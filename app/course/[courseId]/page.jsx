"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generateNotesFromGemini } from "@/services/NotesGenerator";
import { createCourseNotes, getCourseNotes } from "@/services/api";

function CoursePage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [notesExist, setNotesExist] = useState(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [generatingMCQ, setGeneratingMCQ] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await fetch(`/api/studyMaterial?courseId=${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchCourse();
  }, [courseId]);

  // Check if notes already exist for the course
  useEffect(() => {
    async function checkNotes() {
      try {
        const res = await getCourseNotes(courseId);
        if (res && res.notes) {
          setNotesExist(true);
        } else {
          setNotesExist(false);
        }
      } catch (error) {
        // if error (eg 404) then no notes exist.
        setNotesExist(false);
      }
    }
    if (courseId) checkNotes();
  }, [courseId]);

  const chapters = course?.courseLayout?.chapters || [];

  const handleGenerateOrViewNotes = async () => {
    setGenerating(true);
    try {
      if (notesExist) {
        // Notes already exist, simply redirect to view them.
        router.push(`/course/${courseId}/notes`);
      } else {
        // Generate notes using the Gemini function with course topic and chapters.
        const generatedNotes = await generateNotesFromGemini({
          topic: course.topic,
          chapters: chapters,
        });
        // Save the generated notes in the DB.
        await createCourseNotes({
          courseId,
          notes: generatedNotes,
        });
        router.push(`/course/${courseId}/notes`);
      }
    } catch (error) {
      console.error("Error generating or fetching notes:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setGeneratingFlashcards(true);
    try {
      router.push(`/course/${courseId}/flashcards`);
    } catch (error) {
      console.error("Error navigating to flashcards:", error);
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  const handleGenerateMCQ = async () => {
    setGeneratingMCQ(true);
    try {
      router.push(`/course/${courseId}/mcq`);
    } catch (error) {
      console.error("Error navigating to MCQ:", error);
    } finally {
      setGeneratingMCQ(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            className="bg-primary"
            variant="outline"
            onClick={() => router.push(`/createCourse`)}
          >
            &larr; Back to Course
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Welcome to {course.topic} Course
        </h1>

        {/* Cards Section */}
        <section className="grid gap-8 md:grid-cols-3">
          {/* Notes Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 flex flex-col items-center">
            <Image src="/notes.png" alt="Notes" width={80} height={80} />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {course.topic} Notes
            </h2>
            <Button
              onClick={handleGenerateOrViewNotes}
              className="mt-6 w-full"
              disabled={generating}
            >
              {generating
                ? "Generating Notes..."
                : notesExist
                ? "View Notes"
                : "Generate Notes"}
            </Button>
          </div>

          {/* Flashcards Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 flex flex-col items-center">
            <Image src="/flashcard.png" alt="Flashcards" width={80} height={80} />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Flashcards
            </h2>
            <Button
              onClick={handleGenerateFlashcards}
              className="mt-6 w-full"
              disabled={generatingFlashcards}
            >
              {generatingFlashcards ? "Generating Flashcards..." : "Generate Flashcards"}
            </Button>
          </div>

          {/* MCQ Card */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 flex flex-col items-center">
            <Image src="/quiz.png" alt="MCQ Questions" width={80} height={80} />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              MCQ Questions
            </h2>
            <Button
              onClick={handleGenerateMCQ}
              className="mt-6 w-full"
              disabled={generatingMCQ}
            >
              {generatingMCQ ? "Generating MCQ..." : "Generate MCQ"}
            </Button>
          </div>
        </section>

        {/* Chapters Section */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Course Chapters
          </h3>
          {chapters.length > 0 ? (
            <div className="space-y-6">
              {chapters.map((chapter, idx) => (
                <div key={idx} className="p-6 bg-white rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {chapter.chapter_title}
                  </h4>
                  <p className="mt-2 text-gray-600">
                    {[chapter.chapter_summary, chapter.chapterSummary].filter(Boolean).join(" ")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No chapters available.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default CoursePage;