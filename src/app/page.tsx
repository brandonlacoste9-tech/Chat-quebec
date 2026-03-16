import { auth } from '@/app/api/auth/[...nextauth]/route'
import ChatLayout from '@/components/chat/ChatLayout'

export default async function Home() {
  const session = await auth()

  const user = {
    id: session?.user?.id || 'guest-session',
    email: session?.user?.email || '',
    plan: session?.user?.plan || 'free',
    stripeCustomerId: session?.user?.stripe_customer,
    isGuest: !session?.user
  }

  return <ChatLayout user={user} />
}
