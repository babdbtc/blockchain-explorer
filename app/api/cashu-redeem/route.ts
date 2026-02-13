import { NextRequest, NextResponse } from "next/server"
import { Wallet, getDecodedToken, getEncodedTokenV4 } from "@cashu/cashu-ts"
import { readTokens, writeTokens } from "@/lib/tokens-file"
import { corsOptionsResponse } from "@/lib/cors"
import type { StoredToken, Proof } from "@/lib/shared-types"

// POST - Receive and immediately redeem a Cashu token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, note } = body

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      )
    }

    // Validate token format
    const trimmedToken = token.trim()
    if (!trimmedToken.toLowerCase().startsWith("cashu")) {
      return NextResponse.json(
        { error: "Invalid Cashu token format" },
        { status: 400 }
      )
    }

    // Decode the token to get proofs and mint info
    let decoded
    try {
      decoded = getDecodedToken(trimmedToken)
    } catch (decodeErr) {
      console.error("[Cashu] Failed to decode token:", decodeErr)
      return NextResponse.json(
        { error: "Invalid token - could not decode" },
        { status: 400 }
      )
    }

    // Get the mint URL from the token
    const tokenMintUrl = decoded.mint

    // Calculate total amount from proofs
    const proofs = decoded.proofs || []
    const totalAmount = proofs.reduce((sum: number, p: Proof) => sum + p.amount, 0)

    if (totalAmount <= 0 || proofs.length === 0) {
      return NextResponse.json(
        { error: "Token has no value" },
        { status: 400 }
      )
    }

    // Initialize wallet for the token's mint
    const wallet = new Wallet(tokenMintUrl)
    await wallet.loadMint()

    // Swap the proofs for new ones that only we control
    let newProofs: Proof[]
    try {
      const swapResult = await wallet.swap(totalAmount, proofs)
      if (Array.isArray(swapResult)) {
        newProofs = swapResult as Proof[]
      } else if (swapResult && typeof swapResult === 'object') {
        const keep = (swapResult as { keep?: Proof[], send?: Proof[] }).keep || []
        const send = (swapResult as { keep?: Proof[], send?: Proof[] }).send || []
        newProofs = [...keep, ...send] as Proof[]
      } else {
        throw new Error("Unexpected swap result format")
      }
    } catch (swapErr) {
      console.error("[Cashu] Swap failed:", swapErr)
      return NextResponse.json(
        { error: "Token already spent or invalid" },
        { status: 400 }
      )
    }

    if (!newProofs || newProofs.length === 0) {
      return NextResponse.json(
        { error: "Swap returned no proofs" },
        { status: 400 }
      )
    }

    // Encode the new proofs as a token that only we have
    const newToken = getEncodedTokenV4({
      mint: tokenMintUrl,
      proofs: newProofs,
    })

    // Store the new token
    const tokens = await readTokens()

    const storedToken: StoredToken = {
      id: `token_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      token: newToken,
      amount: totalAmount,
      timestamp: Date.now(),
      redeemed: false,
      ...(note && { note }),
    }
    tokens.push(storedToken)

    await writeTokens(tokens)

    return NextResponse.json({
      success: true,
      amount: totalAmount,
      message: `Received ${totalAmount} sats`,
    })
  } catch (err) {
    console.error("[Cashu] Error processing token:", err)
    return NextResponse.json(
      { error: "Failed to process token" },
      { status: 500 }
    )
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return corsOptionsResponse("POST, OPTIONS")
}
