import Redis from 'redis';
import { logger } from '@/utils/logger';

export interface CacheConfig {
    redisUrl: string;
    keyPrefix?: string;
    defaultTTL?: number;
}

export interface CacheOptions {
    ttl?: number;
    useL3?: boolean;
}

export class CacheService {
    private client: Redis.RedisClientType;
    private config: CacheConfig;
    private l1Cache: Map<string, { value: any; expiry: number }> = new Map();
    private isConnected: boolean = false;

    constructor(config: CacheConfig) {
        this.config = {
            keyPrefix: 'daznode:',
            defaultTTL: 3600,
            ...config
        };
        
        this.client = Redis.createClient({
            url: config.redisUrl,
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
                connectTimeout: 5000
            }
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.client.on('connect', () => {
            logger.info('✅ Redis client connecting...');
        });

        this.client.on('ready', () => {
            this.isConnected = true;
            logger.info('✅ Redis client connected and ready');
        });

        this.client.on('error', (error) => {
            logger.error('❌ Redis client error:', error);
            this.isConnected = false;
        });

        this.client.on('reconnecting', () => {
            logger.info('🔄 Redis client reconnecting...');
        });

        this.client.on('end', () => {
            this.isConnected = false;
            logger.info('🔌 Redis client connection closed');
        });
    }

    async initialize(): Promise<void> {
        try {
            await this.client.connect();
            
            // Test connection
            await this.client.ping();
            
            logger.info('✅ Cache service initialized successfully');
        } catch (error) {
            logger.error('❌ Failed to initialize cache service:', error);
            throw new Error(`Failed to connect to Redis: ${error.message}`);
        }
    }

    private getKey(key: string): string {
        return `${this.config.keyPrefix}${key}`;
    }

    // L1 Cache (In-Memory)
    private getFromL1<T>(key: string): T | null {
        const cached = this.l1Cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.value;
        }
        
        if (cached && cached.expiry <= Date.now()) {
            this.l1Cache.delete(key);
        }
        
        return null;
    }

    private setToL1<T>(key: string, value: T, ttl: number = 300): void {
        // Limit L1 cache size to prevent memory issues
        if (this.l1Cache.size >= 1000) {
            const oldestKey = this.l1Cache.keys().next().value;
            if (oldestKey) {
                this.l1Cache.delete(oldestKey);
            }
        }

        this.l1Cache.set(key, {
            value,
            expiry: Date.now() + (ttl * 1000)
        });
    }

    private deleteFromL1(key: string): void {
        this.l1Cache.delete(key);
    }

    // Multi-layer cache GET
    async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
        try {
            const fullKey = this.getKey(key);

            // L1: Check in-memory cache first
            const l1Value = this.getFromL1<T>(fullKey);
            if (l1Value !== null) {
                return l1Value;
            }

            // L2: Check Redis if connected
            if (this.isConnected) {
                const redisValue = await this.client.get(fullKey);
                if (redisValue) {
                    const parsed = JSON.parse(redisValue);
                    // Cache in L1 for faster subsequent access
                    this.setToL1(fullKey, parsed, 60); // 1 minute L1 TTL
                    return parsed;
                }
            }

            return null;

        } catch (error) {
            logger.error('❌ Cache GET error:', { error, key });
            return null;
        }
    }

    // Multi-layer cache SET
    async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
        try {
            const fullKey = this.getKey(key);
            const ttl = options.ttl || this.config.defaultTTL!;
            const serialized = JSON.stringify(value);

            // Set in L1 cache
            this.setToL1(fullKey, value, Math.min(ttl, 300)); // Max 5 minutes in L1

            // Set in Redis if connected
            if (this.isConnected) {
                if (ttl > 0) {
                    await this.client.setEx(fullKey, ttl, serialized);
                } else {
                    await this.client.set(fullKey, serialized);
                }
            }

        } catch (error) {
            logger.error('❌ Cache SET error:', { error, key });
            throw error;
        }
    }

    // DELETE operation
    async delete(key: string): Promise<void> {
        try {
            const fullKey = this.getKey(key);

            // Delete from L1
            this.deleteFromL1(fullKey);

            // Delete from Redis
            if (this.isConnected) {
                await this.client.del(fullKey);
            }

        } catch (error) {
            logger.error('❌ Cache DELETE error:', { error, key });
        }
    }

    // Pattern-based invalidation
    async invalidatePattern(pattern: string): Promise<void> {
        try {
            const fullPattern = this.getKey(pattern);

            // Clear matching keys from L1
            for (const [cacheKey] of this.l1Cache) {
                if (this.matchesPattern(cacheKey, fullPattern)) {
                    this.l1Cache.delete(cacheKey);
                }
            }

            // Clear from Redis using SCAN to avoid blocking
            if (this.isConnected) {
                await this.deletePatternFromRedis(fullPattern);
            }

        } catch (error) {
            logger.error('❌ Cache pattern invalidation error:', { error, pattern });
        }
    }

    private async deletePatternFromRedis(pattern: string): Promise<void> {
        try {
            let cursor = 0;
            const batchSize = 100;

            do {
                const reply = await this.client.scan(cursor, {
                    MATCH: pattern,
                    COUNT: batchSize
                });

                cursor = reply.cursor;
                const keys = reply.keys;

                if (keys.length > 0) {
                    await this.client.del(keys);
                    logger.debug(`Deleted ${keys.length} keys matching pattern ${pattern}`);
                }

            } while (cursor !== 0);

        } catch (error) {
            logger.error('❌ Failed to delete pattern from Redis:', { error, pattern });
        }
    }

    private matchesPattern(key: string, pattern: string): boolean {
        // Simple glob pattern matching (* and ?)
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        
        return new RegExp(`^${regexPattern}$`).test(key);
    }

    // Batch operations
    async mget<T>(keys: string[]): Promise<Record<string, T | null>> {
        try {
            const fullKeys = keys.map(key => this.getKey(key));
            const results: Record<string, T | null> = {};

            // Check L1 cache first
            const missingKeys: string[] = [];
            const keyMapping: Record<string, string> = {};

            for (let i = 0; i < keys.length; i++) {
                const originalKey = keys[i];
                const fullKey = fullKeys[i];
                keyMapping[fullKey] = originalKey;

                const l1Value = this.getFromL1<T>(fullKey);
                if (l1Value !== null) {
                    results[originalKey] = l1Value;
                } else {
                    missingKeys.push(fullKey);
                }
            }

            // Fetch missing keys from Redis
            if (missingKeys.length > 0 && this.isConnected) {
                const redisValues = await this.client.mGet(missingKeys);
                
                for (let i = 0; i < missingKeys.length; i++) {
                    const fullKey = missingKeys[i];
                    const originalKey = keyMapping[fullKey];
                    const redisValue = redisValues[i];

                    if (redisValue) {
                        const parsed = JSON.parse(redisValue);
                        results[originalKey] = parsed;
                        // Cache in L1
                        this.setToL1(fullKey, parsed, 60);
                    } else {
                        results[originalKey] = null;
                    }
                }
            }

            // Set null for any keys not found
            keys.forEach(key => {
                if (!(key in results)) {
                    results[key] = null;
                }
            });

            return results;

        } catch (error) {
            logger.error('❌ Cache MGET error:', { error, keys });
            // Return null for all keys on error
            return keys.reduce((acc, key) => {
                acc[key] = null;
                return acc;
            }, {} as Record<string, T | null>);
        }
    }

    async mset<T>(keyValues: Record<string, T>, options: CacheOptions = {}): Promise<void> {
        try {
            const ttl = options.ttl || this.config.defaultTTL!;
            const pipeline = this.isConnected ? this.client.multi() : null;

            for (const [key, value] of Object.entries(keyValues)) {
                const fullKey = this.getKey(key);
                const serialized = JSON.stringify(value);

                // Set in L1
                this.setToL1(fullKey, value, Math.min(ttl, 300));

                // Add to Redis pipeline
                if (pipeline) {
                    if (ttl > 0) {
                        pipeline.setEx(fullKey, ttl, serialized);
                    } else {
                        pipeline.set(fullKey, serialized);
                    }
                }
            }

            // Execute Redis pipeline
            if (pipeline) {
                await pipeline.exec();
            }

        } catch (error) {
            logger.error('❌ Cache MSET error:', { error, keyValues: Object.keys(keyValues) });
            throw error;
        }
    }

    // Advanced operations
    async increment(key: string, amount: number = 1, options: CacheOptions = {}): Promise<number> {
        try {
            const fullKey = this.getKey(key);

            if (this.isConnected) {
                const result = await this.client.incrBy(fullKey, amount);
                
                // Set TTL if this is a new key
                const ttl = options.ttl || this.config.defaultTTL!;
                if (result === amount && ttl > 0) {
                    await this.client.expire(fullKey, ttl);
                }

                // Update L1 cache
                this.deleteFromL1(fullKey); // Remove from L1 to force fresh read

                return result;
            } else {
                // Fallback to L1 only
                const current = this.getFromL1<number>(fullKey) || 0;
                const newValue = current + amount;
                this.setToL1(fullKey, newValue, options.ttl || 3600);
                return newValue;
            }

        } catch (error) {
            logger.error('❌ Cache INCREMENT error:', { error, key, amount });
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const fullKey = this.getKey(key);

            // Check L1 first
            if (this.getFromL1(fullKey) !== null) {
                return true;
            }

            // Check Redis
            if (this.isConnected) {
                const result = await this.client.exists(fullKey);
                return result === 1;
            }

            return false;

        } catch (error) {
            logger.error('❌ Cache EXISTS error:', { error, key });
            return false;
        }
    }

    async expire(key: string, ttl: number): Promise<void> {
        try {
            const fullKey = this.getKey(key);

            // Update L1 expiry
            const l1Entry = this.l1Cache.get(fullKey);
            if (l1Entry) {
                l1Entry.expiry = Date.now() + (ttl * 1000);
            }

            // Update Redis TTL
            if (this.isConnected) {
                await this.client.expire(fullKey, ttl);
            }

        } catch (error) {
            logger.error('❌ Cache EXPIRE error:', { error, key, ttl });
        }
    }

    // Health and monitoring
    async getStats(): Promise<{
        connected: boolean;
        l1Size: number;
        redisInfo?: any;
        hitRatio?: number;
    }> {
        try {
            const stats = {
                connected: this.isConnected,
                l1Size: this.l1Cache.size
            };

            if (this.isConnected) {
                const info = await this.client.info('memory');
                return {
                    ...stats,
                    redisInfo: this.parseRedisInfo(info)
                };
            }

            return stats;

        } catch (error) {
            logger.error('❌ Failed to get cache stats:', error);
            return {
                connected: false,
                l1Size: this.l1Cache.size
            };
        }
    }

    private parseRedisInfo(info: string): any {
        const result: any = {};
        info.split('\r\n').forEach(line => {
            const [key, value] = line.split(':');
            if (key && value) {
                result[key] = value;
            }
        });
        return result;
    }

    async flushAll(): Promise<void> {
        try {
            // Clear L1 cache
            this.l1Cache.clear();

            // Clear Redis
            if (this.isConnected) {
                await this.client.flushAll();
            }

            logger.info('✅ Cache flushed successfully');

        } catch (error) {
            logger.error('❌ Failed to flush cache:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            this.l1Cache.clear();
            
            if (this.isConnected) {
                await this.client.quit();
            }

            logger.info('✅ Cache service closed');

        } catch (error) {
            logger.error('❌ Error closing cache service:', error);
        }
    }
}