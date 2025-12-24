'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'

  return {
    user: session?.user,
    isLoading,
    isAuthenticated,
    session,
  }
}

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isLoading, isAuthenticated }
}

export function useRequireRole(allowedRoles: Array<'admin' | 'lawyer' | 'partner' | 'client'>) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, router])

  const hasAccess = user ? allowedRoles.includes(user.role) : false

  return { isLoading, hasAccess, user }
}
