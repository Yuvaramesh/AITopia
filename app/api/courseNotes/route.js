import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import CourseNotes from '../../../models/CourseNotes';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');
  if (!courseId) {
    return NextResponse.json({ message: 'Missing courseId query parameter' }, { status: 400 });
  }
  try {
    const notesDoc = await CourseNotes.findOne({ courseId });
    if (!notesDoc) {
      return NextResponse.json({ message: 'No notes found' }, { status: 404 });
    }
    return NextResponse.json(notesDoc, { status: 200 });
  } catch (error) {
    console.error('Error fetching course notes:', error);
    return NextResponse.json(
      { message: 'Error fetching course notes', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    // data should include courseId and notes
    const newNotes = await CourseNotes.create(data);
    return NextResponse.json(newNotes, { status: 200 });
  } catch (error) {
    console.error('Error creating course notes:', error);
    return NextResponse.json(
      { message: 'Error creating course notes', error: error.message },
      { status: 500 }
    );
  }
}