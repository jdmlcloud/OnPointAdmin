import NextAuth from "next-auth"
import { authOptionsDev } from "@/lib/auth-dev"

// Usar configuración de desarrollo para simplificar
const handler = NextAuth(authOptionsDev)

export { handler as GET, handler as POST }
