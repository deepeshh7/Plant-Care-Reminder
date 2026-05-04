import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const updatedSchedule = await prisma.careSchedule.update({
      where: { id },
      data: { isActive: !schedule.isActive },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Toggle schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
