import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
};

export default async function handler(req: any, res: any) {
  const { sessionId } = req.query;
  
  if (req.method === 'GET') {
    try {
      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured" });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId as string);
      res.status(200).json(session);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
