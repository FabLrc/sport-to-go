import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.workoutLog.findMany({
      include: {
        session: {
          include: {
            program: true
          }
        },
        performance: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workout logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, performance } = body;

    const workoutLog = await prisma.workoutLog.create({
      data: {
        sessionId,
        completed: true,
        performance: {
          create: performance.map((p: {
            exerciseId: number;
            setNumber: number;
            repsCompleted: number;
            weight?: number;
            completed: boolean;
          }) => ({
            exerciseId: p.exerciseId,
            setNumber: p.setNumber,
            repsCompleted: p.repsCompleted,
            weight: p.weight,
            completed: p.completed
          }))
        }
      },
      include: {
        performance: true
      }
    });

    return NextResponse.json(workoutLog);
  } catch (error) {
    console.error("Error creating workout log:", error);
    return NextResponse.json({ error: "Failed to create workout log" }, { status: 500 });
  }
}
