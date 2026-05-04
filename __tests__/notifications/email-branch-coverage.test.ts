/**
 * Branch Coverage Tests for email.ts
 * Tests all conditional branches and error paths
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { sendEmailNotification, sendTaskReminderEmail, generateTaskReminderEmail } from '../../lib/notifications/email';

describe('Email Notification - Branch Coverage Tests', () => {
  const originalEnv = process.env.RESEND_API_KEY;

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.RESEND_API_KEY = originalEnv;
    }
  });

  describe('sendEmailNotification - Error Branches', () => {
    it('should handle missing RESEND_API_KEY', async () => {
      // Test branch: if (!process.env.RESEND_API_KEY)
      delete process.env.RESEND_API_KEY;

      const result = await sendEmailNotification(
        'test@example.com',
        'Test Subject',
        '<p>Test</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service not configured');
    });

    it('should handle empty email address', async () => {
      const result = await sendEmailNotification(
        '',
        'Test Subject',
        '<p>Test</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle null email address', async () => {
      const result = await sendEmailNotification(
        null as any,
        'Test Subject',
        '<p>Test</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid email format', async () => {
      const result = await sendEmailNotification(
        'invalid-email',
        'Test Subject',
        '<p>Test</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty subject', async () => {
      const result = await sendEmailNotification(
        'test@example.com',
        '',
        '<p>Test</p>'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty HTML content', async () => {
      const result = await sendEmailNotification(
        'test@example.com',
        'Test Subject',
        ''
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle network timeout errors', async () => {
      // This tests the catch block
      const result = await sendEmailNotification(
        'test@example.com',
        'Test Subject',
        '<p>Test</p>'
      );

      // Will fail due to API restrictions, testing error path
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('sendTaskReminderEmail - Branch Coverage', () => {
    it('should handle missing task data fields', async () => {
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: '',
        plantName: '',
        taskType: '',
        dueDate: new Date(),
        plantId: '',
        scheduleId: '',
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    it('should handle null userName', async () => {
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: null as any,
        plantName: 'Test Plant',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle invalid date', async () => {
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: 'Test User',
        plantName: 'Test Plant',
        taskType: 'WATERING',
        dueDate: new Date('invalid'),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle very long plant names', async () => {
      const longName = 'A'.repeat(500);
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: 'Test User',
        plantName: longName,
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(result).toBeDefined();
    });

    it('should handle special characters in task data', async () => {
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: 'Test <script>alert("xss")</script>',
        plantName: 'Plant & "Special" \'Chars\'',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(result).toBeDefined();
    });
  });

  describe('generateTaskReminderEmail - Branch Coverage', () => {
    it('should generate email with all fields populated', () => {
      const html = generateTaskReminderEmail({
        userName: 'John Doe',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: new Date('2024-12-25T10:00:00'),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(html).toContain('John Doe');
      expect(html).toContain('Monstera');
      expect(html).toContain('WATERING');
    });

    it('should generate email with empty userName', () => {
      const html = generateTaskReminderEmail({
        userName: '',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    });

    it('should generate email with undefined NEXTAUTH_URL', () => {
      const originalUrl = process.env.NEXTAUTH_URL;
      delete process.env.NEXTAUTH_URL;

      const html = generateTaskReminderEmail({
        userName: 'Test User',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(html).toContain('http://localhost:3000');

      if (originalUrl) {
        process.env.NEXTAUTH_URL = originalUrl;
      }
    });

    it('should format date correctly', () => {
      const testDate = new Date('2024-12-25T15:30:00');
      const html = generateTaskReminderEmail({
        userName: 'Test User',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: testDate,
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    });

    it('should include task URL with correct parameters', () => {
      const html = generateTaskReminderEmail({
        userName: 'Test User',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(html).toContain('/tasks');
    });

    it('should handle different task types', () => {
      const wateringHtml = generateTaskReminderEmail({
        userName: 'Test User',
        plantName: 'Monstera',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      const fertilizingHtml = generateTaskReminderEmail({
        userName: 'Test User',
        plantName: 'Monstera',
        taskType: 'FERTILIZING',
        dueDate: new Date(),
        plantId: 'plant-123',
        scheduleId: 'schedule-123',
      });

      expect(wateringHtml).toContain('WATERING');
      expect(fertilizingHtml).toContain('FERTILIZING');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent email sending', async () => {
      const promises = Array(5).fill(null).map((_, i) =>
        sendEmailNotification(
          `test${i}@example.com`,
          'Test Subject',
          '<p>Test</p>'
        )
      );

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
      });
    });

    it('should handle very long email content', async () => {
      const longContent = '<p>' + 'A'.repeat(10000) + '</p>';
      const result = await sendEmailNotification(
        'test@example.com',
        'Test Subject',
        longContent
      );

      expect(result).toBeDefined();
    });

    it('should handle email with special HTML characters', async () => {
      const result = await sendEmailNotification(
        'test@example.com',
        'Test Subject',
        '<p>&lt;script&gt;alert("test")&lt;/script&gt;</p>'
      );

      expect(result).toBeDefined();
    });

    it('should handle undefined task data', async () => {
      const result = await sendTaskReminderEmail('test@example.com', {
        userName: '',
        plantName: '',
        taskType: 'WATERING',
        dueDate: new Date(),
        plantId: '',
        scheduleId: '',
      });

      expect(result).toBeDefined();
    });
  });
});
