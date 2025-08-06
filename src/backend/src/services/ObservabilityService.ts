import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { metrics, trace } from '@opentelemetry/api';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';
import { logger } from '@/utils/logger';

export interface ObservabilityConfig {
    serviceName: string;
    version: string;
    environment?: string;
    jaegerEndpoint?: string;
    enableMetrics?: boolean;
    enableTracing?: boolean;
}

export class ObservabilityService {
    private sdk?: NodeSDK;
    private metricsRegistry = register;
    private config: ObservabilityConfig;

    // Application Metrics
    public httpRequestsTotal: Counter<string>;
    public httpRequestDuration: Histogram<string>;
    public t4gRewardsDistributed: Counter<string>;
    public gitbookIntegrationEvents: Counter<string>;
    public contributionProcessingTime: Histogram<string>;
    public activeConnections: Gauge<string>;
    public cacheHitRatio: Gauge<string>;
    public queueSize: Gauge<string>;
    public errorRate: Gauge<string>;

    // Business Metrics
    public contributionsTotal: Counter<string>;
    public rewardsTotal: Counter<string>;
    public usersActive: Gauge<string>;
    public contentQualityScore: Histogram<string>;
    public communityEngagement: Gauge<string>;

    // System Metrics
    public databaseConnections: Gauge<string>;
    public redisConnections: Gauge<string>;
    public kafkaLag: Gauge<string>;

    constructor(config: ObservabilityConfig) {
        this.config = {
            enableMetrics: true,
            enableTracing: true,
            environment: process.env.NODE_ENV || 'development',
            ...config
        };

        this.initializeMetrics();
        this.initializeTracing();
    }

    async initialize(): Promise<void> {
        try {
            if (this.config.enableMetrics) {
                await this.startMetricsCollection();
            }

            if (this.config.enableTracing) {
                await this.startTracing();
            }

            logger.info('✅ Observability service initialized', {
                metrics: this.config.enableMetrics,
                tracing: this.config.enableTracing,
                service: this.config.serviceName
            });
        } catch (error) {
            logger.error('❌ Failed to initialize observability service:', error);
            throw error;
        }
    }

    private initializeMetrics(): void {
        // Clear default registry
        this.metricsRegistry.clear();

        // Collect default Node.js metrics
        collectDefaultMetrics({
            register: this.metricsRegistry,
            prefix: 'daznode_',
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
        });

        // HTTP Metrics
        this.httpRequestsTotal = new Counter({
            name: 'daznode_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.metricsRegistry]
        });

        this.httpRequestDuration = new Histogram({
            name: 'daznode_http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
            registers: [this.metricsRegistry]
        });

        // T4G Blockchain Metrics
        this.t4gRewardsDistributed = new Counter({
            name: 'daznode_t4g_rewards_distributed_total',
            help: 'Total T4G rewards distributed',
            labelNames: ['user_id', 'domain', 'reason'],
            registers: [this.metricsRegistry]
        });

        // GitBook Integration Metrics
        this.gitbookIntegrationEvents = new Counter({
            name: 'daznode_gitbook_events_total',
            help: 'Total GitBook integration events processed',
            labelNames: ['event_type', 'space_id', 'status'],
            registers: [this.metricsRegistry]
        });

        this.contributionProcessingTime = new Histogram({
            name: 'daznode_contribution_processing_seconds',
            help: 'Time taken to process contributions',
            labelNames: ['type', 'domain'],
            buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
            registers: [this.metricsRegistry]
        });

        // Connection Metrics
        this.activeConnections = new Gauge({
            name: 'daznode_active_connections',
            help: 'Number of active connections',
            labelNames: ['type'],
            registers: [this.metricsRegistry]
        });

        this.cacheHitRatio = new Gauge({
            name: 'daznode_cache_hit_ratio',
            help: 'Cache hit ratio',
            labelNames: ['cache_type'],
            registers: [this.metricsRegistry]
        });

        this.queueSize = new Gauge({
            name: 'daznode_queue_size',
            help: 'Number of items in queue',
            labelNames: ['queue_name'],
            registers: [this.metricsRegistry]
        });

        this.errorRate = new Gauge({
            name: 'daznode_error_rate',
            help: 'Error rate percentage',
            labelNames: ['service', 'error_type'],
            registers: [this.metricsRegistry]
        });

        // Business Metrics
        this.contributionsTotal = new Counter({
            name: 'daznode_contributions_total',
            help: 'Total number of contributions',
            labelNames: ['domain', 'type', 'status'],
            registers: [this.metricsRegistry]
        });

        this.rewardsTotal = new Counter({
            name: 'daznode_rewards_total',
            help: 'Total rewards distributed in T4G tokens',
            labelNames: ['domain', 'user_type'],
            registers: [this.metricsRegistry]
        });

        this.usersActive = new Gauge({
            name: 'daznode_users_active',
            help: 'Number of active users',
            labelNames: ['time_period'],
            registers: [this.metricsRegistry]
        });

        this.contentQualityScore = new Histogram({
            name: 'daznode_content_quality_score',
            help: 'Content quality scores',
            labelNames: ['domain', 'type'],
            buckets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            registers: [this.metricsRegistry]
        });

        this.communityEngagement = new Gauge({
            name: 'daznode_community_engagement',
            help: 'Community engagement metrics',
            labelNames: ['metric_type'],
            registers: [this.metricsRegistry]
        });

        // System Metrics
        this.databaseConnections = new Gauge({
            name: 'daznode_database_connections',
            help: 'Number of database connections',
            labelNames: ['database', 'state'],
            registers: [this.metricsRegistry]
        });

        this.redisConnections = new Gauge({
            name: 'daznode_redis_connections',
            help: 'Number of Redis connections',
            labelNames: ['state'],
            registers: [this.metricsRegistry]
        });

        this.kafkaLag = new Gauge({
            name: 'daznode_kafka_consumer_lag',
            help: 'Kafka consumer lag',
            labelNames: ['topic', 'partition', 'consumer_group'],
            registers: [this.metricsRegistry]
        });
    }

    private initializeTracing(): void {
        if (!this.config.enableTracing) return;

        const resource = Resource.default().merge(
            new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
                [SemanticResourceAttributes.SERVICE_VERSION]: this.config.version,
                [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
            })
        );

        this.sdk = new NodeSDK({
            resource: resource,
            traceExporter: new JaegerExporter({
                endpoint: this.config.jaegerEndpoint || 'http://localhost:14268/api/traces',
            }),
            instrumentations: [
                getNodeAutoInstrumentations({
                    '@opentelemetry/instrumentation-dns': {
                        enabled: false,
                    },
                    '@opentelemetry/instrumentation-fs': {
                        enabled: false,
                    },
                    '@opentelemetry/instrumentation-http': {
                        enabled: true,
                        requestHook: (span, request) => {
                            span.setAttributes({
                                'http.request.body': request.body ? JSON.stringify(request.body) : '',
                            });
                        }
                    },
                    '@opentelemetry/instrumentation-express': {
                        enabled: true,
                    },
                    '@opentelemetry/instrumentation-pg': {
                        enabled: true,
                    },
                    '@opentelemetry/instrumentation-redis': {
                        enabled: true,
                    }
                })
            ]
        });
    }

    private async startMetricsCollection(): Promise<void> {
        try {
            // Start Prometheus metrics server
            const prometheusExporter = new PrometheusExporter({
                port: 9464, // Dedicated metrics port
                endpoint: '/metrics'
            }, () => {
                logger.info('✅ Prometheus metrics server started on port 9464');
            });

            // Initialize meter provider
            const meterProvider = new MeterProvider({
                resource: new Resource({
                    [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
                    [SemanticResourceAttributes.SERVICE_VERSION]: this.config.version,
                }),
            });

            metrics.setGlobalMeterProvider(meterProvider);

        } catch (error) {
            logger.error('❌ Failed to start metrics collection:', error);
            throw error;
        }
    }

    private async startTracing(): Promise<void> {
        try {
            if (this.sdk) {
                await this.sdk.start();
                logger.info('✅ OpenTelemetry tracing started');
            }
        } catch (error) {
            logger.error('❌ Failed to start tracing:', error);
            throw error;
        }
    }

    // Utility methods for common operations
    public recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void {
        this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
        this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
    }

    public recordT4GReward(userId: string, domain: string, amount: number, reason: string): void {
        this.t4gRewardsDistributed.inc({ user_id: userId, domain, reason }, amount);
        this.rewardsTotal.inc({ domain, user_type: 'contributor' }, amount);
    }

    public recordGitBookEvent(eventType: string, spaceId: string, status: string): void {
        this.gitbookIntegrationEvents.inc({ event_type: eventType, space_id: spaceId, status });
    }

    public recordContributionProcessing(type: string, domain: string, duration: number): void {
        this.contributionProcessingTime.observe({ type, domain }, duration);
        this.contributionsTotal.inc({ domain, type, status: 'processed' });
    }

    public recordContribution(domain: string, type: string, status: string, qualityScore?: number): void {
        this.contributionsTotal.inc({ domain, type, status });
        
        if (qualityScore !== undefined) {
            this.contentQualityScore.observe({ domain, type }, qualityScore);
        }
    }

    public updateActiveUsers(period: string, count: number): void {
        this.usersActive.set({ time_period: period }, count);
    }

    public updateCommunityEngagement(metricType: string, value: number): void {
        this.communityEngagement.set({ metric_type: metricType }, value);
    }

    public updateConnectionCounts(type: string, count: number): void {
        this.activeConnections.set({ type }, count);
    }

    public updateCacheMetrics(cacheType: string, hitRatio: number): void {
        this.cacheHitRatio.set({ cache_type: cacheType }, hitRatio);
    }

    public updateQueueSize(queueName: string, size: number): void {
        this.queueSize.set({ queue_name: queueName }, size);
    }

    public updateErrorRate(service: string, errorType: string, rate: number): void {
        this.errorRate.set({ service, error_type: errorType }, rate);
    }

    public updateDatabaseConnections(database: string, state: string, count: number): void {
        this.databaseConnections.set({ database, state }, count);
    }

    public updateKafkaLag(topic: string, partition: string, consumerGroup: string, lag: number): void {
        this.kafkaLag.set({ topic, partition, consumer_group: consumerGroup }, lag);
    }

    // Advanced monitoring methods
    public async collectBusinessMetrics(): Promise<Record<string, any>> {
        return {
            totalContributions: await this.getTotalContributions(),
            totalRewards: await this.getTotalRewards(),
            activeUsers: await this.getActiveUsers(),
            averageQuality: await this.getAverageContentQuality(),
            engagementMetrics: await this.getEngagementMetrics()
        };
    }

    private async getTotalContributions(): Promise<number> {
        // Implementation would query database for total contributions
        return 0; // Placeholder
    }

    private async getTotalRewards(): Promise<number> {
        // Implementation would query database for total rewards
        return 0; // Placeholder
    }

    private async getActiveUsers(): Promise<{ daily: number; weekly: number; monthly: number }> {
        // Implementation would query database for active user counts
        return { daily: 0, weekly: 0, monthly: 0 }; // Placeholder
    }

    private async getAverageContentQuality(): Promise<number> {
        // Implementation would calculate average content quality
        return 0; // Placeholder
    }

    private async getEngagementMetrics(): Promise<Record<string, number>> {
        // Implementation would calculate engagement metrics
        return {}; // Placeholder
    }

    // Health check for observability systems
    public async healthCheck(): Promise<{
        metrics: boolean;
        tracing: boolean;
        errors?: string[];
    }> {
        const health = {
            metrics: true,
            tracing: true,
            errors: [] as string[]
        };

        try {
            // Test metrics collection
            const metricsTest = this.metricsRegistry.getSingleMetric('daznode_http_requests_total');
            if (!metricsTest) {
                health.metrics = false;
                health.errors.push('Metrics collection not working');
            }

            // Test tracing
            const tracer = trace.getActiveTracer();
            const span = tracer.startSpan('health-check');
            span.end();
            
        } catch (error) {
            health.errors.push(`Observability health check failed: ${error.message}`);
        }

        return health;
    }

    // Graceful shutdown
    public async shutdown(): Promise<void> {
        try {
            if (this.sdk) {
                await this.sdk.shutdown();
            }

            // Clear metrics registry
            this.metricsRegistry.clear();

            logger.info('✅ Observability service shut down gracefully');
        } catch (error) {
            logger.error('❌ Error during observability service shutdown:', error);
        }
    }

    // Get metrics for external consumption
    public async getMetrics(): Promise<string> {
        return this.metricsRegistry.metrics();
    }

    // Custom trace creation
    public createTrace(name: string, operation: () => Promise<any>): Promise<any> {
        const tracer = trace.getActiveTracer();
        return tracer.startActiveSpan(name, async (span) => {
            try {
                const result = await operation();
                span.setStatus({ code: 1 }); // OK
                return result;
            } catch (error) {
                span.setStatus({ code: 2, message: error.message }); // ERROR
                span.recordException(error);
                throw error;
            } finally {
                span.end();
            }
        });
    }
}