import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  productId: String,
  discount: Number
});

export default mongoose.model('Offer', offerSchema);