'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Feedback() {
    const router = useRouter();
    const { interviewid } = useParams();
    const [feedbackList, setFeedbackList] = useState([]);

    useEffect(() => {
        const getFeedback = async () => {
            try {
                const response = await fetch(`/api/mock/${interviewid}/feedback`);
                if (!response.ok) {
                    throw new Error('Failed to fetch interview details');
                }
                const data = await response.json();
                console.log("data", data);
                setFeedbackList(data);
            } catch (error) {
                console.error(error);
            }
        };
        getFeedback();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-4xl font-bold text-green-600 mb-4">
                    Congratulations!
                </h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Your Interview Summary
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                    Your performance has been evaluated. Find below a detailed analysis of your interview experience, including feedback, questions, and answers.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-8">
                    <p className="text-lg font-semibold text-blue-800">
                        Overall Interview Rating: <span className="font-bold text-blue-600">6/10</span>
                    </p>
                </div>
                {feedbackList.length > 0 ? (
                    feedbackList.map((item, index) => (
                        <Collapsible key={index} className="mb-4">
                            <CollapsibleTrigger className="flex justify-between items-center p-4 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition">
                                <span className="font-medium text-gray-800">{item.question}</span>
                                <ChevronsUpDown className="w-8 h-8 text-gray-600" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-b-lg">
                                    <p className="text-gray-800 mb-2">
                                        <strong className="text-gray-900">Rating:</strong> {item.rating}
                                    </p>
                                    <p className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-2">
                                        <strong>Your Answer:</strong> {item.userAnswer}
                                    </p>
                                    <p className="bg-green-50 border border-green-200 text-green-800 p-3 rounded mb-2">
                                        <strong>Correct Answer:</strong> {item.correctAnswer}
                                    </p>
                                    <p className="bg-purple-50 border border-purple-200 text-purple-800 p-3 rounded">
                                        <strong>Feedback:</strong> {item.feedback}
                                    </p>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">
                        No Interview Record available for this interview.
                    </p>
                )}
                <div className="mt-8 text-center">
                    <Button
                        className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg"
                        onClick={() => router.replace('/dashboard')}
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
