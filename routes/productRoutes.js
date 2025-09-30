import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Error creando producto" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("user", "username");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("user", "username");
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error cargando producto" });
  }
});

export default router;
