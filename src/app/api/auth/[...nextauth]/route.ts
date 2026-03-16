import NextAuth, { DefaultSession, Session } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import NeonAdapter from '@auth/neon-adapter'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { sendVerificationRequest } from '@/lib/email'

neonConfig.webSocketConstructor = ws
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: string;
      stripe_customer?: string;
    } & DefaultSession["user"]
  }
}

interface User {
  id: string;
  email: string;
  plan?: string;
  stripe_customer?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: NeonAdapter(pool),
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || 'Parlons <noreply@parlons.ca>',
      sendVerificationRequest,
    })
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id
        session.user.plan = user.plan ?? 'free'
        session.user.stripe_customer = user.stripe_customer
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/check-email',
  }
})

export const { GET, POST } = handlers
