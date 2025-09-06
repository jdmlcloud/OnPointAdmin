import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "admin" | "ejecutivo" | "cliente"
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: "admin" | "ejecutivo" | "cliente"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "ejecutivo" | "cliente"
  }
}
