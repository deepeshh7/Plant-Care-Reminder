import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        city: true,
        weatherEnabled: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { city, weatherEnabled, notificationPreferences } = body;

    const updateData: any = {};
    
    if (city !== undefined) updateData.city = city || null;
    if (weatherEnabled !== undefined) updateData.weatherEnabled = weatherEnabled;
    if (notificationPreferences !== undefined) {
      updateData.notificationPreferences = notificationPreferences;
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        city: true,
        weatherEnabled: true,
        notificationPreferences: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
