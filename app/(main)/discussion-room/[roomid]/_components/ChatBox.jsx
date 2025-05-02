import { Button } from "@/components/ui/button";
import { AIModelToGenerateFeedbackAndNotes } from "@/services/GlobalServices";
import React, { useState } from "react";
import { toast } from "sonner";
import { updateDiscussionRoom } from "@/services/api";
import { useParams } from "next/navigation";

function ChatBox({ conversation, enableFeedBackNotes, coachingOptions }) {
  const [loading, setLoading] = useState(false);
  const { roomid } = useParams();

  const GenerateFeedbackNotes = async () => {
    setLoading(true);
    try {
      const result = await AIModelToGenerateFeedbackAndNotes(coachingOptions, conversation);
      const feedbackContent = result.choices[0].message.content;
      console.log("AI Response:", feedbackContent);
      
      await updateDiscussionRoom({
        id: roomid,
        summery: feedbackContent,
      });
      
      toast('Feedback/Notes saved Successfully');
    } catch (e) {
      console.error(e);
      toast('Internal server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="h-[60vh] bg-secondary border rounded-xl
          flex flex-col relative p-4 overflow-auto"
      >
        {conversation.map((item, index) => (
          <div
            key={index}
            className={`flex ${ item.role === "user" ? "justify-end" : "justify-start" }`}
          >
            {item.role === "assistant" ? (
              <h2 className="p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md">
                {item.content}
              </h2>
            ) : (
              <h2 className="p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md">
                {item.content}
              </h2>
            )}
          </div>
        ))}
      </div>
      {!enableFeedBackNotes ? (
        <h2 className="mt-4 text-gray-400 text-sm"></h2>
      ) : (
        <Button onClick={GenerateFeedbackNotes} disabled={loading} className="mt-7 w-full">
          {loading && (
            <span className="animate-spin mr-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24"></svg>
            </span>
          )}
          Generate FeedBack/Notes
        </Button>
      )}
    </div>
  );
}

export default ChatBox;
