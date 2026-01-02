// Custom Auth API - Signin with Better Auth
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/better-auth'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Use Better Auth to verify credentials (checks hashed password)
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })

    if (!result || !result.user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        sub: result.user.id,
        email: result.user.email,
        user_id: result.user.id
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    return NextResponse.json({ 
      token,
      user: { id: result.user.id, email: result.user.email }
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    
    // Better Auth returns specific error for invalid credentials
    if (error?.message?.includes('Invalid') || error?.message?.includes('password')) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { message: 'Sign in failed' },
      { status: 500 }
    )
  }
}
