import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: String,
  price: Number
});

export default mongoose.model('Listing', listingSchema);