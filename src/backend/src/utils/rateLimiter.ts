import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'redis';
import { logger } from './logger';

// Create Redis client for rate limiting
const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    logger.error('Redis rate limiter error:', err);
});

// Rate limiter configurations
const rateLimiters = {
    // General API rate limiting
    api: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'api_limit',
        points: 1000, // Number of requests
        duration: 900, // Per 15 minutes
        execEvenly: true
    }),

    // Strict rate limiting for sensitive endpoints
    sensitive: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'sensitive_limit',
        points: 10, // Number of requests
        duration: 60, // Per minute
        execEvenly: true
    }),

    // Authentication attempts
    auth: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'auth_limit',
        points: 5, // Number of attempts
        duration: 900, // Per 15 minutes
        blockDuration: 900 // Block for 15 minutes after limit
    }),

    // T4G reward requests
    t4g: new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 't4g_limit',
        points: 100, // Number of requests
        duration: 3600, // Per hour
        execEvenly: true
    })
};

// Generic rate limiter middleware
export const createRateLimiter = (type: keyof typeof rateLimiters = 'api') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const limiter = rateLimiters[type];
            const key = req.ip || 'unknown';

            await limiter.consume(key);
            next();

        } catch (rejRes: any) {
            const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
            
            logger.warn('Rate limit exceeded', {
                ip: req.ip,
                type,
                resetTime: secs,
                path: req.path
            });

            res.set('Retry-After', String(secs));
            res.status(429).json({
                error: {
                    message: 'Too Many Requests',
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: secs,
                    timestamp: new Date().toISOString()
                }
            });
        }
    };
};

// Default rate limiter
export const rateLimiter = createRateLimiter('api');

// Specific rate limiters
export const sensitiveRateLimiter = createRateLimiter('sensitive');
export const authRateLimiter = createRateLimiter('auth');
export const t4gRateLimiter = createRateLimiter('t4g');

// IP-based rate limiter for webhooks
export const webhookRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'webhook_limit',
    points: 1000, // High limit for legitimate webhooks
    duration: 3600, // Per hour
    execEvenly: false
});

// User-based rate limiter
export const userRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'user_limit',
    points: 2000, // Per user
    duration: 3600, // Per hour
    execEvenly: true
});

// Initialize Redis connection
export const initializeRateLimiting = async (): Promise<void> => {
    try {
        await redisClient.connect();
        logger.info('✅ Rate limiting Redis client connected');
    } catch (error) {
        logger.error('❌ Failed to connect rate limiting Redis client:', error);
        throw error;
    }
};