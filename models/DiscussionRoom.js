import mongoose from 'mongoose';

const DiscussionRoomSchema = new mongoose.Schema(
  {
    coachingOptions: { type: String, required: true },
    topic: { type: String, required: true },
    expertName: { type: String, default: 'kore' },
    conversation: { type: mongoose.Schema.Types.Mixed },
    summery: { type: mongoose.Schema.Types.Mixed },
    uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    language: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.DiscussionRoom ||
  mongoose.model('DiscussionRoom', DiscussionRoomSchema);