import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completeTaskSchema } from "@/lib/validations/task";
import { addDaysToDate } from "@/lib/date-utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = completeTaskSchema.parse(body);

    // Verify schedule ownership
    const schedule = await prisma.careSchedule.findFirst({
      where: {
        id: validatedData.scheduleId,
        plant: {
          userId: session.user.id,
          isDeleted: false,
        },
        isDeleted: false,
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Create care task record and update schedule in a transaction
    const [careTask, updatedSchedule] = await prisma.$transaction([
      prisma.careTask.create({
        data: {
          scheduleId: validatedData.scheduleId,
          plantId: schedule.plantId,
          notes: validatedData.notes,
          photoUrl: validatedData.photoUrl,
        },
        include: {
          plant: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
          schedule: {
            select: {
              taskType: true,
            },
          },
        },
      }),
      prisma.careSchedule.update({
        where: { id: validatedData.scheduleId },
        data: {
          nextDueDate: addDaysToDate(schedule.nextDueDate, schedule.frequencyDays),
        },
      }),
    ]);

    return NextResponse.json(careTask, { status: 201 });
  } catch (error) {
    console.error("Complete task error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
