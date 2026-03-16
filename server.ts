import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { ensureDocumentsExist } from "./src/services/pdfService.ts";

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

  app.post("/api/send-catalog", async (req, res) => {
    const { email } = req.body;
    console.log(`[API] Request to send catalog to: ${email}`);
    console.log(`[API] RESEND_API_KEY present: ${!!process.env.RESEND_API_KEY}`);
    
    if (!email) return res.status(400).json({ error: "Email required" });
    
    try {
      const { catalogPath, eafuPath } = await ensureDocumentsExist();
      console.log(`[API] Documents paths: ${catalogPath}, ${eafuPath}`);
      
      // Try Resend first if API key is present
      if (process.env.RESEND_API_KEY) {
        console.log(`[RESEND] API Key found. Attempting send to: ${email}`);
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const catalogBuffer = await fs.promises.readFile(catalogPath);
        const eafuBuffer = await fs.promises.readFile(eafuPath);

        const fromAddress = process.env.SMTP_FROM || "onboarding@resend.dev";
        console.log(`[RESEND] Using 'from' address: ${fromAddress}`);

        // Basic validation: if using onboarding@resend.dev, ensure it's not trying to spoof a domain
        let finalFrom = fromAddress;
        if (fromAddress !== "onboarding@resend.dev" && !fromAddress.includes("@")) {
           console.warn("[RESEND] SMTP_FROM seems invalid, falling back to onboarding@resend.dev");
           finalFrom = "onboarding@resend.dev";
        }
        
        // If the user provided a custom domain but it's not verified, Resend will fail.
        // We can't check verification here, but we can log it.
        console.log(`[RESEND] Sending email from ${finalFrom} to ${email}...`);

        const { data, error } = await resend.emails.send({
          from: finalFrom,
          to: email,
          subject: "Hailtools - Catálogo de Ferramentas e Apostila EAFU",
          text: "Olá,\n\nConforme solicitado, seguem em anexo o Catálogo de Ferramentas Hailtools e a Apostila de Treinamento EAFU em formato PDF.\n\nAtenciosamente,\nEquipe Hailtools",
          attachments: [
            {
              filename: 'catalogo_hailtools.pdf',
              content: catalogBuffer,
            },
            {
              filename: 'apostila_eafu.pdf',
              content: eafuBuffer,
            }
          ]
        });

        if (error) {
          console.error("[RESEND] API Error:", error);
          throw new Error(`Resend Error: ${error.message}`);
        }

        console.log(`[RESEND] Email sent successfully. ID: ${data?.id}`);
        return res.json({ success: true, message: `Catálogo e Apostila EAFU enviados com sucesso para ${email} (via Resend)` });
      }

      // Fallback to SMTP
      console.log("[SMTP] Falling back to SMTP or Simulation...");
      const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };

      if (!smtpConfig.host || !smtpConfig.auth.user) {
        console.log(`[EMAIL SIMULATION] SMTP not configured. Simulating send to: ${email}`);
        console.log(`[EMAIL SIMULATION] Attachments: ${catalogPath}, ${eafuPath}`);
        return res.json({ 
          success: true, 
          message: `[SIMULAÇÃO] Catálogo e Apostila EAFU (PDF) enviados com sucesso para ${email}. (Configure o SMTP para envio real)` 
        });
      }

      const transporter = nodemailer.createTransport(smtpConfig);

      await transporter.sendMail({
        from: process.env.SMTP_FROM || "hailtools@example.com",
        to: email,
        subject: "Hailtools - Catálogo de Ferramentas e Apostila EAFU",
        text: "Olá,\n\nConforme solicitado, seguem em anexo o Catálogo de Ferramentas Hailtools e a Apostila de Treinamento EAFU em formato PDF.\n\nAtenciosamente,\nEquipe Hailtools",
        attachments: [
          {
            filename: 'catalogo_hailtools.pdf',
            path: catalogPath
          },
          {
            filename: 'apostila_eafu.pdf',
            path: eafuPath
          }
        ]
      });

      console.log(`Email sent successfully to: ${email}`);
      res.json({ success: true, message: `Catálogo e Apostila EAFU enviados com sucesso para ${email}` });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Erro ao processar o envio dos documentos." });
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
