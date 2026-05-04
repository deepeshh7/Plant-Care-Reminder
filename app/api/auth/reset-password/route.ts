import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = resetPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json(
        { message: "If the email exists, a reset link has been sent" },
        { status: 200 }
      );
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
            <h1 style="color: #22c55e; margin-top: 0;">🌱 Reset Your Password</h1>
            <p style="font-size: 16px;">Hi there,</p>
            <p style="font-size: 16px;">
              We received a request to reset your password for your Plant Care Reminder account.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="font-size: 14px; color: #666;">
              Or copy and paste this URL into your browser:<br>
              <a href="${resetUrl}" style="color: #22c55e; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: 'Plant Care Reminder <onboarding@resend.dev>',
        to: 'chandanbasavaraj88@gmail.com',
        subject: '🌱 Reset Your Password',
        html: emailHtml,
      });
      console.log(`Reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "If the email exists, a reset link has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
