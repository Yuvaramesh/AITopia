"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SelectOptions from "@/app/createCourse/_components/SelectOptions";
import TopicInput from "@/app/createCourse/_components/TopicInput";
import { toast } from "sonner";
import { createStudyMaterial } from "@/services/api";
import { generateCourseOutline } from "@/services/GlobalServices";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { UserContext } from "@/app/_context/UserContext";
import Image from "next/image";

function CreateCourse() {
  const router = useRouter();
  const { userData } = useContext(UserContext);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [selected, setSelected] = useState();

  // Fetch the courses created by the current user from the studyMaterial endpoint
  useEffect(() => {
    const fetchCourses = async () => {
      if (!userData) return;
      try {
        const res = await fetch(`/api/studyMaterial?userId=${userData._id}`);
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCreatedCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [userData]);

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateCourseOutline = async () => {
    setIsLoading(true);
    try {
      // Create a unique id for the course if needed
      const courseId = uuidv4();
      const result = await generateCourseOutline({
        topic: formData.topic,
        courseType: formData.courseType,
        difficultyLevel: formData.difficultyLevel,
      });
      const dbResult = await createStudyMaterial({
        courseId,
        courseType: formData.courseType,
        topic: formData.topic,
        difficultyLevel: formData.difficultyLevel,
        courseLayout: result,
        createdBy: userData._id,
        status: "completed",
      });

      toast.success("Course created successfully!");
      router.push(`/course/${dbResult.courseId}`);
    } catch (error) {
      console.error("Error generating course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
      <h2 className="font-bold text-4xl text-primary">
        Start Building Your Personal Study Material
      </h2>
      <p className="text-gray-500 text-lg">
        Fill in all details in order to generate study material for your next project
      </p>

      <div className="mt-10 w-full max-w-2xl">
        <SelectOptions
          currentValue={formData.courseType}
          selectedStudyType={(value) => handleUserInput("courseType", value)}
        />
        {step > 0 && (
          <TopicInput
            setTopic={(value) => handleUserInput("topic", value)}
            setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
          />
        )}
      </div>
      <div className="flex justify-between w-full max-w-2xl mt-10">
        {step !== 0 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        {step === 0 ? (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button onClick={GenerateCourseOutline} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        )}
      </div>

      {/* User Created Courses Section */}
      <div className="mt-16 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          User Created Courses
        </h3>
        {createdCourses.length === 0 ? (
          <p className="text-gray-500">No courses created yet.</p>
        ) : (
          <div className="space-y-4">
            {createdCourses.map((course) => (
              <div
                key={course._id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src="/laptop.png"
                    alt="Course"
                    width={70}
                    height={70}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{course.topic}</h3>
                    <p className="text-gray-500 text-sm">
                      Course Type: {course.courseType}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Difficulty Level: {course.difficultyLevel}
                    </p>
                    <p className="text-sm mt-2">
                      Created {moment(course.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/course/${course.courseId}`)}
                >
                  View Course
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateCourse;