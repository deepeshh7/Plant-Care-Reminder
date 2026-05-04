import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateScheduleSchema } from "@/lib/validations/schedule";
import { calculateNextDueDate } from "@/lib/date-utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id,
        plant: {
          userId: session.user.id,
        },
        isDeleted: false,
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updateScheduleSchema.parse(body);

    const startDate = new Date(validatedData.startDate);
    const nextDueDate = calculateNextDueDate(
      startDate,
      validatedData.frequencyDays,
      validatedData.timeOfDay
    );

    const updatedSchedule = await prisma.careSchedule.update({
      where: { id },
      data: {
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

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Update schedule error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id,
        plant: {
          userId: session.user.id,
        },
        isDeleted: false,
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    await prisma.careSchedule.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
