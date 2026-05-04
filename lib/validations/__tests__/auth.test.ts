import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  signinSchema,
  resetPasswordSchema,
  confirmResetSchema,
} from '../auth';

describe('Auth Validation Schemas', () => {
  describe('signupSchema', () => {
    it('should validate valid signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'test@',
        'test..user@example.com',
        'test user@example.com',
      ];

      invalidEmails.forEach((email) => {
        const result = signupSchema.safeParse({
          email,
          password: 'Password123!',
          name: 'Test User',
        });
        expect(result.success).toBe(false);
      });
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Pass1!',
        name: 'Test User',
      });
      expect(result.success).toBe(false);
    });

    it('should accept passwords with exactly 8 characters', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Pass123!',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
    });

    it('should accept signup without name (optional field)', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('should trim whitespace from email', () => {
      const result = signupSchema.safeParse({
        email: '  test@example.com  ',
        password: 'Password123!',
        name: 'Test User',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });

  describe('signinSchema', () => {
    it('should validate valid signin data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const result = signinSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = signinSchema.safeParse({
        email: 'notanemail',
        password: 'Password123!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = signinSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should validate valid email', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = resetPasswordSchema.safeParse({
        email: 'notanemail',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const result = resetPasswordSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('confirmResetSchema', () => {
    it('should validate valid reset confirmation data', () => {
      const validData = {
        token: 'valid-token-string',
        password: 'NewPassword123!',
      };
      const result = confirmResetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const result = confirmResetSchema.safeParse({
        token: 'valid-token-string',
        password: 'Short1!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing token', () => {
      const result = confirmResetSchema.safeParse({
        password: 'NewPassword123!',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty token', () => {
      const result = confirmResetSchema.safeParse({
        token: '',
        password: 'NewPassword123!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very long email addresses', () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      const result = signupSchema.safeParse({
        email: longEmail,
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('should handle very long passwords', () => {
      const longPassword = 'P'.repeat(100) + '123!';
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: longPassword,
      });
      expect(result.success).toBe(true);
    });

    it('should handle special characters in email local part', () => {
      const specialEmails = [
        'test+tag@example.com',
        'test.user@example.com',
        'test_user@example.com',
        'test-user@example.com',
      ];

      specialEmails.forEach((email) => {
        const result = signupSchema.safeParse({
          email,
          password: 'Password123!',
        });
        expect(result.success).toBe(true);
      });
    });

    it('should handle international domain names', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.co.uk',
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('should reject email with consecutive dots', () => {
      const result = signupSchema.safeParse({
        email: 'test..user@example.com',
        password: 'Password123!',
      });
      expect(result.success).toBe(false);
    });
  });
});
