/**
 * Plant Management Test Suite - Add New Plant
 * Test case: TC-Plant-01
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma, createTestUser } from '../setup';

describe('Plant Module - Add New Plant', () => {
  
  /**
   * TC-Plant-01: Add a new plant to the catalog
   * 
   * Preconditions: User is logged in
   * 
   * Test Steps:
   * 1. Navigate to 'Add Plant'
   * 2. Upload a plant photo
   * 3. Enter plant name and select a species suggestion
   * 
   * Expected Result: The new plant appears in the user's catalog with the correct details
   * Postconditions: Plant record created with unique ID, photo stored, default schedule generated
   */
  describe('TC-Plant-01: Add a new plant to the catalog', () => {
    let testUser: any;
    let testPlantId: string;
    const testEmail = 'planttest-tc01@example.com';

    beforeEach(async () => {
      // Setup: Create test user (simulating logged in user)
      testUser = await createTestUser({
        email: testEmail,
        password: 'TestP@ssw0rd123',
        name: 'Plant Test User'
      });
    });

    afterEach(async () => {
      // Cleanup: Remove test plant and user
      if (testPlantId) {
        await prisma.plant.delete({ where: { id: testPlantId } }).catch(() => {});
      }
      await prisma.user.delete({ where: { email: testEmail } }).catch(() => {});
    });

    it('should create a new plant with valid data', async () => {
      // Step 1: Navigate to 'Add Plant' (simulated by preparing data)
      const plantData = {
        name: 'Monstera Deliciosa',
        species: 'Monstera deliciosa',
        imageUrl: '/uploads/test-plant-photo.jpg',
        location: 'Living Room',
        acquisitionDate: new Date('2024-01-15'),
        notes: 'Beautiful plant with large leaves',
        userId: testUser.id,
      };

      // Step 2 & 3: Upload photo, enter name and species
      const plant = await prisma.plant.create({
        data: plantData,
        select: {
          id: true,
          name: true,
          species: true,
          imageUrl: true,
          location: true,
          acquisitionDate: true,
          notes: true,
          userId: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      testPlantId = plant.id;

      // Assertions: Verify plant record created with unique ID
      expect(plant).toBeDefined();
      expect(plant.id).toBeDefined();
      expect(typeof plant.id).toBe('string');
      expect(plant.id.length).toBeGreaterThan(0);
    });

    it('should store plant with correct details', async () => {
      const plantData = {
        name: 'Snake Plant',
        species: 'Sansevieria trifasciata',
        imageUrl: '/uploads/snake-plant.jpg',
        location: 'Bedroom',
        acquisitionDate: new Date('2024-02-20'),
        notes: 'Low maintenance plant',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Verify all details are stored correctly
      expect(plant.name).toBe('Snake Plant');
      expect(plant.species).toBe('Sansevieria trifasciata');
      expect(plant.imageUrl).toBe('/uploads/snake-plant.jpg');
      expect(plant.location).toBe('Bedroom');
      expect(plant.acquisitionDate).toEqual(new Date('2024-02-20'));
      expect(plant.notes).toBe('Low maintenance plant');
      expect(plant.userId).toBe(testUser.id);
    });

    it('should store plant photo URL', async () => {
      const plantData = {
        name: 'Pothos',
        species: 'Epipremnum aureum',
        imageUrl: '/uploads/1234567890-pothos.jpg',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify photo is stored
      expect(plant.imageUrl).toBeDefined();
      expect(plant.imageUrl).toBe('/uploads/1234567890-pothos.jpg');
      expect(plant.imageUrl).toContain('/uploads/');
    });

    it('should set isDeleted to false by default', async () => {
      const plantData = {
        name: 'Fiddle Leaf Fig',
        species: 'Ficus lyrata',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify plant is not marked as deleted
      expect(plant.isDeleted).toBe(false);
    });

    it('should create plant with timestamps', async () => {
      const plantData = {
        name: 'Peace Lily',
        species: 'Spathiphyllum',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify timestamps are set
      expect(plant.createdAt).toBeInstanceOf(Date);
      expect(plant.updatedAt).toBeInstanceOf(Date);
      expect(plant.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should appear in user catalog after creation', async () => {
      const plantData = {
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        imageUrl: '/uploads/aloe-vera.jpg',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Verify plant appears in user's catalog
      const userPlants = await prisma.plant.findMany({
        where: {
          userId: testUser.id,
          isDeleted: false,
        },
      });

      expect(userPlants.length).toBeGreaterThan(0);
      expect(userPlants.some(p => p.id === plant.id)).toBe(true);
      expect(userPlants.some(p => p.name === 'Aloe Vera')).toBe(true);
    });

    it('should allow optional fields to be null', async () => {
      const plantData = {
        name: 'Cactus',
        userId: testUser.id,
        // Optional fields not provided
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify optional fields can be null
      expect(plant.name).toBe('Cactus');
      expect(plant.species).toBeNull();
      expect(plant.imageUrl).toBeNull();
      expect(plant.location).toBeNull();
      expect(plant.acquisitionDate).toBeNull();
      expect(plant.notes).toBeNull();
    });

    it('should create plant with unique ID for each plant', async () => {
      const plant1Data = {
        name: 'Plant One',
        userId: testUser.id,
      };

      const plant2Data = {
        name: 'Plant Two',
        userId: testUser.id,
      };

      const plant1 = await prisma.plant.create({ data: plant1Data });
      const plant2 = await prisma.plant.create({ data: plant2Data });

      testPlantId = plant1.id; // Will cleanup plant1

      // Assertions: Verify unique IDs
      expect(plant1.id).not.toBe(plant2.id);
      expect(plant1.id).toBeDefined();
      expect(plant2.id).toBeDefined();

      // Cleanup plant2
      await prisma.plant.delete({ where: { id: plant2.id } });
    });

    it('should associate plant with correct user', async () => {
      const plantData = {
        name: 'User Plant',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      testPlantId = plant.id;

      // Assertions: Verify plant is associated with correct user
      expect(plant.user).toBeDefined();
      expect(plant.user.id).toBe(testUser.id);
      expect(plant.user.email).toBe(testEmail);
      expect(plant.user.name).toBe('Plant Test User');
    });

    it('should validate required fields', async () => {
      // Attempt to create plant without required name field
      const invalidPlantData = {
        userId: testUser.id,
        // name is missing
      } as any;

      // Assertions: Should throw error for missing required field
      await expect(
        prisma.plant.create({
          data: invalidPlantData,
        })
      ).rejects.toThrow();
    });

    it('should handle long plant names', async () => {
      const longName = 'A'.repeat(200); // Very long name
      const plantData = {
        name: longName,
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify long name is stored
      expect(plant.name).toBe(longName);
      expect(plant.name.length).toBe(200);
    });

    it('should handle special characters in plant name', async () => {
      const plantData = {
        name: "Plant's Name with \"Quotes\" & Special-Characters!",
        species: 'Test species (variety)',
        userId: testUser.id,
      };

      const plant = await prisma.plant.create({
        data: plantData,
      });

      testPlantId = plant.id;

      // Assertions: Verify special characters are preserved
      expect(plant.name).toBe("Plant's Name with \"Quotes\" & Special-Characters!");
      expect(plant.species).toBe('Test species (variety)');
    });
  });
});
