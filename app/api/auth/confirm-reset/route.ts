import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { confirmResetSchema } from "@/lib/validations/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = confirmResetSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Confirm reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
