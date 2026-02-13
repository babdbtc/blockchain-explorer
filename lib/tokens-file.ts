import { promises as fs } from "fs"
import path from "path"
import type { StoredToken } from "./shared-types"

export const TOKENS_FILE = path.join(process.cwd(), "cashu-tokens.json")

export async function readTokens(): Promise<StoredToken[]> {
  try {
    const data = await fs.readFile(TOKENS_FILE, "utf-8")
    return JSON.parse(data) as StoredToken[]
  } catch {
    return []
  }
}

export async function writeTokens(tokens: StoredToken[]): Promise<void> {
  await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2))
}
