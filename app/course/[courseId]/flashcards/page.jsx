"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCourseNotes } from "@/services/api";
import { generateFlashcardsFromNotes } from "@/services/FlashcardsGenerator";

function FlashcardsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      try {
        const notesData = await getCourseNotes(courseId);
        const notes = notesData.notes;
        const cards = await generateFlashcardsFromNotes({ notes });
        setFlashcards(cards);
      } catch (error) {
        console.error("Error generating flashcards:", error);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchFlashcards();
  }, [courseId]);

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCardClick = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex flex-col items-center space-y-8">
      {/* Back Button */}
      <div className="w-full max-w-4xl px-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/course/${courseId}`)}
          className="text-sm"
        >
          &larr; Back to Course
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-900">Flashcards</h1>

      {/* Loader or Content */}
      {loading ? (
        <p className="text-lg text-center text-gray-600">Generating flashcards...</p>
      ) : flashcards.length > 0 ? (
        <div className="flex flex-col items-center space-y-6 w-full">
          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-2">
            <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Flashcard {currentIndex + 1} of {flashcards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div
            className="relative w-full max-w-sm h-80 cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={handleCardClick}
          >
            <div
              className={`relative w-full h-full transition-transform duration-700 transform ${
                flipped ? "rotate-y-180" : ""
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Side */}
              <div
                className="absolute inset-0 bg-white rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center p-6 backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <p className="text-2xl font-semibold text-gray-800 text-center">
                  {flashcards[currentIndex].question}
                </p>
              </div>

              {/* Back Side */}
              <div
                className="absolute inset-0 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200 flex items-center justify-center p-6 rotate-y-180 backface-hidden"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <p className="text-xl text-gray-700 text-center">
                  {flashcards[currentIndex].answer}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <Button onClick={handlePrev} disabled={currentIndex === 0} className="px-6">
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="px-6"
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-lg text-center text-gray-600">No flashcards available.</p>
      )}
    </div>
  );
}

export default FlashcardsPage;
