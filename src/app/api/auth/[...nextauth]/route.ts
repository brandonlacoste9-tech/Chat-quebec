import NextAuth, { DefaultSession, Session, getServerSession } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import NeonAdapter from '@auth/neon-adapter'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import { sendVerificationRequest } from '@/lib/email'

neonConfig.webSocketConstructor = ws

// Lazy pool creation to avoid build-time errors
const getPool = () => {
  const connectionString = process.env.DATABASE_URL;
  return new Pool({ connectionString: connectionString || 'postgresql://placeholder:5432/db' });
}

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

export const authOptions = {
  adapter: NeonAdapter(getPool() as any),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || 'Parlons <noreply@parlons.ca>',
      sendVerificationRequest,
    })
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: any }) {
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
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Compatibility auth() function for v5-style calls used in the app
export const auth = () => getServerSession(authOptions)
