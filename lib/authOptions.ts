import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './db'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'database' as const, // <-- cast as const here
  },
  callbacks: {
    session({
      session,
      user,
    }: {
      session: import('next-auth').Session
      user: import('next-auth').User
    }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
}
