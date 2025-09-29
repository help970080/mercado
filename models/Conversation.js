import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: Array
});

export default mongoose.model('Conversation', conversationSchema);