import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET endpoint to fetch participants
export async function GET(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = await params;

    // Verify the interview group exists
    const group = await db.interviewGroup.findUnique({
      where: { id: groupId }
    });

    if (!group) {
      return NextResponse.json(
        { error: "Interview group not found" },
        { status: 404 }
      );
    }

    // Fetch participants with more details according to the schema
    const participants = await db.interviewGroupUser.findMany({
      where: { groupId },
      orderBy: { createdAt: "asc" },
      include: {
        // Include answer count statistics
        Answer: true
      }
    });

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("[GET_INTERVIEW_PARTICIPANTS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST endpoint to add a participant
export async function POST(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const { name, email, imageUrl } = await req.json();

    // Check if the group exists
    const group = await db.interviewGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Interview group not found" },
        { status: 404 }
      );
    }

    // Validate if the user exists in our system
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Add participant (upsert to handle rejoining)
    const participant = await db.interviewGroupUser.upsert({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      update: {
        name,
        email,
        imageUrl
      },
      create: {
        userId,
        groupId,
        name: name || user.name,
        email: email || user.email,
        imageUrl: imageUrl || user.ProfileImage,
        isReady: false,
        isAdmin: group.createdBy === userId, // Set admin status based on creator
        totalScore: 0,

        totalAnswers: 0
      },
    });

    return NextResponse.json({ participant });
  } catch (error) {
    console.error("[ADD_INTERVIEW_PARTICIPANT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update participant status (ready)
export async function PATCH(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;
    const { isReady } = await req.json();

    // Check if the participant exists
    const existingParticipant = await db.interviewGroupUser.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });

    if (!existingParticipant) {
      return NextResponse.json(
        { error: "You are not a participant in this interview group" },
        { status: 404 }
      );
    }

    // Update participant ready status
    const participant = await db.interviewGroupUser.update({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
      data: {
        isReady,
      },
    });

    return NextResponse.json({ participant });
  } catch (error) {
    console.error("[UPDATE_INTERVIEW_PARTICIPANT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a participant
export async function DELETE(
  req: Request,
  { params }: { params: { groupId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId } = params;

    // Check if user is in the group
    const participant = await db.interviewGroupUser.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    // Delete participant
    await db.interviewGroupUser.delete({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_INTERVIEW_PARTICIPANT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
