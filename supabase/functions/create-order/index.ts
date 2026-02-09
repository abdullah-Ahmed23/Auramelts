
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

        // 3. Create Order
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

        if (orderError) throw orderError

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

        if (itemsError) throw itemsError

        // 5. Success Response
        return new Response(
            JSON.stringify({ success: true, order_id: order.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            },
        )
    }
})
