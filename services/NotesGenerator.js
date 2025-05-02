import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client using your API key from environment variables.
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function generateNotesFromGemini({ topic, chapters }) {
  // Build a dynamic prompt using the course topic and chapter details.
  let prompt = `Generate detailed course notes for the course "${topic}".\n`;
  prompt += `For each chapter, provide comprehensive notes based on the chapter title and topics.\n`;
  chapters.forEach((chapter, idx) => {
    prompt += `${idx + 1}. Chapter Title: ${chapter.chapterTitle}. `;
    prompt += `Chapter Topics: ${chapter.topics ? chapter.topics : 'Not specified'}.\n`;
  });
  
  console.log("Generated dynamic prompt:", prompt);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log("Gemini API Response:", response.text);
    return response.text;
  } catch (error) {
    console.error("Error contacting Gemini API:", error);
    throw new Error(error.message || 'Failed to generate notes');
  }
}