export interface StoredToken {
  id?: string
  token: string
  amount: number
  timestamp: number
  redeemed: boolean
  note?: string
}

export interface Proof {
  id: string
  amount: number
  secret: string
  C: string
}
