import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors when API key is not set
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');
  }
  return resend;
}

interface TaskReminderData {
  userName: string;
  plantName: string;
  taskType: string;
  dueDate: Date;
  plantId: string;
  scheduleId: string;
}

export function generateTaskReminderEmail(data: TaskReminderData): string {
  const { userName, plantName, taskType, dueDate, plantId, scheduleId } = data;
  const formattedDate = dueDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dueDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const taskUrl = `${appUrl}/tasks`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plant Care Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h1 style="color: #22c55e; margin-top: 0;">🌱 Plant Care Reminder</h1>
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          <p style="font-size: 16px; margin-bottom: 20px;">
            It's time to take care of your plant!
          </p>
          
          <div style="background-color: white; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h2 style="margin-top: 0; color: #22c55e; font-size: 20px;">Task Details</h2>
            <p style="margin: 10px 0;"><strong>Plant:</strong> ${plantName}</p>
            <p style="margin: 10px 0;"><strong>Task:</strong> ${taskType}</p>
            <p style="margin: 10px 0;"><strong>Due:</strong> ${formattedDate} at ${formattedTime}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${taskUrl}" style="background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Tasks
            </a>
          </div>

          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            You can mark this task as complete in the app to update your care schedule.
          </p>
        </div>

        <div style="text-align: center; font-size: 12px; color: #999; padding: 20px;">
          <p>Plant Care Reminder App</p>
          <p>
            <a href="${appUrl}/settings" style="color: #22c55e; text-decoration: none;">Manage notification preferences</a>
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendEmailNotification(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const client = getResendClient();
    const { data, error } = await client.emails.send({
      from: 'Plant Care Reminder <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function sendTaskReminderEmail(
  to: string,
  data: TaskReminderData
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const subject = `🌱 Time to ${data.taskType.toLowerCase()} ${data.plantName}`;
  const html = generateTaskReminderEmail(data);
  return sendEmailNotification(to, subject, html);
}
