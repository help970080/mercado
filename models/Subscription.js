import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: String,
  plan: String
});

export default mongoose.model('Subscription', subscriptionSchema);