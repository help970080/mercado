import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: String,
  items: Array
});

export default mongoose.model('Cart', cartSchema);