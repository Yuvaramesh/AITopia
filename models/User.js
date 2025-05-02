import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    credits: { type: Number, default: 0 },
    subscriptionId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model('User', UserSchema);