import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/admin-auth"
import { readTokens, writeTokens } from "@/lib/tokens-file"
import type { StoredToken } from "@/lib/shared-types"

// Ensure all tokens have IDs
function ensureTokenIds(tokens: StoredToken[]): StoredToken[] {
  return tokens.map((token, index) => ({
    ...token,
    id: token.id || `token_${token.timestamp}_${index}`,
  }))
}

// GET - Retrieve all tokens (requires auth)
export async function GET() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawTokens = await readTokens()
  const tokens = ensureTokenIds(rawTokens)

  // Calculate stats
  const totalReceived = tokens.reduce((sum, t) => sum + t.amount, 0)
  const unredeemedAmount = tokens
    .filter((t) => !t.redeemed)
    .reduce((sum, t) => sum + t.amount, 0)
  const redeemedAmount = tokens
    .filter((t) => t.redeemed)
    .reduce((sum, t) => sum + t.amount, 0)

  return NextResponse.json({
    tokens: tokens.sort((a, b) => b.timestamp - a.timestamp),
    stats: {
      totalReceived,
      unredeemedAmount,
      redeemedAmount,
      totalTokens: tokens.length,
      unredeemedTokens: tokens.filter((t) => !t.redeemed).length,
    },
  })
}

// PATCH - Mark token(s) as redeemed (requires auth)
export async function PATCH(request: NextRequest) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { tokenIds, redeemed } = body

    if (!tokenIds || !Array.isArray(tokenIds)) {
      return NextResponse.json(
        { error: "tokenIds array required" },
        { status: 400 }
      )
    }

    const rawTokens = await readTokens()
    let tokens = ensureTokenIds(rawTokens)

    if (tokens.length === 0) {
      return NextResponse.json({ error: "No tokens found" }, { status: 404 })
    }

    // Update tokens
    let updatedCount = 0
    tokens = tokens.map((token) => {
      if (tokenIds.includes(token.id)) {
        updatedCount++
        return { ...token, redeemed: redeemed !== false }
      }
      return token
    })

    await writeTokens(tokens)

    return NextResponse.json({
      success: true,
      updatedCount,
    })
  } catch (error) {
    console.error("Error updating tokens:", error)
    return NextResponse.json(
      { error: "Failed to update tokens" },
      { status: 500 }
    )
  }
}

// DELETE - Delete redeemed tokens (cleanup, requires auth)
export async function DELETE() {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tokens = await readTokens()

    if (tokens.length === 0) {
      return NextResponse.json({ error: "No tokens found" }, { status: 404 })
    }

    const originalCount = tokens.length
    const remaining = tokens.filter((t) => !t.redeemed)
    const deletedCount = originalCount - remaining.length

    await writeTokens(remaining)

    return NextResponse.json({
      success: true,
      deletedCount,
      remainingCount: remaining.length,
    })
  } catch (error) {
    console.error("Error deleting tokens:", error)
    return NextResponse.json(
      { error: "Failed to delete tokens" },
      { status: 500 }
    )
  }
}
