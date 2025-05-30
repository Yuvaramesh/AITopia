"use client"
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import ChatInterface from "@/components/ChatInterface";
import Settings from "@/components/Settings";
import VoiceAssistant from "@/components/VoiceAssistant";
import { MdDelete } from "react-icons/md";

export default function HandWrittenEvaluator() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const { toast } = useToast();

  // Settings with defaults
  const [settings, setSettings] = useState({
    voiceAssistant: false,
    autoRead: false,
    accessibility: false,
  });

  // Load settings and chat history from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedImage = localStorage.getItem("uploadedImage");
    if (savedImage) {
      setUploadedImage(savedImage);
    }
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Save uploaded image to localStorage
  useEffect(() => {
    if (uploadedImage) {
      localStorage.setItem("uploadedImage", uploadedImage);
    } else {
      localStorage.removeItem("uploadedImage");
    }
  }, [uploadedImage]);

  const handleImageUpload = (base64Image) => {
    setUploadedImage(base64Image);
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  const handleClearHistory = () => {
    setMessages([]);
    toast({
      description: "Cleared Successfully",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleVoiceInput = (text) => {
    // Add the voice input to the chat input
    if (text && uploadedImage) {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: text,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Simulate analyzing image - this would trigger the same flow as the chat interface
      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      }) ;
      handleSubmit(formEvent, text);
    } else if (!uploadedImage) {
      toast({
        title: "No image",
        description: "Upload image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e, voiceText) => {
    // This is a proxy function to simulate form submission from voice input
    // The actual implementation is in ChatInterface component
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white text-black border border-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-semibold text-primary">✍️</span>
                <h1 className="ml-2 text-xl font-bold">Kids' Handwriting Evaluator</h1>
              </div>
            </div>

        
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 bg-white text-black border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 flex-1 overflow-y-auto">
            {/* Image upload section */}
            <ImageUploader
              onImageUpload={handleImageUpload}
              clearImage={clearImage}
              uploadedImage={uploadedImage}
            />

            {/* Clear history button */}
            <div className="mt-6">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center"
                onClick={handleClearHistory}
              >
                <MdDelete />
                Clear History
              </Button>
            </div>
          </div>

          {/* Settings section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Settings settings={settings} onSettingsChange={setSettings} />
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden">
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
            uploadedImage={uploadedImage}
            settings={settings}
          />
        </div>
      </main>

      {/* Voice assistant button */}
      {/* <VoiceAssistant
        onSubmit={handleVoiceInput}
        isEnabled={settings.voiceAssistant}
      /> */}
    </div>
  );
}
