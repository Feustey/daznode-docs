import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
    Calculator, 
    DollarSign, 
    TrendingUp, 
    Zap, 
    Settings,
    Info,
    BarChart3,
    PieChart,
    Target
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { useCommunityBenchmarks } from '../hooks/useCommunityBenchmarks';

const calculatorSchema = z.object({
    initialInvestment: z.number().min(100).max(100000),
    monthlyElectricity: z.number().min(5).max(500),
    setupType: z.enum(['dazbox_standard', 'dazbox_pro', 'custom_build', 'raspberry_pi']),
    region: z.enum(['north_america', 'europe', 'asia', 'other']),
    channelStrategy: z.enum(['conservative', 'balanced', 'aggressive']),
    expectedUptime: z.number().min(80).max(100),
    averageChannelSize: z.number().min(100000).max(10000000),
    targetChannels: z.number().min(5).max(100)
});

type CalculatorForm = z.infer<typeof calculatorSchema>;

interface ROICalculatorBlockProps {
    className?: string;
    showBenchmarks?: boolean;
    showAdvanced?: boolean;
}

const BlockContainer = styled(motion.div)`
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    
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
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Title = styled.h3`
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const Input = styled.input`
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 1rem;
    backdrop-filter: blur(5px);
    
    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.2);
    }
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    &[type=number] {
        -moz-appearance: textfield;
    }
`;

const Select = styled.select`
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 1rem;
    backdrop-filter: blur(5px);
    cursor: pointer;
    
    &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.2);
    }
    
    option {
        background: #1f2937;
        color: white;
    }
`;

const ResultsContainer = styled(motion.div)`
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
`;

const ResultCard = styled(motion.div)`
    text-align: center;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ResultValue = styled.div`
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff;
`;

const ResultLabel = styled.div`
    font-size: 0.9rem;
    opacity: 0.8;
    font-weight: 500;
`;

const ChartContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
`;

const ChartBox = styled.div`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartTitle = styled.h4`
    margin: 0 0 16px 0;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
`;

const BenchmarkSection = styled(motion.div)`
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const BenchmarkTitle = styled.h4`
    margin: 0 0 16px 0;
    font-size: 1.1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const BenchmarkGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
`;

const BenchmarkCard = styled.div`
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BenchmarkValue = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 4px;
`;

const BenchmarkLabel = styled.div`
    font-size: 0.8rem;
    opacity: 0.8;
`;

const InfoTooltip = styled.div`
    position: relative;
    display: inline-block;
    cursor: help;
    
    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
    }
`;

const SETUP_CONFIGS = {
    dazbox_standard: { cost: 800, power: 15, efficiency: 0.85 },
    dazbox_pro: { cost: 1200, power: 25, efficiency: 0.92 },
    custom_build: { cost: 600, power: 20, efficiency: 0.8 },
    raspberry_pi: { cost: 200, power: 5, efficiency: 0.7 }
};

const REGION_MULTIPLIERS = {
    north_america: { electricity: 0.12, competition: 1.0 },
    europe: { electricity: 0.25, competition: 1.1 },
    asia: { electricity: 0.08, competition: 0.9 },
    other: { electricity: 0.15, competition: 1.0 }
};

const STRATEGY_MULTIPLIERS = {
    conservative: { risk: 0.7, reward: 0.8 },
    balanced: { risk: 1.0, reward: 1.0 },
    aggressive: { risk: 1.4, reward: 1.3 }
};

const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

export const ROICalculatorBlock: React.FC<ROICalculatorBlockProps> = ({
    className,
    showBenchmarks = true,
    showAdvanced = false
}) => {
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(showAdvanced);
    const { benchmarks, isLoading: benchmarksLoading } = useCommunityBenchmarks();

    const {
        register,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CalculatorForm>({
        resolver: zodResolver(calculatorSchema),
        defaultValues: {
            initialInvestment: 1000,
            monthlyElectricity: 50,
            setupType: 'dazbox_standard',
            region: 'north_america',
            channelStrategy: 'balanced',
            expectedUptime: 95,
            averageChannelSize: 1000000,
            targetChannels: 20
        }
    });

    const formData = watch();

    const calculations = useMemo(() => {
        const setupConfig = SETUP_CONFIGS[formData.setupType];
        const regionMultiplier = REGION_MULTIPLIERS[formData.region];
        const strategyMultiplier = STRATEGY_MULTIPLIERS[formData.channelStrategy];

        // Base costs
        const totalInitialCost = formData.initialInvestment + setupConfig.cost;
        const monthlyElectricityCost = formData.monthlyElectricity * regionMultiplier.electricity;
        const annualElectricityCost = monthlyElectricityCost * 12;

        // Revenue calculations
        const baseRevenuePerChannel = 50000; // sats per month base
        const revenueAdjustment = setupConfig.efficiency * 
                                 strategyMultiplier.reward * 
                                 regionMultiplier.competition * 
                                 (formData.expectedUptime / 100);
        
        const monthlyRevenueSats = formData.targetChannels * baseRevenuePerChannel * revenueAdjustment;
        const monthlyRevenueUSD = monthlyRevenueSats * 0.0003; // $30k BTC price approximation
        const annualRevenueUSD = monthlyRevenueUSD * 12;

        // Profitability metrics
        const annualProfit = annualRevenueUSD - annualElectricityCost;
        const roi = (annualProfit / totalInitialCost) * 100;
        const breakEvenMonths = totalInitialCost / (monthlyRevenueUSD - monthlyElectricityCost);
        const yearTwoProfit = annualProfit - (totalInitialCost / 24); // Amortize over 2 years

        return {
            totalInitialCost,
            monthlyRevenueSats,
            monthlyRevenueUSD,
            annualRevenueUSD,
            monthlyElectricityCost,
            annualElectricityCost,
            annualProfit,
            roi,
            breakEvenMonths,
            yearTwoProfit,
            revenueAdjustment
        };
    }, [formData]);

    const costBreakdown = useMemo(() => {
        const setupCost = SETUP_CONFIGS[formData.setupType].cost;
        return [
            { name: 'Hardware Setup', value: setupCost, percentage: (setupCost / calculations.totalInitialCost) * 100 },
            { name: 'Initial Capital', value: formData.initialInvestment, percentage: (formData.initialInvestment / calculations.totalInitialCost) * 100 }
        ];
    }, [formData, calculations]);

    const monthlyProjection = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        return months.map(month => ({
            month: `M${month}`,
            revenue: calculations.monthlyRevenueUSD * month,
            costs: (calculations.monthlyElectricityCost * month) + calculations.totalInitialCost,
            profit: (calculations.monthlyRevenueUSD * month) - (calculations.monthlyElectricityCost * month) - calculations.totalInitialCost
        }));
    }, [calculations]);

    return (
        <BlockContainer
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Header>
                <Title>
                    <Calculator size={24} />
                    Lightning ROI Calculator
                </Title>
                <motion.button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '8px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Settings size={16} />
                </motion.button>
            </Header>

            <FormGrid>
                <FormGroup>
                    <Label>
                        <DollarSign size={14} />
                        Initial Investment ($)
                        <InfoTooltip data-tooltip="Total budget for getting started">
                            <Info size={12} />
                        </InfoTooltip>
                    </Label>
                    <Input
                        type="number"
                        min="100"
                        max="100000"
                        step="100"
                        {...register('initialInvestment', { valueAsNumber: true })}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>
                        <Zap size={14} />
                        Monthly Electricity ($)
                    </Label>
                    <Input
                        type="number"
                        min="5"
                        max="500"
                        step="5"
                        {...register('monthlyElectricity', { valueAsNumber: true })}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Setup Type</Label>
                    <Select {...register('setupType')}>
                        <option value="dazbox_standard">DazBox Standard</option>
                        <option value="dazbox_pro">DazBox Pro</option>
                        <option value="custom_build">Custom Build</option>
                        <option value="raspberry_pi">Raspberry Pi</option>
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Region</Label>
                    <Select {...register('region')}>
                        <option value="north_america">North America</option>
                        <option value="europe">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="other">Other</option>
                    </Select>
                </FormGroup>

                {showAdvancedSettings && (
                    <>
                        <FormGroup>
                            <Label>
                                <Target size={14} />
                                Channel Strategy
                            </Label>
                            <Select {...register('channelStrategy')}>
                                <option value="conservative">Conservative</option>
                                <option value="balanced">Balanced</option>
                                <option value="aggressive">Aggressive</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Expected Uptime (%)</Label>
                            <Input
                                type="number"
                                min="80"
                                max="100"
                                step="1"
                                {...register('expectedUptime', { valueAsNumber: true })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Average Channel Size (sats)</Label>
                            <Input
                                type="number"
                                min="100000"
                                max="10000000"
                                step="100000"
                                {...register('averageChannelSize', { valueAsNumber: true })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Target Channels</Label>
                            <Input
                                type="number"
                                min="5"
                                max="100"
                                step="1"
                                {...register('targetChannels', { valueAsNumber: true })}
                            />
                        </FormGroup>
                    </>
                )}
            </FormGrid>

            <ResultsContainer
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <ResultsGrid>
                    <ResultCard>
                        <ResultValue style={{ color: calculations.roi > 0 ? '#10b981' : '#ef4444' }}>
                            {calculations.roi.toFixed(1)}%
                        </ResultValue>
                        <ResultLabel>Annual ROI</ResultLabel>
                    </ResultCard>

                    <ResultCard>
                        <ResultValue>
                            {formatCurrency(calculations.monthlyRevenueUSD)}
                        </ResultValue>
                        <ResultLabel>Monthly Revenue</ResultLabel>
                    </ResultCard>

                    <ResultCard>
                        <ResultValue>
                            {formatCurrency(calculations.annualProfit)}
                        </ResultValue>
                        <ResultLabel>Annual Profit</ResultLabel>
                    </ResultCard>

                    <ResultCard>
                        <ResultValue>
                            {calculations.breakEvenMonths > 0 ? `${calculations.breakEvenMonths.toFixed(1)}` : '∞'}
                        </ResultValue>
                        <ResultLabel>Break-even (months)</ResultLabel>
                    </ResultCard>
                </ResultsGrid>

                <ChartContainer>
                    <ChartBox>
                        <ChartTitle>Cost Breakdown</ChartTitle>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <RechartsPieChart data={costBreakdown} cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                                        {costBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </RechartsPieChart>
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartBox>

                    <ChartBox>
                        <ChartTitle>12-Month Projection</ChartTitle>
                        <div style={{ height: '200px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyProjection.slice(0, 6)}>
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: 'white' }}
                                    />
                                    <YAxis 
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'white' }}
                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="profit" fill="#fbbf24" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartBox>
                </ChartContainer>
            </ResultsContainer>

            {showBenchmarks && benchmarks && !benchmarksLoading && (
                <BenchmarkSection
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <BenchmarkTitle>
                        <BarChart3 size={16} />
                        Community Benchmarks
                    </BenchmarkTitle>
                    
                    <BenchmarkGrid>
                        <BenchmarkCard>
                            <BenchmarkValue>{benchmarks.avgROI}%</BenchmarkValue>
                            <BenchmarkLabel>Average ROI</BenchmarkLabel>
                        </BenchmarkCard>
                        
                        <BenchmarkCard>
                            <BenchmarkValue>{formatCurrency(benchmarks.avgMonthlyRevenue)}</BenchmarkValue>
                            <BenchmarkLabel>Avg Monthly Revenue</BenchmarkLabel>
                        </BenchmarkCard>
                        
                        <BenchmarkCard>
                            <BenchmarkValue>{benchmarks.avgBreakEven}mo</BenchmarkValue>
                            <BenchmarkLabel>Avg Break-even</BenchmarkLabel>
                        </BenchmarkCard>
                        
                        <BenchmarkCard>
                            <BenchmarkValue>{benchmarks.avgChannels}</BenchmarkValue>
                            <BenchmarkLabel>Avg Channels</BenchmarkLabel>
                        </BenchmarkCard>
                    </BenchmarkGrid>
                </BenchmarkSection>
            )}
        </BlockContainer>
    );
};