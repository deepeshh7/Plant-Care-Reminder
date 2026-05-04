import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendTaskReminderEmail } from "@/lib/notifications/email";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendTaskReminderEmail(session.user.email, {
      userName: session.user.name || "Plant Lover",
      plantName: "Test Plant",
      taskType: "WATERING",
      dueDate: new Date(),
      plantId: "test",
      scheduleId: "test",
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "Test email sent successfully" 
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
