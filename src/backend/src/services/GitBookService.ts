import axios, { AxiosInstance } from 'axios';
import { logger } from '@/utils/logger';
import { CacheService } from './CacheService';

export interface GitBookConfig {
    apiToken: string;
    baseUrl: string;
}

export interface GitBookPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    spaceId: string;
    parentId?: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
        id: string;
        name: string;
        email: string;
    };
    metrics: {
        views: number;
        comments: number;
        collaborators: number;
    };
}

export interface GitBookWebhookEvent {
    type: 'page.created' | 'page.updated' | 'page.deleted' | 'comment.added' | 'review.submitted';
    space: {
        id: string;
        title: string;
        domain: string;
    };
    page: GitBookPage;
    user: {
        id: string;
        name: string;
        email: string;
    };
    change: {
        summary: string;
        additions: number;
        deletions: number;
        content: string;
    };
    timestamp: Date;
}

export class GitBookService {
    private client: AxiosInstance;
    private config: GitBookConfig;
    private cache?: CacheService;

    constructor(config: GitBookConfig, cache?: CacheService) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Authorization': `Bearer ${config.apiToken}`,
                'Content-Type': 'application/json'
            }
        });
        this.cache = cache;
        logger.info('✅ GitBook service initialized');
    }

    // Page Management
    async createPage(spaceId: string, page: Partial<GitBookPage>): Promise<GitBookPage> {
        try {
            logger.info(`Creating page in space ${spaceId}`, { title: page.title });

            const response = await this.client.post(`/v1/spaces/${spaceId}/pages`, {
                title: page.title!,
                content: page.content || '',
                parent: page.parentId
            });

            const createdPage = await this.getPage(spaceId, response.data.id);
            
            // Invalidate cache
            if (this.cache) {
                await this.cache.invalidatePattern(`gitbook:space:${spaceId}:*`);
            }

            logger.info(`✅ Page created successfully`, { pageId: response.data.id });
            return createdPage;

        } catch (error) {
            logger.error('❌ Failed to create GitBook page', { error, spaceId, page });
            throw new Error(`Failed to create GitBook page: ${error.message}`);
        }
    }

    async updatePage(spaceId: string, pageId: string, updates: Partial<GitBookPage>): Promise<GitBookPage> {
        try {
            logger.info(`Updating page ${pageId} in space ${spaceId}`);

            await this.client.spaces.updatePage(spaceId, pageId, {
                title: updates.title,
                content: updates.content
            });

            const updatedPage = await this.getPage(spaceId, pageId);

            // Invalidate cache
            if (this.cache) {
                await this.cache.delete(`gitbook:page:${pageId}`);
                await this.cache.invalidatePattern(`gitbook:space:${spaceId}:*`);
            }

            return updatedPage;

        } catch (error) {
            logger.error('❌ Failed to update GitBook page', { error, spaceId, pageId });
            throw new Error(`Failed to update GitBook page: ${error.message}`);
        }
    }

    async getPage(spaceId: string, pageId: string): Promise<GitBookPage> {
        const cacheKey = `gitbook:page:${pageId}`;

        try {
            // Check cache first
            if (this.cache) {
                const cached = await this.cache.get<GitBookPage>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const response = await this.client.spaces.getPage(spaceId, pageId);
            
            // Get page metrics
            const metrics = await this.getPageMetrics(spaceId, pageId);
            
            const page: GitBookPage = {
                id: response.id,
                title: response.title,
                slug: response.slug,
                content: response.content,
                spaceId: spaceId,
                parentId: response.parent?.id,
                createdAt: new Date(response.createdAt),
                updatedAt: new Date(response.updatedAt),
                author: {
                    id: response.createdBy.id,
                    name: response.createdBy.displayName,
                    email: response.createdBy.email || ''
                },
                metrics
            };

            // Cache the result
            if (this.cache) {
                await this.cache.set(cacheKey, page, { ttl: 300 }); // 5 minutes
            }

            return page;

        } catch (error) {
            logger.error('❌ Failed to get GitBook page', { error, spaceId, pageId });
            throw new Error(`Failed to get GitBook page: ${error.message}`);
        }
    }

    async getSpacePages(spaceId: string): Promise<GitBookPage[]> {
        const cacheKey = `gitbook:space:${spaceId}:pages`;

        try {
            // Check cache first
            if (this.cache) {
                const cached = await this.cache.get<GitBookPage[]>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const response = await this.client.spaces.listPages(spaceId);
            
            const pages = await Promise.all(
                response.items.map(async (pageRef) => {
                    return await this.getPage(spaceId, pageRef.id);
                })
            );

            // Cache the result
            if (this.cache) {
                await this.cache.set(cacheKey, pages, { ttl: 600 }); // 10 minutes
            }

            return pages;

        } catch (error) {
            logger.error('❌ Failed to get space pages', { error, spaceId });
            throw new Error(`Failed to get space pages: ${error.message}`);
        }
    }

    // Content Analysis
    async classifyContent(content: string): Promise<{
        domain: string;
        expertise_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        topics: string[];
        estimated_reading_time: number;
        technical_complexity: number;
    }> {
        // Simple content classification (in production, use ML/NLP)
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute

        // Domain classification based on keywords
        const domainKeywords = {
            'lightning': ['lightning', 'channel', 'routing', 'lnd', 'cln', 'htlc', 'invoice'],
            'hardware': ['dazbox', 'node', 'hardware', 'setup', 'installation', 'performance'],
            'security': ['backup', 'seed', 'security', 'tor', 'privacy', 'hsm'],
            'economics': ['fee', 'profit', 'roi', 'liquidity', 'capital', 'revenue'],
            'education': ['tutorial', 'guide', 'introduction', 'beginner', 'learn']
        };

        let detectedDomain = 'general';
        let maxMatches = 0;

        for (const [domain, keywords] of Object.entries(domainKeywords)) {
            const matches = keywords.filter(keyword => 
                content.toLowerCase().includes(keyword)
            ).length;
            
            if (matches > maxMatches) {
                maxMatches = matches;
                detectedDomain = domain;
            }
        }

        // Technical complexity based on technical terms and code blocks
        const technicalIndicators = [
            /```[\s\S]*?```/g, // code blocks
            /`[^`]+`/g, // inline code
            /bitcoin|satoshi|blockchain|cryptography/gi,
            /api|json|http|rest/gi
        ];

        const technicalScore = technicalIndicators.reduce((score, pattern) => {
            const matches = content.match(pattern);
            return score + (matches ? matches.length : 0);
        }, 0);

        const complexity = Math.min(technicalScore / 10, 1); // normalized 0-1

        // Expertise level based on content complexity and length
        let expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
        if (complexity > 0.7 || wordCount > 2000) {
            expertiseLevel = 'expert';
        } else if (complexity > 0.5 || wordCount > 1000) {
            expertiseLevel = 'advanced';
        } else if (complexity > 0.2 || wordCount > 500) {
            expertiseLevel = 'intermediate';
        }

        return {
            domain: detectedDomain,
            expertise_level: expertiseLevel,
            topics: this.extractTopics(content),
            estimated_reading_time: readingTime,
            technical_complexity: complexity
        };
    }

    private extractTopics(content: string): string[] {
        // Simple topic extraction (in production, use NLP libraries)
        const commonTopics = [
            'setup', 'configuration', 'troubleshooting', 'optimization',
            'security', 'backup', 'monitoring', 'performance',
            'channels', 'routing', 'fees', 'liquidity'
        ];

        return commonTopics.filter(topic => 
            content.toLowerCase().includes(topic)
        );
    }

    // Metrics and Analytics
    async getPageMetrics(spaceId: string, pageId: string): Promise<{
        views: number;
        comments: number;
        collaborators: number;
    }> {
        try {
            // In a real implementation, these would come from GitBook analytics API
            // For now, we'll return mock data or implement basic tracking

            const cacheKey = `gitbook:metrics:${pageId}`;
            
            if (this.cache) {
                const cached = await this.cache.get(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            // Mock metrics (replace with actual GitBook API calls)
            const metrics = {
                views: Math.floor(Math.random() * 1000),
                comments: Math.floor(Math.random() * 50),
                collaborators: Math.floor(Math.random() * 10) + 1
            };

            if (this.cache) {
                await this.cache.set(cacheKey, metrics, { ttl: 3600 }); // 1 hour
            }

            return metrics;

        } catch (error) {
            logger.error('❌ Failed to get page metrics', { error, spaceId, pageId });
            return { views: 0, comments: 0, collaborators: 1 };
        }
    }

    async getSpaceMetrics(spaceId: string): Promise<{
        totalPages: number;
        totalViews: number;
        activeContributors: number;
        avgQualityScore: number;
    }> {
        try {
            const pages = await this.getSpacePages(spaceId);
            
            const totalViews = pages.reduce((sum, page) => sum + page.metrics.views, 0);
            const contributors = new Set(pages.map(page => page.author.id));
            
            return {
                totalPages: pages.length,
                totalViews,
                activeContributors: contributors.size,
                avgQualityScore: 0.85 // Placeholder - would be calculated based on reviews/ratings
            };

        } catch (error) {
            logger.error('❌ Failed to get space metrics', { error, spaceId });
            throw new Error(`Failed to get space metrics: ${error.message}`);
        }
    }

    // Webhook Processing
    async processWebhookEvent(event: GitBookWebhookEvent): Promise<{
        contribution: {
            id: string;
            type: string;
            userId: string;
            pageId: string;
            spaceId: string;
            content: any;
            classification: any;
        };
        shouldReward: boolean;
        rewardCalculation?: any;
    }> {
        try {
            logger.info('Processing GitBook webhook event', { 
                type: event.type, 
                pageId: event.page.id,
                userId: event.user.id 
            });

            // Classify the content
            const classification = await this.classifyContent(event.change.content);

            // Determine if this contribution should be rewarded
            const shouldReward = this.shouldRewardContribution(event, classification);

            const contribution = {
                id: `${event.page.id}_${Date.now()}`,
                type: event.type,
                userId: event.user.id,
                pageId: event.page.id,
                spaceId: event.space.id,
                content: {
                    title: event.page.title,
                    summary: event.change.summary,
                    additions: event.change.additions,
                    deletions: event.change.deletions,
                    metrics: event.page.metrics
                },
                classification
            };

            let rewardCalculation;
            if (shouldReward) {
                rewardCalculation = await this.calculateContributionReward(event, classification);
            }

            return {
                contribution,
                shouldReward,
                rewardCalculation
            };

        } catch (error) {
            logger.error('❌ Failed to process webhook event', { error, event });
            throw error;
        }
    }

    private shouldRewardContribution(
        event: GitBookWebhookEvent, 
        classification: any
    ): boolean {
        // Define reward criteria
        const rewardableEvents = ['page.created', 'page.updated', 'comment.added', 'review.submitted'];
        
        if (!rewardableEvents.includes(event.type)) {
            return false;
        }

        // Minimum content requirements
        if (event.type === 'page.created' && event.change.additions < 50) {
            return false; // Too short for meaningful contribution
        }

        if (event.type === 'page.updated' && event.change.additions < 20) {
            return false; // Minor update
        }

        return true;
    }

    private async calculateContributionReward(
        event: GitBookWebhookEvent,
        classification: any
    ): Promise<{
        baseReward: number;
        multipliers: Record<string, number>;
        totalReward: number;
        reasoning: string[];
    }> {
        const baseRewards = {
            'page.created': 100,
            'page.updated': 50,
            'comment.added': 10,
            'review.submitted': 25
        };

        const baseReward = baseRewards[event.type] || 0;
        const reasoning: string[] = [`Base reward for ${event.type}: ${baseReward} T4G`];

        const multipliers: Record<string, number> = {};

        // Content quality multiplier
        if (classification.technical_complexity > 0.5) {
            multipliers.complexity = 1.5;
            reasoning.push('Technical complexity bonus: +50%');
        }

        // Length/effort multiplier
        if (event.change.additions > 500) {
            multipliers.length = 1.3;
            reasoning.push('Substantial content bonus: +30%');
        }

        // Domain expertise multiplier
        if (classification.expertise_level === 'expert') {
            multipliers.expertise = 1.4;
            reasoning.push('Expert-level content bonus: +40%');
        } else if (classification.expertise_level === 'advanced') {
            multipliers.expertise = 1.2;
            reasoning.push('Advanced content bonus: +20%');
        }

        // First contribution bonus
        if (event.type === 'page.created') {
            multipliers.first_contribution = 1.2;
            reasoning.push('New page creation bonus: +20%');
        }

        const totalMultiplier = Object.values(multipliers).reduce((acc, mult) => acc * mult, 1);
        const totalReward = Math.floor(baseReward * totalMultiplier);

        reasoning.push(`Total multiplier: ${totalMultiplier.toFixed(2)}x`);
        reasoning.push(`Final reward: ${totalReward} T4G`);

        return {
            baseReward,
            multipliers,
            totalReward,
            reasoning
        };
    }

    // Custom Blocks Integration
    async insertCustomBlock(
        spaceId: string, 
        pageId: string, 
        blockType: string, 
        blockData: any
    ): Promise<void> {
        try {
            logger.info(`Inserting custom block ${blockType} into page ${pageId}`);

            // This would integrate with GitBook's ContentKit API when available
            // For now, we'll append structured content

            const blockContent = this.formatCustomBlock(blockType, blockData);
            const currentPage = await this.getPage(spaceId, pageId);
            
            const updatedContent = `${currentPage.content}\n\n${blockContent}`;
            
            await this.updatePage(spaceId, pageId, {
                content: updatedContent
            });

            logger.info(`✅ Custom block ${blockType} inserted successfully`);

        } catch (error) {
            logger.error('❌ Failed to insert custom block', { error, spaceId, pageId, blockType });
            throw error;
        }
    }

    private formatCustomBlock(blockType: string, blockData: any): string {
        switch (blockType) {
            case 'lightning-node-status':
                return `
### ⚡ Lightning Node Status

**Node ID:** \`${blockData.nodeId}\`
**Status:** ${blockData.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
**Channels:** ${blockData.channels || 0}
**Capacity:** ${blockData.capacity || 0} sats
**Last Updated:** ${new Date().toISOString()}

---
`;

            case 't4g-rewards':
                return `
### 🎯 T4G Rewards

**Current Balance:** ${blockData.balance} T4G
**Total Earned:** ${blockData.totalEarned} T4G
**Contributions:** ${blockData.contributions}
**Domain Ranking:** ${blockData.domainRank}

---
`;

            case 'roi-calculator':
                return `
### 💰 ROI Calculator

**Initial Investment:** $${blockData.investment}
**Monthly Revenue:** $${blockData.monthlyRevenue}
**ROI:** ${blockData.roi}%
**Break-even:** ${blockData.breakEven} months

---
`;

            default:
                return `<!-- Custom Block: ${blockType} -->\n${JSON.stringify(blockData, null, 2)}`;
        }
    }
}