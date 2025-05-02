import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import StudyMaterial from '../../../models/studyMaterialTable';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ message: 'Missing userId query parameter' }, { status: 400 });
  }
  try {
    // Find all courses created by the given user from StudyMaterial collection
    const courses = await StudyMaterial.find({ createdBy: userId });
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}