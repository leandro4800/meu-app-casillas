import Stripe from 'stripe';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
};

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { plan, email } = req.body;
      const stripe = getStripe();

      if (!stripe) {
        return res.status(500).json({ 
          error: "Stripe não configurado no servidor. Verifique a variável STRIPE_SECRET_KEY no Vercel." 
        });
      }
      
      const priceId = plan === 'annual' 
        ? process.env.STRIPE_PRICE_ID_ANNUAL 
        : process.env.STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        return res.status(400).json({ 
          error: `ID de preço não configurado para o plano ${plan === 'annual' ? 'Anual' : 'Mensal'}. Verifique as variáveis STRIPE_PRICE_ID_* no Vercel.` 
        });
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
        metadata: {
          plan: plan,
          email: email
        },
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
