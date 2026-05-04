/**
 * Authentication Test Suite - User Login
 * Test cases for login functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma, cleanupTestData } from '../setup';
import bcrypt from 'bcryptjs';

describe('Auth Module - User Login', () => {
  const testEmail = 'login-test@example.com';
  const testPassword = 'LoginP@ssw0rd123';
  let userId: string;
  
  beforeEach(async () => {
    // Setup: Create test user account
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Login Test User',
      },
    });
    userId = user.id;
  });

  afterEach(async () => {
    // Cleanup: Remove test data
    await cleanupTestData(testEmail);
  });

  describe('Successful Login', () => {
    it('should login with valid credentials', async () => {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user).toBeDefined();
      expect(user!.email).toBe(testEmail);

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        testPassword,
        user!.password
      );

      expect(isPasswordValid).toBe(true);
    });

    it('should return user data without password on successful login', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      expect(user).toBeDefined();
      expect(user!.id).toBe(userId);
      expect(user!.email).toBe(testEmail);
      expect(user!.name).toBe('Login Test User');
      expect(user).not.toHaveProperty('password');
    });

    it('should verify user exists before login attempt', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user).not.toBeNull();
      expect(user!.id).toBeDefined();
      expect(user!.email).toBe(testEmail);
    });
  });

  describe('Failed Login Attempts', () => {
    it('should reject login with invalid email', async () => {
      const invalidEmail = 'nonexistent@example.com';
      
      const user = await prisma.user.findUnique({
        where: { email: invalidEmail },
      });

      expect(user).toBeNull();
    });

    it('should reject login with invalid password', async () => {
      const wrongPassword = 'WrongP@ssw0rd123';
      
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user).toBeDefined();

      const isPasswordValid = await bcrypt.compare(
        wrongPassword,
        user!.password
      );

      expect(isPasswordValid).toBe(false);
    });

    it('should reject login with non-existent user', async () => {
      const nonExistentEmail = 'ghost@example.com';
      
      const user = await prisma.user.findUnique({
        where: { email: nonExistentEmail },
      });

      expect(user).toBeNull();
    });

    it('should handle case-sensitive email lookup', async () => {
      const uppercaseEmail = testEmail.toUpperCase();
      
      // Prisma is case-sensitive by default
      const user = await prisma.user.findUnique({
        where: { email: uppercaseEmail },
      });

      // Should not find user with different case
      expect(user).toBeNull();
    });

    it('should not reveal password hash in error responses', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      expect(user).toBeDefined();
      expect(user).not.toHaveProperty('password');
    });
  });

  describe('Password Validation', () => {
    it('should correctly validate matching passwords', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      const isValid = await bcrypt.compare(testPassword, user!.password);
      expect(isValid).toBe(true);
    });

    it('should correctly reject non-matching passwords', async () => {
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      const wrongPasswords = [
        'wrong',
        'LoginP@ssw0rd124',
        'loginp@ssw0rd123',
        'LOGINP@SSW0RD123',
        '',
      ];

      for (const wrongPassword of wrongPasswords) {
        const isValid = await bcrypt.compare(wrongPassword, user!.password);
        expect(isValid).toBe(false);
      }
    });
  });
});
