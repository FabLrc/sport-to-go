import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const program = await prisma.program.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        sessions: {
          include: {
            exercises: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { dayInCycle: 'asc' }
        }
      }
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, startDate, cycleDays, totalCycles, sessions } = body;

    // Supprimer toutes les séances et exercices existants
    await prisma.session.deleteMany({
      where: { programId: parseInt(params.id) }
    });

    // Mettre à jour le programme et créer de nouvelles séances
    const program = await prisma.program.update({
      where: { id: parseInt(params.id) },
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
    console.error("Error updating program:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.program.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
