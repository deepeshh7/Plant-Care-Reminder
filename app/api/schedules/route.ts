import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createScheduleSchema } from "@/lib/validations/schedule";
import { calculateNextDueDate } from "@/lib/date-utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedules = await prisma.careSchedule.findMany({
      where: {
        plant: {
          userId: session.user.id,
          isDeleted: false,
        },
        isDeleted: false,
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { nextDueDate: "asc" },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Get schedules error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createScheduleSchema.parse(body);

    // Verify plant ownership
    const plant = await prisma.plant.findFirst({
      where: {
        id: validatedData.plantId,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const startDate = new Date(validatedData.startDate);
    const nextDueDate = calculateNextDueDate(
      startDate,
      validatedData.frequencyDays,
      validatedData.timeOfDay,
      validatedData.allowPastDates || false
    );

    const schedule = await prisma.careSchedule.create({
      data: {
        plantId: validatedData.plantId,
        taskType: validatedData.taskType,
        frequencyDays: validatedData.frequencyDays,
        timeOfDay: validatedData.timeOfDay,
        startDate,
        nextDueDate,
        notes: validatedData.notes,
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Create schedule error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
