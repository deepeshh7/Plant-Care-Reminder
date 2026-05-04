import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plantId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plantId } = await params;

    // Verify plant ownership
    const plant = await prisma.plant.findFirst({
      where: {
        id: plantId,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!plant) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const schedules = await prisma.careSchedule.findMany({
      where: {
        plantId,
        isDeleted: false,
      },
      orderBy: { nextDueDate: "asc" },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Get plant schedules error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
