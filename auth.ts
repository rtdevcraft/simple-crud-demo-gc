import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { Pool } from 'pg'

import PgAdapter from '@auth/pg-adapter'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PgAdapter(pool),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // This callback ensures the user's ID is included in the session token

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
  },
})
