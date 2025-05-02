import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import StudyMaterial from "../../../models/studyMaterialTable";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  // If userId is provided, fetch all courses created by that user.
  const userId = searchParams.get("userId");
  // Otherwise, if courseId is provided, fetch that course.
  const courseId = searchParams.get("courseId");

  try {
    if (userId) {
      // Find all courses where createdBy equals the userId
      const materials = await StudyMaterial.find({ createdBy: userId });
      return NextResponse.json(materials, { status: 200 });
    } else if (courseId) {
      const material = await StudyMaterial.findOne({ courseId });
      if (!material) {
        return NextResponse.json({ message: "Study material not found" }, { status: 404 });
      }
      return NextResponse.json(material, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Missing query parameter: userId or courseId" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error fetching study material:", error);
    return NextResponse.json(
      { message: "Error fetching study material", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const newMaterial = await StudyMaterial.create(data);
    return NextResponse.json(newMaterial, { status: 200 });
  } catch (error) {
    console.error("Error creating study material:", error);
    return NextResponse.json(
      { message: "Error creating study material", error: error.message },
      { status: 500 }
    );
  }
}