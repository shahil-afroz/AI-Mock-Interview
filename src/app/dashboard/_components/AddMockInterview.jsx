"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { LoaderPinwheelIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { chatSession } from "../../../lib/AI/GeminiAIModel";

function AddMockInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobdesc, setJobdesc] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [mockJsonresp, setMockJsonResp] = useState([]);
  const router=useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt = `Job Position:${role}, Job Description:${jobdesc}:${years} years. Now make 5 interview questions for me and answers in JSON format.`;

    try {
      if (!InputPrompt) return;

      // Send the message to the chat session
      const res = await chatSession.sendMessage(InputPrompt);
      console.log("res");
      console.log("res",res);
      const mockJsonResponse = res.response.text();

      const cleanedResponse = mockJsonResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedResponse = JSON.parse(cleanedResponse);

      console.log("Parsed Response:", parsedResponse);
      setMockJsonResp(parsedResponse);

      const mockData = {
        jobDesc: jobdesc,
        jobPosition: role,
        jobexperience: years,
        MockResponse: parsedResponse.interviewQuestions
      };

      console.log(mockData)
      // Save the response to the database
      const response = await fetch("/api/mockInterview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      });

      if (!response.ok) {
        throw new Error("Failed to save interview data");
      }


      const savedResponse = await response.json();
      console.log("Saved to database:", savedResponse);
      if (response) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${savedResponse.id}`)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log("Invalid JSON response:", error);
        // Display a user-friendly error message
      } else {
        console.log("Error fetching interview questions:", error);
        // Handle other errors
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to open the dialog */}
      <div
        className="p-10 border rounded-lg bg-slate-300 hover:scale-100 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>


      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tell us more about yourself</DialogTitle>
            <DialogDescription className="flex flex-col">
              <h3 className="text-xl font-semibold">
                Add details about your job position/role and experience
              </h3>
              <form onSubmit={onSubmit}>
                {/* Role Input */}
                <span className="flex flex-col mt-3">
                  <label
                    htmlFor="role"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Job Role/Position
                  </label>
                  <input
                    type="text"
                    id="role"
                    placeholder="Enter your Job Role/Position"
                    className="mt-2 rounded-lg border p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </span>

                {/* Job Description Input */}
                <span className="flex flex-col mt-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Job Description/Tech Stacks
                  </label>
                  <textarea
                    id="description"
                    placeholder="Eg:- React, TailwindCSS"
                    className="mt-2 rounded-lg border p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                    value={jobdesc}
                    onChange={(e) => setJobdesc(e.target.value)}
                  />
                </span>

                {/* Years of Experience Input */}
                <span className="flex flex-col mt-3">
                  <label
                    htmlFor="years"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="years"
                    placeholder="Eg:- 5"
                    className="mt-2 rounded-lg border p-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200"
                    required
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </span>

                {/* Buttons */}
                <span className="flex gap-5 justify-between mt-5">
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-800"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderPinwheelIcon className="animate-spin" />
                        Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                  <Button type="button" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                </span>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddMockInterview;
