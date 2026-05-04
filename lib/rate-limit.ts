interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the interval
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; remaining: number; reset: number } => {
      const now = Date.now();
      const record = store.get(identifier);

      // Clean up expired entries periodically
      if (store.size > 10000) {
        for (const [key, value] of store.entries()) {
          if (value.resetTime < now) {
            store.delete(key);
          }
        }
      }

      if (!record || record.resetTime < now) {
        // Create new record or reset expired one
        const resetTime = now + config.interval;
        store.set(identifier, { count: 1, resetTime });
        return {
          success: true,
          remaining: config.maxRequests - 1,
          reset: resetTime,
        };
      }

      if (record.count >= config.maxRequests) {
        // Rate limit exceeded
        return {
          success: false,
          remaining: 0,
          reset: record.resetTime,
        };
      }

      // Increment count
      record.count++;
      store.set(identifier, record);

      return {
        success: true,
        remaining: config.maxRequests - record.count,
        reset: record.resetTime,
      };
    },
  };
}

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5,
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60,
});

export const uploadRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10,
});

// Helper to get client identifier from request
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  return ip;
}
