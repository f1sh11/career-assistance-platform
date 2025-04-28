import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  isAnonymous: { type: Boolean, default: false }, // ✅ 新增字段
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  collectedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);


