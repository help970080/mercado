// routes/membershipRoutes.js
import express from "express";
import Stripe from "stripe";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Crear sesión de checkout
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Debes configurar este PRICE_ID en Stripe
          quantity: 1,
        },
      ],
      customer_email: req.user.email,
      success_url: `${process.env.FRONTEND_URL}/membership/success`,
      cancel_url: `${process.env.FRONTEND_URL}/membership/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creando sesión de checkout:", err.message);
    res.status(500).json({ error: "Error creando sesión de pago" });
  }
});

// Webhook de Stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("⚠️ Error verificando webhook:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar eventos importantes
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Actualizar usuario en DB
        const user = await User.findOne({ email: session.customer_email });
        if (user) {
          user.membershipActive = true;
          user.membershipSince = new Date();
          await user.save();
          console.log("✅ Membresía activada para:", user.email);
        }
      } catch (err) {
        console.error("❌ Error actualizando usuario:", err.message);
      }
    }

    res.json({ received: true });
  }
);

export default router;
