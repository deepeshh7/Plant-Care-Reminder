import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

// Initialize Firebase only on client side
if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export function getFirebaseMessaging(): Messaging | undefined {
  if (typeof window === 'undefined') return undefined;
  
  if (!messaging && app) {
    try {
      messaging = getMessaging(app);
    } catch (error) {
      console.error('Error getting Firebase messaging:', error);
    }
  }
  
  return messaging;
}

export async function requestNotificationPermission(): Promise<{
  granted: boolean;
  token?: string;
  error?: string;
}> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { granted: false, error: 'Notifications not supported' };
    }

    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      return { granted: false, error: 'Permission denied' };
    }

    const messaging = getFirebaseMessaging();
    if (!messaging) {
      return { granted: false, error: 'Firebase messaging not initialized' };
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      return { granted: false, error: 'VAPID key not configured' };
    }

    const token = await getToken(messaging, { vapidKey });
    
    if (!token) {
      return { granted: false, error: 'Failed to get FCM token' };
    }

    return { granted: true, token };
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return {
      granted: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function onMessageListener(): Promise<any> {
  return new Promise((resolve) => {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.warn('Firebase messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
