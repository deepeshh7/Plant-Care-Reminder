/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
}

/**
 * Validate and sanitize file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images are allowed' };
  }

  return { valid: true };
}

/**
 * Validate URL to prevent SSRF attacks
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Prevent localhost and private IP ranges
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: string, limit?: string) {
  const pageNum = parseInt(page || '1');
  const limitNum = parseInt(limit || '10');

  if (isNaN(pageNum) || pageNum < 1) {
    return { page: 1, limit: limitNum };
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return { page: pageNum, limit: 10 };
  }

  return { page: pageNum, limit: limitNum };
}

/**
 * Check if user owns a resource
 */
export async function verifyResourceOwnership(
  userId: string,
  resourceType: 'plant' | 'schedule' | 'task',
  resourceId: string,
  prisma: any
): Promise<boolean> {
  try {
    switch (resourceType) {
      case 'plant': {
        const plant = await prisma.plant.findFirst({
          where: { id: resourceId, userId, isDeleted: false },
          select: { id: true },
        });
        return !!plant;
      }
      case 'schedule': {
        const schedule = await prisma.careSchedule.findFirst({
          where: {
            id: resourceId,
            plant: { userId, isDeleted: false },
            isDeleted: false,
          },
          select: { id: true },
        });
        return !!schedule;
      }
      case 'task': {
        const task = await prisma.careTask.findFirst({
          where: {
            id: resourceId,
            plant: { userId, isDeleted: false },
          },
          select: { id: true },
        });
        return !!task;
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
}
