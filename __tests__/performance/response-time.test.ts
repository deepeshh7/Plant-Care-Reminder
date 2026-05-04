/**
 * TC-Perf-01: Application Response Time Validation
 * 
 * Test Case: Validate application response time
 * Precondition: User is logged in
 * 
 * Steps:
 * 1. Perform a search in the plant catalog
 * 
 * Expected Result: Search results are displayed in under 2 seconds
 * Pass Criteria: Response times logged, all within <2s target
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createTestUser, cleanupTestData, prisma } from '../setup';

describe('TC-Perf-01: Application Response Time', () => {
  let testUser: any;
  const RESPONSE_TIME_TARGET = 2000; // 2 seconds in milliseconds

  beforeAll(async () => {
    // Create test user and sample plants
    testUser = await createTestUser();

    // Create multiple test plants for search testing
    const plantData = [
      { name: 'Monstera Deliciosa', species: 'Monstera deliciosa', location: 'Living Room' },
      { name: 'Snake Plant', species: 'Sansevieria trifasciata', location: 'Bedroom' },
      { name: 'Pothos', species: 'Epipremnum aureum', location: 'Kitchen' },
      { name: 'Fiddle Leaf Fig', species: 'Ficus lyrata', location: 'Living Room' },
      { name: 'Spider Plant', species: 'Chlorophytum comosum', location: 'Bathroom' },
      { name: 'Peace Lily', species: 'Spathiphyllum', location: 'Office' },
      { name: 'Rubber Plant', species: 'Ficus elastica', location: 'Living Room' },
      { name: 'ZZ Plant', species: 'Zamioculcas zamiifolia', location: 'Bedroom' },
      { name: 'Aloe Vera', species: 'Aloe barbadensis', location: 'Kitchen' },
      { name: 'Boston Fern', species: 'Nephrolepis exaltata', location: 'Bathroom' },
    ];

    await prisma.plant.createMany({
      data: plantData.map(plant => ({
        ...plant,
        userId: testUser.id,
      })),
    });
  }, 30000);

  afterAll(async () => {
    // Cleanup: Delete test plants and user
    await prisma.plant.deleteMany({ where: { userId: testUser.id } });
    await cleanupTestData(testUser.email);
  }, 30000);

  it('should return search results within 2 seconds - search by name', async () => {
    const startTime = Date.now();

    // Perform search in plant catalog
    const searchResults = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
        OR: [
          { name: { contains: 'Plant', mode: 'insensitive' } },
          { species: { contains: 'Plant', mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    const responseTime = Date.now() - startTime;

    // Verify: Results are returned
    expect(searchResults.length).toBeGreaterThan(0);

    // Verify: Response time is under 2 seconds
    expect(responseTime).toBeLessThan(RESPONSE_TIME_TARGET);

    console.log(`✓ Search by name completed in ${responseTime}ms (Target: <${RESPONSE_TIME_TARGET}ms)`);
  });

  it('should return search results within 2 seconds - search by species', async () => {
    const startTime = Date.now();

    const searchResults = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
        species: { contains: 'Ficus', mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
    });

    const responseTime = Date.now() - startTime;

    expect(searchResults.length).toBeGreaterThan(0);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_TARGET);

    console.log(`✓ Search by species completed in ${responseTime}ms (Target: <${RESPONSE_TIME_TARGET}ms)`);
  });

  it('should return search results within 2 seconds - search by location', async () => {
    const startTime = Date.now();

    const searchResults = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
        location: { contains: 'Living Room', mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
    });

    const responseTime = Date.now() - startTime;

    expect(searchResults.length).toBeGreaterThan(0);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_TARGET);

    console.log(`✓ Search by location completed in ${responseTime}ms (Target: <${RESPONSE_TIME_TARGET}ms)`);
  });

  it('should return paginated results within acceptable time for cloud database', async () => {
    const startTime = Date.now();

    const page = 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const [plants, total] = await Promise.all([
      prisma.plant.findMany({
        where: {
          userId: testUser.id,
          isDeleted: false,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.plant.count({
        where: {
          userId: testUser.id,
          isDeleted: false,
        },
      }),
    ]);

    const responseTime = Date.now() - startTime;

    expect(plants.length).toBeLessThanOrEqual(limit);
    expect(total).toBeGreaterThan(0);
    expect(responseTime).toBeLessThan(5000); // 5 seconds for cloud database with network latency

    console.log(`✓ Paginated query completed in ${responseTime}ms (Target: <5000ms for cloud DB)`);
  });

  it('should fetch single plant details within 2 seconds', async () => {
    // Get a plant ID
    const plant = await prisma.plant.findFirst({
      where: { userId: testUser.id },
    });

    expect(plant).toBeDefined();

    const startTime = Date.now();

    const plantDetails = await prisma.plant.findUnique({
      where: { id: plant!.id },
    });

    const responseTime = Date.now() - startTime;

    expect(plantDetails).toBeDefined();
    expect(plantDetails?.id).toBe(plant!.id);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_TARGET);

    console.log(`✓ Plant details fetch completed in ${responseTime}ms (Target: <${RESPONSE_TIME_TARGET}ms)`);
  });

  it('should handle complex queries within 2 seconds', async () => {
    const startTime = Date.now();

    // Complex query with multiple conditions
    const results = await prisma.plant.findMany({
      where: {
        userId: testUser.id,
        isDeleted: false,
        OR: [
          { location: { contains: 'Living', mode: 'insensitive' } },
          { location: { contains: 'Bedroom', mode: 'insensitive' } },
        ],
        AND: [
          {
            OR: [
              { name: { contains: 'Plant', mode: 'insensitive' } },
              { species: { contains: 'Ficus', mode: 'insensitive' } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    const responseTime = Date.now() - startTime;

    expect(responseTime).toBeLessThan(RESPONSE_TIME_TARGET);

    console.log(`✓ Complex query completed in ${responseTime}ms (Target: <${RESPONSE_TIME_TARGET}ms)`);
  });

  it('should log all response times and verify they meet the target', async () => {
    const responseTimes: number[] = [];
    const iterations = 5;

    // Run multiple search queries and log response times
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();

      await prisma.plant.findMany({
        where: {
          userId: testUser.id,
          isDeleted: false,
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      const responseTime = Date.now() - startTime;
      responseTimes.push(responseTime);
    }

    // Calculate statistics
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);

    console.log('\n=== Response Time Statistics ===');
    console.log(`Iterations: ${iterations}`);
    console.log(`Average: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min: ${minResponseTime}ms`);
    console.log(`Max: ${maxResponseTime}ms`);
    console.log(`Target: <${RESPONSE_TIME_TARGET}ms`);
    console.log('================================\n');

    // Verify: All response times are within target
    responseTimes.forEach((time, index) => {
      expect(time).toBeLessThan(RESPONSE_TIME_TARGET);
      console.log(`✓ Query ${index + 1}: ${time}ms`);
    });

    // Verify: Average is well within target
    expect(avgResponseTime).toBeLessThan(RESPONSE_TIME_TARGET);
  });
});
