import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fcmToken } = await req.json();

    if (!fcmToken) {
      return NextResponse.json({ error: "FCM token is required" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { fcmToken },
    });

    return NextResponse.json({ message: "FCM token saved successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
