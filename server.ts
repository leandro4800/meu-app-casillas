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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { plan, email } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    try {
      const priceId = plan === 'annual' 
        ? process.env.STRIPE_PRICE_ID_ANNUAL 
        : process.env.STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        return res.status(400).json({ error: "Price ID not configured for this plan" });
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
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}?payment=cancel`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
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
