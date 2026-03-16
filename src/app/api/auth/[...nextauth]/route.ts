import NextAuth, { DefaultSession, Session, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import NeonAdapter from '@auth/neon-adapter'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

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

export const authOptions = {
  // Only add adapter if we have a real database URL
  ...(process.env.DATABASE_URL ? { adapter: NeonAdapter(getPool() as any) } : {}),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    session({ session, user }: { session: Session; user: any }) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.plan = user.plan ?? 'free'
        session.user.stripe_customer = user.stripe_customer
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Compatibility auth() function for v5-style calls used in the app
export const auth = () => getServerSession(authOptions)
