/**
 * TC-Sync-01: Cross-Device Data Synchronization Test
 * 
 * Test Case: Verify cross-device data synchronization
 * Precondition: User is logged in on two devices (Web and Mobile)
 * 
 * Steps:
 * 1. Add a new plant on the Web app
 * 2. Refresh the plant list on the Mobile app
 * 
 * Expected Result: The newly added plant appears on the Mobile app within 10 seconds
 * Pass Criteria: Data synced across devices, both show identical plant info
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createTestUser, cleanupTestData, prisma } from '../setup';

describe('TC-Sync-01: Cross-Device Data Synchronization', () => {
  let testUser: any;
  let plantId: string;

  beforeAll(async () => {
    // Create a test user
    testUser = await createTestUser();
  });

  afterAll(async () => {
    // Cleanup: Delete test plant and user
    if (plantId) {
      await prisma.plant.deleteMany({ where: { userId: testUser.id } });
    }
    await cleanupTestData(testUser.email);
  });

  it('should sync newly added plant across devices within 10 seconds', async () => {
    const startTime = Date.now();

    // Step 1: Simulate Web app - Add a new plant
    const newPlant = {
      name: 'Test Monstera',
      species: 'Monstera deliciosa',
      location: 'Living Room',
      notes: 'Cross-device sync test plant',
    };

    const createdPlant = await prisma.plant.create({
      data: {
        ...newPlant,
        userId: testUser.id,
      },
    });

    plantId = createdPlant.id;

    // Step 2: Simulate Mobile app - Fetch plant list (refresh)
    const plantsOnMobile = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    const syncTime = Date.now() - startTime;

    // Verify: Plant appears on mobile
    expect(plantsOnMobile.length).toBeGreaterThan(0);
    
    const syncedPlant = plantsOnMobile.find(p => p.id === plantId);
    expect(syncedPlant).toBeDefined();

    // Verify: Data is identical across devices
    expect(syncedPlant?.name).toBe(newPlant.name);
    expect(syncedPlant?.species).toBe(newPlant.species);
    expect(syncedPlant?.location).toBe(newPlant.location);
    expect(syncedPlant?.notes).toBe(newPlant.notes);
    expect(syncedPlant?.userId).toBe(testUser.id);

    // Verify: Sync happened within 10 seconds
    expect(syncTime).toBeLessThan(10000);

    console.log(`✓ Plant synced across devices in ${syncTime}ms`);
  });

  it('should maintain data consistency when updating plant on one device', async () => {
    // Create initial plant
    const plant = await prisma.plant.create({
      data: {
        name: 'Original Plant',
        species: 'Test species',
        userId: testUser.id,
      },
    });

    // Device 1: Update the plant
    const updatedData = {
      name: 'Updated Plant Name',
      location: 'Bedroom',
    };

    await prisma.plant.update({
      where: { id: plant.id },
      data: updatedData,
    });

    // Device 2: Fetch the updated plant
    const plantOnDevice2 = await prisma.plant.findUnique({
      where: { id: plant.id },
    });

    // Verify: Updates are reflected
    expect(plantOnDevice2?.name).toBe(updatedData.name);
    expect(plantOnDevice2?.location).toBe(updatedData.location);
    expect(plantOnDevice2?.species).toBe(plant.species); // Unchanged field

    // Cleanup
    await prisma.plant.delete({ where: { id: plant.id } });
  });

  it('should sync plant deletion across devices', async () => {
    // Create a plant
    const plant = await prisma.plant.create({
      data: {
        name: 'Plant to Delete',
        userId: testUser.id,
      },
    });

    // Device 1: Soft delete the plant
    await prisma.plant.update({
      where: { id: plant.id },
      data: { isDeleted: true },
    });

    // Device 2: Fetch active plants (should not include deleted)
    const activePlants = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
      },
    });

    // Verify: Deleted plant doesn't appear in active list
    const deletedPlant = activePlants.find(p => p.id === plant.id);
    expect(deletedPlant).toBeUndefined();

    // Cleanup
    await prisma.plant.delete({ where: { id: plant.id } });
  });

  it('should handle concurrent updates from multiple devices', async () => {
    // Create a plant
    const plant = await prisma.plant.create({
      data: {
        name: 'Concurrent Test Plant',
        userId: testUser.id,
      },
    });

    // Simulate concurrent updates from two devices
    const [update1, update2] = await Promise.all([
      prisma.plant.update({
        where: { id: plant.id },
        data: { location: 'Kitchen' },
      }),
      prisma.plant.update({
        where: { id: plant.id },
        data: { notes: 'Updated from device 2' },
      }),
    ]);

    // Fetch final state
    const finalPlant = await prisma.plant.findUnique({
      where: { id: plant.id },
    });

    // Verify: Both updates are applied
    expect(finalPlant?.location).toBe('Kitchen');
    expect(finalPlant?.notes).toBe('Updated from device 2');

    // Cleanup
    await prisma.plant.delete({ where: { id: plant.id } });
  });
});
