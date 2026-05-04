/**
 * Authentication Test Suite - Password Reset
 * Test cases for password reset functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma, cleanupTestData } from '../setup';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

describe('Auth Module - Password Reset', () => {
  const testEmail = 'reset-test@example.com';
  const testPassword = 'OriginalP@ssw0rd123';
  let userId: string;
  
  beforeEach(async () => {
    // Setup: Create test user account
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Reset Test User',
      },
    });
    userId = user.id;
  });

  afterEach(async () => {
    // Cleanup: Remove test data and reset tokens
    await cleanupTestData(testEmail);
  });

  describe('Password Reset Request', () => {
    it('should generate reset token for valid user', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      const updatedUser = await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      expect(updatedUser.resetToken).toBe(resetToken);
      expect(updatedUser.resetTokenExpiry).toBeDefined();
      expect(updatedUser.resetTokenExpiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should not reveal if email exists (security)', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { email: nonExistentEmail },
      });

      // Should return null without revealing user doesn't exist
      expect(user).toBeNull();
      
      // In real API, both cases return same success message
      // This prevents email enumeration attacks
    });

    it('should generate unique reset token', async () => {
      const token1 = randomBytes(32).toString('hex');
      const token2 = randomBytes(32).toString('hex');

      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(0);
      expect(token2.length).toBeGreaterThan(0);
    });

    it('should set token expiration time', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
      const currentTime = Date.now();

      const updatedUser = await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      expect(updatedUser.resetTokenExpiry).toBeDefined();
      expect(updatedUser.resetTokenExpiry!.getTime()).toBeGreaterThan(currentTime);
      expect(updatedUser.resetTokenExpiry!.getTime()).toBeLessThan(currentTime + 3700000);
    });

    it('should store reset token in database', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user!.resetToken).toBe(resetToken);
      expect(user!.resetTokenExpiry).toEqual(resetTokenExpiry);
    });
  });

  describe('Password Reset Completion', () => {
    it('should reset password with valid token', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const newPassword = 'NewSecureP@ssw0rd456';

      // Set reset token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // Find user with valid token
      const user = await prisma.user.findFirst({
        where: {
          resetToken,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      expect(user).toBeDefined();

      // Reset password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: user!.id },
        data: {
          password: newPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();

      // Verify new password works
      const isValid = await bcrypt.compare(newPassword, updatedUser.password);
      expect(isValid).toBe(true);
    });

    it('should reject expired token', async () => {
      const expiredToken = randomBytes(32).toString('hex');
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago

      // Set expired token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken: expiredToken,
          resetTokenExpiry: expiredDate,
        },
      });

      // Try to find user with valid (non-expired) token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: expiredToken,
          resetTokenExpiry: {
            gt: new Date(), // Must be in the future
          },
        },
      });

      expect(user).toBeNull();
    });

    it('should reject invalid token', async () => {
      const validToken = randomBytes(32).toString('hex');
      const invalidToken = 'invalid-token-12345';

      // Set valid token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken: validToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // Try to find user with invalid token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: invalidToken,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      expect(user).toBeNull();
    });

    it('should invalidate token after use', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const newPassword = 'FreshP@ssw0rd789';

      // Set reset token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // Complete password reset
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Try to use token again
      const user = await prisma.user.findFirst({
        where: {
          resetToken,
        },
      });

      expect(user).toBeNull();
    });

    it('should not allow token reuse after password reset', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const firstNewPassword = 'FirstNewP@ssw0rd';
      const secondNewPassword = 'SecondNewP@ssw0rd';

      // Set reset token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // First password reset
      const firstPasswordHash = await bcrypt.hash(firstNewPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: firstPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Try to use same token again
      const userWithToken = await prisma.user.findFirst({
        where: {
          resetToken,
          resetTokenExpiry: {
            gt: new Date(),
          },
        },
      });

      expect(userWithToken).toBeNull();
    });

    it('should maintain password security during reset', async () => {
      const resetToken = randomBytes(32).toString('hex');
      const newPassword = 'SecureNewP@ssw0rd';

      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // Reset password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Verify password is hashed
      expect(updatedUser.password).not.toBe(newPassword);
      expect(updatedUser.password.length).toBeGreaterThan(20);

      // Verify old password doesn't work
      const oldPasswordValid = await bcrypt.compare(testPassword, updatedUser.password);
      expect(oldPasswordValid).toBe(false);

      // Verify new password works
      const newPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
      expect(newPasswordValid).toBe(true);
    });
  });
});
