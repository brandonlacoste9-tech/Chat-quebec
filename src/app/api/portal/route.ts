import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Stripe Portal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
