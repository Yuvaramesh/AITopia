import mongoose from 'mongoose';

const StudyMaterialSchema = new mongoose.Schema({
  courseId: String,
  courseType: String,
  topic: String,
  difficultyLevel: String,
  courseLayout: Object,
  createdBy: String,
  status: String,
}, { timestamps: true });

export default mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);