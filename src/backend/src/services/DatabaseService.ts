import { Pool, PoolClient, PoolConfig } from 'pg';
import { logger } from '@/utils/logger';

export interface DatabaseConfig extends PoolConfig {
    connectionString: string;
    ssl?: boolean;
}

export interface User {
    id: string;
    email: string;
    username: string;
    wallet_address?: string;
    gitbook_user_id?: string;
    reputation_score: number;
    created_at: Date;
    updated_at: Date;
}

export interface Contribution {
    id: string;
    user_id: string;
    gitbook_page_id: string;
    gitbook_space_id: string;
    type: 'page_created' | 'page_updated' | 'comment_added' | 'review_submitted';
    title: string;
    content_summary: string;
    domain: string;
    expertise_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    quality_score: number;
    impact_score: number;
    status: 'pending' | 'approved' | 'rejected';
    reward_amount?: number;
    transaction_hash?: string;
    created_at: Date;
    updated_at: Date;
}

export interface RewardTransaction {
    id: string;
    user_id: string;
    contribution_id?: string;
    amount: number;
    transaction_hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    block_number?: number;
    gas_used?: number;
    gas_fee?: number;
    metadata: any;
    created_at: Date;
    updated_at: Date;
}

export interface UserExpertise {
    id: string;
    user_id: string;
    domain: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
    reputation_score: number;
    verified_by?: string;
    verification_date?: Date;
    specializations: string[];
    created_at: Date;
    updated_at: Date;
}

export class DatabaseService {
    private pool: Pool;
    private config: DatabaseConfig;

    constructor(config: DatabaseConfig) {
        this.config = config;
        this.pool = new Pool({
            connectionString: config.connectionString,
            ssl: config.ssl ? { rejectUnauthorized: false } : false,
            max: 20, // Maximum connections in pool
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
            maxUses: 7500, // Close connections after 7500 uses
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.pool.on('connect', (client) => {
            logger.debug('New database client connected');
        });

        this.pool.on('error', (err) => {
            logger.error('❌ Database pool error:', err);
        });

        this.pool.on('remove', (client) => {
            logger.debug('Database client removed from pool');
        });
    }

    async initialize(): Promise<void> {
        try {
            // Test connection
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();

            // Run migrations
            await this.runMigrations();

            logger.info('✅ Database service initialized successfully');
        } catch (error) {
            logger.error('❌ Failed to initialize database:', error);
            throw new Error(`Database initialization failed: ${error.message}`);
        }
    }

    private async runMigrations(): Promise<void> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            // Create extensions
            await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            await client.query('CREATE EXTENSION IF NOT EXISTS "btree_gin"');

            // Create enum types
            await client.query(`
                DO $$ 
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contribution_type') THEN
                        CREATE TYPE contribution_type AS ENUM (
                            'page_created', 'page_updated', 'comment_added', 'review_submitted'
                        );
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expertise_level') THEN
                        CREATE TYPE expertise_level AS ENUM (
                            'beginner', 'intermediate', 'advanced', 'expert', 'master'
                        );
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contribution_status') THEN
                        CREATE TYPE contribution_status AS ENUM (
                            'pending', 'approved', 'rejected'
                        );
                    END IF;
                    
                    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
                        CREATE TYPE transaction_status AS ENUM (
                            'pending', 'confirmed', 'failed'
                        );
                    END IF;
                END $$;
            `);

            // Create users table
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    username VARCHAR(100) UNIQUE NOT NULL,
                    wallet_address VARCHAR(42) UNIQUE,
                    gitbook_user_id VARCHAR(255) UNIQUE,
                    reputation_score INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

            // Create contributions table
            await client.query(`
                CREATE TABLE IF NOT EXISTS contributions (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    gitbook_page_id VARCHAR(255) NOT NULL,
                    gitbook_space_id VARCHAR(255) NOT NULL,
                    type contribution_type NOT NULL,
                    title VARCHAR(500) NOT NULL,
                    content_summary TEXT,
                    domain VARCHAR(100) NOT NULL,
                    expertise_level expertise_level DEFAULT 'beginner',
                    quality_score DECIMAL(3,2) DEFAULT 0.0,
                    impact_score DECIMAL(3,2) DEFAULT 0.0,
                    status contribution_status DEFAULT 'pending',
                    reward_amount INTEGER,
                    transaction_hash VARCHAR(66),
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

            // Create reward_transactions table
            await client.query(`
                CREATE TABLE IF NOT EXISTS reward_transactions (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    contribution_id UUID REFERENCES contributions(id) ON DELETE SET NULL,
                    amount INTEGER NOT NULL,
                    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
                    status transaction_status DEFAULT 'pending',
                    block_number BIGINT,
                    gas_used INTEGER,
                    gas_fee BIGINT,
                    metadata JSONB,
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

            // Create user_expertise table
            await client.query(`
                CREATE TABLE IF NOT EXISTS user_expertise (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    domain VARCHAR(100) NOT NULL,
                    level expertise_level DEFAULT 'beginner',
                    reputation_score INTEGER DEFAULT 0,
                    verified_by UUID REFERENCES users(id),
                    verification_date TIMESTAMP,
                    specializations TEXT[] DEFAULT '{}',
                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW(),
                    UNIQUE(user_id, domain)
                )
            `);

            // Create indexes
            await client.query(`
                CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
                CREATE INDEX IF NOT EXISTS idx_contributions_gitbook_page_id ON contributions(gitbook_page_id);
                CREATE INDEX IF NOT EXISTS idx_contributions_domain ON contributions(domain);
                CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
                CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at DESC);
                
                CREATE INDEX IF NOT EXISTS idx_reward_transactions_user_id ON reward_transactions(user_id);
                CREATE INDEX IF NOT EXISTS idx_reward_transactions_hash ON reward_transactions(transaction_hash);
                CREATE INDEX IF NOT EXISTS idx_reward_transactions_status ON reward_transactions(status);
                CREATE INDEX IF NOT EXISTS idx_reward_transactions_created_at ON reward_transactions(created_at DESC);
                
                CREATE INDEX IF NOT EXISTS idx_user_expertise_user_id ON user_expertise(user_id);
                CREATE INDEX IF NOT EXISTS idx_user_expertise_domain ON user_expertise(domain);
                CREATE INDEX IF NOT EXISTS idx_user_expertise_level ON user_expertise(level);
                
                CREATE INDEX IF NOT EXISTS idx_users_gitbook_user_id ON users(gitbook_user_id);
                CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
            `);

            // Create triggers for updated_at
            await client.query(`
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                END;
                $$ language 'plpgsql';

                DROP TRIGGER IF EXISTS update_users_updated_at ON users;
                CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

                DROP TRIGGER IF EXISTS update_contributions_updated_at ON contributions;
                CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

                DROP TRIGGER IF EXISTS update_reward_transactions_updated_at ON reward_transactions;
                CREATE TRIGGER update_reward_transactions_updated_at BEFORE UPDATE ON reward_transactions
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

                DROP TRIGGER IF EXISTS update_user_expertise_updated_at ON user_expertise;
                CREATE TRIGGER update_user_expertise_updated_at BEFORE UPDATE ON user_expertise
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            `);

            await client.query('COMMIT');
            logger.info('✅ Database migrations completed successfully');

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('❌ Database migration failed:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    // User operations
    async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'reputation_score'>): Promise<User> {
        const query = `
            INSERT INTO users (email, username, wallet_address, gitbook_user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [
            userData.email,
            userData.username,
            userData.wallet_address || null,
            userData.gitbook_user_id || null
        ];

        try {
            const result = await this.pool.query(query, values);
            logger.info('✅ User created:', { userId: result.rows[0].id, username: userData.username });
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to create user:', { error, userData });
            throw error;
        }
    }

    async getUserById(userId: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1';
        
        try {
            const result = await this.pool.query(query, [userId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error('❌ Failed to get user by ID:', { error, userId });
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        
        try {
            const result = await this.pool.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error('❌ Failed to get user by email:', { error, email });
            throw error;
        }
    }

    async getUserByGitBookId(gitbookUserId: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE gitbook_user_id = $1';
        
        try {
            const result = await this.pool.query(query, [gitbookUserId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error('❌ Failed to get user by GitBook ID:', { error, gitbookUserId });
            throw error;
        }
    }

    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        const query = `
            UPDATE users 
            SET ${setClause}
            WHERE id = $1 
            RETURNING *
        `;

        const values = [userId, ...Object.values(updates)];

        try {
            const result = await this.pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('User not found');
            }
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to update user:', { error, userId, updates });
            throw error;
        }
    }

    // Contribution operations
    async createContribution(contributionData: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>): Promise<Contribution> {
        const query = `
            INSERT INTO contributions (
                user_id, gitbook_page_id, gitbook_space_id, type, title,
                content_summary, domain, expertise_level, quality_score,
                impact_score, status, reward_amount, transaction_hash
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *
        `;

        const values = [
            contributionData.user_id,
            contributionData.gitbook_page_id,
            contributionData.gitbook_space_id,
            contributionData.type,
            contributionData.title,
            contributionData.content_summary,
            contributionData.domain,
            contributionData.expertise_level,
            contributionData.quality_score,
            contributionData.impact_score,
            contributionData.status,
            contributionData.reward_amount || null,
            contributionData.transaction_hash || null
        ];

        try {
            const result = await this.pool.query(query, values);
            logger.info('✅ Contribution created:', { contributionId: result.rows[0].id });
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to create contribution:', { error, contributionData });
            throw error;
        }
    }

    async getContributionById(contributionId: string): Promise<Contribution | null> {
        const query = 'SELECT * FROM contributions WHERE id = $1';
        
        try {
            const result = await this.pool.query(query, [contributionId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error('❌ Failed to get contribution:', { error, contributionId });
            throw error;
        }
    }

    async getUserContributions(userId: string, options: {
        limit?: number;
        offset?: number;
        domain?: string;
        status?: string;
    } = {}): Promise<{ contributions: Contribution[]; total: number }> {
        const { limit = 50, offset = 0, domain, status } = options;
        
        let whereClause = 'WHERE user_id = $1';
        const values: any[] = [userId];
        let paramCount = 1;

        if (domain) {
            whereClause += ` AND domain = $${++paramCount}`;
            values.push(domain);
        }

        if (status) {
            whereClause += ` AND status = $${++paramCount}`;
            values.push(status);
        }

        const countQuery = `SELECT COUNT(*) FROM contributions ${whereClause}`;
        const dataQuery = `
            SELECT * FROM contributions 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT $${++paramCount} OFFSET $${++paramCount}
        `;

        values.push(limit, offset);

        try {
            const [countResult, dataResult] = await Promise.all([
                this.pool.query(countQuery, values.slice(0, -2)),
                this.pool.query(dataQuery, values)
            ]);

            return {
                contributions: dataResult.rows,
                total: parseInt(countResult.rows[0].count)
            };
        } catch (error) {
            logger.error('❌ Failed to get user contributions:', { error, userId });
            throw error;
        }
    }

    async updateContribution(contributionId: string, updates: Partial<Contribution>): Promise<Contribution> {
        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');

        const query = `
            UPDATE contributions 
            SET ${setClause}
            WHERE id = $1 
            RETURNING *
        `;

        const values = [contributionId, ...Object.values(updates)];

        try {
            const result = await this.pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('Contribution not found');
            }
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to update contribution:', { error, contributionId, updates });
            throw error;
        }
    }

    // Reward transaction operations
    async createRewardTransaction(transactionData: Omit<RewardTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<RewardTransaction> {
        const query = `
            INSERT INTO reward_transactions (
                user_id, contribution_id, amount, transaction_hash,
                status, block_number, gas_used, gas_fee, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const values = [
            transactionData.user_id,
            transactionData.contribution_id || null,
            transactionData.amount,
            transactionData.transaction_hash,
            transactionData.status,
            transactionData.block_number || null,
            transactionData.gas_used || null,
            transactionData.gas_fee || null,
            JSON.stringify(transactionData.metadata)
        ];

        try {
            const result = await this.pool.query(query, values);
            logger.info('✅ Reward transaction created:', { transactionId: result.rows[0].id });
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to create reward transaction:', { error, transactionData });
            throw error;
        }
    }

    async updateRewardTransactionStatus(transactionHash: string, updates: {
        status: 'pending' | 'confirmed' | 'failed';
        block_number?: number;
        gas_used?: number;
        gas_fee?: number;
    }): Promise<RewardTransaction> {
        const query = `
            UPDATE reward_transactions 
            SET status = $1, block_number = $2, gas_used = $3, gas_fee = $4
            WHERE transaction_hash = $5 
            RETURNING *
        `;

        const values = [
            updates.status,
            updates.block_number || null,
            updates.gas_used || null,
            updates.gas_fee || null,
            transactionHash
        ];

        try {
            const result = await this.pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error('Transaction not found');
            }
            return result.rows[0];
        } catch (error) {
            logger.error('❌ Failed to update transaction status:', { error, transactionHash, updates });
            throw error;
        }
    }

    async getUserRewardStats(userId: string): Promise<{
        totalEarned: number;
        pendingRewards: number;
        transactionCount: number;
        lastReward?: Date;
    }> {
        const query = `
            SELECT 
                COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) as total_earned,
                COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_rewards,
                COUNT(*) as transaction_count,
                MAX(CASE WHEN status = 'confirmed' THEN created_at END) as last_reward
            FROM reward_transactions 
            WHERE user_id = $1
        `;

        try {
            const result = await this.pool.query(query, [userId]);
            const row = result.rows[0];
            
            return {
                totalEarned: parseInt(row.total_earned),
                pendingRewards: parseInt(row.pending_rewards),
                transactionCount: parseInt(row.transaction_count),
                lastReward: row.last_reward
            };
        } catch (error) {
            logger.error('❌ Failed to get user reward stats:', { error, userId });
            throw error;
        }
    }

    // Analytics queries
    async getDomainStats(domain?: string): Promise<{
        totalContributions: number;
        totalRewards: number;
        activeContributors: number;
        avgQualityScore: number;
    }> {
        const whereClause = domain ? 'WHERE c.domain = $1' : '';
        const params = domain ? [domain] : [];

        const query = `
            SELECT 
                COUNT(DISTINCT c.id) as total_contributions,
                COALESCE(SUM(rt.amount), 0) as total_rewards,
                COUNT(DISTINCT c.user_id) as active_contributors,
                COALESCE(AVG(c.quality_score), 0) as avg_quality_score
            FROM contributions c
            LEFT JOIN reward_transactions rt ON c.id = rt.contribution_id AND rt.status = 'confirmed'
            ${whereClause}
        `;

        try {
            const result = await this.pool.query(query, params);
            const row = result.rows[0];
            
            return {
                totalContributions: parseInt(row.total_contributions),
                totalRewards: parseInt(row.total_rewards),
                activeContributors: parseInt(row.active_contributors),
                avgQualityScore: parseFloat(row.avg_quality_score)
            };
        } catch (error) {
            logger.error('❌ Failed to get domain stats:', { error, domain });
            throw error;
        }
    }

    // Batch operations for optimization
    async batchCreateContributions(contributions: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>[]): Promise<Contribution[]> {
        const client = await this.pool.connect();
        
        try {
            await client.query('BEGIN');
            
            const results = [];
            for (const contribution of contributions) {
                const query = `
                    INSERT INTO contributions (
                        user_id, gitbook_page_id, gitbook_space_id, type, title,
                        content_summary, domain, expertise_level, quality_score,
                        impact_score, status, reward_amount, transaction_hash
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    RETURNING *
                `;

                const values = [
                    contribution.user_id,
                    contribution.gitbook_page_id,
                    contribution.gitbook_space_id,
                    contribution.type,
                    contribution.title,
                    contribution.content_summary,
                    contribution.domain,
                    contribution.expertise_level,
                    contribution.quality_score,
                    contribution.impact_score,
                    contribution.status,
                    contribution.reward_amount || null,
                    contribution.transaction_hash || null
                ];

                const result = await client.query(query, values);
                results.push(result.rows[0]);
            }

            await client.query('COMMIT');
            logger.info('✅ Batch created contributions:', { count: contributions.length });
            return results;

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('❌ Failed to batch create contributions:', { error });
            throw error;
        } finally {
            client.release();
        }
    }

    async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.info('✅ Database service closed');
        } catch (error) {
            logger.error('❌ Error closing database:', error);
        }
    }

    // Health check
    async healthCheck(): Promise<{ connected: boolean; latency?: number }> {
        const start = Date.now();
        
        try {
            await this.pool.query('SELECT 1');
            const latency = Date.now() - start;
            
            return { connected: true, latency };
        } catch (error) {
            logger.error('❌ Database health check failed:', error);
            return { connected: false };
        }
    }
}