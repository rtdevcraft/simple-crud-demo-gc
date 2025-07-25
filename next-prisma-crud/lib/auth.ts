import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import prisma from './prisma'
import type NextAuthOptions from 'next-auth'
import type { Session, User } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      if (session.user && user.id) {
        ;(session.user as { id: string }).id = user.id
      }
      return session
    },
  },
}
