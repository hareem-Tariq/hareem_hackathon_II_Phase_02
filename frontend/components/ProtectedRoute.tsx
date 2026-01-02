// Task P2-T-021: Create Protected Route Wrapper
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      router.push('/signin')
      return
    }

    // Decode token to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp
      
      if (exp && Date.now() >= exp * 1000) {
        // Token expired
        localStorage.removeItem('auth_token')
        router.push('/signin')
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      // Invalid token
      localStorage.removeItem('auth_token')
      router.push('/signin')
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

/**
 * Get current user ID from token
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('auth_token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub || payload.user_id || null
  } catch {
    return null
  }
}
