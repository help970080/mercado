import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("Falta MONGODB_URI en .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
  await Product.deleteMany({});

  await Product.insertMany([
    { name: "Teléfono usado", price: 120, image: "https://via.placeholder.com/300x200?text=Telefono", description: "Buen estado." },
    { name: "Bicicleta de montaña", price: 350, image: "https://via.placeholder.com/300x200?text=Bicicleta", description: "Lista para rodar." },
    { name: "Laptop", price: 800, image: "https://via.placeholder.com/300x200?text=Laptop", description: "Ideal para trabajo." }
  ]);

  console.log("Seed completado ✅");
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
