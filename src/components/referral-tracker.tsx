'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function ReferralTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for referral code in URL
    const refCode = searchParams.get('ref')

    if (refCode) {
      // Store referral code in localStorage
      localStorage.setItem('referralCode', refCode)
      localStorage.setItem('referralTimestamp', Date.now().toString())

      // Track the click via API (in production)
      trackReferralClick(refCode)
    }

    // Also check for existing referral code and validate it's not expired (30 days)
    const storedCode = localStorage.getItem('referralCode')
    const storedTimestamp = localStorage.getItem('referralTimestamp')

    if (storedCode && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp, 10)
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000

      // If referral code is older than 30 days, remove it
      if (Date.now() - timestamp > thirtyDaysInMs) {
        localStorage.removeItem('referralCode')
        localStorage.removeItem('referralTimestamp')
      }
    }
  }, [searchParams])

  return null // This component doesn't render anything
}

async function trackReferralClick(partnerCode: string) {
  try {
    // Get source from referrer
    const source = document.referrer
      ? new URL(document.referrer).hostname
      : 'direct'

    // In production, this would call the API
    // await fetch('/api/referral/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     partnerCode,
    //     source,
    //     userAgent: navigator.userAgent,
    //   }),
    // })

    console.log('Referral tracked:', { partnerCode, source })
  } catch (error) {
    console.error('Failed to track referral:', error)
  }
}

// Hook to get the current referral code
export function useReferralCode() {
  if (typeof window === 'undefined') {
    return null
  }

  const code = localStorage.getItem('referralCode')
  const timestamp = localStorage.getItem('referralTimestamp')

  if (!code || !timestamp) {
    return null
  }

  // Check if expired (30 days)
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
  if (Date.now() - parseInt(timestamp, 10) > thirtyDaysInMs) {
    return null
  }

  return code
}

// Helper function to attach referral code to forms
export function getReferralData() {
  if (typeof window === 'undefined') {
    return {}
  }

  const code = localStorage.getItem('referralCode')
  const timestamp = localStorage.getItem('referralTimestamp')

  if (!code || !timestamp) {
    return {}
  }

  return {
    referralCode: code,
    referralTimestamp: timestamp,
  }
}
