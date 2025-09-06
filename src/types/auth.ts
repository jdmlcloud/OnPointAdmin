import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: 'admin' | 'ejecutivo' | 'cliente'
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    role: 'admin' | 'ejecutivo' | 'cliente'
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: 'admin' | 'ejecutivo' | 'cliente'
    accessToken?: string
    refreshToken?: string
  }
}
