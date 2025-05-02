import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function generateFlashcardsFromNotes({ notes }) {
  const prompt = `Using the following course notes, generate 10 concise flashcards. Summarize the notes and extract the most important points. Each flashcard should contain a "question" and its corresponding "answer". Return the output strictly as valid JSON in the following format:
[
  {"question": "Question 1?", "answer": "Answer 1."},
  {"question": "Question 2?", "answer": "Answer 2."},
  ...
]
Course Notes:
${notes}
Ensure the output is valid JSON without any markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    let text = response.text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").trim();
    }
    if (text.endsWith("```")) {
      text = text.slice(0, -3).trim();
    }
    console.log("Generated flashcards text:", text);
    // Parse and return JSON
    const flashcards = JSON.parse(text);
    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
}