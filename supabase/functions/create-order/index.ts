
// @ts-ignore: Deno is provided by the Supabase Edge Function environment
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Minimal declaration for local IDE support (standard TS doesn't know Deno)
declare const Deno: any;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Variant {
    name: string;
    stock: number;
    price: number;
}

interface Product {
    id: string;
    name: string;
    stock: number | null;
    variants: Variant[] | null;
    price: number;
}

interface OrderItem {
    product_id: string;
    quantity: number;
    price: number;
    variant_name?: string;
}

interface OrderResponse {
    id: string;
}

Deno.serve(async (req: Request) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json();
        const {
            name,
            email,
            phone,
            address,
            governorate,
            city,
            items,
            total_amount,
            is_discounted,
            discount_percent,
            payment_method,
            turnstile_token
        } = body as {
            name: string;
            email: string;
            phone: string;
            address: string;
            governorate: string;
            city: string;
            items: OrderItem[];
            total_amount: number;
            is_discounted?: boolean;
            discount_percent?: number;
            payment_method: string;
            turnstile_token: string;
        }

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

        // --- Stock Management Logic ---
        const productIds = [...new Set(items.map((item) => item.product_id))];
        const { data: productsData, error: productsError } = await supabaseClient
            .from('products')
            .select('*')
            .in('id', productIds);

        if (productsError) throw new Error('Failed to fetch product stock');

        const products = (productsData || []) as Product[];
        const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));
        const updates: Product[] = [];

        // Validate and Prepare Updates
        for (const item of items) {
            const product = productMap.get(item.product_id);
            if (!product) throw new Error(`Product not found: ${item.product_id}`);

            if (item.variant_name) {
                // Handle Variant Stock
                if (!product.variants || !Array.isArray(product.variants)) {
                    throw new Error(`Product ${product.name} has no variants but variant selected`);
                }

                const variantIndex = product.variants.findIndex((v) => v.name === item.variant_name);
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

                // Update root stock if it exists
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

        // 3. Create Order
        console.log('Stock updated. Creating order...');
        const { data: orderData, error: orderError } = await supabaseClient
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
                    is_paid: false,
                    is_discounted: is_discounted || false,
                    discount_percent: discount_percent || 0
                }
            ])
            .select('id')
            .single()

        if (orderError || !orderData) {
            console.error('Order creation failed:', orderError);
            throw orderError || new Error('Failed to create order entry');
        }

        const order = orderData as OrderResponse;

        // 4. Create Order Items
        const orderItems = items.map((item) => ({
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


