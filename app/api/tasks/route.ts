import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = startDate && endDate
      ? {
          nextDueDate: {
            gte: startOfDay(new Date(startDate)),
            lte: endOfDay(new Date(endDate)),
          },
        }
      : {};

    const tasks = await prisma.careSchedule.findMany({
      where: {
        plant: {
          userId: session.user.id,
          isDeleted: false,
        },
        isDeleted: false,
        isActive: true,
        ...dateFilter,
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            species: true,
            imageUrl: true,
            location: true,
          },
        },
      },
      orderBy: { nextDueDate: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
