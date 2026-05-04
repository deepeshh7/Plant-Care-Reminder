/**
 * Schedule Management Test Suite - Create Recurring Watering Schedule
 * Test case: TC-Sched-01
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma, createTestUser } from '../setup';

describe('Schedule Module - Create Recurring Watering Schedule', () => {
  
  /**
   * TC-Sched-01: Create a recurring watering schedule
   * 
   * Preconditions: User has added a plant
   * 
   * Test Steps:
   * 1. Select the plant
   * 2. Set a watering schedule for every 3 days
   * 
   * Expected Result: A notification is scheduled to trigger every 3 days for that plant
   * Postconditions: Schedule task created, notification queued, appears in calendar
   */
  describe('TC-Sched-01: Create a recurring watering schedule', () => {
    let testUser: any;
    let testPlant: any;
    let testScheduleId: string;
    const testEmail = 'scheduletest-tc01@example.com';

    beforeEach(async () => {
      // Setup: Create test user and plant
      testUser = await createTestUser({
        email: testEmail,
        password: 'TestP@ssw0rd123',
        name: 'Schedule Test User'
      });

      // Create a test plant for the user
      testPlant = await prisma.plant.create({
        data: {
          name: 'Test Plant for Schedule',
          species: 'Test Species',
          userId: testUser.id,
        },
      });
    });

    afterEach(async () => {
      // Cleanup: Remove test schedule, plant, and user
      if (testScheduleId) {
        await prisma.careSchedule.delete({ where: { id: testScheduleId } }).catch(() => {});
      }
      await prisma.plant.delete({ where: { id: testPlant.id } }).catch(() => {});
      await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});
    });

    it('should create a watering schedule for every 3 days', async () => {
      // Step 1: Select the plant (simulated by using plantId)
      const plantId = testPlant.id;

      // Step 2: Set a watering schedule for every 3 days
      const startDate = new Date();
      const scheduleData = {
        plantId: plantId,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: startDate,
        nextDueDate: startDate,
        notes: 'Water every 3 days',
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
        select: {
          id: true,
          plantId: true,
          taskType: true,
          frequencyDays: true,
          timeOfDay: true,
          startDate: true,
          nextDueDate: true,
          notes: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      testScheduleId = schedule.id;

      // Assertions: Verify schedule task created
      expect(schedule).toBeDefined();
      expect(schedule.id).toBeDefined();
      expect(schedule.plantId).toBe(plantId);
      expect(schedule.taskType).toBe('WATERING');
      expect(schedule.frequencyDays).toBe(3);
    });

    it('should set correct frequency of 3 days', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify frequency is 3 days
      expect(schedule.frequencyDays).toBe(3);
    });

    it('should set schedule as active by default', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify schedule is active
      expect(schedule.isActive).toBe(true);
    });

    it('should set isDeleted to false by default', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify schedule is not deleted
      expect(schedule.isDeleted).toBe(false);
    });

    it('should store time of day correctly', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '14:30',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify time of day
      expect(schedule.timeOfDay).toBe('14:30');
      expect(schedule.timeOfDay).toMatch(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
    });

    it('should set nextDueDate for notification scheduling', async () => {
      const startDate = new Date();
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: startDate,
        nextDueDate: startDate,
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify nextDueDate is set for notification
      expect(schedule.nextDueDate).toBeDefined();
      expect(schedule.nextDueDate).toBeInstanceOf(Date);
    });

    it('should appear in calendar/schedule list', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Verify schedule appears in list
      const schedules = await prisma.careSchedule.findMany({
        where: {
          plantId: testPlant.id,
          isActive: true,
          isDeleted: false,
        },
      });

      expect(schedules.length).toBeGreaterThan(0);
      expect(schedules.some(s => s.id === schedule.id)).toBe(true);
    });

    it('should associate schedule with correct plant', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
        include: {
          plant: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
        },
      });

      testScheduleId = schedule.id;

      // Assertions: Verify plant association
      expect(schedule.plant).toBeDefined();
      expect(schedule.plant.id).toBe(testPlant.id);
      expect(schedule.plant.name).toBe('Test Plant for Schedule');
      expect(schedule.plant.userId).toBe(testUser.id);
    });

    it('should create schedule with timestamps', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify timestamps
      expect(schedule.createdAt).toBeInstanceOf(Date);
      expect(schedule.updatedAt).toBeInstanceOf(Date);
      expect(schedule.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should allow optional notes field', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
        notes: 'Water thoroughly until soil is moist',
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify notes are stored
      expect(schedule.notes).toBe('Water thoroughly until soil is moist');
    });

    it('should create schedule without notes', async () => {
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify notes can be null
      expect(schedule.notes).toBeNull();
    });

    it('should support different task types', async () => {
      const wateringSchedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'WATERING',
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      const fertilizingSchedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'FERTILIZING',
          frequencyDays: 14,
          timeOfDay: '10:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      testScheduleId = wateringSchedule.id;

      // Assertions: Verify different task types
      expect(wateringSchedule.taskType).toBe('WATERING');
      expect(fertilizingSchedule.taskType).toBe('FERTILIZING');

      // Cleanup fertilizing schedule
      await prisma.careSchedule.delete({ where: { id: fertilizingSchedule.id } });
    });

    it('should support different frequencies', async () => {
      const schedule1 = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'WATERING',
          frequencyDays: 1,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      const schedule2 = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'WATERING',
          frequencyDays: 7,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      testScheduleId = schedule1.id;

      // Assertions: Verify different frequencies
      expect(schedule1.frequencyDays).toBe(1);
      expect(schedule2.frequencyDays).toBe(7);

      // Cleanup schedule2
      await prisma.careSchedule.delete({ where: { id: schedule2.id } });
    });

    it('should validate required fields', async () => {
      // Attempt to create schedule without required plantId
      const invalidScheduleData = {
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: new Date(),
        nextDueDate: new Date(),
      } as any;

      // Assertions: Should throw error for missing required field
      await expect(
        prisma.careSchedule.create({
          data: invalidScheduleData,
        })
      ).rejects.toThrow();
    });

    it('should create multiple schedules for same plant', async () => {
      const schedule1 = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'WATERING',
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      const schedule2 = await prisma.careSchedule.create({
        data: {
          plantId: testPlant.id,
          taskType: 'FERTILIZING',
          frequencyDays: 14,
          timeOfDay: '10:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      testScheduleId = schedule1.id;

      // Assertions: Verify multiple schedules for same plant
      const plantSchedules = await prisma.careSchedule.findMany({
        where: { plantId: testPlant.id },
      });

      expect(plantSchedules.length).toBe(2);
      expect(plantSchedules.some(s => s.taskType === 'WATERING')).toBe(true);
      expect(plantSchedules.some(s => s.taskType === 'FERTILIZING')).toBe(true);

      // Cleanup schedule2
      await prisma.careSchedule.delete({ where: { id: schedule2.id } });
    });

    it('should store startDate correctly', async () => {
      const startDate = new Date('2024-01-15T09:00:00Z');
      const scheduleData = {
        plantId: testPlant.id,
        taskType: 'WATERING' as const,
        frequencyDays: 3,
        timeOfDay: '09:00',
        startDate: startDate,
        nextDueDate: startDate,
      };

      const schedule = await prisma.careSchedule.create({
        data: scheduleData,
      });

      testScheduleId = schedule.id;

      // Assertions: Verify startDate
      expect(schedule.startDate).toBeInstanceOf(Date);
      expect(schedule.startDate.toISOString()).toBe(startDate.toISOString());
    });
  });
});
