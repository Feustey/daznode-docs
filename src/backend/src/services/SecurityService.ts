import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request } from 'express';
import { logger } from '@/utils/logger';
import { CacheService } from './CacheService';

export interface SecurityConfig {
    jwtSecret: string;
    encryptionKey: string;
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
}

export interface SecurityContext {
    userId: string;
    permissions: string[];
    riskScore: number;
    sessionId: string;
    deviceFingerprint?: string;
    ipAddress?: string;
    userAgent?: string;
    mfaVerified?: boolean;
}

export interface UserActivity {
    userId: string;
    action: string;
    resource: string;
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    metadata?: Record<string, any>;
}

export interface ThreatAssessment {
    threatLevel: number;
    patterns: AnomalyPattern[];
    recommendedActions: string[];
    confidence: number;
}

export interface AnomalyPattern {
    type: 'velocity' | 'location' | 'behavior' | 'device' | 'timing';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    confidence: number;
    data: Record<string, any>;
}

export interface ContentSecurityResult {
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    reasons: string[];
    confidence: number;
    quarantined: boolean;
}

export class SecurityService {
    private config: SecurityConfig;
    private cache?: CacheService;
    private encryptionAlgorithm = 'aes-256-gcm';
    private hashAlgorithm = 'sha256';

    // Security patterns for threat detection
    private suspiciousPatterns = {
        velocityThresholds: {
            contributions: { max: 10, window: 3600 }, // 10 contributions per hour
            rewards: { max: 1000, window: 86400 },    // 1000 T4G per day
            logins: { max: 5, window: 900 }           // 5 login attempts per 15 minutes
        },
        blockedUserAgents: [
            /bot/i, /crawler/i, /spider/i, /scraper/i
        ],
        suspiciousKeywords: [
            'script', 'eval', 'onclick', 'onerror', 'javascript:',
            'data:', 'vbscript:', 'onload', 'expression'
        ]
    };

    constructor(config: SecurityConfig, cache?: CacheService) {
        this.config = {
            sessionTimeout: 24 * 60 * 60, // 24 hours
            maxLoginAttempts: 5,
            lockoutDuration: 15 * 60, // 15 minutes
            ...config
        };
        this.cache = cache;
        logger.info('✅ Security service initialized');
    }

    // Authentication and Authorization
    async generateJWTToken(payload: {
        userId: string;
        email: string;
        permissions: string[];
        sessionId: string;
    }): Promise<string> {
        try {
            const token = jwt.sign(
                {
                    ...payload,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + this.config.sessionTimeout!
                },
                this.config.jwtSecret,
                { algorithm: 'HS256' }
            );

            // Store session in cache for validation
            if (this.cache) {
                await this.cache.set(
                    `session:${payload.sessionId}`,
                    {
                        userId: payload.userId,
                        email: payload.email,
                        permissions: payload.permissions,
                        createdAt: new Date()
                    },
                    { ttl: this.config.sessionTimeout }
                );
            }

            return token;

        } catch (error) {
            logger.error('❌ Failed to generate JWT token:', error);
            throw new Error('Token generation failed');
        }
    }

    async verifyJWTToken(token: string): Promise<SecurityContext | null> {
        try {
            const decoded = jwt.verify(token, this.config.jwtSecret) as any;

            // Verify session still exists
            if (this.cache) {
                const session = await this.cache.get(`session:${decoded.sessionId}`);
                if (!session) {
                    logger.warn('Session not found in cache', { sessionId: decoded.sessionId });
                    return null;
                }
            }

            return {
                userId: decoded.userId,
                permissions: decoded.permissions || [],
                riskScore: 0, // Will be calculated by risk assessment
                sessionId: decoded.sessionId
            };

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.debug('JWT token expired');
            } else if (error.name === 'JsonWebTokenError') {
                logger.warn('Invalid JWT token');
            } else {
                logger.error('JWT verification error:', error);
            }
            return null;
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const saltRounds = 12;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            logger.error('❌ Password hashing failed:', error);
            throw new Error('Password hashing failed');
        }
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            logger.error('❌ Password verification failed:', error);
            return false;
        }
    }

    // Multi-Factor Authentication
    generateMFASecret(): string {
        return crypto.randomBytes(32).toString('base64');
    }

    generateMFACode(secret: string): string {
        const timestamp = Math.floor(Date.now() / 30000); // 30-second window
        const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'base64'));
        hmac.update(Buffer.from(timestamp.toString()));
        const digest = hmac.digest();
        
        const offset = digest[digest.length - 1] & 0x0f;
        const code = ((digest[offset] & 0x7f) << 24) |
                    ((digest[offset + 1] & 0xff) << 16) |
                    ((digest[offset + 2] & 0xff) << 8) |
                    (digest[offset + 3] & 0xff);
        
        return (code % 1000000).toString().padStart(6, '0');
    }

    verifyMFACode(code: string, secret: string): boolean {
        const currentCode = this.generateMFACode(secret);
        return code === currentCode;
    }

    // Request Validation
    async validateRequest(req: Request): Promise<SecurityContext> {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);
        const context = await this.verifyJWTToken(token);
        
        if (!context) {
            throw new Error('Invalid or expired token');
        }

        // Generate device fingerprint
        const deviceFingerprint = this.generateDeviceFingerprint(req);
        const ipAddress = this.getClientIP(req);
        const userAgent = req.headers['user-agent'] || '';

        // Assess risk
        const riskScore = await this.assessRiskScore({
            ...context,
            deviceFingerprint,
            ipAddress,
            userAgent
        });

        // Record activity
        await this.recordUserActivity({
            userId: context.userId,
            action: req.method,
            resource: req.path,
            timestamp: new Date(),
            ipAddress,
            userAgent,
            metadata: {
                deviceFingerprint,
                riskScore
            }
        });

        return {
            ...context,
            deviceFingerprint,
            ipAddress,
            userAgent,
            riskScore
        };
    }

    private generateDeviceFingerprint(req: Request): string {
        const components = [
            req.headers['user-agent'] || '',
            req.headers['accept-language'] || '',
            req.headers['accept-encoding'] || '',
            req.connection.remoteAddress || '',
            req.headers['x-forwarded-for'] || ''
        ];

        return crypto
            .createHash(this.hashAlgorithm)
            .update(components.join('|'))
            .digest('hex');
    }

    private getClientIP(req: Request): string {
        return (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
               req.connection.remoteAddress ||
               req.socket.remoteAddress ||
               'unknown';
    }

    // Risk Assessment
    private async assessRiskScore(context: SecurityContext): Promise<number> {
        let riskScore = 0;

        try {
            // Check for suspicious IP patterns
            const ipRisk = await this.assessIPRisk(context.ipAddress);
            riskScore += ipRisk * 0.3;

            // Check device consistency
            const deviceRisk = await this.assessDeviceRisk(context.userId, context.deviceFingerprint);
            riskScore += deviceRisk * 0.2;

            // Check user behavior patterns
            const behaviorRisk = await this.assessBehaviorRisk(context.userId);
            riskScore += behaviorRisk * 0.3;

            // Check geographical anomalies
            const geoRisk = await this.assessGeographicalRisk(context.userId, context.ipAddress);
            riskScore += geoRisk * 0.2;

            return Math.min(riskScore, 1.0); // Cap at 1.0

        } catch (error) {
            logger.error('❌ Risk assessment failed:', error);
            return 0.5; // Default medium risk
        }
    }

    private async assessIPRisk(ipAddress?: string): Promise<number> {
        if (!ipAddress || ipAddress === 'unknown') return 0.5;

        try {
            // Check if IP is in cache of known bad IPs
            if (this.cache) {
                const cachedRisk = await this.cache.get<number>(`ip_risk:${ipAddress}`);
                if (cachedRisk !== null) {
                    return cachedRisk;
                }
            }

            // Simple checks (in production, integrate with IP reputation services)
            let risk = 0;

            // Check for private/localhost IPs (lower risk)
            if (this.isPrivateIP(ipAddress)) {
                risk = 0.1;
            }

            // Check recent login attempts from this IP
            const recentAttempts = await this.getRecentLoginAttempts(ipAddress);
            if (recentAttempts > 10) {
                risk = Math.min(risk + 0.4, 1.0);
            }

            // Cache result for 1 hour
            if (this.cache) {
                await this.cache.set(`ip_risk:${ipAddress}`, risk, { ttl: 3600 });
            }

            return risk;

        } catch (error) {
            logger.error('IP risk assessment failed:', error);
            return 0.3; // Default low-medium risk
        }
    }

    private isPrivateIP(ip: string): boolean {
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^192\.168\./,
            /^127\./,
            /^::1$/,
            /^fc00:/,
            /^fd00:/
        ];

        return privateRanges.some(range => range.test(ip));
    }

    private async getRecentLoginAttempts(ipAddress: string): Promise<number> {
        if (!this.cache) return 0;

        const key = `login_attempts:${ipAddress}`;
        const attempts = await this.cache.get<number>(key);
        return attempts || 0;
    }

    private async assessDeviceRisk(userId: string, deviceFingerprint?: string): Promise<number> {
        if (!deviceFingerprint || !this.cache) return 0.3;

        try {
            // Get known devices for user
            const knownDevices = await this.cache.get<string[]>(`user_devices:${userId}`) || [];
            
            if (knownDevices.includes(deviceFingerprint)) {
                return 0.1; // Known device, low risk
            }

            // New device - check if user has history of multiple devices
            if (knownDevices.length === 0) {
                return 0.2; // First device, low-medium risk
            }

            return 0.6; // New device for existing user, medium-high risk

        } catch (error) {
            logger.error('Device risk assessment failed:', error);
            return 0.3;
        }
    }

    private async assessBehaviorRisk(userId: string): Promise<number> {
        if (!this.cache) return 0.2;

        try {
            const now = Date.now();
            const hour = 1000 * 60 * 60;
            
            // Check activity velocity
            const recentActivity = await this.cache.get<UserActivity[]>(`user_activity:${userId}`) || [];
            const recentCount = recentActivity.filter(a => 
                now - new Date(a.timestamp).getTime() < hour
            ).length;

            if (recentCount > 50) {
                return 0.8; // Very high activity, suspicious
            } else if (recentCount > 20) {
                return 0.5; // High activity, medium risk
            }

            return 0.1; // Normal activity, low risk

        } catch (error) {
            logger.error('Behavior risk assessment failed:', error);
            return 0.2;
        }
    }

    private async assessGeographicalRisk(userId: string, ipAddress?: string): Promise<number> {
        // Simplified geographical risk assessment
        // In production, use IP geolocation services
        return 0.1; // Placeholder
    }

    // Content Security
    async validateContentSecurity(content: string, userId: string): Promise<ContentSecurityResult> {
        const risks: string[] = [];
        let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let confidence = 0.9;

        try {
            // Check for malicious script content
            const scriptRisk = this.detectMaliciousScripts(content);
            if (scriptRisk.detected) {
                risks.push(...scriptRisk.reasons);
                level = 'HIGH';
            }

            // Check for suspicious URLs
            const urlRisk = this.detectSuspiciousURLs(content);
            if (urlRisk.detected) {
                risks.push(...urlRisk.reasons);
                level = level === 'HIGH' ? 'CRITICAL' : 'MEDIUM';
            }

            // Check for PII leaks
            const piiRisk = await this.detectPIILeaks(content, userId);
            if (piiRisk.detected) {
                risks.push(...piiRisk.reasons);
                level = level === 'LOW' ? 'MEDIUM' : level;
            }

            // Check for social engineering patterns
            const socialRisk = this.detectSocialEngineering(content);
            if (socialRisk.detected) {
                risks.push(...socialRisk.reasons);
                level = level === 'LOW' ? 'MEDIUM' : level;
            }

            const quarantined = level === 'HIGH' || level === 'CRITICAL';

            if (quarantined) {
                await this.quarantineContent(content, userId, risks);
            }

            return { level, reasons: risks, confidence, quarantined };

        } catch (error) {
            logger.error('Content security validation failed:', error);
            return {
                level: 'MEDIUM',
                reasons: ['Content validation error'],
                confidence: 0.5,
                quarantined: false
            };
        }
    }

    private detectMaliciousScripts(content: string): { detected: boolean; reasons: string[] } {
        const reasons: string[] = [];
        let detected = false;

        // Check for script tags
        if (/<script[\s\S]*?>[\s\S]*?<\/script>/gi.test(content)) {
            reasons.push('Contains script tags');
            detected = true;
        }

        // Check for event handlers
        if (/on\w+\s*=/gi.test(content)) {
            reasons.push('Contains event handlers');
            detected = true;
        }

        // Check for JavaScript protocols
        if (/javascript:/gi.test(content)) {
            reasons.push('Contains JavaScript protocols');
            detected = true;
        }

        // Check for suspicious keywords
        for (const keyword of this.suspiciousPatterns.suspiciousKeywords) {
            if (content.toLowerCase().includes(keyword)) {
                reasons.push(`Contains suspicious keyword: ${keyword}`);
                detected = true;
            }
        }

        return { detected, reasons };
    }

    private detectSuspiciousURLs(content: string): { detected: boolean; reasons: string[] } {
        const reasons: string[] = [];
        let detected = false;

        // Extract URLs
        const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
        const urls = content.match(urlRegex) || [];

        for (const url of urls) {
            // Check for URL shorteners
            if (/bit\.ly|tinyurl|t\.co|short\.link/i.test(url)) {
                reasons.push(`Suspicious URL shortener: ${url}`);
                detected = true;
            }

            // Check for suspicious domains
            if (/phishing|malware|suspicious/i.test(url)) {
                reasons.push(`Suspicious domain: ${url}`);
                detected = true;
            }

            // Check for data URLs
            if (url.startsWith('data:')) {
                reasons.push(`Data URL detected: ${url.substring(0, 50)}...`);
                detected = true;
            }
        }

        return { detected, reasons };
    }

    private async detectPIILeaks(content: string, userId: string): Promise<{ detected: boolean; reasons: string[] }> {
        const reasons: string[] = [];
        let detected = false;

        // Check for email patterns
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = content.match(emailRegex);
        if (emails && emails.length > 0) {
            reasons.push('Contains email addresses');
            detected = true;
        }

        // Check for phone numbers
        const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
        const phones = content.match(phoneRegex);
        if (phones && phones.length > 0) {
            reasons.push('Contains phone numbers');
            detected = true;
        }

        // Check for credit card patterns
        const ccRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
        const creditCards = content.match(ccRegex);
        if (creditCards && creditCards.length > 0) {
            reasons.push('Contains potential credit card numbers');
            detected = true;
        }

        return { detected, reasons };
    }

    private detectSocialEngineering(content: string): { detected: boolean; reasons: string[] } {
        const reasons: string[] = [];
        let detected = false;

        const socialEngineeringPatterns = [
            /urgent.*action.*required/gi,
            /click.*here.*immediately/gi,
            /verify.*account.*now/gi,
            /suspended.*account/gi,
            /free.*money.*claim/gi,
            /winner.*congratulations/gi
        ];

        for (const pattern of socialEngineeringPatterns) {
            if (pattern.test(content)) {
                reasons.push(`Social engineering pattern detected: ${pattern.source}`);
                detected = true;
            }
        }

        return { detected, reasons };
    }

    private async quarantineContent(content: string, userId: string, reasons: string[]): Promise<void> {
        try {
            const quarantineId = crypto.randomUUID();
            
            if (this.cache) {
                await this.cache.set(
                    `quarantine:${quarantineId}`,
                    {
                        content,
                        userId,
                        reasons,
                        timestamp: new Date(),
                        reviewed: false
                    },
                    { ttl: 7 * 24 * 60 * 60 } // 7 days
                );
            }

            logger.warn('Content quarantined', {
                quarantineId,
                userId,
                reasons
            });

        } catch (error) {
            logger.error('Failed to quarantine content:', error);
        }
    }

    // Activity Recording and Monitoring
    async recordUserActivity(activity: UserActivity): Promise<void> {
        try {
            if (!this.cache) return;

            const key = `user_activity:${activity.userId}`;
            const activities = await this.cache.get<UserActivity[]>(key) || [];
            
            activities.push(activity);
            
            // Keep only last 100 activities
            if (activities.length > 100) {
                activities.splice(0, activities.length - 100);
            }

            await this.cache.set(key, activities, { ttl: 7 * 24 * 60 * 60 }); // 7 days

            // Record for threat detection
            await this.checkForAnomalousActivity(activity);

        } catch (error) {
            logger.error('Failed to record user activity:', error);
        }
    }

    private async checkForAnomalousActivity(activity: UserActivity): Promise<void> {
        try {
            const patterns = await this.detectAnomalousPatterns(activity.userId, activity);
            
            if (patterns.length > 0) {
                const threatLevel = patterns.reduce((max, p) => 
                    Math.max(max, this.getSeverityScore(p.severity)), 0
                );

                if (threatLevel > 0.7) {
                    await this.triggerSecurityAlert(activity.userId, patterns);
                }
            }

        } catch (error) {
            logger.error('Anomalous activity check failed:', error);
        }
    }

    public async detectAnomalousPatterns(userId: string, activity: UserActivity): Promise<AnomalyPattern[]> {
        const patterns: AnomalyPattern[] = [];

        try {
            // Velocity anomaly detection
            const velocityPattern = await this.detectVelocityAnomalies(userId, activity);
            if (velocityPattern) patterns.push(velocityPattern);

            // Behavior anomaly detection
            const behaviorPattern = await this.detectBehaviorAnomalies(userId, activity);
            if (behaviorPattern) patterns.push(behaviorPattern);

            // Timing anomaly detection
            const timingPattern = await this.detectTimingAnomalies(userId, activity);
            if (timingPattern) patterns.push(timingPattern);

        } catch (error) {
            logger.error('Anomaly pattern detection failed:', error);
        }

        return patterns;
    }

    private async detectVelocityAnomalies(userId: string, activity: UserActivity): Promise<AnomalyPattern | null> {
        if (!this.cache) return null;

        const key = `velocity:${userId}:${activity.action}`;
        const count = await this.cache.get<number>(key) || 0;
        const newCount = count + 1;

        await this.cache.set(key, newCount, { ttl: 3600 }); // 1 hour window

        const threshold = this.suspiciousPatterns.velocityThresholds[activity.action as keyof typeof this.suspiciousPatterns.velocityThresholds];
        
        if (threshold && newCount > threshold.max) {
            return {
                type: 'velocity',
                severity: 'high',
                description: `High velocity detected: ${newCount} ${activity.action} actions in 1 hour`,
                confidence: 0.8,
                data: { count: newCount, threshold: threshold.max, window: '1h' }
            };
        }

        return null;
    }

    private async detectBehaviorAnomalies(userId: string, activity: UserActivity): Promise<AnomalyPattern | null> {
        // Simplified behavior anomaly detection
        // In production, use machine learning models
        return null;
    }

    private async detectTimingAnomalies(userId: string, activity: UserActivity): Promise<AnomalyPattern | null> {
        const hour = new Date(activity.timestamp).getHours();
        
        // Flag activity during unusual hours (2 AM - 5 AM) as potentially suspicious
        if (hour >= 2 && hour <= 5) {
            return {
                type: 'timing',
                severity: 'low',
                description: `Activity during unusual hours: ${hour}:00`,
                confidence: 0.4,
                data: { hour }
            };
        }

        return null;
    }

    private getSeverityScore(severity: string): number {
        switch (severity) {
            case 'low': return 0.2;
            case 'medium': return 0.5;
            case 'high': return 0.8;
            case 'critical': return 1.0;
            default: return 0.3;
        }
    }

    private async triggerSecurityAlert(userId: string, patterns: AnomalyPattern[]): Promise<void> {
        logger.warn('Security alert triggered', {
            userId,
            patterns: patterns.map(p => ({
                type: p.type,
                severity: p.severity,
                description: p.description
            }))
        });

        // In production, send to security monitoring system
        // e.g., SIEM, Slack alerts, email notifications
    }

    // Data Encryption
    encrypt(plaintext: string): { encrypted: string; iv: string; authTag: string } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(this.encryptionAlgorithm, this.config.encryptionKey);
        cipher.setIVInitData(iv);

        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    decrypt(encrypted: string, iv: string, authTag: string): string {
        const decipher = crypto.createDecipher(this.encryptionAlgorithm, this.config.encryptionKey);
        decipher.setIVInitData(Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // Session Management
    async invalidateSession(sessionId: string): Promise<void> {
        if (this.cache) {
            await this.cache.delete(`session:${sessionId}`);
        }
    }

    async invalidateAllUserSessions(userId: string): Promise<void> {
        if (!this.cache) return;

        try {
            // Get all sessions for user (this would need to be implemented based on your session storage)
            // For now, we'll just log the action
            logger.info('Invalidating all sessions for user', { userId });
            
        } catch (error) {
            logger.error('Failed to invalidate user sessions:', error);
        }
    }

    // Rate Limiting
    async checkRateLimit(identifier: string, action: string, maxRequests: number = 100, windowMs: number = 60000): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }> {
        if (!this.cache) {
            return { allowed: true, remaining: maxRequests - 1, resetTime: Date.now() + windowMs };
        }

        try {
            const key = `rate_limit:${identifier}:${action}`;
            const current = await this.cache.get<number>(key) || 0;
            const remaining = Math.max(0, maxRequests - current - 1);

            if (current >= maxRequests) {
                return {
                    allowed: false,
                    remaining: 0,
                    resetTime: Date.now() + windowMs
                };
            }

            // Increment counter
            await this.cache.set(key, current + 1, { ttl: Math.floor(windowMs / 1000) });

            return {
                allowed: true,
                remaining,
                resetTime: Date.now() + windowMs
            };

        } catch (error) {
            logger.error('Rate limit check failed:', error);
            return { allowed: true, remaining: maxRequests - 1, resetTime: Date.now() + windowMs };
        }
    }
}