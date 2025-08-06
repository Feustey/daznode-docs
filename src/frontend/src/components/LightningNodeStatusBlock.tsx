import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Circle, 
    TrendingUp, 
    TrendingDown, 
    Activity, 
    DollarSign,
    Clock,
    AlertCircle,
    CheckCircle,
    RefreshCw,
    ExternalLink,
    BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useLightningNode } from '../hooks/useLightningNode';
import { formatSats, formatBTC, formatTimeAgo } from '../utils/formatters';

interface LightningNodeStatusBlockProps {
    nodeId: string;
    displayAlias?: string;
    showChart?: boolean;
    showMetrics?: boolean;
    refreshInterval?: number;
    className?: string;
}

const BlockContainer = styled(motion.div)`
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    border-radius: 16px;
    padding: 24px;
    color: #1f2937;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.2) 0%, 
            transparent 50%, 
            rgba(255, 255, 255, 0.1) 100%
        );
        pointer-events: none;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
`;

const NodeInfo = styled.div`
    flex: 1;
`;

const NodeAlias = styled.h3`
    margin: 0 0 8px 0;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const NodeId = styled.div`
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.8rem;
    opacity: 0.7;
    word-break: break-all;
    margin-bottom: 4px;
`;

const StatusIndicator = styled.div<{ status: 'online' | 'offline' | 'syncing' }>`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    
    color: ${props => {
        switch (props.status) {
            case 'online': return '#059669';
            case 'offline': return '#dc2626';
            case 'syncing': return '#d97706';
            default: return '#6b7280';
        }
    }};
`;

const StatusDot = styled(motion.div)<{ status: 'online' | 'offline' | 'syncing' }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
        switch (props.status) {
            case 'online': return '#10b981';
            case 'offline': return '#ef4444';
            case 'syncing': return '#f59e0b';
            default: return '#9ca3af';
        }
    }};
`;

const RefreshButton = styled(motion.button)`
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const MetricsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
`;

const MetricCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const MetricValue = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const MetricLabel = styled.div`
    font-size: 0.8rem;
    opacity: 0.8;
    font-weight: 500;
`;

const MetricChange = styled.span<{ positive?: boolean }>`
    font-size: 0.75rem;
    font-weight: 500;
    color: ${props => props.positive ? '#059669' : '#dc2626'};
    display: flex;
    align-items: center;
    gap: 2px;
`;

const ChartContainer = styled(motion.div)`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartTitle = styled.h4`
    margin: 0 0 16px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
`;

const ChannelsList = styled.div`
    max-height: 200px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
    }
`;

const ChannelItem = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 0.9rem;
`;

const ChannelInfo = styled.div`
    flex: 1;
`;

const ChannelAlias = styled.div`
    font-weight: 600;
    margin-bottom: 2px;
`;

const ChannelCapacity = styled.div`
    font-size: 0.8rem;
    opacity: 0.8;
`;

const ChannelStatus = styled.div<{ active: boolean }>`
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${props => props.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    color: ${props => props.active ? '#059669' : '#dc2626'};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;

const ActionButton = styled(motion.button)`
    flex: 1;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: #1f2937;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
    }
`;

const ErrorMessage = styled.div`
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 16px;
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

export const LightningNodeStatusBlock: React.FC<LightningNodeStatusBlockProps> = ({
    nodeId,
    displayAlias,
    showChart = true,
    showMetrics = true,
    refreshInterval = 30000,
    className
}) => {
    const [showChannels, setShowChannels] = useState(false);
    
    const {
        nodeInfo,
        channels,
        metrics,
        chartData,
        isLoading,
        error,
        lastUpdated,
        refetch,
        isRefetching
    } = useLightningNode(nodeId, { refreshInterval });

    const handleRefresh = () => {
        refetch();
    };

    const handleViewOnAmboss = () => {
        window.open(`https://amboss.space/node/${nodeId}`, '_blank');
    };

    const handleViewOn1ML = () => {
        window.open(`https://1ml.com/node/${nodeId}`, '_blank');
    };

    if (error) {
        return (
            <BlockContainer className={className}>
                <ErrorMessage>
                    <AlertCircle size={16} />
                    Failed to load node data: {error.message}
                </ErrorMessage>
                <ActionButton onClick={handleRefresh}>
                    <RefreshCw size={16} />
                    Retry
                </ActionButton>
            </BlockContainer>
        );
    }

    return (
        <BlockContainer
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Header>
                <NodeInfo>
                    <NodeAlias>
                        <Zap size={24} />
                        {displayAlias || nodeInfo?.alias || 'Lightning Node'}
                    </NodeAlias>
                    
                    <NodeId>
                        {nodeId}
                    </NodeId>
                    
                    {nodeInfo && (
                        <StatusIndicator status={nodeInfo.status}>
                            <StatusDot
                                status={nodeInfo.status}
                                animate={{
                                    scale: nodeInfo.status === 'online' ? [1, 1.2, 1] : 1,
                                    opacity: nodeInfo.status === 'syncing' ? [1, 0.5, 1] : 1
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: nodeInfo.status !== 'offline' ? Infinity : 0
                                }}
                            />
                            {nodeInfo.status === 'online' && <CheckCircle size={14} />}
                            {nodeInfo.status === 'syncing' ? 'Syncing...' : 
                             nodeInfo.status === 'online' ? 'Online' : 'Offline'}
                            {lastUpdated && (
                                <span style={{ marginLeft: '8px', fontSize: '0.8rem' }}>
                                    • {formatTimeAgo(lastUpdated)}
                                </span>
                            )}
                        </StatusIndicator>
                    )}
                </NodeInfo>
                
                <RefreshButton
                    onClick={handleRefresh}
                    disabled={isRefetching}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RefreshCw 
                        size={16} 
                        style={{
                            animation: isRefetching ? 'spin 1s linear infinite' : 'none'
                        }}
                    />
                </RefreshButton>
            </Header>

            {showMetrics && metrics && (
                <MetricsGrid>
                    <MetricCard
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <MetricValue>
                            <Circle size={16} />
                            {metrics.channelCount}
                            {metrics.channelCountChange !== undefined && (
                                <MetricChange positive={metrics.channelCountChange > 0}>
                                    {metrics.channelCountChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(metrics.channelCountChange)}
                                </MetricChange>
                            )}
                        </MetricValue>
                        <MetricLabel>Active Channels</MetricLabel>
                    </MetricCard>

                    <MetricCard
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <MetricValue>
                            <DollarSign size={16} />
                            {formatBTC(metrics.capacity)}
                            {metrics.capacityChange !== undefined && (
                                <MetricChange positive={metrics.capacityChange > 0}>
                                    {metrics.capacityChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(metrics.capacityChange).toFixed(2)}%
                                </MetricChange>
                            )}
                        </MetricValue>
                        <MetricLabel>Total Capacity</MetricLabel>
                    </MetricCard>

                    <MetricCard
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <MetricValue>
                            <Activity size={16} />
                            {metrics.uptime}%
                            {metrics.uptimeChange !== undefined && (
                                <MetricChange positive={metrics.uptimeChange > 0}>
                                    {metrics.uptimeChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(metrics.uptimeChange).toFixed(1)}%
                                </MetricChange>
                            )}
                        </MetricValue>
                        <MetricLabel>Uptime (30d)</MetricLabel>
                    </MetricCard>

                    <MetricCard
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <MetricValue>
                            <BarChart3 size={16} />
                            {formatSats(metrics.dailyRevenue)}
                            {metrics.revenueChange !== undefined && (
                                <MetricChange positive={metrics.revenueChange > 0}>
                                    {metrics.revenueChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {Math.abs(metrics.revenueChange).toFixed(1)}%
                                </MetricChange>
                            )}
                        </MetricValue>
                        <MetricLabel>Daily Revenue</MetricLabel>
                    </MetricCard>
                </MetricsGrid>
            )}

            {showChart && chartData && chartData.length > 0 && (
                <ChartContainer
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <ChartTitle>Revenue Trend (7 days)</ChartTitle>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#1f2937' }}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#1f2937' }}
                                    tickFormatter={(value) => formatSats(value, true)}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid rgba(31, 41, 55, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}
                                    formatter={(value: number) => [formatSats(value), 'Revenue']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1f2937"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#1f2937' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartContainer>
            )}

            {channels && channels.length > 0 && (
                <div>
                    <ActionButton
                        onClick={() => setShowChannels(!showChannels)}
                        style={{ marginBottom: '16px' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Circle size={16} />
                        View Channels ({channels.length})
                    </ActionButton>

                    <AnimatePresence>
                        {showChannels && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <ChannelsList>
                                    {channels.map((channel, index) => (
                                        <ChannelItem
                                            key={channel.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ChannelInfo>
                                                <ChannelAlias>
                                                    {channel.peerAlias || 'Unknown Node'}
                                                </ChannelAlias>
                                                <ChannelCapacity>
                                                    {formatSats(channel.capacity)} capacity •{' '}
                                                    {formatSats(channel.localBalance)} local
                                                </ChannelCapacity>
                                            </ChannelInfo>
                                            <ChannelStatus active={channel.active}>
                                                {channel.active ? 'Active' : 'Inactive'}
                                            </ChannelStatus>
                                        </ChannelItem>
                                    ))}
                                </ChannelsList>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <ActionButtons>
                <ActionButton
                    onClick={handleViewOnAmboss}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ExternalLink size={16} />
                    Amboss
                </ActionButton>
                
                <ActionButton
                    onClick={handleViewOn1ML}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ExternalLink size={16} />
                    1ML
                </ActionButton>
            </ActionButtons>
        </BlockContainer>
    );
};