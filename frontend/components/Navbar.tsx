// Task P2-T-025: Implement Home Page and Navigation
'use client'

import { useRouter } from 'next/navigation'
import { getCurrentUserId } from './ProtectedRoute'

export default function Navbar() {
  const router = useRouter()
  const userId = getCurrentUserId()
  const isAuthenticated = !!userId

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/signin')
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Todo App
          </a>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <a
                  href="/tasks"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  My Tasks
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/signin"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
