import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 📌 Crear producto (requiere login)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image,
      user: req.user.userId
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// 📌 Obtener productos del usuario logueado
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos del usuario" });
  }
});

export default router;
