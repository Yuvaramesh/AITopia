"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateStory } from "@/utils/generateStory";
import { generateImage } from "@/utils/generateImage";
import Panels from "@/components/Panels";
import ClickSpark from "../../components/ClickSpark";
const ComicGenerator = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [maxNbPanels, setMaxNbPanels] = useState(4);
  const [story, setStory] = useState([]);
  const [count, setCount] = useState(0);
  const [llmModel, setLlmModel] = useState("hugging-face");
  const [language, setLanguage] = useState("English"); // NEW

  const [images, setImages] = useState([
    { image: undefined, text: "" },
    { image: undefined, text: "" },
    { image: undefined, text: "" },
    { image: undefined, text: "" },
  ]);

  const generateNextPage = async () => {
    setMaxNbPanels((prev) => prev + 4);
    setImages((prev) => [
      ...prev,
      { image: undefined, text: "" },
      { image: undefined, text: "" },
      { image: undefined, text: "" },
      { image: undefined, text: "" },
    ]);

    generateComic();
  };

  const generateComic = async () => {
    try {
      setIsGenerating(true);

      const firstStory = await generateStory({
        maxNbPanels,
        topic,
        previousPanel: story,
        language, // Pass language here
      });

      let updatedStory = [...story, ...firstStory];
      setStory(updatedStory);

      const secondStory = await generateStory({
        maxNbPanels,
        topic,
        previousPanel: updatedStory,
        language,
      });

      updatedStory = [...updatedStory, ...secondStory];
      setStory(updatedStory);

      setCount((prev) => prev + 4);

      for (let i = 0; i < 4; i++) {
        const panelIndex = 4 * (count / 4) - 4 + 1 + i + 3;

        let image;
        let success = false;
        let retryCount = 0;
        const maxRetries = 5;

        while (!success && retryCount < maxRetries) {
          try {
            image = await generateImage({
              topic: language === "Tamil" ? `தமிழ்: ${topic}` : topic,
              panelDescription: updatedStory[panelIndex]?.instructions || "",
              previousPanelDescription:
                panelIndex > 0 ? updatedStory[panelIndex - 1]?.instructions : undefined,
              llmModel,
            });
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
            }
          }
        }

        setImages((prev) => {
          const newImages = [...prev];
          newImages[panelIndex] = {
            image: llmModel === "dalle" ? image : URL.createObjectURL(image),
            text: updatedStory[panelIndex]?.caption || "",
          };
          return newImages;
        });
      }
    } catch (error) {
      console.error("Error generating comic:", error.response?.data || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full relative h-full text-white">
      
      <div className="w-3/4 mx-auto flex pt-9 items-center justify-center">
        <h1 className="text-5xl font-bold text-black">
          {language === "Tamil" ? "காமிக் உருவாக்கி✨" : "Comic Generator✨"}
        </h1>
      </div>

      {/* Language Switcher */}
      <div className="mt-6 mb-4 flex justify-center items-center">
  <div className="flex gap-2">
    <ClickSpark
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={20}
      sparkCount={12}
      duration={500}
    >
      <Button
        variant={language === "English" ? "default" : "outline"}
        onClick={() => setLanguage("English")}
        className="text-black"
      >
        English
      </Button>
    </ClickSpark>

    <ClickSpark
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={20}
      sparkCount={12}
      duration={500}
    >
      <Button
        variant={language === "Tamil" ? "default" : "outline"}
        onClick={() => setLanguage("Tamil")}
        className="text-black"
      >
        தமிழ்
      </Button>
    </ClickSpark>
  </div>
</div>





      <div className="w-full mt-2 min-h-screen flex flex-col items-center justify-center gap-y-4">
        <div className="flex w-3/4 gap-x-3">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full py-6 border text-black bg-gray-400/50 border-black"
            placeholder={
              language === "Tamil"
                ? "உங்கள் காமிக் தலைப்பை இங்கே உள்ளிடுங்கள்"
                : "Enter your comic topic here"
            }
          />
          <Button
            disabled={topic.length === 0 || isGenerating}
            onClick={generateComic}
            className="py-6"
          >
            {language === "Tamil" ? "உருவாக்கவும்" : "Generate"}
          </Button>
        </div>

        <Panels images={images} isGenerating={isGenerating} />

        <div className="flex gap-x-2">
          <Button
            disabled={topic.length === 0 || isGenerating}
            className="w-32 mb-10"
            onClick={generateNextPage}
          >
            {language === "Tamil" ? "தொடரவும்" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComicGenerator;
