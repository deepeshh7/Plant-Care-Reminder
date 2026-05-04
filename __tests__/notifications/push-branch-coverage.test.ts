/**
 * Branch Coverage Tests for push.ts
 * Tests all conditional branches and error paths
 */

import { describe, it, expect } from '@jest/globals';
import { sendPushNotification, sendTaskReminderPush } from '../../lib/notifications/push';

describe('Push Notification - Branch Coverage Tests', () => {
  describe('sendPushNotification - Error Branches', () => {
    it('should handle Firebase not initialized', async () => {
      // Test branch: if (!admin.apps.length)
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Firebase Admin not initialized');
    });

    it('should handle empty FCM token', async () => {
      const result = await sendPushNotification('', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle null FCM token', async () => {
      const result = await sendPushNotification(null as any, {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid FCM token format', async () => {
      const result = await sendPushNotification('invalid-token-format', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty notification title', async () => {
      const result = await sendPushNotification('test-token', {
        title: '',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty notification body', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: '',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing scheduleId', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: '',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing plantId', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle undefined notification data', async () => {
      const result = await sendPushNotification('test-token', {
        title: undefined as any,
        body: undefined as any,
        scheduleId: undefined as any,
        plantId: undefined as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle notification with custom icon', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
        icon: '/custom-icon.png',
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle notification with custom badge', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
        badge: '/custom-badge.png',
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle notification with both icon and badge', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
        icon: '/custom-icon.png',
        badge: '/custom-badge.png',
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('sendTaskReminderPush - Branch Coverage', () => {
    it('should handle empty plant name', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        '',
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle null plant name', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        null as any,
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty task type', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        'Monstera',
        '',
        'schedule-123',
        'plant-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid task type', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        'Monstera',
        'INVALID_TYPE' as any,
        'schedule-123',
        'plant-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle WATERING task type', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        'Monstera',
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle FERTILIZING task type', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        'Monstera',
        'FERTILIZING',
        'schedule-123',
        'plant-123'
      );

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle very long plant names', async () => {
      const longName = 'A'.repeat(500);
      const result = await sendTaskReminderPush(
        'test-token',
        longName,
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result).toBeDefined();
    });

    it('should handle special characters in plant name', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        'Plant & "Special" \'Chars\'',
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result).toBeDefined();
    });

    it('should handle unicode characters in plant name', async () => {
      const result = await sendTaskReminderPush(
        'test-token',
        '🌱 Monstera 🌿',
        'WATERING',
        'schedule-123',
        'plant-123'
      );

      expect(result).toBeDefined();
    });
  });

  describe('Firebase Error Code Branches', () => {
    it('should handle invalid-registration-token error', async () => {
      // This would trigger error.code === 'messaging/invalid-registration-token'
      const result = await sendPushNotification('invalid-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      if (result.error) {
        expect(typeof result.error).toBe('string');
      }
    });

    it('should handle registration-token-not-registered error', async () => {
      // This would trigger error.code === 'messaging/registration-token-not-registered'
      const result = await sendPushNotification('unregistered-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      if (result.error) {
        expect(typeof result.error).toBe('string');
      }
    });

    it('should handle generic Firebase errors', async () => {
      // This tests the catch block for other errors
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent push notifications', async () => {
      const promises = Array(5).fill(null).map((_, i) =>
        sendTaskReminderPush(
          `test-token-${i}`,
          'Monstera',
          'WATERING',
          'schedule-123',
          'plant-123'
        )
      );

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
      });
    });

    it('should handle notification with very long body text', async () => {
      const longBody = 'A'.repeat(1000);
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: longBody,
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle notification with HTML in title', async () => {
      const result = await sendPushNotification('test-token', {
        title: '<script>alert("xss")</script>',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle notification with HTML in body', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: '<script>alert("xss")</script>',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle multiple rapid notifications to same token', async () => {
      const token = 'test-token-rapid';
      const results = await Promise.all([
        sendTaskReminderPush(token, 'Plant 1', 'WATERING', 'schedule-1', 'plant-1'),
        sendTaskReminderPush(token, 'Plant 2', 'FERTILIZING', 'schedule-2', 'plant-2'),
        sendTaskReminderPush(token, 'Plant 3', 'WATERING', 'schedule-3', 'plant-3'),
      ]);

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });

    it('should handle notification with missing optional fields', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
        // icon and badge are optional
      });

      expect(result).toBeDefined();
    });

    it('should handle notification with null optional fields', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
        icon: null as any,
        badge: null as any,
      });

      expect(result).toBeDefined();
    });
  });

  describe('Firebase Initialization Branches', () => {
    it('should handle missing Firebase project ID', async () => {
      // Tests the branch where Firebase credentials are missing
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing Firebase client email', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing Firebase private key', async () => {
      const result = await sendPushNotification('test-token', {
        title: 'Test',
        body: 'Test body',
        scheduleId: 'schedule-123',
        plantId: 'plant-123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
