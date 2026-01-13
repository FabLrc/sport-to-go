import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: {
        sessions: {
          include: {
            exercises: {
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, cycleDays, totalCycles, sessions } = body;

    const program = await prisma.program.create({
      data: {
        name,
        startDate: new Date(startDate),
        cycleDays,
        totalCycles,
        sessions: {
          create: sessions.map((session: {
            name: string;
            dayInCycle: number;
            exercises: Array<{
              name: string;
              sets: number;
              reps: number;
              restTime: number;
            }>;
          }) => ({
            name: session.name,
            dayInCycle: session.dayInCycle,
            exercises: {
              create: session.exercises.map((exercise, index) => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                restTime: exercise.restTime,
                order: index + 1
              }))
            }
          }))
        }
      },
      include: {
        sessions: {
          include: {
            exercises: true
          }
        }
      }
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
