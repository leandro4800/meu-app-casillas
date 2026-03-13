import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialize Stripe
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

// In-memory session store
const activeSessions = new Map<string, string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/session/login", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const sessionId = Math.random().toString(36).substring(2) + Date.now();
    activeSessions.set(email, sessionId);
    console.log(`New session for ${email}: ${sessionId}`);
    res.json({ sessionId });
  });

  app.post("/api/session/check", (req, res) => {
    const { email, sessionId } = req.body;
    if (!email || !sessionId) return res.status(400).json({ error: "Email and sessionId required" });
    
    const currentSession = activeSessions.get(email);
    // If no session exists on server, we accept the first one that comes (e.g. after server restart)
    if (!currentSession) {
      activeSessions.set(email, sessionId);
      return res.json({ valid: true });
    }

    if (currentSession !== sessionId) {
      return res.json({ valid: false });
    }
    res.json({ valid: true });
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { plan, email } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      console.error("ERRO: STRIPE_SECRET_KEY não encontrada no ambiente.");
      return res.status(500).json({ 
        error: "Stripe não configurado no servidor. Verifique se a variável STRIPE_SECRET_KEY está definida nas configurações do projeto." 
      });
    }

    try {
      const priceId = plan === 'annual' 
        ? process.env.STRIPE_PRICE_ID_ANNUAL 
        : process.env.STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        console.error(`ERRO: ID de preço não configurado para o plano ${plan}.`);
        return res.status(400).json({ 
          error: `ID de preço não configurado para o plano ${plan === 'annual' ? 'Anual' : 'Mensal'}. Verifique as variáveis STRIPE_PRICE_ID_ANNUAL e STRIPE_PRICE_ID_MONTHLY nas configurações do projeto.` 
        });
      }

      const session = await stripeClient.checkout.sessions.create({
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
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment=cancel`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/checkout-session/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const session = await stripeClient.checkout.sessions.retrieve(sessionId);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/save-asset", (req, res) => {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Missing name or data" });
    }

    try {
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = path.join(__dirname, `${name}.png`);
      fs.writeFileSync(filePath, buffer);
      console.log(`Asset saved: ${name}.png`);
      res.json({ success: true, path: filePath });
    } catch (error) {
      console.error("Error saving asset:", error);
      res.status(500).json({ error: "Failed to save asset" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
