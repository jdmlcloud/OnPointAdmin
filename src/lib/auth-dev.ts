import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { envDev } from "@/config/env-dev"

export const authOptionsDev: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Para desarrollo, permitir login con cualquier credencial
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email,
            name: "Usuario Demo",
            role: "admin" as const,
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as any
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: envDev.NEXTAUTH_SECRET,
  debug: envDev.NODE_ENV === 'development',
}
