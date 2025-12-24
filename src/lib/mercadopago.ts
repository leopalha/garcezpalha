/**
 * MercadoPago Client Configuration
 * Handles PIX payments via MercadoPago
 */

import { MercadoPagoConfig, Payment } from 'mercadopago'

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn('MERCADOPAGO_ACCESS_TOKEN is not set in environment variables')
}

// Initialize MercadoPago client
export const mercadopago = process.env.MERCADOPAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: {
        timeout: 5000,
      },
    })
  : null

// Payment client
export const paymentClient = mercadopago ? new Payment(mercadopago) : null

/**
 * Check if MercadoPago is configured
 */
export function isMercadoPagoConfigured(): boolean {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN)
}
