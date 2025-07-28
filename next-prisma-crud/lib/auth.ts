import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import prisma from './prisma'
import type { Session, User } from 'next-auth'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database' as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      if (session.user && user.id) {
        session.user.id = user.id
      }
      return session
    },
  },
}
