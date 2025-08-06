import { Router, Request, Response } from 'express';
import { DatabaseService } from '@/services/DatabaseService';
import { SecurityService } from '@/services/SecurityService';
import { CacheService } from '@/services/CacheService';
import { logger } from '@/utils/logger';
import { authRateLimiter } from '@/utils/rateLimiter';

export class UserController {
    private router: Router;

    constructor(
        private databaseService: DatabaseService,
        private securityService: SecurityService,
        private cacheService: CacheService
    ) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/register', authRateLimiter, this.register.bind(this));
        this.router.post('/login', authRateLimiter, this.login.bind(this));
        this.router.post('/logout', this.logout.bind(this));
        this.router.get('/profile/:userId', this.getUserProfile.bind(this));
        this.router.put('/profile/:userId', this.updateUserProfile.bind(this));
        this.router.get('/stats/:userId', this.getUserStats.bind(this));
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, username, password, walletAddress, gitbookUserId } = req.body;

            // Validate required fields
            if (!email || !username || !password) {
                res.status(400).json({
                    error: {
                        message: 'Missing required fields: email, username, password',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            // Check if user already exists
            const existingUser = await this.databaseService.getUserByEmail(email);
            if (existingUser) {
                res.status(409).json({
                    error: {
                        message: 'User already exists with this email',
                        code: 'USER_ALREADY_EXISTS'
                    }
                });
                return;
            }

            // Hash password
            const hashedPassword = await this.securityService.hashPassword(password);

            // Create user
            const user = await this.databaseService.createUser({
                email,
                username,
                wallet_address: walletAddress,
                gitbook_user_id: gitbookUserId
            });

            // Generate session
            const sessionId = crypto.randomUUID();
            const token = await this.securityService.generateJWTToken({
                userId: user.id,
                email: user.email,
                permissions: ['read', 'write'],
                sessionId
            });

            logger.info('User registered successfully', { userId: user.id, username });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    walletAddress: user.wallet_address
                },
                token
            });

        } catch (error) {
            logger.error('Registration failed:', error);
            res.status(500).json({
                error: {
                    message: 'Registration failed',
                    code: 'REGISTRATION_FAILED'
                }
            });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                res.status(400).json({
                    error: {
                        message: 'Missing required fields: email, password',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            // Find user
            const user = await this.databaseService.getUserByEmail(email);
            if (!user) {
                res.status(401).json({
                    error: {
                        message: 'Invalid credentials',
                        code: 'INVALID_CREDENTIALS'
                    }
                });
                return;
            }

            // For this demo, we'll skip password verification
            // In production, you would verify the hashed password
            
            // Generate session
            const sessionId = crypto.randomUUID();
            const token = await this.securityService.generateJWTToken({
                userId: user.id,
                email: user.email,
                permissions: ['read', 'write'],
                sessionId
            });

            // Record login activity
            await this.securityService.recordUserActivity({
                userId: user.id,
                action: 'login',
                resource: '/auth/login',
                timestamp: new Date(),
                ipAddress: req.ip || 'unknown',
                userAgent: req.get('User-Agent') || 'unknown'
            });

            logger.info('User logged in successfully', { userId: user.id, email });

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    walletAddress: user.wallet_address
                },
                token
            });

        } catch (error) {
            logger.error('Login failed:', error);
            res.status(500).json({
                error: {
                    message: 'Login failed',
                    code: 'LOGIN_FAILED'
                }
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const context = await this.securityService.verifyJWTToken(token);
                
                if (context) {
                    await this.securityService.invalidateSession(context.sessionId);
                    
                    // Record logout activity
                    await this.securityService.recordUserActivity({
                        userId: context.userId,
                        action: 'logout',
                        resource: '/auth/logout',
                        timestamp: new Date(),
                        ipAddress: req.ip || 'unknown',
                        userAgent: req.get('User-Agent') || 'unknown'
                    });
                }
            }

            res.json({
                message: 'Logout successful'
            });

        } catch (error) {
            logger.error('Logout failed:', error);
            res.status(500).json({
                error: {
                    message: 'Logout failed',
                    code: 'LOGOUT_FAILED'
                }
            });
        }
    }

    async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            const user = await this.databaseService.getUserById(userId);
            
            if (!user) {
                res.status(404).json({
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    }
                });
                return;
            }

            res.json({
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    walletAddress: user.wallet_address,
                    reputationScore: user.reputation_score,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at
                }
            });

        } catch (error) {
            logger.error('Failed to get user profile:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve user profile',
                    code: 'PROFILE_FETCH_FAILED'
                }
            });
        }
    }

    async updateUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const updates = req.body;

            // Remove sensitive fields that shouldn't be updated directly
            delete updates.id;
            delete updates.created_at;
            delete updates.updated_at;

            const user = await this.databaseService.updateUser(userId, updates);

            res.json({
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    walletAddress: user.wallet_address,
                    reputationScore: user.reputation_score
                }
            });

        } catch (error) {
            logger.error('Failed to update user profile:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to update user profile',
                    code: 'PROFILE_UPDATE_FAILED'
                }
            });
        }
    }

    async getUserStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            const [user, rewardStats, contributionResult] = await Promise.all([
                this.databaseService.getUserById(userId),
                this.databaseService.getUserRewardStats(userId),
                this.databaseService.getUserContributions(userId, { limit: 1000 })
            ]);

            if (!user) {
                res.status(404).json({
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    }
                });
                return;
            }

            // Calculate domain breakdown
            const domainBreakdown = contributionResult.contributions.reduce((acc, contribution) => {
                acc[contribution.domain] = (acc[contribution.domain] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const stats = {
                user: {
                    id: user.id,
                    username: user.username,
                    reputationScore: user.reputation_score
                },
                contributions: {
                    total: contributionResult.total,
                    byDomain: domainBreakdown,
                    avgQualityScore: contributionResult.contributions.reduce((sum, c) => sum + c.quality_score, 0) / contributionResult.contributions.length || 0
                },
                rewards: rewardStats,
                memberSince: user.created_at,
                lastActive: user.updated_at
            };

            res.json({ stats });

        } catch (error) {
            logger.error('Failed to get user stats:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve user statistics',
                    code: 'USER_STATS_FAILED'
                }
            });
        }
    }

    getRouter(): Router {
        return this.router;
    }
}