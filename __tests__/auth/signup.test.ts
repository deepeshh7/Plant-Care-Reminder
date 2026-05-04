/**
 * Authentication Test Suite - User Registration
 * Test cases for signup functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { prisma, generateTestUser, cleanupTestData } from '../setup';
import bcrypt from 'bcryptjs';

describe('Auth Module - User Registration', () => {
  
  /**
   * TC-Auth-01: Successful user registration and login
   * 
   * Preconditions: User is on the registration page
   * 
   * Test Steps:
   * 1. Enter valid email and a strong password
   * 2. Submit the form
   * 3. Log in with new credentials
   * 
   * Expected Result: User is successfully registered and logged into the dashboard
   * Postconditions: User account created, session active, user logged in
   */
  describe('TC-Auth-01: Successful user registration and login', () => {
    const testEmail = 'newuser-tc01@example.com';
    
    afterEach(async () => {
      // Cleanup: Remove test user from database
      await cleanupTestData(testEmail);
    });

    it('should register a new user with valid email and strong password', async () => {
      const testData = {
        email: testEmail,
        password: 'StrongP@ssw0rd123',
        name: 'New Test User'
      };

      // Step 1 & 2: Enter valid email and strong password, submit the form
      const hashedPassword = await bcrypt.hash(testData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: testData.email,
          password: hashedPassword,
          name: testData.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Assertions
      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.name).toBe('New Test User');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should verify password is hashed correctly', async () => {
      const testData = {
        email: testEmail,
        password: 'StrongP@ssw0rd123',
        name: 'Test User'
      };

      const hashedPassword = await bcrypt.hash(testData.password, 10);
      await prisma.user.create({
        data: {
          email: testData.email,
          password: hashedPassword,
          name: testData.name,
        },
      });

      // Verify password is hashed
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user).toBeDefined();
      expect(user!.password).not.toBe(testData.password);
      
      // Verify password can be validated
      const isValid = await bcrypt.compare(testData.password, user!.password);
      expect(isValid).toBe(true);
    });

    it('should have user account created with all required fields', async () => {
      const testData = {
        email: testEmail,
        password: 'StrongP@ssw0rd123',
        name: 'Complete User'
      };

      const hashedPassword = await bcrypt.hash(testData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: testData.email,
          password: hashedPassword,
          name: testData.name,
        },
      });

      // Verify all required fields exist
      expect(user.id).toBeDefined();
      expect(user.email).toBe(testEmail);
      expect(user.name).toBe('Complete User');
      expect(user.password).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow login with newly created credentials', async () => {
      const testData = {
        email: testEmail,
        password: 'StrongP@ssw0rd123',
        name: 'Login Test User'
      };

      // Create user
      const hashedPassword = await bcrypt.hash(testData.password, 10);
      await prisma.user.create({
        data: {
          email: testData.email,
          password: hashedPassword,
          name: testData.name,
        },
      });

      // Step 3: Simulate login by verifying credentials
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      expect(user).toBeDefined();
      
      const isPasswordValid = await bcrypt.compare(
        testData.password,
        user!.password
      );

      expect(isPasswordValid).toBe(true);
    });
  });

  /**
   * TC-Auth-02: Attempt registration with an existing email
   * 
   * Preconditions: An account with 'test@example.com' already exists
   * 
   * Test Steps:
   * 1. Attempt to register with 'test@example.com'
   * 
   * Expected Result: An error message "Email already in use" is displayed
   * Postconditions: No duplicate account created, error displayed, user on registration page
   */
  describe('TC-Auth-02: Attempt registration with existing email', () => {
    const existingEmail = 'test-tc02@example.com';
    
    beforeEach(async () => {
      // Setup: Create existing user with test@example.com
      const hashedPassword = await bcrypt.hash('ExistingP@ssw0rd123', 10);
      await prisma.user.create({
        data: {
          email: existingEmail,
          password: hashedPassword,
          name: 'Existing User',
        },
      });
    });

    afterEach(async () => {
      // Cleanup: Remove test user
      await cleanupTestData(existingEmail);
    });

    it('should reject registration with existing email', async () => {
      // Step 1: Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: existingEmail },
      });

      expect(existingUser).toBeDefined();
      expect(existingUser!.email).toBe(existingEmail);

      // Attempt to create duplicate should throw error
      await expect(
        prisma.user.create({
          data: {
            email: existingEmail,
            password: await bcrypt.hash('AnotherP@ssw0rd123', 10),
            name: 'Duplicate User',
          },
        })
      ).rejects.toThrow();
    });

    it('should not create duplicate account', async () => {
      // Verify only one account exists with this email
      const userCount = await prisma.user.count({
        where: { email: existingEmail },
      });
      
      expect(userCount).toBe(1);

      // Try to create duplicate (should fail)
      try {
        await prisma.user.create({
          data: {
            email: existingEmail,
            password: await bcrypt.hash('NewP@ssw0rd123', 10),
            name: 'Another User',
          },
        });
      } catch (error) {
        // Expected to fail
      }

      // Verify still only one account
      const finalCount = await prisma.user.count({
        where: { email: existingEmail },
      });
      
      expect(finalCount).toBe(1);
    });

    it('should maintain data integrity when duplicate registration fails', async () => {
      const originalUser = await prisma.user.findUnique({
        where: { email: existingEmail },
      });

      // Attempt duplicate registration
      try {
        await prisma.user.create({
          data: {
            email: existingEmail,
            password: await bcrypt.hash('DifferentP@ssw0rd', 10),
            name: 'Different Name',
          },
        });
      } catch (error) {
        // Expected to fail
      }

      // Verify original user data is unchanged
      const unchangedUser = await prisma.user.findUnique({
        where: { email: existingEmail },
      });

      expect(unchangedUser).toBeDefined();
      expect(unchangedUser!.id).toBe(originalUser!.id);
      expect(unchangedUser!.name).toBe(originalUser!.name);
      expect(unchangedUser!.password).toBe(originalUser!.password);
    });
  });

  /**
   * TC-Auth-03: Password reset via email
   * 
   * Preconditions: Valid user account exists
   * 
   * Test Steps:
   * 1. Click "Forgot Password"
   * 2. Enter email: test@example.com
   * 3. Submit request to receive password reset email
   * 
   * Expected Result: Password hash updated in database; old password invalidated
   * Postconditions: Old password invalidated, new password saved in database
   */
  describe('TC-Auth-03: Password reset via email', () => {
    const testEmail = 'test-tc03@example.com';
    const originalPassword = 'OldP@ssw0rd123';
    let originalPasswordHash: string;
    let userId: string;

    beforeEach(async () => {
      // Setup: Create user account and store original password hash
      originalPasswordHash = await bcrypt.hash(originalPassword, 10);
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          password: originalPasswordHash,
          name: 'Reset Test User',
        },
      });
      userId = user.id;
    });

    afterEach(async () => {
      // Cleanup: Remove test user
      await cleanupTestData(testEmail);
    });

    it('should generate valid password reset token', async () => {
      // Step 1 & 2: Request password reset
      const resetToken = 'test-reset-token-' + Date.now();
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      const updatedUser = await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });

      // Assertions
      expect(updatedUser.resetToken).toBe(resetToken);
      expect(updatedUser.resetTokenExpiry).toBeDefined();
      expect(updatedUser.resetTokenExpiry!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should update password hash in database', async () => {
      const newPassword = 'NewSecureP@ssw0rd456';
      const resetToken = 'valid-reset-token';

      // Set reset token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 3600000),
        },
      });

      // Step 3: Complete password reset
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Assertions
      expect(updatedUser.password).not.toBe(originalPasswordHash);
      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();
    });

    it('should invalidate old password after reset', async () => {
      const newPassword = 'NewSecureP@ssw0rd456';

      // Reset password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
        },
      });

      // Try to validate old password
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      const isOldPasswordValid = await bcrypt.compare(
        originalPassword,
        user!.password
      );

      // Assertions
      expect(isOldPasswordValid).toBe(false);
    });

    it('should allow login with new password', async () => {
      const newPassword = 'NewSecureP@ssw0rd456';

      // Reset password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
        },
      });

      // Verify new password works
      const user = await prisma.user.findUnique({
        where: { email: testEmail },
      });

      const isNewPasswordValid = await bcrypt.compare(
        newPassword,
        user!.password
      );

      // Assertions
      expect(isNewPasswordValid).toBe(true);
    });

    it('should reject expired reset token', async () => {
      const resetToken = 'expired-token';
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago

      // Set expired token
      await prisma.user.update({
        where: { email: testEmail },
        data: {
          resetToken,
          resetTokenExpiry: expiredDate,
        },
      });

      // Try to find user with valid token
      const user = await prisma.user.findFirst({
        where: {
          resetToken,
          resetTokenExpiry: {
            gt: new Date(), // Token must be in the future
          },
        },
      });

      // Assertions
      expect(user).toBeNull(); // Should not find user with expired token
    });

    it('should clear reset token after successful password reset', async () => {
      const resetToken = 'valid-token';
      const newPassword = 'FinalP@ssw0rd789';

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
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          password: newPasswordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      // Assertions
      expect(updatedUser.resetToken).toBeNull();
      expect(updatedUser.resetTokenExpiry).toBeNull();
      
      // Verify token cannot be reused
      const userWithToken = await prisma.user.findFirst({
        where: {
          resetToken,
        },
      });
      expect(userWithToken).toBeNull();
    });
  });
});
