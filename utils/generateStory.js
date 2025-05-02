import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateStory({
  topic,
  maxNbPanels,
  previousPanel,
  language = "english", // "tamil" or "english"
}) {
  try {
    const nbPanelsToGenerate = 2;
    const existingPanels = previousPanel || [];

    const isTamil = language.toLowerCase() === "tamil";

    const existingPanelsTemplate = existingPanels.length
      ? `Here are the previous panels and their captions: ${JSON.stringify(
            existingPanels,
            null,
            2
          )}. Use them to maintain story continuity.`
      : "";

    const firstNextOrLast =
      existingPanels.length === 0
        ?  "first"
        : maxNbPanels - existingPanels.length === maxNbPanels
        ?  "last"
      
        :"next";

    
      const query = isTamil
      ? `
    You are a story writer specialized in science and education. Write a 4-panel comic story on the topic: **${topic}**.
    
    **Instructions**:  
    1. Use technical terms (e.g., "photosynthesis", "algorithm") naturally in dialogue or narration.  
    2. Set the story in real-world environments (e.g., science labs, coding competitions).  
    3. Maintain a professional and engaging tone — not childish.  
    4. **Write all drawing instructions in English. Write only the captions in Tamil.**
    
    For the **${firstNextOrLast} ${nbPanelsToGenerate} panels** out of a total of ${maxNbPanels}:  
    - Provide detailed drawing instructions in English (e.g., characters, setting, actions).  
    - Each **caption must be in Tamil**, and include at least one technical term.  
    - Make sure the story continues logically from previous panels.
    
    ${existingPanelsTemplate}
    
    **Respond in JSON format** like this:
    
    [
      {
        "panel": ${existingPanels.length + 1},
        "instructions": "In this panel...",
        "caption": "..." // Tamil
      },
      {
        "panel": ${existingPanels.length + 2},
        "instructions": "...",
        "caption": "..." // Tamil
      }
    ]
    `
    
      : `
You are a story writer specializing in science and education. Write a 4-panel comic story on the topic: **${topic}**.

**Instructions**:  
1. Use technical terms (e.g., "photosynthesis", "algorithm") naturally in dialogue or narration.  
2. Set the story in real-world settings (e.g., science labs, coding competitions).  
3. Maintain a professional, engaging tone — not childish.  
4. All responses should be in **English**.

For the **${firstNextOrLast} ${nbPanelsToGenerate} panels** out of a total of ${maxNbPanels}:  
- Provide detailed drawing instructions (character gender, age, clothing, setting, visual cues).  
- Each caption should include at least one technical term.  
- Make sure the story continues logically from previous panels.

${existingPanelsTemplate}

**Respond in JSON format** like this:

[
  {
    "panel": ${existingPanels.length + 1},
    "instructions": "In this panel...",
    "caption": "..."
  },
  {
    "panel": ${existingPanels.length + 2},
    "instructions": "...",
    "caption": "..."
  }
]
`;

    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const jsonData = JSON.parse(cleanText);
    return jsonData;
  } catch (error) {
    console.error("Error generating story:", error);
    return {
      message: "Error generating story",
      error: error.message || "Unknown error",
    };
  }
}
