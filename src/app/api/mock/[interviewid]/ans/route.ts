import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, feedback, userAnswer, mockInterviewId } = body;

    // Validate request body
    if (!question || !feedback?.rating || !feedback?.feedback ||!feedback.correct_answer|| !userAnswer || !mockInterviewId) {
      return NextResponse.json({ error: 'Missing or invalid fields in request.' }, { status: 400 });
    }

    // Get the current user
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
    }

    const userId = user.id;




    const existingAnswer=await db.userAnswer.findFirst({
      where:{
        mockInterviewId:mockInterviewId,
        question:question

      }
    })

    if(existingAnswer){
      const updateAnswer=await db.userAnswer.update(
        {
          where:{
            id:existingAnswer.id
        },
        data:{
          Intervieweerating: feedback.rating,
          Intervieweefeedback: feedback.feedback,
          userAnswer,
          correctAnswer: feedback.correct_answer,

        }
      }
      )
      return NextResponse.json({ message: 'Answer updated successfully.' }, { status: 200 });
    }else{
    const newMockAns = await db.userAnswer.create({
      data: {
        question,
        Intervieweerating: feedback.rating,
        Intervieweefeedback: feedback.feedback,
        userAnswer,
        userId,
        correctAnswer:feedback.correct_answer,
        mockInterviewId: mockInterviewId.toString()
      }
    });


    return NextResponse.json({ message: 'Mock Answer created successfully', newMockAns });
  }
  } catch (error: any) {
    console.error('Error saving mock interview answer:', error.message || error);
    return NextResponse.json({ error: 'Error saving mock interview answer' }, { status: 500 });
  }
}
