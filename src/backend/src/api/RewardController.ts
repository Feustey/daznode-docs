import { Router, Request, Response } from 'express';
import { T4GService } from '@/services/T4GService';
import { DatabaseService } from '@/services/DatabaseService';
import { SecurityService } from '@/services/SecurityService';
import { logger } from '@/utils/logger';
import { t4gRateLimiter } from '@/utils/rateLimiter';

export class RewardController {
    private router: Router;

    constructor(
        private t4gService: T4GService,
        private databaseService: DatabaseService,
        private securityService: SecurityService
    ) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/stats/:userId', this.getUserRewardStats.bind(this));
        this.router.get('/history/:userId', this.getUserRewardHistory.bind(this));
        this.router.post('/withdraw', t4gRateLimiter, this.withdrawRewards.bind(this));
        this.router.get('/balance/:address', this.getBalance.bind(this));
        this.router.post('/calculate', this.calculateReward.bind(this));
    }

    async getUserRewardStats(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;

            // Get stats from both T4G service and database
            const [t4gStats, dbStats] = await Promise.all([
                this.t4gService.getUserRewardStats(userId),
                this.databaseService.getUserRewardStats(userId)
            ]);

            const combinedStats = {
                ...t4gStats,
                ...dbStats,
                lastUpdated: new Date().toISOString()
            };

            res.json({ stats: combinedStats });

        } catch (error) {
            logger.error('Failed to get user reward stats:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve reward statistics',
                    code: 'REWARD_STATS_FAILED'
                }
            });
        }
    }

    async getUserRewardHistory(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 50 } = req.query;

            const history = await this.t4gService.getUserTransactionHistory(userId);
            
            // Paginate results
            const startIndex = (Number(page) - 1) * Number(limit);
            const endIndex = startIndex + Number(limit);
            const paginatedHistory = history.slice(startIndex, endIndex);

            res.json({
                history: paginatedHistory,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: history.length,
                    totalPages: Math.ceil(history.length / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Failed to get user reward history:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve reward history',
                    code: 'REWARD_HISTORY_FAILED'
                }
            });
        }
    }

    async withdrawRewards(req: Request, res: Response): Promise<void> {
        try {
            const { userId, walletAddress, amount } = req.body;

            // Validate required fields
            if (!userId || !walletAddress || !amount) {
                res.status(400).json({
                    error: {
                        message: 'Missing required fields: userId, walletAddress, amount',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            // Security checks
            const userStats = await this.t4gService.getUserRewardStats(userId);
            
            if (userStats.pendingRewards < amount) {
                res.status(400).json({
                    error: {
                        message: 'Insufficient pending rewards',
                        code: 'INSUFFICIENT_BALANCE'
                    }
                });
                return;
            }

            // Check rate limits and fraud detection
            const rateLimit = await this.securityService.checkRateLimit(
                userId, 
                'withdraw', 
                5, // Max 5 withdrawals
                24 * 60 * 60 * 1000 // Per day
            );

            if (!rateLimit.allowed) {
                res.status(429).json({
                    error: {
                        message: 'Withdrawal rate limit exceeded',
                        code: 'RATE_LIMIT_EXCEEDED',
                        retryAfter: rateLimit.resetTime
                    }
                });
                return;
            }

            // Create withdrawal transaction
            const distribution = {
                userId,
                walletAddress,
                amount,
                reason: 'Manual withdrawal',
                contributionId: '', // No specific contribution
                metadata: {
                    domain: 'withdrawal',
                    type: 'manual_withdrawal',
                    quality_score: 0,
                    impact_score: 0
                }
            };

            const transaction = await this.t4gService.distributeReward(distribution);

            res.json({
                message: 'Withdrawal initiated successfully',
                transaction: {
                    id: transaction.id,
                    hash: transaction.hash,
                    amount: transaction.amount,
                    status: transaction.status
                }
            });

        } catch (error) {
            logger.error('Failed to process withdrawal:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to process withdrawal',
                    code: 'WITHDRAWAL_FAILED'
                }
            });
        }
    }

    async getBalance(req: Request, res: Response): Promise<void> {
        try {
            const { address } = req.params;

            const balance = await this.t4gService.getUserBalance(address);

            res.json({
                address,
                balance,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            logger.error('Failed to get balance:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve balance',
                    code: 'BALANCE_FETCH_FAILED'
                }
            });
        }
    }

    async calculateReward(req: Request, res: Response): Promise<void> {
        try {
            const {
                baseAmount,
                contributionType,
                domain,
                qualityScore,
                impactScore,
                userReputation,
                communityMultiplier
            } = req.body;

            // Validate required fields
            if (!baseAmount || !contributionType || !domain) {
                res.status(400).json({
                    error: {
                        message: 'Missing required fields: baseAmount, contributionType, domain',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            const rewardCalculation = await this.t4gService.calculateAdvancedReward({
                baseAmount: Number(baseAmount),
                contributionType,
                domain,
                qualityScore: Number(qualityScore) || 0.5,
                impactScore: Number(impactScore) || 0.5,
                userReputation: Number(userReputation) || 0,
                communityMultiplier: Number(communityMultiplier) || 1.0
            });

            res.json({
                calculation: rewardCalculation,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            logger.error('Failed to calculate reward:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to calculate reward',
                    code: 'REWARD_CALCULATION_FAILED'
                }
            });
        }
    }

    getRouter(): Router {
        return this.router;
    }
}