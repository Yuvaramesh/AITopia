import { GoogleGenAI } from "@google/genai";
import { CoachingOptions } from "./Options";
import axios from "axios";
import { ElevenLabsClient, stream } from 'elevenlabs';
import { Readable } from 'stream';

// Initialize the Gemini client using your API key from environment variables.
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY ,
});

export const AIModel = async (topic, coachingOption, lastTwoConversation,language) => {
  const option = CoachingOptions.find((item) => item.name === coachingOption);
  // Create a prompt by replacing the placeholder in your option.
  const prompt = option.prompt.replace("{user_topic}", topic);
  // Replace the placeholder with the selected language.
  const UpdatedPrompt = prompt.replace("{language}", language);


  // Combine the prompt with the conversation context.
  const conversationText = lastTwoConversation
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  const combinedPrompt = `${UpdatedPrompt}\n\n${conversationText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: combinedPrompt,
    });
    console.log("Gemini API Response:", response.text);
    // Wrap the response to mimic the structure expected by your code.
    return { choices: [{ message: { content: response.text } }] };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const ConvertTextToSpeech = async (text) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb',
      headers: {
        'xi-api-key': 'sk_dac32a2a3a2e2d7af2cdd7485649c63697b483140f7cc3e1',
        'Content-Type': 'application/json',
      },
      params: {
        output_format: 'mp3_44100_128',
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
      },
      responseType: 'blob', // important for audio
    });

    const audioUrl = URL.createObjectURL(response.data);
    return audioUrl;

  } catch (error) {
    console.error('Error generating audio:', error.response?.data || error.message);
  }
};



export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation) => {
  const option = CoachingOptions.find((item) => item.name === coachingOption);
  if (!option) {
    throw new Error(`Coaching option "${coachingOption}" not found.`);
  }
  const prompt = option.summeryPrompt;

  const feedbackConversationText = conversation
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  const combinedPrompt = `${prompt}\n\n${feedbackConversationText}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: combinedPrompt,
    });
    console.log("Gemini API Response:", response.text);
    return { choices: [{ message: { content: response.text } }] };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

export const generateCourseOutline = async ({ topic, courseType, difficultyLevel }) => {
  const PROMPT = `Generate structured study material for Topic: ${topic}, Course/Study Type: ${courseType}, Difficulty level: ${difficultyLevel}.
                  Provide:
                  A course summary (50-100 words).
                  - Three chapters with summaries that are only related to the user input topic.
                  - Topics for each chapter.
                  - Return the output as clean JSON with the following constant keys exactly as written (do not modify the key names):
                      "topic"
                      "course_type"
                      "difficulty_level"
                      "course_summary"
                      "chapters" (an array where each element must have exactly the keys below
                      "chapter_number"
                      "chapter_title"
                      "chapter_summary"
                      "topics" (an array)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });

    // Extract just the JSON text
    const jsonText = response.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate course content");
  }
};

export const generateMCQ = async ({ notes }) => {
  const PROMPT = `Generate 10 multiple-choice questions (MCQs) based on the following course notes:
${notes}

Requirements:
- Each MCQ must have one correct answer and three incorrect options (total 4 options).
- Return the output as clean JSON without markdown formatting using the following structure:
{
  "mcqs": [
    {
      "question": "Question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "answer": "Correct Option text"
    },
    ... (total 10 questions)
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });
    
    const jsonText = response.text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
      
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate MCQs");
  }
};

export const generateMCQFeedback = async (userResponses) => {
  const PROMPT = `Analyze the following MCQ test results and provide overall performance feedback:
${JSON.stringify(userResponses, null, 2)}

Requirements:
- Summarize the user's score, make it very concise.
- Create two side headings as strengths and weaknesses and provide 2 strength and 2 weakness as points.
- Provide recommendations on where the user should improve, make it very short.
- Provide a very short motivation quotes.
Return the feedback as proper markdown format.Also , it should be short and concise.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: PROMPT,
    });
    return response.text.trim();
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate feedback");
  }
};


