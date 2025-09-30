// Questions.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  answer: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Questions", questionSchema);
