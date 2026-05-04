import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendTaskReminderEmail } from '@/lib/notifications/email';
import { sendTaskReminderPush } from '@/lib/notifications/push';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        fcmToken: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const preferences = user.notificationPreferences as any;
    const results: string[] = [];
    let hasError = false;

    // Send test email if enabled
    if (preferences?.emailEnabled) {
      const emailResult = await sendTaskReminderEmail(user.email, {
        userName: user.name || 'User',
        plantName: 'Test Plant',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'test-plant-id',
        scheduleId: 'test-schedule-id',
      });

      if (emailResult.success) {
        results.push('Email notification sent');
      } else {
        results.push(`Email failed: ${emailResult.error}`);
        hasError = true;
      }
    }

    // Send test push if enabled and token exists
    if (preferences?.pushEnabled && user.fcmToken) {
      const pushResult = await sendTaskReminderPush(
        user.fcmToken,
        'Test Plant',
        'WATERING',
        'test-schedule-id',
        'test-plant-id'
      );

      if (pushResult.success) {
        results.push('Push notification sent');
      } else {
        results.push(`Push failed: ${pushResult.error}`);
        hasError = true;
      }
    }

    if (results.length === 0) {
      return NextResponse.json({
        message: 'No notifications sent',
        note: 'Enable email or push notifications in settings',
      });
    }

    return NextResponse.json({
      message: hasError ? 'Some notifications failed' : 'Test notifications sent successfully',
      details: results,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
