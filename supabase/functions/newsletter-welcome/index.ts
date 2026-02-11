// @ts-ignore: Deno environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Local IDE support for Deno globals
declare const Deno: any;

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  console.log('--- Newsletter Welcome Function Triggered ---');

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Webhook received:', payload)

    // Supabase Webhooks pass the new record in the 'record' field
    const email = payload.record?.email

    if (!email) {
      throw new Error('No email found in subscription record')
    }

    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable')
    }

    console.log(`Sending congratulations email to: ${email}`)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Aura Melts <onboarding@resend.dev>', // Note: Update this to hello@auramelts.com after domain verification
        to: [email],
        subject: 'Welcome to the Family! You got 10% OFF! ✨',
        html: `
          <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; background: #fff; border: 1px solid #7B4B94/10;">
            <div style="background: #7B4B94; padding: 40px 20px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 28px;">Welcome to the Family!</h1>
            </div>
            <div style="padding: 40px 30px; color: #444; line-height: 1.6;">
              <p style="font-size: 18px; color: #7B4B94;"><strong>We're so glad you're here!</strong></p>
              <p>Thank you for joining our inner circle at <strong>Aura Melts</strong>. As a special welcome gift, you get <strong>10% OFF</strong> your first order automatically applied at checkout!</p>
              
              <div style="text-align: center; margin-top: 40px;">
                <a href="https://auramelts.com/products" style="background: #E84A8A; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Shop Our Collection</a>
              </div>
            </div>
            <div style="background: #FDF8F4; padding: 30px; text-align: center; color: #7B4B94/60; font-size: 12px;">
              <p>© 2026 Aura Melts. Handcrafted with love.</p>
              <p>No longer want to receive these emails? <a href="#" style="color: #7B4B94;">Unsubscribe</a></p>
            </div>
          </div>
        `,
      }),
    })

    console.log('Resend Response Status:', res.status)
    const result = await res.json()
    console.log('Resend API Result:', JSON.stringify(result, null, 2))

    if (!res.ok) {
      throw new Error(`Resend API Error (Status ${res.status}): ${JSON.stringify(result)}`)
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Email Function Failed:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
