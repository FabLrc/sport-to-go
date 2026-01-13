import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metrics = await prisma.bodyMetric.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weight, chest, waist, hips, arms, thighs, notes } = body;

    const metric = await prisma.bodyMetric.create({
      data: {
        weight: weight ? parseFloat(weight) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        hips: hips ? parseFloat(hips) : null,
        arms: arms ? parseFloat(arms) : null,
        thighs: thighs ? parseFloat(thighs) : null,
        notes
      }
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error("Error creating metric:", error);
    return NextResponse.json({ error: "Failed to create metric" }, { status: 500 });
  }
}
