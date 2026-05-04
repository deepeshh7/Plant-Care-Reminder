import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';
import { toast } from 'sonner';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }

    // Listen for foreground messages
    if (permission === 'granted') {
      onMessageListener()
        .then((payload: any) => {
          console.log('Received foreground message:', payload);
          toast.success(payload.notification?.title || 'Notification', {
            description: payload.notification?.body,
          });
        })
        .catch((err) => console.error('Failed to listen for messages:', err));
    }
  }, [permission]);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const result = await requestNotificationPermission();
      
      if (result.granted && result.token) {
        setPermission('granted');
        setFcmToken(result.token);
        
        // Send token to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcmToken: result.token }),
        });
        
        toast.success('Push notifications enabled');
        return { success: true, token: result.token };
      } else {
        toast.error(result.error || 'Failed to enable notifications');
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast.error('Failed to enable notifications');
      return { success: false, error: 'Unknown error' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    fcmToken,
    isLoading,
    requestPermission,
  };
}
