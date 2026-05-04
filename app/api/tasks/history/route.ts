import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.careTask.findMany({
        where: {
          plant: {
            userId: session.user.id,
            isDeleted: false,
          },
        },
        include: {
          plant: {
            select: {
              id: true,
              name: true,
              species: true,
              imageUrl: true,
            },
          },
          schedule: {
            select: {
              taskType: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.careTask.count({
        where: {
          plant: {
            userId: session.user.id,
            isDeleted: false,
          },
        },
      }),
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get task history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
