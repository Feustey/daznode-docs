import { ethers, Contract, Wallet } from 'ethers';
import { logger } from '@/utils/logger';
import { CacheService } from './CacheService';

export interface T4GConfig {
    contractAddress: string;
    providerUrl: string;
    privateKey: string;
}

export interface RewardDistribution {
    userId: string;
    walletAddress: string;
    amount: number;
    reason: string;
    contributionId: string;
    metadata: {
        domain: string;
        type: string;
        quality_score: number;
        impact_score: number;
    };
}

export interface RewardTransaction {
    id: string;
    hash: string;
    userId: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    timestamp: Date;
    gasUsed?: number;
    gasFee?: number;
}

export interface UserRewardStats {
    totalEarned: number;
    pendingRewards: number;
    totalContributions: number;
    domainBreakdown: Record<string, number>;
    reputationScore: number;
    monthlyEarnings: Record<string, number>;
}

// T4G Token Contract ABI (simplified)
const T4G_CONTRACT_ABI = [
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
    'function totalSupply() external view returns (uint256)',
    'function mint(address to, uint256 amount) external',
    'function burn(uint256 amount) external',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event RewardDistributed(address indexed recipient, uint256 amount, string reason)'
];

export class T4GService {
    private provider: ethers.Provider;
    private wallet: Wallet;
    private contract: Contract;
    private config: T4GConfig;
    private cache?: CacheService;
    private pendingTransactions: Map<string, RewardTransaction> = new Map();

    constructor(config: T4GConfig, cache?: CacheService) {
        this.config = config;
        this.cache = cache;
        this.initializeProvider();
        this.initializeContract();
        this.setupEventListeners();
        logger.info('✅ T4G service initialized');
    }

    private initializeProvider(): void {
        try {
            this.provider = new ethers.JsonRpcProvider(this.config.providerUrl);
            this.wallet = new Wallet(this.config.privateKey, this.provider);
            logger.info('✅ Ethereum provider and wallet initialized');
        } catch (error) {
            logger.error('❌ Failed to initialize provider', { error });
            throw new Error(`Failed to initialize Ethereum provider: ${error.message}`);
        }
    }

    private initializeContract(): void {
        try {
            this.contract = new Contract(
                this.config.contractAddress,
                T4G_CONTRACT_ABI,
                this.wallet
            );
            logger.info('✅ T4G contract initialized', { address: this.config.contractAddress });
        } catch (error) {
            logger.error('❌ Failed to initialize contract', { error });
            throw new Error(`Failed to initialize T4G contract: ${error.message}`);
        }
    }

    private setupEventListeners(): void {
        // Listen for Transfer events
        this.contract.on('Transfer', (from, to, value, event) => {
            this.handleTransferEvent(from, to, value, event);
        });

        // Listen for RewardDistributed events
        this.contract.on('RewardDistributed', (recipient, amount, reason, event) => {
            this.handleRewardDistributedEvent(recipient, amount, reason, event);
        });

        logger.info('✅ Contract event listeners set up');
    }

    // Reward Distribution
    async distributeReward(distribution: RewardDistribution): Promise<RewardTransaction> {
        try {
            logger.info('Distributing T4G reward', {
                userId: distribution.userId,
                amount: distribution.amount,
                reason: distribution.reason
            });

            // Validate distribution
            await this.validateRewardDistribution(distribution);

            // Convert amount to wei (assuming 18 decimals)
            const amountWei = ethers.parseUnits(distribution.amount.toString(), 18);

            // Execute transaction
            const tx = await this.contract.transfer(
                distribution.walletAddress,
                amountWei
            );

            const rewardTransaction: RewardTransaction = {
                id: `reward_${Date.now()}_${distribution.userId}`,
                hash: tx.hash,
                userId: distribution.userId,
                amount: distribution.amount,
                status: 'pending',
                timestamp: new Date()
            };

            // Track pending transaction
            this.pendingTransactions.set(tx.hash, rewardTransaction);

            // Cache transaction
            if (this.cache) {
                await this.cache.set(`t4g:tx:${tx.hash}`, rewardTransaction, { ttl: 3600 });
            }

            logger.info('✅ T4G reward transaction submitted', {
                hash: tx.hash,
                userId: distribution.userId,
                amount: distribution.amount
            });

            // Wait for confirmation in background
            this.confirmTransaction(tx.hash);

            return rewardTransaction;

        } catch (error) {
            logger.error('❌ Failed to distribute T4G reward', { error, distribution });
            throw new Error(`Failed to distribute T4G reward: ${error.message}`);
        }
    }

    async batchDistributeRewards(distributions: RewardDistribution[]): Promise<RewardTransaction[]> {
        try {
            logger.info('Batch distributing T4G rewards', { count: distributions.length });

            // Validate all distributions
            for (const dist of distributions) {
                await this.validateRewardDistribution(dist);
            }

            // Prepare batch data
            const recipients = distributions.map(d => d.walletAddress);
            const amounts = distributions.map(d => 
                ethers.parseUnits(d.amount.toString(), 18)
            );

            // Execute batch transaction
            const tx = await this.contract.batchTransfer(recipients, amounts);

            const transactions = distributions.map((dist, index) => ({
                id: `batch_reward_${Date.now()}_${index}`,
                hash: tx.hash,
                userId: dist.userId,
                amount: dist.amount,
                status: 'pending' as const,
                timestamp: new Date()
            }));

            // Track all pending transactions
            transactions.forEach(txn => {
                this.pendingTransactions.set(`${tx.hash}_${txn.userId}`, txn);
            });

            // Cache transactions
            if (this.cache) {
                await Promise.all(transactions.map(txn =>
                    this.cache!.set(`t4g:tx:${txn.id}`, txn, { ttl: 3600 })
                ));
            }

            logger.info('✅ Batch T4G reward transaction submitted', {
                hash: tx.hash,
                count: distributions.length,
                totalAmount: distributions.reduce((sum, d) => sum + d.amount, 0)
            });

            // Confirm transaction in background
            this.confirmBatchTransaction(tx.hash, transactions);

            return transactions;

        } catch (error) {
            logger.error('❌ Failed to batch distribute T4G rewards', { error });
            throw new Error(`Failed to batch distribute T4G rewards: ${error.message}`);
        }
    }

    private async validateRewardDistribution(distribution: RewardDistribution): Promise<void> {
        // Check minimum reward amount
        if (distribution.amount < 1) {
            throw new Error('Reward amount must be at least 1 T4G');
        }

        // Check maximum single reward (prevent abuse)
        if (distribution.amount > 10000) {
            throw new Error('Single reward cannot exceed 10,000 T4G');
        }

        // Validate wallet address
        if (!ethers.isAddress(distribution.walletAddress)) {
            throw new Error('Invalid wallet address');
        }

        // Check contract balance
        const contractBalance = await this.getContractBalance();
        if (contractBalance < distribution.amount) {
            throw new Error('Insufficient contract balance for reward distribution');
        }

        // Rate limiting check
        const dailyLimit = await this.checkDailyRewardLimit(distribution.userId);
        if (!dailyLimit.allowed) {
            throw new Error(`Daily reward limit exceeded. Limit: ${dailyLimit.limit}, Used: ${dailyLimit.used}`);
        }
    }

    private async confirmTransaction(txHash: string): Promise<void> {
        try {
            const receipt = await this.provider.waitForTransaction(txHash);
            const transaction = this.pendingTransactions.get(txHash);

            if (receipt && transaction) {
                transaction.status = receipt.status === 1 ? 'confirmed' : 'failed';
                transaction.blockNumber = receipt.blockNumber;
                transaction.gasUsed = Number(receipt.gasUsed);
                transaction.gasFee = Number(receipt.gasUsed * (receipt.gasPrice || 0n));

                // Update cache
                if (this.cache) {
                    await this.cache.set(`t4g:tx:${txHash}`, transaction, { ttl: 86400 }); // 24 hours
                }

                // Update user stats
                if (transaction.status === 'confirmed') {
                    await this.updateUserRewardStats(transaction.userId, transaction.amount);
                }

                logger.info(`✅ Transaction ${transaction.status}`, {
                    hash: txHash,
                    blockNumber: transaction.blockNumber,
                    gasUsed: transaction.gasUsed
                });

                this.pendingTransactions.delete(txHash);
            }

        } catch (error) {
            logger.error('❌ Failed to confirm transaction', { error, txHash });
            const transaction = this.pendingTransactions.get(txHash);
            if (transaction) {
                transaction.status = 'failed';
                this.pendingTransactions.delete(txHash);
            }
        }
    }

    private async confirmBatchTransaction(txHash: string, transactions: RewardTransaction[]): Promise<void> {
        try {
            const receipt = await this.provider.waitForTransaction(txHash);
            
            const status = receipt?.status === 1 ? 'confirmed' : 'failed';
            
            for (const transaction of transactions) {
                transaction.status = status;
                transaction.blockNumber = receipt?.blockNumber;
                transaction.gasUsed = receipt ? Number(receipt.gasUsed) / transactions.length : 0;
                transaction.gasFee = receipt ? Number(receipt.gasUsed * (receipt.gasPrice || 0n)) / transactions.length : 0;

                // Update cache
                if (this.cache) {
                    await this.cache.set(`t4g:tx:${transaction.id}`, transaction, { ttl: 86400 });
                }

                // Update user stats if confirmed
                if (status === 'confirmed') {
                    await this.updateUserRewardStats(transaction.userId, transaction.amount);
                }

                // Remove from pending
                this.pendingTransactions.delete(`${txHash}_${transaction.userId}`);
            }

            logger.info(`✅ Batch transaction ${status}`, {
                hash: txHash,
                count: transactions.length,
                blockNumber: receipt?.blockNumber
            });

        } catch (error) {
            logger.error('❌ Failed to confirm batch transaction', { error, txHash });
        }
    }

    // User Balance and Stats
    async getUserBalance(walletAddress: string): Promise<number> {
        try {
            const cacheKey = `t4g:balance:${walletAddress}`;
            
            if (this.cache) {
                const cached = await this.cache.get<number>(cacheKey);
                if (cached !== null) {
                    return cached;
                }
            }

            const balanceWei = await this.contract.balanceOf(walletAddress);
            const balance = Number(ethers.formatUnits(balanceWei, 18));

            if (this.cache) {
                await this.cache.set(cacheKey, balance, { ttl: 60 }); // 1 minute
            }

            return balance;

        } catch (error) {
            logger.error('❌ Failed to get user balance', { error, walletAddress });
            return 0;
        }
    }

    async getUserRewardStats(userId: string): Promise<UserRewardStats> {
        try {
            const cacheKey = `t4g:stats:${userId}`;
            
            if (this.cache) {
                const cached = await this.cache.get<UserRewardStats>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            // This would typically query from database
            const stats: UserRewardStats = {
                totalEarned: 0,
                pendingRewards: 0,
                totalContributions: 0,
                domainBreakdown: {},
                reputationScore: 0,
                monthlyEarnings: {}
            };

            // Query user transaction history
            const userTransactions = await this.getUserTransactionHistory(userId);
            
            stats.totalEarned = userTransactions
                .filter(tx => tx.status === 'confirmed')
                .reduce((sum, tx) => sum + tx.amount, 0);

            stats.pendingRewards = userTransactions
                .filter(tx => tx.status === 'pending')
                .reduce((sum, tx) => sum + tx.amount, 0);

            stats.totalContributions = userTransactions.length;

            // Calculate monthly earnings
            const monthlyMap = new Map<string, number>();
            userTransactions.forEach(tx => {
                if (tx.status === 'confirmed') {
                    const monthKey = tx.timestamp.toISOString().slice(0, 7); // YYYY-MM
                    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + tx.amount);
                }
            });
            stats.monthlyEarnings = Object.fromEntries(monthlyMap);

            // Calculate reputation score (simplified)
            stats.reputationScore = Math.min(stats.totalEarned / 1000, 10); // Max 10

            if (this.cache) {
                await this.cache.set(cacheKey, stats, { ttl: 300 }); // 5 minutes
            }

            return stats;

        } catch (error) {
            logger.error('❌ Failed to get user reward stats', { error, userId });
            throw error;
        }
    }

    async getUserTransactionHistory(userId: string): Promise<RewardTransaction[]> {
        try {
            const cacheKey = `t4g:history:${userId}`;
            
            if (this.cache) {
                const cached = await this.cache.get<RewardTransaction[]>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            // In production, this would query from database
            // For now, return empty array or mock data
            const transactions: RewardTransaction[] = [];

            if (this.cache) {
                await this.cache.set(cacheKey, transactions, { ttl: 600 }); // 10 minutes
            }

            return transactions;

        } catch (error) {
            logger.error('❌ Failed to get user transaction history', { error, userId });
            return [];
        }
    }

    private async updateUserRewardStats(userId: string, amount: number): Promise<void> {
        try {
            // Invalidate cache to force refresh
            if (this.cache) {
                await this.cache.delete(`t4g:stats:${userId}`);
                await this.cache.delete(`t4g:history:${userId}`);
            }

            // In production, would update database records
            logger.info('Updated user reward stats', { userId, amount });

        } catch (error) {
            logger.error('❌ Failed to update user reward stats', { error, userId, amount });
        }
    }

    // Contract Information
    async getContractBalance(): Promise<number> {
        try {
            const balanceWei = await this.contract.balanceOf(this.config.contractAddress);
            return Number(ethers.formatUnits(balanceWei, 18));
        } catch (error) {
            logger.error('❌ Failed to get contract balance', { error });
            return 0;
        }
    }

    async getTotalSupply(): Promise<number> {
        try {
            const totalSupplyWei = await this.contract.totalSupply();
            return Number(ethers.formatUnits(totalSupplyWei, 18));
        } catch (error) {
            logger.error('❌ Failed to get total supply', { error });
            return 0;
        }
    }

    // Fraud Detection and Rate Limiting
    private async checkDailyRewardLimit(userId: string): Promise<{
        allowed: boolean;
        limit: number;
        used: number;
        remainingTime?: number;
    }> {
        try {
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const cacheKey = `t4g:daily_limit:${userId}:${today}`;
            
            const dailyLimit = 1000; // Max 1000 T4G per day per user
            const used = this.cache ? await this.cache.get<number>(cacheKey) || 0 : 0;
            
            return {
                allowed: used < dailyLimit,
                limit: dailyLimit,
                used,
                remainingTime: used >= dailyLimit ? this.getTimeUntilMidnight() : undefined
            };

        } catch (error) {
            logger.error('❌ Failed to check daily reward limit', { error, userId });
            return { allowed: true, limit: 1000, used: 0 };
        }
    }

    private async incrementDailyRewardUsage(userId: string, amount: number): Promise<void> {
        try {
            const today = new Date().toISOString().slice(0, 10);
            const cacheKey = `t4g:daily_limit:${userId}:${today}`;
            
            if (this.cache) {
                const current = await this.cache.get<number>(cacheKey) || 0;
                await this.cache.set(cacheKey, current + amount, { 
                    ttl: this.getTimeUntilMidnight() 
                });
            }

        } catch (error) {
            logger.error('❌ Failed to increment daily reward usage', { error, userId, amount });
        }
    }

    private getTimeUntilMidnight(): number {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    }

    // Event Handlers
    private async handleTransferEvent(from: string, to: string, value: bigint, event: any): Promise<void> {
        try {
            const amount = Number(ethers.formatUnits(value, 18));
            
            logger.info('T4G Transfer event detected', {
                from,
                to,
                amount,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
            });

            // Update cache for recipient balance
            if (this.cache) {
                await this.cache.delete(`t4g:balance:${to}`);
                if (from !== ethers.ZeroAddress) {
                    await this.cache.delete(`t4g:balance:${from}`);
                }
            }

        } catch (error) {
            logger.error('❌ Failed to handle Transfer event', { error, event });
        }
    }

    private async handleRewardDistributedEvent(recipient: string, amount: bigint, reason: string, event: any): Promise<void> {
        try {
            const rewardAmount = Number(ethers.formatUnits(amount, 18));
            
            logger.info('T4G Reward Distributed event', {
                recipient,
                amount: rewardAmount,
                reason,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash
            });

            // Additional event processing can be added here
            // e.g., notifications, analytics, etc.

        } catch (error) {
            logger.error('❌ Failed to handle RewardDistributed event', { error, event });
        }
    }

    // Advanced Reward Calculation
    async calculateAdvancedReward(params: {
        baseAmount: number;
        contributionType: string;
        domain: string;
        qualityScore: number;
        impactScore: number;
        userReputation: number;
        communityMultiplier: number;
    }): Promise<{
        finalAmount: number;
        breakdown: Record<string, number>;
        reasoning: string[];
    }> {
        const {
            baseAmount,
            contributionType,
            domain,
            qualityScore,
            impactScore,
            userReputation,
            communityMultiplier
        } = params;

        const breakdown: Record<string, number> = {
            base: baseAmount
        };

        const reasoning: string[] = [`Base reward: ${baseAmount} T4G`];

        // Quality multiplier
        const qualityMultiplier = 0.5 + (qualityScore * 1.5); // 0.5x to 2.0x
        breakdown.quality = qualityMultiplier;
        reasoning.push(`Quality multiplier: ${qualityMultiplier.toFixed(2)}x (score: ${qualityScore.toFixed(2)})`);

        // Impact multiplier
        const impactMultiplier = 0.8 + (impactScore * 1.2); // 0.8x to 2.0x
        breakdown.impact = impactMultiplier;
        reasoning.push(`Impact multiplier: ${impactMultiplier.toFixed(2)}x (score: ${impactScore.toFixed(2)})`);

        // User reputation bonus
        const reputationBonus = Math.min(userReputation / 100, 0.5); // Up to 50% bonus
        breakdown.reputation = 1 + reputationBonus;
        reasoning.push(`Reputation bonus: +${(reputationBonus * 100).toFixed(0)}% (reputation: ${userReputation})`);

        // Domain specialization bonus
        const domainBonuses = {
            'lightning': 1.2,
            'hardware': 1.1,
            'security': 1.3,
            'economics': 1.25,
            'education': 1.0
        };
        const domainBonus = domainBonuses[domain as keyof typeof domainBonuses] || 1.0;
        breakdown.domain = domainBonus;
        reasoning.push(`Domain bonus (${domain}): ${domainBonus}x`);

        // Community activity multiplier
        breakdown.community = communityMultiplier;
        reasoning.push(`Community multiplier: ${communityMultiplier.toFixed(2)}x`);

        // Calculate final amount
        const finalAmount = Math.floor(
            baseAmount * 
            qualityMultiplier * 
            impactMultiplier * 
            breakdown.reputation * 
            domainBonus * 
            communityMultiplier
        );

        reasoning.push(`Final reward: ${finalAmount} T4G`);

        return {
            finalAmount,
            breakdown,
            reasoning
        };
    }
}