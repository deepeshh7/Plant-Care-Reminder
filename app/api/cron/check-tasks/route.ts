import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDaysToDate } from "@/lib/date-utils";
import { sendTaskReminderEmail } from "@/lib/notifications/email";
import { sendTaskReminderPush } from "@/lib/notifications/push";
import { shouldWaterBasedOnWeather } from "@/lib/weather/weather-service";

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    let processedCount = 0;
    let notificationsSent = 0;
    const errors: string[] = [];

    // Find all active schedules that are due
    const dueSchedules = await prisma.careSchedule.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        nextDueDate: {
          lte: now,
        },
        plant: {
          isDeleted: false,
        },
      },
      include: {
        plant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                notificationPreferences: true,
                fcmToken: true,
                city: true,
                weatherEnabled: true,
              },
            },
          },
        },
      },
    });

    for (const schedule of dueSchedules) {
      try {
        const user = schedule.plant.user;
        const preferences = user.notificationPreferences as any;

        // Check weather conditions for watering tasks
        let weatherAdjustment = { shouldWater: true, reason: 'Weather check disabled' };
        if (user.weatherEnabled && user.city) {
          weatherAdjustment = await shouldWaterBasedOnWeather(user.city, schedule.taskType);
          
          // Skip this task if weather suggests not to water
          if (!weatherAdjustment.shouldWater) {
            console.log(`Skipping ${schedule.taskType} for ${schedule.plant.name}: ${weatherAdjustment.reason}`);
            
            // Update next due date but don't send notification
            await prisma.careSchedule.update({
              where: { id: schedule.id },
              data: {
                nextDueDate: addDaysToDate(schedule.nextDueDate, 1), // Check again tomorrow
              },
            });
            
            processedCount++;
            continue;
          }
        }

        // Send notifications based on user preferences
        if (preferences?.emailEnabled && user.email) {
          const emailResult = await sendTaskReminderEmail(user.email, {
            userName: 'User',
            plantName: schedule.plant.name,
            taskType: schedule.taskType,
            dueDate: schedule.nextDueDate,
            plantId: schedule.plant.id,
            scheduleId: schedule.id,
          });
          
          await prisma.notificationLog.create({
            data: {
              scheduleId: schedule.id,
              userId: user.id,
              channel: "EMAIL",
              status: emailResult.success ? "SENT" : "FAILED",
              errorMessage: emailResult.error,
            },
          });
          
          if (emailResult.success) {
            notificationsSent++;
          } else {
            errors.push(`Email failed for schedule ${schedule.id}: ${emailResult.error}`);
          }
        }

        if (preferences?.pushEnabled && user.fcmToken) {
          const pushResult = await sendTaskReminderPush(
            user.fcmToken,
            schedule.plant.name,
            schedule.taskType,
            schedule.id,
            schedule.plant.id
          );
          
          await prisma.notificationLog.create({
            data: {
              scheduleId: schedule.id,
              userId: user.id,
              channel: "PUSH",
              status: pushResult.success ? "SENT" : "FAILED",
              errorMessage: pushResult.error,
            },
          });
          
          if (pushResult.success) {
            notificationsSent++;
          } else {
            errors.push(`Push failed for schedule ${schedule.id}: ${pushResult.error}`);
            
            // If token is invalid, clear it from user record
            if (pushResult.error?.includes('Invalid or expired')) {
              await prisma.user.update({
                where: { id: user.id },
                data: { fcmToken: null },
              });
            }
          }
        }

        // Update schedule nextDueDate
        await prisma.careSchedule.update({
          where: { id: schedule.id },
          data: {
            nextDueDate: addDaysToDate(schedule.nextDueDate, schedule.frequencyDays),
          },
        });

        processedCount++;
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error);
        errors.push(`Schedule ${schedule.id}: ${error instanceof Error ? error.message : "Unknown error"}`);
        
        // Log failed notification
        await prisma.notificationLog.create({
          data: {
            scheduleId: schedule.id,
            userId: schedule.plant.user.id,
            channel: "EMAIL",
            status: "FAILED",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount,
      notificationsSent,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
