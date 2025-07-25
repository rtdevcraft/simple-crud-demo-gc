import NextAuth, { Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '../../../../../lib/prisma' // Assumes prisma is at src/lib/prisma.ts

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // This callback adds the user's ID from the database to the session object,
    // making it available on the client side.
    session({ session, user }: { session: Session; user: User }) {
      // Add the user ID to the session object with proper typing
      if (session.user && user.id) {
        // FIXED: Check if user.id exists
        // By casting session.user to a type that includes an 'id',
        // we satisfy TypeScript and avoid the 'any' keyword.
        ;(session.user as { id: string }).id = user.id
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
