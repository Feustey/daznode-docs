import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Trophy, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useT4GRewards } from '../hooks/useT4GRewards';
import { formatNumber, formatCurrency } from '../utils/formatters';
import { Confetti } from 'react-confetti';

interface T4GRewardsWidgetProps {
    userId: string;
    pageId?: string;
    spaceId?: string;
    className?: string;
    showConfetti?: boolean;
}

const WidgetContainer = styled(motion.div)`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%, 
            rgba(255, 255, 255, 0.05) 100%
        );
        pointer-events: none;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const BalanceSection = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const Balance = styled(motion.div)`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const BalanceLabel = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
`;

const StatCard = styled(motion.div)`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 4px;
`;

const StatLabel = styled.div`
    font-size: 0.8rem;
    opacity: 0.8;
`;

const RecentActivity = styled.div`
    margin-top: 20px;
`;

const ActivityHeader = styled.button`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
    opacity: 0.9;
    
    &:hover {
        opacity: 1;
    }
`;

const ActivityList = styled(motion.div)`
    margin-top: 12px;
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

const ActivityItem = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 0.9rem;
`;

const ActivityAmount = styled.span<{ positive?: boolean }>`
    font-weight: 600;
    color: ${props => props.positive ? '#4ade80' : '#f87171'};
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
`;

const ActionButton = styled(motion.button)`
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    backdrop-filter: blur(5px);
    
    &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LoadingSpinner = styled(motion.div)`
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    margin: 20px auto;
`;

export const T4GRewardsWidget: React.FC<T4GRewardsWidgetProps> = ({
    userId,
    pageId,
    spaceId,
    className,
    showConfetti = false
}) => {
    const [showActivity, setShowActivity] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    
    const {
        userStats,
        recentRewards,
        isLoading,
        error,
        refetch,
        withdrawRewards,
        isWithdrawing
    } = useT4GRewards(userId);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [refetch]);

    if (isLoading) {
        return (
            <WidgetContainer className={className}>
                <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </WidgetContainer>
        );
    }

    if (error) {
        return (
            <WidgetContainer className={className}>
                <div style={{ textAlign: 'center', color: '#f87171' }}>
                    Error loading T4G data. Please try again.
                </div>
            </WidgetContainer>
        );
    }

    const handleWithdraw = async () => {
        if (userStats.pendingRewards > 0) {
            try {
                await withdrawRewards();
                setShowWithdrawModal(false);
            } catch (error) {
                console.error('Withdrawal failed:', error);
            }
        }
    };

    return (
        <>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}
            
            <WidgetContainer
                className={className}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Header>
                    <Title>
                        <Coins size={24} />
                        T4G Rewards
                    </Title>
                    <Trophy size={20} style={{ opacity: 0.7 }} />
                </Header>

                <BalanceSection>
                    <Balance
                        key={userStats.totalEarned}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                    >
                        {formatNumber(userStats.totalEarned)}
                    </Balance>
                    <BalanceLabel>Total T4G Earned</BalanceLabel>
                </BalanceSection>

                <StatsGrid>
                    <StatCard
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <StatValue>{formatNumber(userStats.pendingRewards)}</StatValue>
                        <StatLabel>Pending Rewards</StatLabel>
                    </StatCard>

                    <StatCard
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <StatValue>{userStats.totalContributions}</StatValue>
                        <StatLabel>Contributions</StatLabel>
                    </StatCard>

                    <StatCard
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <StatValue>#{Math.floor(userStats.reputationScore * 10)}</StatValue>
                        <StatLabel>Community Rank</StatLabel>
                    </StatCard>

                    <StatCard
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <StatValue>
                            {formatCurrency(Object.values(userStats.monthlyEarnings).slice(-1)[0] || 0)}
                        </StatValue>
                        <StatLabel>This Month</StatLabel>
                    </StatCard>
                </StatsGrid>

                <RecentActivity>
                    <ActivityHeader onClick={() => setShowActivity(!showActivity)}>
                        <span>Recent Activity</span>
                        {showActivity ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </ActivityHeader>

                    <AnimatePresence>
                        {showActivity && (
                            <ActivityList
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {recentRewards.slice(0, 5).map((reward, index) => (
                                    <ActivityItem
                                        key={reward.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                                {reward.reason}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} />
                                                {new Date(reward.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <ActivityAmount positive>
                                            +{formatNumber(reward.amount)} T4G
                                        </ActivityAmount>
                                    </ActivityItem>
                                ))}
                                
                                {recentRewards.length === 0 && (
                                    <div style={{ textAlign: 'center', opacity: 0.6, padding: '20px' }}>
                                        No recent activity
                                    </div>
                                )}
                            </ActivityList>
                        )}
                    </AnimatePresence>
                </RecentActivity>

                <ActionButtons>
                    <ActionButton
                        onClick={() => window.open('/t4g/history', '_blank')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <TrendingUp size={16} style={{ marginRight: '8px', display: 'inline' }} />
                        View History
                    </ActionButton>
                    
                    <ActionButton
                        onClick={handleWithdraw}
                        disabled={userStats.pendingRewards === 0 || isWithdrawing}
                        whileHover={{ scale: userStats.pendingRewards > 0 ? 1.02 : 1 }}
                        whileTap={{ scale: userStats.pendingRewards > 0 ? 0.98 : 1 }}
                    >
                        {isWithdrawing ? (
                            <LoadingSpinner
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ width: '16px', height: '16px', margin: '0 8px 0 0', display: 'inline-block' }}
                            />
                        ) : (
                            <Coins size={16} style={{ marginRight: '8px', display: 'inline' }} />
                        )}
                        Withdraw
                    </ActionButton>
                </ActionButtons>

                {/* Domain Breakdown */}
                {Object.keys(userStats.domainBreakdown).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ marginTop: '20px' }}
                    >
                        <div style={{ fontSize: '0.9rem', marginBottom: '12px', opacity: 0.8 }}>
                            Domain Expertise
                        </div>
                        {Object.entries(userStats.domainBreakdown).map(([domain, amount], index) => (
                            <motion.div
                                key={domain}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <span style={{ textTransform: 'capitalize' }}>{domain}</span>
                                <span style={{ fontWeight: '600' }}>{formatNumber(amount)} T4G</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </WidgetContainer>
        </>
    );
};