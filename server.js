import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({
  origin: process.env.FRONTEND_URL?.split(",") || "*",
  credentials: false
}));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// Health check
app.get("/", (_req, res) => res.json({ ok: true, service: "mercadito-backend" }));

// Routes
app.use("/api/products", productRoutes);

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("MongoDB conectado 🚀");
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => {
    console.error("Error de conexión MongoDB:", err);
    process.exit(1);
  });

export { cloudinary };
