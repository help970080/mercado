import express from "express";
const router = express.Router();

// GET /api/products
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Producto demo 1", price: 100 },
    { id: 2, name: "Producto demo 2", price: 200 }
  ]);
});

export default router;
