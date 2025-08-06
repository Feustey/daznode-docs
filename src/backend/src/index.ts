import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import { DatabaseService } from '@/services/DatabaseService';
import { GitBookService } from '@/services/GitBookService';
import { T4GService } from '@/services/T4GService';
import { CacheService } from '@/services/CacheService';
import { EventStreamingService } from '@/services/EventStreamingService';
import { SecurityService } from '@/services/SecurityService';
import { ObservabilityService } from '@/services/ObservabilityService';
import { ContributionController } from '@/api/ContributionController';
import { RewardController } from '@/api/RewardController';
import { UserController } from '@/api/UserController';
import { WebSocketService } from '@/services/WebSocketService';
import { errorHandler } from '@/utils/errorHandler';
import { rateLimiter } from '@/utils/rateLimiter';
import { logger } from '@/utils/logger';

// Load environment variables
config();

class DaznodeGitBookServer {
    private app: express.Application;
    private server: any;
    private io: SocketIOServer;
    private services: {
        database: DatabaseService;
        gitbook: GitBookService;
        t4g: T4GService;
        cache: CacheService;
        eventStreaming: EventStreamingService;
        security: SecurityService;
        observability: ObservabilityService;
        websocket: WebSocketService;
    };

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
                credentials: true
            }
        });
        this.initializeServices();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private async initializeServices(): Promise<void> {
        logger.info('🚀 Initializing services...');

        // Initialize core services
        this.services = {
            database: new DatabaseService({
                connectionString: process.env.DATABASE_URL!,
                ssl: process.env.NODE_ENV === 'production'
            }),
            gitbook: new GitBookService({
                apiToken: process.env.GITBOOK_API_TOKEN!,
                baseUrl: process.env.GITBOOK_API_URL || 'https://api.gitbook.com'
            }),
            t4g: new T4GService({
                contractAddress: process.env.T4G_CONTRACT_ADDRESS!,
                providerUrl: process.env.ETHEREUM_PROVIDER_URL!,
                privateKey: process.env.T4G_PRIVATE_KEY!
            }),
            cache: new CacheService({
                redisUrl: process.env.REDIS_URL!
            }),
            eventStreaming: new EventStreamingService({
                brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092']
            }),
            security: new SecurityService({
                jwtSecret: process.env.JWT_SECRET!,
                encryptionKey: process.env.ENCRYPTION_KEY!
            }),
            observability: new ObservabilityService({
                serviceName: 'daznode-gitbook-backend',
                version: process.env.APP_VERSION || '1.0.0'
            }),
            websocket: new WebSocketService(this.io)
        };

        // Initialize all services
        await Promise.all([
            this.services.database.initialize(),
            this.services.cache.initialize(),
            this.services.eventStreaming.initialize(),
            this.services.observability.initialize(),
            this.services.websocket.initialize()
        ]);

        logger.info('✅ All services initialized successfully');
    }

    private initializeMiddleware(): void {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                    connectSrc: ["'self'", "wss:"],
                }
            }
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
        }));

        // Rate limiting
        this.app.use(rateLimiter);

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        this.app.use((req, res, next) => {
            logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                timestamp: new Date().toISOString()
            });
            next();
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: process.env.APP_VERSION || '1.0.0'
            });
        });
    }

    private initializeRoutes(): void {
        const apiRouter = express.Router();

        // Initialize controllers with services
        const contributionController = new ContributionController(
            this.services.gitbook,
            this.services.t4g,
            this.services.database,
            this.services.cache,
            this.services.eventStreaming
        );

        const rewardController = new RewardController(
            this.services.t4g,
            this.services.database,
            this.services.security
        );

        const userController = new UserController(
            this.services.database,
            this.services.security,
            this.services.cache
        );

        // Mount routes
        apiRouter.use('/contributions', contributionController.getRouter());
        apiRouter.use('/rewards', rewardController.getRouter());
        apiRouter.use('/users', userController.getRouter());

        // GitBook webhooks
        apiRouter.post('/webhooks/gitbook', contributionController.handleGitBookWebhook.bind(contributionController));

        this.app.use('/api/v1', apiRouter);
    }

    private initializeErrorHandling(): void {
        this.app.use(errorHandler);

        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Not Found',
                message: 'The requested resource was not found',
                timestamp: new Date().toISOString()
            });
        });

        // Graceful shutdown
        process.on('SIGTERM', () => this.gracefulShutdown());
        process.on('SIGINT', () => this.gracefulShutdown());
    }

    private async gracefulShutdown(): Promise<void> {
        logger.info('🛑 Graceful shutdown initiated...');

        // Close server
        this.server.close();

        // Close services
        await Promise.all([
            this.services.database.close(),
            this.services.cache.close(),
            this.services.eventStreaming.close()
        ]);

        logger.info('✅ Graceful shutdown completed');
        process.exit(0);
    }

    public async start(): Promise<void> {
        const port = process.env.PORT || 3001;
        
        this.server.listen(port, () => {
            logger.info(`🚀 Server running on port ${port}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
}

// Start server
async function bootstrap() {
    try {
        const server = new DaznodeGitBookServer();
        await server.start();
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();