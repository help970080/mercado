// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

// Importar rutas desde /routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: false,
  })
);

// Middleware para JSON y formularios
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Subida de archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

// Configuración de Cloudinary (si está habilitado)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Conexión a MongoDB
const { MONGODB_URI, DB_NAME } = process.env;
if (!MONGODB_URI || !DB_NAME) {
  console.error("❌ Faltan variables MONGODB_URI o DB_NAME");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { dbName: DB_NAME })
  .then(() => console.log("✅ Conectado a MongoDB:", DB_NAME))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);
  });

// Rutas principales
app.get("/", (_req, res) => res.send("API funcionando 🚀"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/questions", questionRoutes);

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`✅ Server corriendo en http://localhost:${PORT}`)
);
