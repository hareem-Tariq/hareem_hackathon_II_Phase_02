// Task P2-T-017: Configure Better Auth
import { auth } from "@/lib/auth/better-auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
