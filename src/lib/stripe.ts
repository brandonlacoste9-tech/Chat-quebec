import Stripe from 'stripe';

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
        console.warn('⚠️ STRIPE_SECRET_KEY is missing!');
    }
    // Return a proxy that warns when called, to avoid crashing module evaluation
    return new Proxy({}, {
        get: () => {
            return () => {
                console.error("❌ Stripe API key is missing. Action cannot be performed.");
                throw new Error("Missing Stripe API key");
            };
        }
    }) as unknown as Stripe;
  }
  return new Stripe(apiKey);
};

export const stripe = getStripe();
