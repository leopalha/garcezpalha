import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
    hasMercadopago: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Only show first 10 chars for security
    stripeSecretPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT SET',
    envKeys: Object.keys(process.env).filter(k => k.includes('STRIPE') || k.includes('SUPABASE')),
  })
}
