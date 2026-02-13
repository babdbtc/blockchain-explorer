import { NextRequest, NextResponse } from "next/server"
import { readTokens, writeTokens } from "@/lib/tokens-file"
import { corsOptionsResponse } from "@/lib/cors"
import type { StoredToken } from "@/lib/shared-types"

// GET - Retrieve all stored tokens (for you to redeem)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const expectedKey = process.env.CASHU_ADMIN_KEY

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const tokens = await readTokens()
  return NextResponse.json({ tokens })
}

// POST - Store a new Cashu token after payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, amount, note } = body

    if (!token || !amount) {
      return NextResponse.json(
        { error: "Missing token or amount" },
        { status: 400 }
      )
    }

    const tokens = await readTokens()

    const newToken: StoredToken = {
      token,
      amount,
      timestamp: Date.now(),
      redeemed: false,
      ...(note && { note }),
    }
    tokens.push(newToken)

    await writeTokens(tokens)

    return NextResponse.json({ success: true, message: "Token stored" })
  } catch (err) {
    console.error("[Cashu] Error storing token:", err)
    return NextResponse.json(
      { error: "Failed to store token" },
      { status: 500 }
    )
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return corsOptionsResponse("GET, POST, OPTIONS", true)
}
