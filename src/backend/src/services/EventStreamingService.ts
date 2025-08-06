import { Kafka, Producer, Consumer, KafkaConfig } from 'kafkajs';
import { logger } from '@/utils/logger';

export interface EventStreamingConfig {
    brokers: string[];
    clientId?: string;
    groupId?: string;
}

export interface DaznodeEvent {
    type: string;
    data: Record<string, any>;
    timestamp: Date;
    userId?: string;
    traceId?: string;
}

export class EventStreamingService {
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;
    private config: EventStreamingConfig;

    constructor(config: EventStreamingConfig) {
        this.config = {
            clientId: 'daznode-community',
            groupId: 'daznode-processors',
            ...config
        };

        this.kafka = this.createKafkaClient();
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: this.config.groupId! });
    }

    private createKafkaClient(): Kafka {
        const kafkaConfig: KafkaConfig = {
            clientId: this.config.clientId,
            brokers: this.config.brokers,
            retry: {
                initialRetryTime: 100,
                retries: 8
            }
        };

        return new Kafka(kafkaConfig);
    }

    async initialize(): Promise<void> {
        try {
            await this.producer.connect();
            await this.consumer.connect();
            
            // Subscribe to topics
            await this.consumer.subscribe({
                topics: [
                    'gitbook-events',
                    'contribution-events', 
                    't4g-events',
                    'user-events'
                ]
            });

            logger.info('✅ Event streaming service initialized');
        } catch (error) {
            logger.error('❌ Failed to initialize event streaming service:', error);
            throw error;
        }
    }

    async publishEvent(type: string, data: Record<string, any>, userId?: string): Promise<void> {
        try {
            const event: DaznodeEvent = {
                type,
                data,
                timestamp: new Date(),
                userId,
                traceId: this.generateTraceId()
            };

            await this.producer.send({
                topic: this.getTopicForEventType(type),
                messages: [{
                    key: userId || 'system',
                    value: JSON.stringify(event),
                    timestamp: event.timestamp.getTime().toString()
                }]
            });

            logger.debug('Event published', { type, userId, traceId: event.traceId });

        } catch (error) {
            logger.error('Failed to publish event:', { error, type, data });
            throw error;
        }
    }

    private getTopicForEventType(type: string): string {
        if (type.startsWith('gitbook.')) return 'gitbook-events';
        if (type.startsWith('contribution.')) return 'contribution-events';
        if (type.startsWith('t4g.') || type.startsWith('reward.')) return 't4g-events';
        if (type.startsWith('user.')) return 'user-events';
        return 'general-events';
    }

    private generateTraceId(): string {
        return `trace_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    async startEventProcessing(): Promise<void> {
        try {
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message, heartbeat }) => {
                    try {
                        if (!message.value) return;

                        const event: DaznodeEvent = JSON.parse(message.value.toString());
                        
                        logger.debug('Processing event', {
                            type: event.type,
                            topic,
                            partition,
                            traceId: event.traceId
                        });

                        await this.processEvent(event);
                        await heartbeat();

                    } catch (error) {
                        logger.error('Failed to process event:', { error, topic, partition });
                    }
                }
            });

        } catch (error) {
            logger.error('Failed to start event processing:', error);
            throw error;
        }
    }

    private async processEvent(event: DaznodeEvent): Promise<void> {
        try {
            switch (event.type) {
                case 'contribution.created':
                    await this.handleContributionCreated(event);
                    break;
                
                case 'gitbook.webhook.processed':
                    await this.handleGitBookWebhookProcessed(event);
                    break;
                
                case 't4g.reward.distributed':
                    await this.handleT4GRewardDistributed(event);
                    break;
                
                case 'user.login':
                    await this.handleUserLogin(event);
                    break;
                
                default:
                    logger.debug('Unhandled event type:', event.type);
            }

        } catch (error) {
            logger.error('Event processing failed:', { error, event });
        }
    }

    private async handleContributionCreated(event: DaznodeEvent): Promise<void> {
        logger.info('Processing contribution created event', {
            contributionId: event.data.contributionId,
            userId: event.userId,
            domain: event.data.domain
        });

        // Here you could trigger additional processing:
        // - Quality assessment
        // - Expert review assignment
        // - Community notifications
        // - Analytics updates
    }

    private async handleGitBookWebhookProcessed(event: DaznodeEvent): Promise<void> {
        logger.info('GitBook webhook processed', {
            contributionId: event.data.contributionId,
            rewarded: event.data.rewarded,
            type: event.data.type
        });

        // Could trigger:
        // - User notifications
        // - Analytics updates
        // - Badge/achievement checks
    }

    private async handleT4GRewardDistributed(event: DaznodeEvent): Promise<void> {
        logger.info('T4G reward distributed', {
            userId: event.userId,
            amount: event.data.amount,
            reason: event.data.reason
        });

        // Could trigger:
        // - User notifications
        // - Leaderboard updates
        // - Achievement checks
        // - Analytics updates
    }

    private async handleUserLogin(event: DaznodeEvent): Promise<void> {
        logger.debug('User login processed', {
            userId: event.userId,
            timestamp: event.timestamp
        });

        // Could trigger:
        // - Session analytics
        // - Security monitoring
        // - Personalization updates
    }

    // Batch event publishing for high-volume scenarios
    async publishEventBatch(events: Array<{
        type: string;
        data: Record<string, any>;
        userId?: string;
    }>): Promise<void> {
        try {
            const topicMessages: Record<string, any[]> = {};

            // Group events by topic
            for (const eventData of events) {
                const event: DaznodeEvent = {
                    type: eventData.type,
                    data: eventData.data,
                    timestamp: new Date(),
                    userId: eventData.userId,
                    traceId: this.generateTraceId()
                };

                const topic = this.getTopicForEventType(event.type);
                
                if (!topicMessages[topic]) {
                    topicMessages[topic] = [];
                }

                topicMessages[topic].push({
                    key: event.userId || 'system',
                    value: JSON.stringify(event),
                    timestamp: event.timestamp.getTime().toString()
                });
            }

            // Send batched messages to each topic
            const publishPromises = Object.entries(topicMessages).map(([topic, messages]) =>
                this.producer.send({ topic, messages })
            );

            await Promise.all(publishPromises);

            logger.info('Event batch published', {
                eventCount: events.length,
                topicCount: Object.keys(topicMessages).length
            });

        } catch (error) {
            logger.error('Failed to publish event batch:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck(): Promise<{ connected: boolean; topics?: string[]; error?: string }> {
        try {
            const admin = this.kafka.admin();
            await admin.connect();
            
            const topics = await admin.listTopics();
            await admin.disconnect();

            return {
                connected: true,
                topics
            };

        } catch (error) {
            return {
                connected: false,
                error: error.message
            };
        }
    }

    // Graceful shutdown
    async close(): Promise<void> {
        try {
            await this.consumer.disconnect();
            await this.producer.disconnect();
            
            logger.info('✅ Event streaming service closed gracefully');

        } catch (error) {
            logger.error('❌ Error closing event streaming service:', error);
        }
    }
}