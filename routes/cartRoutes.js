// cartRoutes.js
import { Router } from "express";
import { authMiddleware } from "./authMiddleware.js";
import Cart from "./Cart.js";
import Product from "./Product.js";

const router = Router();

// Obtener carrito del usuario
router.get("/", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
  if (!cart) cart = await Cart.create({ userId: req.user.userId, items: [] });

  // Normalizar para frontend
  const mapped = {
    _id: cart._id,
    items: cart.items.map(i => ({
      product: {
        _id: i.productId?._id,
        name: i.productId?.name,
        price: i.productId?.price,
        image: i.productId?.image
      },
      quantity: i.quantity
    }))
  };
  return res.json(mapped);
});

// Agregar/actualizar ítem
router.post("/", authMiddleware, async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });

  let cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) cart = await Cart.create({ userId: req.user.userId, items: [] });

  const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
  if (idx >= 0) cart.items[idx].quantity = quantity;
  else cart.items.push({ productId, quantity });

  await cart.save();
  return res.json({ ok: true });
});

// Eliminar producto del carrito
router.delete("/:productId", authMiddleware, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) return res.json({ ok: true });

  cart.items = cart.items.filter(i => String(i.productId) !== String(req.params.productId));
  await cart.save();
  return res.json({ ok: true });
});

export default router;
