import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: String,
  answer: String
});

export default mongoose.model('Questions', questionSchema);