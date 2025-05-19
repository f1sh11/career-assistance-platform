import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String }, 
  authorAvatarUrl: { type: String }, 
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  isAnonymous: { type: Boolean, default: false }, 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  collectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isChat: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);


