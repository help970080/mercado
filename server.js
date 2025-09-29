import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/questions", questionRoutes);

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("MongoDB conectado 🚀");
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.error("Error de conexión MongoDB:", err));
