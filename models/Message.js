import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: String,
  text: String
});

export default mongoose.model('Message', messageSchema);