
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import client from "./src/lib/db"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    async profile(profile) {
      return { ...profile }
    },
  }),
  Credentials({
    async authorize(credentials) {
      return { ...credentials }
    },
  }),
]
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers,
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  }
})
