"use client";

import { useState, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { TrendingUp, Users, Target, DollarSign, Download, Building2 } from 'lucide-react';;
import { ArrowUp, ArrowDown } from '@phosphor-icons/react';
import Image from 'next/image';


type TimeRange = '7d' | '30d' | '90d' | '1y';

const AnalyticsPage: React.FC = () => {
    const { campaigns, influencers, transactions, getBrand } = useStore();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
    

    const { analyticsData, chartData } = useMemo(() => {
        // Filter data based on time range
        const now = new Date();
        let startDate: Date;

        switch (timeRange) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
        }

        const filteredCampaigns = campaigns.filter(c => new Date(c.startDate) >= startDate);
        const filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);

        // Calculate metrics
        const totalRevenue = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalSpent = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const activeCampaigns = filteredCampaigns.filter(c => c.status === 'Live').length;
        const completedCampaigns = filteredCampaigns.filter(c => c.status === 'Completed').length;
        const avgROI = filteredCampaigns.length > 0 ? filteredCampaigns.reduce((sum, c) => sum + c.roi, 0) / filteredCampaigns.length : 0;

        // Generate chart data for revenue trends
        const revenueChartData = [];
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayRevenue = filteredTransactions
                .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            revenueChartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dayRevenue,
                expenses: filteredTransactions
                    .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
            });
        }

        return {
            analyticsData: {
                totalRevenue,
                totalSpent,
                netProfit: totalRevenue - totalSpent,
                activeCampaigns,
                completedCampaigns,
                avgROI,
                totalInfluencers: influencers.length,
                conversionRate: 3.2
            },
            chartData: revenueChartData
        };
    }, [campaigns, influencers, transactions, timeRange]);

    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

    interface MetricCardProps {
        title: string;
        value: string | number;
        change?: string;
        icon: React.ReactNode;
        trend?: 'up' | 'down';
    }

    const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => (
        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-brand-text-secondary">{title}</p>
                    <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
                    {change && (
                        <div className={`flex items-center gap-1 mt-1 ${
                            trend === 'up' ? 'text-brand-success' : trend === 'down' ? 'text-red-500' : 'text-brand-text-secondary'
                        }`}>
                            {trend === 'up' ? <ArrowUp size={16} /> : trend === 'down' ? <ArrowDown size={16} /> : null}
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                    )}
                </div>
                {icon}
            </div>
        </div>
    );


    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Analytics</h1>
                    <p className="text-brand-text-secondary">Comprehensive performance insights and metrics</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        className="px-3 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last 1 year</option>
                    </select>
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(analyticsData.totalRevenue)}
                    change="+12.5% from last month"
                    icon={<DollarSign className="w-8 h-8 text-brand-success" />}
                    trend="up"
                />
                <MetricCard
                    title="Active Campaigns"
                    value={analyticsData.activeCampaigns}
                    change={`${analyticsData.completedCampaigns} completed`}
                    icon={<Target className="w-8 h-8 text-brand-primary" />}
                />
                <MetricCard
                    title="Average ROI"
                    value={`${analyticsData.avgROI.toFixed(1)}%`}
                    change="+5.2% improvement"
                    icon={<TrendingUp className="w-8 h-8 text-brand-insight" />}
                    trend="up"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={`${analyticsData.conversionRate}%`}
                    change="+0.8% from last month"
                    icon={<Users className="w-8 h-8 text-brand-warning" />}
                    trend="up"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Revenue vs Expenses Trend</h3>
                    <div className="h-64">
                        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
                            {/* Grid lines */}
                            {[0, 1, 2, 3, 4].map(i => (
                                <g key={i}>
                                    <line
                                        x1="40"
                                        y1={40 + i * 40}
                                        x2="360"
                                        y2={40 + i * 40}
                                        stroke="var(--color-border)"
                                        strokeWidth="0.5"
                                        opacity="0.3"
                                    />
                                    <text
                                        x="30"
                                        y={45 + i * 40}
                                        textAnchor="middle"
                                        className="text-xs fill-current"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        {((4 - i) * 25000).toLocaleString()}
                                    </text>
                                </g>
                            ))}

                            {/* Revenue area */}
                            <path
                                d={`M 40,200 ${chartData.map((d, i) =>
                                    `L ${40 + i * (320 / (chartData.length - 1))},${200 - (d.revenue / 25000) * 160}`
                                ).join(' ')} L 360,200 Z`}
                                fill="var(--color-success)"
                                fillOpacity="0.2"
                                stroke="var(--color-success)"
                                strokeWidth="2"
                            />

                            {/* Expense area */}
                            <path
                                d={`M 40,200 ${chartData.map((d, i) =>
                                    `L ${40 + i * (320 / (chartData.length - 1))},${200 - (d.expenses / 25000) * 160}`
                                ).join(' ')} L 360,200 Z`}
                                fill="var(--color-warning)"
                                fillOpacity="0.2"
                                stroke="var(--color-warning)"
                                strokeWidth="2"
                            />

                            {/* Chart labels */}
                            <text x="200" y="190" textAnchor="middle" className="text-xs fill-current" style={{ color: 'var(--color-text-secondary)' }}>
                                Last {timeRange.replace('d', ' days').replace('y', ' year')}
                            </text>
                        </svg>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-brand-success rounded-full"></div>
                            <span className="text-sm text-brand-text-secondary">Revenue</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-brand-warning rounded-full"></div>
                            <span className="text-sm text-brand-text-secondary">Expenses</span>
                        </div>
                    </div>
                </div>

                {/* Campaign Performance */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Campaign Performance</h3>
                    <div className="space-y-4">
                        {campaigns.slice(0, 5).map(campaign => (
                            <div key={campaign.id} className="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-brand-text-primary text-sm">{campaign.name}</p>
                                    <p className="text-xs text-brand-text-secondary">{getBrand(campaign.brandId)?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-brand-text-primary">{campaign.roi}% ROI</p>
                                    <div className="w-20 h-2 bg-brand-border rounded-full mt-1">
                                        <div
                                            className="h-2 bg-brand-primary rounded-full"
                                            style={{ width: `${Math.min(campaign.roi / 3, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Analytics Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Influencers */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Top Performing Influencers</h3>
                    <div className="space-y-3">
                        {influencers
                            .sort((a, b) => b.engagementRate - a.engagementRate)
                            .slice(0, 5)
                            .map(influencer => (
                                <div key={influencer.id} className="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-brand-primary/20 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold text-brand-primary">
                                                {influencer.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-brand-text-primary text-sm">{influencer.name}</p>
                                            <p className="text-xs text-brand-text-secondary">{influencer.followers.toLocaleString()} followers</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-brand-success">{influencer.engagementRate}%</p>
                                        <p className="text-xs text-brand-text-secondary">Engagement</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Revenue by Brand */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Revenue by Brand</h3>
                    <div className="space-y-3">
                        {Object.entries(
                            transactions
                                .filter(t => t.type === 'income' && t.brandId)
                                .reduce((acc, t) => {
                                    acc[t.brandId!] = (acc[t.brandId!] || 0) + t.amount;
                                    return acc;
                                }, {} as Record<string, number>)
                        )
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5)
                            .map(([brandId, revenue]) => {
                                const brand = getBrand(brandId);
                                return (
                                    <div key={brandId} className="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center">
                                                {brand?.logoUrl ? (
                                                    <Image src={brand.logoUrl} alt={brand.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                                                ) : (
                                                    <Building2 className="w-4 h-4 text-brand-text-secondary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-brand-text-primary text-sm">{brand?.name}</p>
                                                <p className="text-xs text-brand-text-secondary">Active client</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-brand-success">{formatCurrency(revenue)}</p>
                                            <p className="text-xs text-brand-text-secondary">Revenue</p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Summary Insights */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-insight/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-brand-bg/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-brand-success" />
                            <span className="font-medium text-brand-text-primary">Revenue Growth</span>
                        </div>
                        <p className="text-sm text-brand-text-secondary">
                            Revenue has increased by 15.3% compared to the previous period, with consistent growth across all major clients.
                        </p>
                    </div>
                    <div className="bg-brand-bg/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-brand-primary" />
                            <span className="font-medium text-brand-text-primary">Influencer Performance</span>
                        </div>
                        <p className="text-sm text-brand-text-secondary">
                            Top 20% of influencers are generating 80% of engagement, indicating effective talent selection.
                        </p>
                    </div>
                    <div className="bg-brand-bg/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-brand-warning" />
                            <span className="font-medium text-brand-text-primary">Campaign Efficiency</span>
                        </div>
                        <p className="text-sm text-brand-text-secondary">
                            Average campaign ROI is {analyticsData.avgROI.toFixed(1)}%, exceeding industry benchmarks by 23%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;