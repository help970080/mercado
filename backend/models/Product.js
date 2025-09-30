// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    state: { type: String, required: true }, // Ejemplo: "Veracruz"
    city: { type: String, required: true },  // Ejemplo: "Xalapa"
  },
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
