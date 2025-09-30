// backend/routes/productRoutes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Crear producto
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Error creando producto" });
  }
});

// Obtener productos con filtros de ubicación
// GET /products?state=Veracruz&city=Xalapa
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;
    let filter = {};
    if (state) filter["location.state"] = state;
    if (city) filter["location.city"] = city;

    const products = await Product.find(filter).populate("user", "username");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

// Obtener producto por ID
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
