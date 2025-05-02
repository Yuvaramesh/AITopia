"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

// Custom markdown components with improved styling
const markdownComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto my-4">
        <code className={`language-${match[1]}`} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-200 rounded px-1 py-0.5" {...props}>
        {children}
      </code>
    );
  },
  h1({ node, ...props }) {
    return <h1 className="text-3xl font-bold my-4" {...props} />;
  },
  h2({ node, ...props }) {
    return <h2 className="text-2xl font-bold my-4" {...props} />;
  },
  p({ node, ...props }) {
    return <p className="text-lg leading-relaxed my-3" {...props} />;
  }
};

function CourseNotesPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [notesText, setNotesText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the plain notes text from DB
  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      try {
        const res = await fetch(`/api/courseNotes?courseId=${courseId}`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch course notes");
        }
        const data = await res.json();
        setNotesText(data.notes);
      } catch (error) {
        console.error("Error fetching course notes:", error);
      } finally {
        setLoading(false);
      }
    }
    if (courseId) fetchNotes();
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button className='bg-primary' variant="outline" onClick={() => router.push(`/course/${courseId}`)}>
            &larr; Back to Course
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Course Notes</h1>
        {loading ? (
          <p className="text-lg text-center">Loading course notes...</p>
        ) : notesText ? (
          <div className="bg-white shadow-xl rounded-lg p-8">
            <div className="prose max-w-none" style={{ lineHeight: "1.5" }}>
              <ReactMarkdown components={markdownComponents}>{notesText}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <p className="text-lg text-center">No notes available.</p>
        )}
      </div>
    </div>
  );
}

export default CourseNotesPage;