import { auth } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import ChatLayout from '@/components/chat/ChatLayout'

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const user = {
    id: session.user.id,
    email: session.user.email || '',
    plan: session.user.plan || 'free',
    stripeCustomerId: session.user.stripe_customer,
  }

  return <ChatLayout user={user} />
}
