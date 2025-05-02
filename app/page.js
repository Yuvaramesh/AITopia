"use client";

import { useState } from "react";
import BlurText from "@/components/BlurText";
import Hyperspeed from "@/components/Hyperspeed";
import PixelCard from "@/components/Pixel";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";
import TrueFocus from "@/components/TrueFocus";
import Link from "next/link";


export default function Home() {
  return <ClientContent />;
}

function ClientContent() {


  const [stage,setStage] = useState(0)

  return (
    <div className="h-screen overflow-hidden flex justify-center items-center relative">
      <div className="absolute w-full h-full">
      <Hyperspeed
  effectOptions={{
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      roadColor: 0x0c0a09,
      islandColor: 0xfacc15,
      background: 0x000000,
      shoulderLines: 0xfacc15,
      brokenLines: 0xfacc15,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }}
/>
</div>

<div  className={`absolute w-full h-full ${stage==0?'backdrop-blur-[2px]':'backdrop-blur-[14px]'} ` } ></div>

{stage===0 &&<>
<div className="flex flex-col gap-10 z-50 mb-40">
<TrueFocus
sentence="AI Topia"
manualMode={false}
blurAmount={5}
borderColor="#facc15"
animationDuration={2}
pauseBetweenAnimations={1}
/>

  
<BlurText
  text="Adaptive Learning Platforms for Diverse Needs"
  delay={150}
  animateBy="words"
  direction="top"
  className="text-5xl font-bold"

/>

<button 
onClick={()=>setStage(1)}
className="px-5 py-3 bg-amber-400 hover:bg-amber-500 transition-all rounded-lg mt-4 w-max mx-auto text-2xl font-medium" >Get Started</button>
</div>
</>}

{
  stage > 0 &&

  <div className="grid grid-cols-3 grid-rows-3 gap-2">
        <div className="col-start-2 row-start-1">
        <Link href="/handwriting-dashboard">
        <SpotlightCard className="custom-spotlight-card rotate-45" spotlightColor="rgba(255, 192, 0,0.8)">
          <div
            onClick={() => console.log("WriteMate card touched")}
            className="w-40 h-40  transition-shadow cursor-pointer transform -rotate-45"
          >
            <div className="w-full h-full flex flex-col justify-center items-center transform ">
              <img src="/handwritten.png" alt="WriteMate" className="w-12 h-12 mb-2" />
              <span className="text-lg font-semibold text-black">WriteMate</span>
            </div>
          </div>
          </SpotlightCard>
          </Link>
        </div>

        <div className="col-start-1 row-start-2">
          <Link href="/comic">
          <SpotlightCard className="custom-spotlight-card rotate-45" spotlightColor="rgba(255, 192, 0,0.8)">

            <div className="w-40 h-40  transition-shadow cursor-pointer transform -rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform">
                <img src="/comic.png" alt="Think2Comic" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">Think2Comic</span>
              </div>
            </div>
          </SpotlightCard>
          </Link>
        </div>

        <div className="col-start-3 row-start-2">
          <Link href="/dashboard">
          <SpotlightCard className="custom-spotlight-card rotate-45" spotlightColor="rgba(255, 192, 0,0.8)">

            <div className="w-40 h-40  transition-shadow cursor-pointer transform -rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform">
                <img src="/voice-assistant.png" alt="EchoMentor" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">EchoMentor</span>
              </div>
            </div>
            </SpotlightCard>
          </Link>
        </div>

        <div className="col-start-2 row-start-3">
          <Link href="/createCourse">
          <SpotlightCard className="custom-spotlight-card rotate-45" spotlightColor="rgba(255, 192, 0,0.8)">

            <div className="w-40 h-40  transition-shadow cursor-pointer transform -rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform">
                <img src="/smartstudy.png" alt="SmartLearn" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">SmartLearn</span>
              </div>
            </div>
            </SpotlightCard>
          </Link>
        </div>
      </div> 
}

      


    </div>
  );
}
