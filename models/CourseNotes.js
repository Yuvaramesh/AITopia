import mongoose from 'mongoose';

const CourseNotesSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  notes: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CourseNotes || mongoose.model('CourseNotes', CourseNotesSchema);