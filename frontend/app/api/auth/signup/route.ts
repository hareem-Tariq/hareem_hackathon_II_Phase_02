// Custom Auth API - Signup with Better Auth
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/better-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Use Better Auth server API to create user (automatically hashes password)
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email,
      },
    })

    if (!result) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      email 
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle duplicate user error
    if (error?.message?.includes('duplicate') || error?.message?.includes('already exists') || error?.code === '23505') {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: error?.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
