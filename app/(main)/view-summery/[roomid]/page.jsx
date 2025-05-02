"use client";
import { CoachingOptions } from "@/services/Options";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SummaryBox from "../_components/SummaryBox";
import moment from "moment";
import ChatBox from "../../discussion-room/[roomid]/_components/ChatBox";
import { getDiscussionRoom } from "@/services/api";
import Image from "next/image";

export default function ViewSummary() {
  const { roomid } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomid) return;
    getDiscussionRoom(roomid)
      .then(setRoomData)
      .catch((err) => setError(err.message));
  }, [roomid]);

  if (error) return <p>Error: {error}</p>;
  if (!roomData) return <p>Loading...</p>;
  console.log("Room Data", roomData);

  const GetAbstractImages = (option) => {
    const coachingOption = CoachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? "/ab1.png";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {roomData?.coachingOptions && CoachingOptions &&(
              <Image
                src={GetAbstractImages(roomData.coachingOptions)}
                alt="abstract"
                width={100}
                height={100}
                className="rounded-full h-[70px] w-[70px]"
              />
            )}
            <div>
              <h2 className="font-bold text-lg">{roomData?.topic}</h2>
              <p className="text-gray-400">{roomData?.coachingOptions}</p>
            </div>
          </div>
          <p className="text-gray-400">
            {moment(roomData?._creationTime).fromNow()}
          </p>
        </div>
        <div className="flex flex-col">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Summary Column */}
            <div className="col-span-3">
              <h2 className="text-lg font-bold mb-4">Summary of your Conversation</h2>
              <SummaryBox summery={roomData?.summery} />
            </div>

            {/* Conversation Column */}
            <div className="col-span-2">
              <h2 className="text-lg font-bold mb-4">Your Conversation</h2>
              {roomData?.conversation && (
                <ChatBox
                  conversation={roomData?.conversation}
                  coachingOptions={roomData?.coachingOptions}
                  enableFeedBackNotes={false}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
