import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationPreferences: true },
    });

    return NextResponse.json(user?.notificationPreferences || {
      pushEnabled: false,
      emailEnabled: false,
      preferredTime: "09:00",
      dailyDigest: false,
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: { notificationPreferences: preferences },
    });

    return NextResponse.json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
