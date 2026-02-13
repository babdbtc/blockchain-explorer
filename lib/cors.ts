import { NextResponse } from "next/server"

const ALLOWED_ORIGIN = "https://babd.space"

export function corsHeaders(methods: string, includeAuth = false) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": includeAuth
      ? "Content-Type, Authorization"
      : "Content-Type",
  }
  return headers
}

export function corsOptionsResponse(methods: string, includeAuth = false) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(methods, includeAuth),
  })
}
