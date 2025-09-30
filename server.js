// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import questionRoutes from "./questionRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: false
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Archivos (para subir imágenes)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  createParentPath: true
}));

// Cloudinary (si lo usas)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// DB
const { MONGODB_URI, DB_NAME } = process.env;
if (!MONGODB_URI || !DB_NAME) {
  console.error("❌ Faltan variables MONGODB_URI o DB_NAME");
  process.exit(1);
}
await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
console.log("✅ Conectado a MongoDB:", DB_NAME);

// Rutas
app.get("/", (_req, res) => res.send("API funcionando 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/questions", questionRoutes);

// Lanzar
app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
