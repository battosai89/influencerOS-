import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import useStore from '../hooks/useStore';
import { exportPageToPdf } from '../services/downloadUtils';
import notificationService from '../services/notificationService';
import DashboardCard from '../components/analytics/DashboardCard';
import Chart, { ChartDataPoint } from '../components/analytics/Chart';
import CustomReportManager from '../components/analytics/CustomReportManager';
import ConfirmationModal from '../components/ConfirmationModal';
import ToastNotification from '../components/ToastNotification';
import { Download, Loader2, TrendingUp, TrendingDown, Users, DollarSign, Plus, Settings } from 'lucide-react';
import { CustomReport, Notification } from '../types';

interface AnalyticsData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitChangeType: 'increase' | 'decrease';
  activeCampaigns: number;
  campaignPerformanceData: ChartDataPoint[];
  influencerFollowerData: ChartDataPoint[];
  platformDistributionData: ChartDataPoint[];
  incomeData: ChartDataPoint[];
  loading: boolean;
  error: string | null;
}

const Analytics: React.FC = () => {
    const { campaigns, transactions, influencers } = useStore();
    const reportRef = useRef<HTMLDivElement>(null);

    // State management
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitChangeType: 'increase',
        activeCampaigns: 0,
        campaignPerformanceData: [],
        influencerFollowerData: [],
        platformDistributionData: [],
        incomeData: [],
        loading: false,
        error: null
    });

    const [isDownloading, setIsDownloading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [customReports, setCustomReports] = useState<CustomReport[]>([]);
    const [isDeleteReportModalOpen, setIsDeleteReportModalOpen] = useState(false);
    const [reportToDelete, setReportToDelete] = useState<CustomReport | null>(null);

    // Subscribe to notifications
    useEffect(() => {
        const unsubscribe = notificationService.subscribe(setNotifications);
        return unsubscribe;
    }, []);

    // Load analytics data with error handling
    const loadAnalyticsData = async () => {
        try {
            setAnalyticsData(prev => ({ ...prev, loading: true, error: null }));

            // Simulate API call delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            const totalRevenue = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
            const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
            const netProfit = totalRevenue - totalExpenses;
            const activeCampaigns = campaigns.filter(c => new Date(c.endDate) >= new Date()).length;

            const campaignPerformanceData = campaigns.map(c => ({
                label: c.name,
                value: c.roi,
                color: '#8B5CF6'
            }));

            const influencerFollowerData = [...influencers]
                .sort((a, b) => b.followers - a.followers)
                .slice(0, 5)
                .map(i => ({
                    label: i.name,
                    value: i.followers,
                    color: '#3B82F6'
                }));

            const platformDistributionData = influencers.reduce((acc, influencer) => {
                const platform = influencer.platform;
                const existing = acc.find(item => item.label === platform);
                if (existing) {
                    existing.value++;
                } else {
                    acc.push({
                        label: platform,
                        value: 1,
                        color: platform === 'Instagram' ? '#E1306C' : platform === 'TikTok' ? '#00F2EA' : '#FF0000'
                    });
                }
                return acc;
            }, [] as ChartDataPoint[]);

            const monthlyFinancials = transactions.reduce((acc, t) => {
                const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!acc[month]) {
                    acc[month] = { income: 0, expense: 0 };
                }
                acc[month][t.type] += t.amount;
                return acc;
            }, {} as {[key: string]: {income: number, expense: number}});

            const incomeData = Object.keys(monthlyFinancials).map(month => ({
                label: month,
                value: monthlyFinancials[month].income,
                color: '#10B981'
            }));

            setAnalyticsData({
                totalRevenue,
                totalExpenses,
                netProfit,
                profitChangeType: netProfit >= 0 ? 'increase' : 'decrease',
                activeCampaigns,
                campaignPerformanceData,
                influencerFollowerData,
                platformDistributionData,
                incomeData,
                loading: false,
                error: null
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';
            setAnalyticsData(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
            notificationService.error(errorMessage);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadAnalyticsData();
    }, [campaigns, transactions, influencers]);

    // Custom report management functions
    const handleCreateReport = async (reportData: Omit<CustomReport, 'id' | 'createdAt' | 'lastRun'>) => {
        try {
            const newReport: CustomReport = {
                ...reportData,
                id: `report_${Date.now()}`,
                createdAt: new Date().toISOString(),
                lastRun: undefined
            };

            setCustomReports(prev => [...prev, newReport]);
            notificationService.success(`Custom report "${newReport.name}" created successfully`);
        } catch (error) {
            notificationService.error('Failed to create custom report');
            throw error;
        }
    };

    const handleUpdateReport = async (id: string, updates: Partial<CustomReport>) => {
        try {
            setCustomReports(prev => prev.map(report =>
                report.id === id ? { ...report, ...updates } : report
            ));
            notificationService.success('Custom report updated successfully');
        } catch (error) {
            notificationService.error('Failed to update custom report');
            throw error;
        }
    };

    const handleDeleteReport = async (id: string) => {
        try {
            setCustomReports(prev => prev.filter(report => report.id !== id));
            notificationService.success('Custom report deleted successfully');
        } catch (error) {
            notificationService.error('Failed to delete custom report');
            throw error;
        }
    };

    const handleRunReport = async (id: string) => {
        try {
            // Update last run timestamp
            setCustomReports(prev => prev.map(report =>
                report.id === id
                    ? { ...report, lastRun: new Date().toISOString() }
                    : report
            ));

            // Simulate report execution
            await new Promise(resolve => setTimeout(resolve, 1000));
            notificationService.success('Report executed successfully');
        } catch (error) {
            notificationService.error('Failed to run report');
            throw error;
        }
    };

    const handleDownload = async () => {
        if (reportRef.current) {
            try {
                setIsDownloading(true);
                await exportPageToPdf(reportRef.current, 'analytics_report.pdf');
                notificationService.success('PDF report downloaded successfully');
            } catch (error) {
                notificationService.error('Failed to download PDF report');
            } finally {
                setIsDownloading(false);
            }
        }
    };

    const handleNavigateToReportBuilder = () => {
        // For now, show a notification that this feature is coming soon
        // In a real app, this would navigate to '/analytics/reports/builder'
        notificationService.info('Advanced report builder feature coming soon!');
    };

    const handleRemoveNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Header with enhanced navigation */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-brand-text-primary">Analytics Overview</h1>
                    <button
                        onClick={handleNavigateToReportBuilder}
                        className="flex items-center gap-2 bg-brand-secondary text-brand-text-primary font-semibold py-2 px-3 rounded-lg hover:bg-brand-border transition-colors"
                        title="Advanced Report Builder"
                    >
                        <Settings className="w-4 h-4" />
                        Report Builder
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || analyticsData.loading}
                        className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors disabled:bg-brand-secondary disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            {/* Error State */}
            {analyticsData.error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400">
                        <span>⚠</span>
                        <span className="font-medium">Error loading analytics data</span>
                    </div>
                    <p className="text-red-300 text-sm mt-1">{analyticsData.error}</p>
                    <button
                        onClick={loadAnalyticsData}
                        className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Main Analytics Content */}
            <div ref={reportRef} className="space-y-8">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        title="Total Revenue"
                        value={analyticsData.loading ? 'Loading...' : `$${analyticsData.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="w-5 h-5" />}
                        loading={analyticsData.loading}
                    />
                    <DashboardCard
                        title="Total Expenses"
                        value={analyticsData.loading ? 'Loading...' : `$${analyticsData.totalExpenses.toLocaleString()}`}
                        icon={<TrendingDown className="w-5 h-5" />}
                        loading={analyticsData.loading}
                    />
                    <DashboardCard
                        title="Net Profit"
                        value={analyticsData.loading ? 'Loading...' : `$${analyticsData.netProfit.toLocaleString()}`}
                        changeType={analyticsData.profitChangeType}
                        changeValue={analyticsData.loading ? undefined : `${Math.abs(analyticsData.netProfit / Math.max(analyticsData.totalRevenue, 1) * 100).toFixed(1)}%`}
                        icon={<TrendingUp className="w-5 h-5" />}
                        loading={analyticsData.loading}
                    />
                    <DashboardCard
                        title="Active Campaigns"
                        value={analyticsData.loading ? 'Loading...' : analyticsData.activeCampaigns}
                        icon={<Users className="w-5 h-5" />}
                        loading={analyticsData.loading}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Chart
                        type="bar"
                        title="Campaign Performance (ROI %)"
                        data={analyticsData.campaignPerformanceData}
                        loading={analyticsData.loading}
                        error={analyticsData.error || undefined}
                    />
                    <Chart
                        type="bar"
                        title="Top 5 Influencers by Followers"
                        data={analyticsData.influencerFollowerData}
                        loading={analyticsData.loading}
                        error={analyticsData.error || undefined}
                    />
                    <Chart
                        type="pie"
                        title="Platform Distribution"
                        data={analyticsData.platformDistributionData}
                        loading={analyticsData.loading}
                        error={analyticsData.error || undefined}
                    />
                    <Chart
                        type="area"
                        title="Monthly Income Trend"
                        data={analyticsData.incomeData}
                        loading={analyticsData.loading}
                        error={analyticsData.error || undefined}
                    />
                </div>

                {/* Custom Reports Section */}
                <CustomReportManager
                    reports={customReports}
                    onCreateReport={handleCreateReport}
                    onUpdateReport={handleUpdateReport}
                    onDeleteReport={(id) => {
                        const report = customReports.find(r => r.id === id);
                        if (report) {
                            setReportToDelete(report);
                            setIsDeleteReportModalOpen(true);
                        }
                    }}
                    onRunReport={handleRunReport}
                />
            </div>

            {/* Toast Notifications */}
            <ToastNotification
                notifications={notifications}
                removeNotification={handleRemoveNotification}
            />

            {/* Delete Report Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteReportModalOpen}
                onClose={() => {
                    setIsDeleteReportModalOpen(false);
                    setReportToDelete(null);
                }}
                onConfirm={() => {
                    if (reportToDelete) {
                        handleDeleteReport(reportToDelete.id);
                        setIsDeleteReportModalOpen(false);
                        setReportToDelete(null);
                    }
                }}
                title="Delete Custom Report"
                message={`Are you sure you want to delete "${reportToDelete?.name}"? This action cannot be undone and all associated data will be lost.`}
                confirmText="Delete Report"
                cancelText="Keep Report"
                variant="danger"
                showIcon={true}
            />
        </div>
    );
};

export default Analytics;
