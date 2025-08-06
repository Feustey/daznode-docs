import { Router, Request, Response } from 'express';
import { GitBookService } from '@/services/GitBookService';
import { T4GService } from '@/services/T4GService';
import { DatabaseService } from '@/services/DatabaseService';
import { CacheService } from '@/services/CacheService';
import { EventStreamingService } from '@/services/EventStreamingService';
import { logger } from '@/utils/logger';
import { sensitiveRateLimiter } from '@/utils/rateLimiter';

export class ContributionController {
    private router: Router;

    constructor(
        private gitbookService: GitBookService,
        private t4gService: T4GService,
        private databaseService: DatabaseService,
        private cacheService: CacheService,
        private eventStreamingService: EventStreamingService
    ) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/', this.getContributions.bind(this));
        this.router.get('/:id', this.getContribution.bind(this));
        this.router.post('/', sensitiveRateLimiter, this.createContribution.bind(this));
        this.router.put('/:id', sensitiveRateLimiter, this.updateContribution.bind(this));
        this.router.post('/webhooks/gitbook', this.handleGitBookWebhook.bind(this));
    }

    async getContributions(req: Request, res: Response): Promise<void> {
        try {
            const {
                page = 1,
                limit = 50,
                domain,
                status,
                userId
            } = req.query;

            const offset = (Number(page) - 1) * Number(limit);

            let contributions;
            let total;

            if (userId) {
                const result = await this.databaseService.getUserContributions(
                    userId as string,
                    {
                        offset,
                        limit: Number(limit),
                        domain: domain as string,
                        status: status as string
                    }
                );
                contributions = result.contributions;
                total = result.total;
            } else {
                // Implementation for getting all contributions would go here
                contributions = [];
                total = 0;
            }

            res.json({
                contributions,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Failed to get contributions:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve contributions',
                    code: 'CONTRIBUTIONS_FETCH_FAILED'
                }
            });
        }
    }

    async getContribution(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const contribution = await this.databaseService.getContributionById(id);
            
            if (!contribution) {
                res.status(404).json({
                    error: {
                        message: 'Contribution not found',
                        code: 'CONTRIBUTION_NOT_FOUND'
                    }
                });
                return;
            }

            res.json({ contribution });

        } catch (error) {
            logger.error('Failed to get contribution:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to retrieve contribution',
                    code: 'CONTRIBUTION_FETCH_FAILED'
                }
            });
        }
    }

    async createContribution(req: Request, res: Response): Promise<void> {
        try {
            const {
                userId,
                gitbookPageId,
                gitbookSpaceId,
                type,
                title,
                contentSummary,
                domain
            } = req.body;

            // Validate required fields
            if (!userId || !gitbookPageId || !type || !title) {
                res.status(400).json({
                    error: {
                        message: 'Missing required fields',
                        code: 'VALIDATION_ERROR'
                    }
                });
                return;
            }

            // Create contribution in database
            const contribution = await this.databaseService.createContribution({
                user_id: userId,
                gitbook_page_id: gitbookPageId,
                gitbook_space_id: gitbookSpaceId,
                type,
                title,
                content_summary: contentSummary,
                domain: domain || 'general',
                expertise_level: 'beginner',
                quality_score: 0,
                impact_score: 0,
                status: 'pending'
            });

            // Emit event for processing
            await this.eventStreamingService.publishEvent('contribution.created', {
                contributionId: contribution.id,
                userId,
                type,
                domain
            });

            res.status(201).json({ contribution });

        } catch (error) {
            logger.error('Failed to create contribution:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to create contribution',
                    code: 'CONTRIBUTION_CREATE_FAILED'
                }
            });
        }
    }

    async updateContribution(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = req.body;

            const contribution = await this.databaseService.updateContribution(id, updates);

            res.json({ contribution });

        } catch (error) {
            logger.error('Failed to update contribution:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to update contribution',
                    code: 'CONTRIBUTION_UPDATE_FAILED'
                }
            });
        }
    }

    async handleGitBookWebhook(req: Request, res: Response): Promise<void> {
        try {
            const webhookData = req.body;
            
            logger.info('Received GitBook webhook', {
                type: webhookData.type,
                spaceId: webhookData.space?.id,
                pageId: webhookData.page?.id
            });

            // Process webhook data
            const result = await this.gitbookService.processWebhookEvent(webhookData);

            if (result.shouldReward && result.rewardCalculation) {
                // Distribute T4G reward
                const rewardDistribution = {
                    userId: result.contribution.userId,
                    walletAddress: 'placeholder', // Would be retrieved from user profile
                    amount: result.rewardCalculation.totalReward,
                    reason: `GitBook contribution: ${result.contribution.type}`,
                    contributionId: result.contribution.id,
                    metadata: {
                        domain: result.contribution.classification.domain,
                        type: result.contribution.type,
                        quality_score: result.contribution.classification.technical_complexity,
                        impact_score: 0.8 // Placeholder
                    }
                };

                await this.t4gService.distributeReward(rewardDistribution);
            }

            // Emit processing event
            await this.eventStreamingService.publishEvent('gitbook.webhook.processed', {
                type: webhookData.type,
                contributionId: result.contribution.id,
                rewarded: result.shouldReward
            });

            res.status(200).json({
                message: 'Webhook processed successfully',
                contributionId: result.contribution.id,
                rewarded: result.shouldReward
            });

        } catch (error) {
            logger.error('Failed to process GitBook webhook:', error);
            res.status(500).json({
                error: {
                    message: 'Failed to process webhook',
                    code: 'WEBHOOK_PROCESSING_FAILED'
                }
            });
        }
    }

    getRouter(): Router {
        return this.router;
    }
}