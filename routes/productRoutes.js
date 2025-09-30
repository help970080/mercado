import { Router } from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import cloudinary from "cloudinary";
import fs from "fs";

const router = Router();

router.get("/", async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  return res.json(items);
});

router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Producto no encontrado" });
  return res.json(p);
});

router.get("/mine/list", authMiddleware, async (req, res) => {
  const items = await Product.find({ user: req.user.userId }).sort({ createdAt: -1 });
  return res.json(items);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, description, image } = req.body || {};
    if (!name || price === undefined) {
      return res.status(400).json({ error: "Faltan campos: name/price" });
    }

    let finalImage = image || "";
    if (req.files?.file && process.env.CLOUDINARY_CLOUD_NAME) {
      const tmp = req.files.file.tempFilePath;
      const upload = await cloudinary.v2.uploader.upload(tmp, { folder: "libremercado/products" });
      finalImage = upload.secure_url;
      if (tmp && fs.existsSync(tmp)) fs.unlinkSync(tmp);
    }

    const newP = await Product.create({
      name,
      price,
      description: description || "",
      image: finalImage || "",
      user: req.user.userId,
    });

    return res.status(201).json(newP);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al crear producto" });
  }
});

export default router;
