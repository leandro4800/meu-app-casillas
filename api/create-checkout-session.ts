import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { plan, email } = req.body;
      
      const priceId = plan === 'annual' 
        ? process.env.STRIPE_PRICE_ID_ANNUAL 
        : process.env.STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID não configurado' });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: email,
        success_url: `${process.env.APP_URL || 'https://consultorcasillas.vercel.app'}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${process.env.APP_URL || 'https://consultorcasillas.vercel.app'}?payment=cancel`,
      });

      res.status(200).json({ url: session.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
