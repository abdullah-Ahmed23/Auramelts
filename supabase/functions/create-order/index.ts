
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const {
            name,
            email,
            phone,
            address,
            governorate,
            city,
            items,
            total_amount,
            payment_method,
            turnstile_token
        } = await req.json()

        // 1. Validate CAPTCHA with Cloudflare
        const ip = req.headers.get('cf-connecting-ip')
        const secret = Deno.env.get('TURNSTILE_SECRET_KEY')

        if (!secret) {
            throw new Error('Server misconfiguration: Missing Turnstile Secret')
        }

        const formData = new FormData();
        formData.append('secret', secret);
        formData.append('response', turnstile_token);
        formData.append('remoteip', ip || '');

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        if (!outcome.success) {
            console.error('Turnstile Validation Failed:', outcome);
            throw new Error(`CAPTCHA validation failed: ${JSON.stringify(outcome['error-codes'])}`)
        }

        // 2. Initialize Supabase Client (Service Role)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // --- NEW: Stock Management Logic ---
        const productIds = [...new Set(items.map((item: any) => item.product_id))];
        const { data: products, error: productsError } = await supabaseClient
            .from('products')
            .select('*')
            .in('id', productIds);

        if (productsError) throw new Error('Failed to fetch product stock');

        const productMap = new Map(products.map((p: any) => [p.id, p]));
        const updates: any[] = [];

        // Validate and Prepare Updates
        for (const item of items) {
            const product = productMap.get(item.product_id);
            if (!product) throw new Error(`Product not found: ${item.product_id}`);

            // Deep clone to avoid mutating the map if we have multiple items for same product (e.g. diff variants)
            // Actually we SHOULD mutate the map object so subsequent items see the reduced stock

            if (item.variant_name) {
                // Handle Variant Stock
                if (!product.variants || !Array.isArray(product.variants)) {
                    throw new Error(`Product ${product.name} has no variants but variant selected`);
                }

                const variantIndex = product.variants.findIndex((v: any) => v.name === item.variant_name);
                if (variantIndex === -1) throw new Error(`Variant ${item.variant_name} not found for ${product.name}`);

                const variant = product.variants[variantIndex];
                const currentStock = Number(variant.stock);

                if (isNaN(currentStock)) {
                    console.error(`Invalid stock value for ${product.name} (${item.variant_name}):`, variant.stock);
                    throw new Error(`System Error: Invalid stock configuration for ${product.name}`);
                }

                if (currentStock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name} (${item.variant_name}). Available: ${currentStock}`);
                }

                // Update stock in memory
                product.variants[variantIndex].stock = currentStock - item.quantity;

                // NEW: Also update the root stock if it exists, so the admin panel shows the correct total
                if (product.stock !== undefined && product.stock !== null) {
                    const rootStock = Number(product.stock);
                    if (!isNaN(rootStock)) {
                        product.stock = rootStock - item.quantity;
                    }
                }

            } else {
                // Handle Simple Product Stock
                const currentStock = Number(product.stock);

                if (isNaN(currentStock)) {
                    console.error(`Invalid stock value for ${product.name}:`, product.stock);
                    throw new Error(`System Error: Invalid stock configuration for ${product.name}`);
                }

                if (currentStock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${currentStock}`);
                }

                // Update stock in memory
                product.stock = currentStock - item.quantity;
            }

            // Mark product for update if not already marked
            if (!updates.find(u => u.id === product.id)) {
                updates.push(product);
            }
        }

        console.log(`Updating stock for ${updates.length} products...`);

        // Apply Updates to Database
        for (const update of updates) {
            const { error: updateError } = await supabaseClient
                .from('products')
                .update({
                    stock: update.stock,
                    variants: update.variants
                })
                .eq('id', update.id);

            if (updateError) {
                console.error('Failed to update stock for', update.name, updateError);
                throw new Error(`Failed to update inventory for ${update.name}`);
            }
        }
        // --- End Stock Management ---

        // 3. Create Order
        console.log('Stock updated. Creating order...');
        const { data: order, error: orderError } = await supabaseClient
            .from('orders')
            .insert([
                {
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    address: address,
                    governorate: governorate,
                    city: city,
                    total_amount: total_amount,
                    status: 'pending',
                    payment_method: payment_method,
                    is_paid: false
                }
            ])
            .select()
            .single()

        if (orderError) {
            console.error('Order creation failed:', orderError);
            throw orderError;
        }

        // 4. Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            variant_name: item.variant_name
        }))

        const { error: itemsError } = await supabaseClient
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Order items creation failed:', itemsError);
            throw itemsError;
        }

        // 5. Success Response
        return new Response(
            JSON.stringify({ success: true, order_id: order.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error: any) {
        console.error('Edge Function Request Failed:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            },
        )
    }
})
