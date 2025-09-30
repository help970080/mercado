import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Questions from "../models/Questions.js";
import Product from "../models/Product.js";

const router = Router();

router.get("/product/:productId", async (req, res) => {
  const list = await Questions.find({ productId: req.params.productId })
    .populate("fromUser", "name")
    .sort({ createdAt: -1 });
  return res.json(list);
});

router.post("/product/:productId", authMiddleware, async (req, res) => {
  const { text } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ error: "Pregunta vacía" });

  const exists = await Product.findById(req.params.productId);
  if (!exists) return res.status(404).json({ error: "Producto no existe" });

  const q = await Questions.create({
    productId: req.params.productId,
    fromUser: req.user.userId,
    text,
  });
  const populated = await q.populate("fromUser", "name");
  return res.status(201).json(populated);
});

router.patch("/:id/answer", authMiddleware, async (req, res) => {
  const { answer } = req.body || {};
  const q = await Questions.findById(req.params.id);
  if (!q) return res.status(404).json({ error: "Pregunta no encontrada" });

  const product = await Product.findById(q.productId);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  if (String(product.user) !== String(req.user.userId)) {
    return res.status(403).json({ error: "No autorizado para responder" });
  }

  q.answer = answer || "";
  await q.save();
  return res.json(q);
});

export default router;
