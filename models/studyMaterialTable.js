import mongoose from "mongoose";

const StudyMaterialSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    courseType: { type: String, required: true },
    topic: { type: String, required: true },
    difficultyLevel: { type: String, required: true },
    courseLayout: { type: Object, required: true },
    createdBy: { type: String, required: true },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.StudyMaterial ||
  mongoose.model("StudyMaterial", StudyMaterialSchema);