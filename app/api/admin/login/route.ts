import { NextRequest, NextResponse } from "next/server"
import { getClientIP } from "@/lib/get-client-ip"
import {
  verifyPassword,
  createSession,
  isRateLimited,
  recordLoginAttempt,
  SESSION_COOKIE_NAME,
  SESSION_DURATION,
} from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Check rate limiting
  const rateLimitCheck = isRateLimited(ip)
  if (rateLimitCheck.limited) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Try again in ${rateLimitCheck.remainingTime} seconds.`,
      },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      recordLoginAttempt(ip, false)
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    // Verify password
    const isValid = await verifyPassword(password)

    if (!isValid) {
      recordLoginAttempt(ip, false)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    recordLoginAttempt(ip, true)
    const sessionToken = await createSession()

    // Create response with secure cookie
    const response = NextResponse.json({ success: true })

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION / 1000,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
