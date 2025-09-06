import { NextAuthOptions } from "next-auth"
import { env } from "@/config/env"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "cognito",
      name: "Cognito",
      type: "oauth",
      authorization: {
        url: `${env.COGNITO_ISSUER}/oauth2/authorize`,
        params: {
          scope: "openid email profile",
          response_type: "code",
        },
      },
      token: `${env.COGNITO_ISSUER}/oauth2/token`,
      userinfo: `${env.COGNITO_ISSUER}/oauth2/userInfo`,
      clientId: env.COGNITO_CLIENT_ID,
      clientSecret: env.COGNITO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: 'ejecutivo', // Default role
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          role: user.role || 'ejecutivo',
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        role: token.role,
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  secret: env.NEXTAUTH_SECRET || "dev-secret-key-for-development",
}
