// Task P2-T-025: Implement Home Page and Navigation
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      // Try to decode and check if valid
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const exp = payload.exp
        
        if (!exp || Date.now() < exp * 1000) {
          // Token valid, redirect to tasks
          router.push('/tasks')
          return
        }
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('auth_token')
      }
    }
    
    // Not authenticated, redirect to signin
    router.push('/signin')
  }, [router])

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    </Layout>
  )
}
