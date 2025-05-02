"use client";

import { CoachingExpert, coachingOptions } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { AIModel, ConvertTextToSpeech } from "@/services/GlobalServices";
import ChatBox from "./_components/ChatBox";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { getDiscussionRoom, updateDiscussionRoom } from "@/services/api";

function DiscussionRoom() {
  const { roomid } = useParams();
  const [discussionRoomData, setDiscussionRoomData] = useState(null);
  const [expert, setExpert] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [enableMic, setEnableMic] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [audioUrl, setAudioUrl] = useState();
  const [enableFeedBackNotes, setEnableFeedBackNotes] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualStop, setManualStop] = useState(false);

  useEffect(() => {
    async function fetchRoom() {
      try {
        const data = await getDiscussionRoom(roomid);
        setDiscussionRoomData(data);
        setExpert({
          name: "Kore AI",
          avatar: "/ai.gif"
        });
      } catch (error) {
        console.error("Error fetching discussion room:", error);
      }
    }
    fetchRoom();
  }, [roomid]);

  // Trigger an AI call when the last message is from the user.
  useEffect(() => {
    async function fetchAIResponse() {
      if (!discussionRoomData) return;
      if (conversation.length === 0 || conversation[conversation.length - 1]?.role === "user") {
        const lastTwoMsg = conversation.slice(-2);
        console.log("User response received:", lastTwoMsg);
        try {
          const aiResponse = await AIModel(
            discussionRoomData.topic,
            discussionRoomData.coachingOptions,
            lastTwoMsg,
            discussionRoomData.language
          );
          console.log("AI Response:", aiResponse);
          const url = await ConvertTextToSpeech(
          aiResponse.choices[0].message.content, 
          "kore"
          );
          console.log("Audio URL:", url);
          setAudioUrl(url);
          setConversation((prev) => [
            ...prev,
            {
              role: "assistant",
              content: aiResponse.choices[0].message.content,
            },
          ]);
        } catch (error) {
          console.error("Error in AI call:", error);
        }
      }
    }
    fetchAIResponse();
  }, [conversation, discussionRoomData]);

  const connectToServer = async () => {
    setLoading(true);
    setManualStop(false);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in your browser.");
      setLoading(false);
      return;
    }
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = discussionRoomData?.language || 'en-US';

    recognitionInstance.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk + " ";
          setConversation((prev) => [
            ...prev,
            { role: "user", content: transcriptChunk },
          ]);
          console.log("Added user response:", transcriptChunk);
        } else {
          interimTranscript += transcriptChunk;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognitionInstance.onend = () => {
      console.log("Speech recognition ended");
      if (!manualStop) {
        recognitionInstance.start();
      } else {
        setEnableMic(false);
        setLoading(false);
      }
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setEnableMic(true);
    setLoading(false);
    toast("Connected to server successfully");
  };

  const stopRecognition = async () => {
    if (recognition) {
      setManualStop(true);
      recognition.stop();
      setEnableMic(false);
      toast("Disconnected");
      try {
        await updateDiscussionRoom({
          id: discussionRoomData._id,
          conversation: conversation
        });
      } catch (error) {
        console.error("Error updating conversation:", error);
      }
      setLoading(false);
      setEnableFeedBackNotes(true);
    }
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {discussionRoomData?.coachingOptions}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div
            className="h-[60vh] bg-secondary border rounded-4xl
            flex flex-col items-center justify-center relative"
          >
            {expert?.avatar ? (
              <Image
                src={expert.avatar}
                alt="avatar"
                width={200}
                height={200}
                className="h-[150px] w-[150px] object-cover rounded-full"
              />
            ) : (
              <p>Loading expert...</p>
            )}

            <h2 className="text-gray-500 mt-2">{expert?.name}</h2>
            <audio src={audioUrl} type="audio/mp3" autoPlay/>

            <div className="absolute bottom-10 right-10">
              <Webcam height={80} width={130} className="rounded-2xl" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={loading}>
                {loading && <Loader2Icon className="animate-spin" />} Connect
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={stopRecognition}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" />} Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <ChatBox 
            conversation={conversation}
            enableFeedBackNotes={enableFeedBackNotes}
            coachingOptions={discussionRoomData?.coachingOptions}
          />
        </div>
      </div>
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold">{transcript}</h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
