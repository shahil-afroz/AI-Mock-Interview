'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

function InterviewCard({ interview }) {
    const router=useRouter();
    const onStart=()=>{
        router.push(`/dashboard/interview/${interview.id}/`);
    }
    const getFeedback=()=>{
        router.push(`/dashboard/interview/${interview.id}/feedback`);
    }
  return (
    <div className="border border-gray-300 rounded-lg shadow-md p-5 bg-white hover:shadow-lg transition-shadow duration-300 hover:scale-105">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-violet-700 mb-1">{interview.jobPosition}</h2>
        <p className="text-sm text-gray-500">{interview.jobexperience} Years of Experience</p>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <span className="font-semibold text-gray-700">Created At: </span>
        {new Date(interview.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="sm"
          onClick={onStart}
          className="bg-gray-200 text-gray-700 font-medium w-full hover:bg-gray-300 hover:text-black transition-colors"
        >
          Restart Interview
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={getFeedback}
          className="bg-violet-700 text-white font-medium w-full hover:bg-violet-600 transition-colors"
        >
           
          View Feedback
        </Button>
      </div>
    </div>
  );
}

export default InterviewCard;
