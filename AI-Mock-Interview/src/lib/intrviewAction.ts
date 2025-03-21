// lib/interview-actions.ts
import axios from 'axios';

export interface AnswerSubmissionResponse {
  success: boolean;
  answer: {
    id: string;
    questionId: string;
    participantId: string;
    userId: string;
    text: string;
    submittedAt: string;
    score: number;
    feedback: {
      strengths: string[];
      weaknesses: string[];
      improvement: string;
    };
  };
  analysis: {
    score: number;
    feedback: {
      strengths: string[];
      weaknesses: string[];
      improvement: string;
    };
  };
}

export async function submitAnswer(questionId: string, userAnswer: string): Promise<AnswerSubmissionResponse> {
  try {
    const response = await axios.post('/api/interview/answer', {
      questionId,
      userAnswer
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
}
