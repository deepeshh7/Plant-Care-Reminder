/**
 * Test Setup and Configuration
 * Global setup for all test suites
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Mock environment variables for testing
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

// Create a separate Prisma instance for testing
export const prisma = new PrismaClient();

// Global test utilities
export const testConfig = {
  apiBaseUrl: 'http://localhost:3000',
  testTimeout: 10000,
};

// Helper function to generate test user data
export const generateTestUser = () => ({
  email: `test-${Date.now()}@example.com`,
  password: 'TestP@ssw0rd123',
  name: 'Test User',
});

// Helper function to create a test user in the database
export const createTestUser = async (userData?: { email: string; password: string; name?: string }) => {
  const data = userData || generateTestUser();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || 'Test User',
    },
  });
};

// Helper function to clean up test data
export const cleanupTestData = async (email: string) => {
  try {
    await prisma.user.delete({ where: { email } });
  } catch (error) {
    // User might not exist, ignore error
  }
};

// Helper function to clean up all test users
export const cleanupAllTestUsers = async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test',
      },
    },
  });
};

// Mock fetch for API calls
export const mockFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  const data = await response.json();
  return { response, data };
};

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
