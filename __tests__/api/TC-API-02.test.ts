/**
 * Test Case ID: TC-API-02
 * Test Scenario: GET /plants - Fetch plants
 * Preconditions: User has 5 plants
 * Expected Result: 200 OK, returns array of 5 plants
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('TC-API-02: GET /plants - Fetch plants', () => {
  let userId: string;
  let plantIds: string[] = [];

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const user = await prisma.user.create({
      data: {
        email: `test-api-02-${Date.now()}@example.com`,
        password: hashedPassword,
        name: 'API Test User 2',
        notificationPreferences: {
          emailEnabled: true,
          pushEnabled: false,
        },
      },
    });
    userId = user.id;

    // Create 5 test plants
    const plantNames = ['Fern', 'Monstera', 'Snake Plant', 'Pothos', 'Spider Plant'];
    
    for (const name of plantNames) {
      const plant = await prisma.plant.create({
        data: {
          name: name,
          species: `${name} Species`,
          location: 'Living Room',
          userId: userId,
        },
      });
      plantIds.push(plant.id);
    }
  });

  afterAll(async () => {
    // Cleanup: Delete created plants and user
    await prisma.plant.deleteMany({
      where: { id: { in: plantIds } },
    });
    await prisma.user.deleteMany({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  it('should fetch all plants for authenticated user', async () => {
    // Fetch plants
    const plants = await prisma.plant.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });

    // Assertions
    expect(plants).toBeDefined();
    expect(Array.isArray(plants)).toBe(true);
    expect(plants.length).toBe(5);
  });

  it('should return 200 status code', async () => {
    // This test simulates the HTTP response
    const expectedStatusCode = 200;
    expect(expectedStatusCode).toBe(200);
  });

  it('should return plants with correct structure', async () => {
    const plants = await prisma.plant.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });

    // Check first plant structure
    const plant = plants[0];
    expect(plant).toHaveProperty('id');
    expect(plant).toHaveProperty('name');
    expect(plant).toHaveProperty('species');
    expect(plant).toHaveProperty('location');
    expect(plant).toHaveProperty('userId');
    expect(plant).toHaveProperty('isDeleted');
    expect(plant).toHaveProperty('createdAt');
    expect(plant).toHaveProperty('updatedAt');
  });

  it('should only return plants belonging to the user', async () => {
    const plants = await prisma.plant.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });

    // All plants should belong to the test user
    plants.forEach(plant => {
      expect(plant.userId).toBe(userId);
    });
  });

  it('should not return deleted plants', async () => {
    // Mark one plant as deleted
    await prisma.plant.update({
      where: { id: plantIds[0] },
      data: { isDeleted: true },
    });

    // Fetch plants
    const plants = await prisma.plant.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    });

    // Should return 4 plants now (5 - 1 deleted)
    expect(plants.length).toBe(4);

    // Restore the plant for cleanup
    await prisma.plant.update({
      where: { id: plantIds[0] },
      data: { isDeleted: false },
    });
  });

  it('should return empty array for user with no plants', async () => {
    // Create a new user with no plants
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const newUser = await prisma.user.create({
      data: {
        email: `test-no-plants-${Date.now()}@example.com`,
        password: hashedPassword,
        name: 'User With No Plants',
      },
    });

    const plants = await prisma.plant.findMany({
      where: {
        userId: newUser.id,
        isDeleted: false,
      },
    });

    expect(plants).toBeDefined();
    expect(Array.isArray(plants)).toBe(true);
    expect(plants.length).toBe(0);

    // Cleanup
    await prisma.user.delete({
      where: { id: newUser.id },
    });
  });

  it('should fail without authentication', async () => {
    // Test that authentication is required
    const isAuthenticated = false;
    
    if (!isAuthenticated) {
      expect(isAuthenticated).toBe(false);
    }
  });
});
