import express from "express";
import Product from "../models/Product.js";
import { cloudinary } from "../server.js";

const router = express.Router();

// Listar productos
router.get("/", async (_req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear producto (con imagen opcional)
router.post("/", async (req, res) => {
  try {
    let imageUrl = req.body.image || "";

    if (req.files?.file) {
      const upload = await cloudinary.v2.uploader.upload(req.files.file.tempFilePath, {
        folder: "libremercado"
      });
      imageUrl = upload.secure_url;
    }

    const { name, price, description = "" } = req.body;
    const created = await Product.create({ name, price, description, image: imageUrl });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
