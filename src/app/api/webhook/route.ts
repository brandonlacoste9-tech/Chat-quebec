import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import Stripe from 'stripe';
import { sql } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Webhook Error: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userEmail = session.customer_details?.email || session.metadata?.userEmail;
      const customerId = session.customer as string;

      if (userEmail) {
        await sql`
          UPDATE users 
          SET plan = 'plus', stripe_customer = ${customerId}
          WHERE email = ${userEmail}
        `;
        console.log(`✅ User ${userEmail} upgraded to plus`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await sql`
        UPDATE users 
        SET plan = 'free'
        WHERE stripe_customer = ${customerId}
      `;
      console.log(`ℹ️ Customer ${customerId} subscription deleted. Reverted to free.`);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
