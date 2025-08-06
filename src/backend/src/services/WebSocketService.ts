import { Server, Socket } from 'socket.io';
import { logger } from '@/utils/logger';
import { SecurityService } from './SecurityService';

export interface WebSocketConfig {
    cors?: {
        origin: string | string[];
        credentials: boolean;
    };
    pingTimeout?: number;
    pingInterval?: number;
}

export class WebSocketService {
    private io: Server;
    private connectedUsers: Map<string, Socket[]> = new Map();
    private securityService?: SecurityService;

    constructor(io: Server, securityService?: SecurityService) {
        this.io = io;
        this.securityService = securityService;
        this.setupEventHandlers();
    }

    async initialize(): Promise<void> {
        logger.info('✅ WebSocket service initialized');
    }

    private setupEventHandlers(): void {
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });

        this.io.use(async (socket, next) => {
            try {
                await this.authenticateSocket(socket);
                next();
            } catch (error) {
                logger.warn('Socket authentication failed', { 
                    socketId: socket.id,
                    error: error.message 
                });
                next(error);
            }
        });
    }

    private async authenticateSocket(socket: Socket): Promise<void> {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token || !this.securityService) {
            socket.data.authenticated = false;
            return;
        }

        try {
            const context = await this.securityService.verifyJWTToken(token);
            if (context) {
                socket.data.userId = context.userId;
                socket.data.authenticated = true;
                socket.data.permissions = context.permissions;
            }
        } catch (error) {
            socket.data.authenticated = false;
        }
    }

    private handleConnection(socket: Socket): void {
        logger.info('Client connected', { 
            socketId: socket.id,
            userId: socket.data.userId,
            authenticated: socket.data.authenticated 
        });

        // Track user connections
        if (socket.data.userId) {
            this.addUserConnection(socket.data.userId, socket);
        }

        // Set up event handlers
        socket.on('join_room', (data) => this.handleJoinRoom(socket, data));
        socket.on('leave_room', (data) => this.handleLeaveRoom(socket, data));
        socket.on('subscribe_notifications', () => this.handleSubscribeNotifications(socket));
        socket.on('unsubscribe_notifications', () => this.handleUnsubscribeNotifications(socket));
        socket.on('heartbeat', () => this.handleHeartbeat(socket));

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            logger.info('Client disconnected', { 
                socketId: socket.id,
                userId: socket.data.userId,
                reason 
            });

            if (socket.data.userId) {
                this.removeUserConnection(socket.data.userId, socket);
            }
        });

        // Send initial connection confirmation
        socket.emit('connected', {
            socketId: socket.id,
            authenticated: socket.data.authenticated,
            timestamp: new Date().toISOString()
        });
    }

    private addUserConnection(userId: string, socket: Socket): void {
        if (!this.connectedUsers.has(userId)) {
            this.connectedUsers.set(userId, []);
        }
        this.connectedUsers.get(userId)!.push(socket);
    }

    private removeUserConnection(userId: string, socket: Socket): void {
        const userSockets = this.connectedUsers.get(userId);
        if (userSockets) {
            const index = userSockets.indexOf(socket);
            if (index > -1) {
                userSockets.splice(index, 1);
            }
            
            if (userSockets.length === 0) {
                this.connectedUsers.delete(userId);
            }
        }
    }

    private handleJoinRoom(socket: Socket, data: { room: string; type?: string }): void {
        if (!socket.data.authenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        const { room, type } = data;
        
        // Validate room access based on type
        if (!this.canJoinRoom(socket, room, type)) {
            socket.emit('error', { message: 'Access denied to room' });
            return;
        }

        socket.join(room);
        socket.emit('room_joined', { room, timestamp: new Date().toISOString() });
        
        logger.debug('User joined room', {
            userId: socket.data.userId,
            room,
            type
        });
    }

    private handleLeaveRoom(socket: Socket, data: { room: string }): void {
        const { room } = data;
        
        socket.leave(room);
        socket.emit('room_left', { room, timestamp: new Date().toISOString() });
        
        logger.debug('User left room', {
            userId: socket.data.userId,
            room
        });
    }

    private handleSubscribeNotifications(socket: Socket): void {
        if (!socket.data.authenticated) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }

        const notificationRoom = `notifications:${socket.data.userId}`;
        socket.join(notificationRoom);
        socket.emit('notifications_subscribed', { timestamp: new Date().toISOString() });
        
        logger.debug('User subscribed to notifications', {
            userId: socket.data.userId
        });
    }

    private handleUnsubscribeNotifications(socket: Socket): void {
        const notificationRoom = `notifications:${socket.data.userId}`;
        socket.leave(notificationRoom);
        socket.emit('notifications_unsubscribed', { timestamp: new Date().toISOString() });
    }

    private handleHeartbeat(socket: Socket): void {
        socket.emit('heartbeat_ack', { timestamp: new Date().toISOString() });
    }

    private canJoinRoom(socket: Socket, room: string, type?: string): boolean {
        // Basic room access control
        if (room.startsWith('admin:') && !socket.data.permissions?.includes('admin')) {
            return false;
        }

        if (room.startsWith('private:') && !socket.data.authenticated) {
            return false;
        }

        // User can only join their own private rooms
        if (room.startsWith(`private:${socket.data.userId}:`)) {
            return true;
        }

        // Public rooms are accessible to authenticated users
        if (room.startsWith('public:') && socket.data.authenticated) {
            return true;
        }

        return true; // Default allow for now
    }

    // Public methods for broadcasting events

    // Send real-time notification to a specific user
    public notifyUser(userId: string, notification: {
        type: string;
        title: string;
        message: string;
        data?: Record<string, any>;
    }): void {
        const room = `notifications:${userId}`;
        this.io.to(room).emit('notification', {
            ...notification,
            timestamp: new Date().toISOString()
        });

        logger.debug('Notification sent to user', { userId, type: notification.type });
    }

    // Broadcast to all users in a room
    public broadcastToRoom(room: string, event: string, data: any): void {
        this.io.to(room).emit(event, {
            ...data,
            timestamp: new Date().toISOString()
        });

        logger.debug('Broadcasted to room', { room, event });
    }

    // Send T4G reward notification
    public notifyRewardReceived(userId: string, reward: {
        amount: number;
        reason: string;
        contributionId?: string;
    }): void {
        this.notifyUser(userId, {
            type: 'reward_received',
            title: '🎉 T4G Reward Received!',
            message: `You earned ${reward.amount} T4G for: ${reward.reason}`,
            data: reward
        });

        // Also broadcast to contribution room if applicable
        if (reward.contributionId) {
            this.broadcastToRoom(`contribution:${reward.contributionId}`, 'reward_distributed', reward);
        }
    }

    // Send contribution update
    public notifyContributionUpdate(contributionId: string, update: {
        type: string;
        status?: string;
        message: string;
        userId?: string;
    }): void {
        const room = `contribution:${contributionId}`;
        this.broadcastToRoom(room, 'contribution_updated', update);

        // Also notify the contributor directly
        if (update.userId) {
            this.notifyUser(update.userId, {
                type: 'contribution_update',
                title: 'Contribution Updated',
                message: update.message,
                data: { contributionId, ...update }
            });
        }
    }

    // Send real-time GitBook sync status
    public notifyGitBookSync(spaceId: string, status: {
        type: 'sync_started' | 'sync_completed' | 'sync_failed';
        message: string;
        details?: Record<string, any>;
    }): void {
        const room = `gitbook:${spaceId}`;
        this.broadcastToRoom(room, 'gitbook_sync', status);
    }

    // Send system-wide announcements
    public broadcastSystemAnnouncement(announcement: {
        type: 'info' | 'warning' | 'success' | 'error';
        title: string;
        message: string;
        priority?: 'low' | 'medium' | 'high' | 'critical';
    }): void {
        this.io.emit('system_announcement', {
            ...announcement,
            timestamp: new Date().toISOString()
        });

        logger.info('System announcement broadcasted', { 
            type: announcement.type,
            priority: announcement.priority 
        });
    }

    // Get connection statistics
    public getStats(): {
        totalConnections: number;
        authenticatedConnections: number;
        uniqueUsers: number;
        rooms: string[];
    } {
        const sockets = Array.from(this.io.sockets.sockets.values());
        const authenticatedSockets = sockets.filter(s => s.data.authenticated);
        const rooms = Array.from(this.io.sockets.adapter.rooms.keys());

        return {
            totalConnections: sockets.length,
            authenticatedConnections: authenticatedSockets.length,
            uniqueUsers: this.connectedUsers.size,
            rooms
        };
    }

    // Health check
    public async healthCheck(): Promise<{ healthy: boolean; connections: number; error?: string }> {
        try {
            const stats = this.getStats();
            
            return {
                healthy: true,
                connections: stats.totalConnections
            };
        } catch (error) {
            return {
                healthy: false,
                connections: 0,
                error: error.message
            };
        }
    }

    // Graceful shutdown
    public async close(): Promise<void> {
        try {
            this.io.close();
            this.connectedUsers.clear();
            
            logger.info('✅ WebSocket service closed gracefully');
        } catch (error) {
            logger.error('❌ Error closing WebSocket service:', error);
        }
    }
}