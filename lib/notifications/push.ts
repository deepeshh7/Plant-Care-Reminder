import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials not configured. Push notifications will not work.');
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

interface PushNotificationData {
  title: string;
  body: string;
  scheduleId: string;
  plantId: string;
  icon?: string;
  badge?: string;
}

export async function sendPushNotification(
  fcmToken: string,
  data: PushNotificationData
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!admin.apps.length) {
      return { success: false, error: 'Firebase Admin not initialized' };
    }

    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: {
        scheduleId: data.scheduleId,
        plantId: data.plantId,
        url: '/tasks',
      },
      webpush: {
        fcmOptions: {
          link: '/tasks',
        },
        notification: {
          icon: data.icon || '/icon-192x192.png',
          badge: data.badge || '/badge-72x72.png',
          requireInteraction: false,
          tag: `task-${data.scheduleId}`,
          renotify: true,
        },
      },
    };

    const messageId = await admin.messaging().send(message);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    
    // Handle specific FCM errors
    if (error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered') {
      return { success: false, error: 'Invalid or expired FCM token' };
    }

    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

export async function sendTaskReminderPush(
  fcmToken: string,
  plantName: string,
  taskType: string,
  scheduleId: string,
  plantId: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  return sendPushNotification(fcmToken, {
    title: '🌱 Plant Care Reminder',
    body: `Time to ${taskType.toLowerCase()} ${plantName}`,
    scheduleId,
    plantId,
  });
}
