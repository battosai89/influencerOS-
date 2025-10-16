import * as React from 'react';
import { useRef, useState } from 'react';
import useStore from '../hooks/useStore';
import { exportPageToPdf } from '../services/downloadUtils';
import { Download, Loader2 } from 'lucide-react';

// Simple DashboardCard component
const DashboardCard: React.FC<{ title: string; value: string | number; _changeType?: 'increase' | 'decrease' }> = ({ title, value, _changeType }) => (
  <div className="futuristic-border bg-brand-surface rounded-xl p-6">
    <h3 className="text-sm font-medium text-brand-text-secondary mb-2">{title}</h3>
    <p className="text-2xl font-bold text-brand-text-primary">{value}
      {_changeType && (
        <span className={`ml-2 text-sm font-medium ${
          _changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          {_changeType === 'increase' ? '▲' : '▼'}
        </span>
      )}
    </p>
  </div>
);

interface ChartData {
  label: string;
  value: number;
}

// Simple Chart component placeholder
const Chart: React.FC<{ type: string; title: string; data: ChartData[] }> = ({ title }) => (
  <div className="futuristic-border bg-brand-surface rounded-xl p-6">
    <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
    <div className="h-64 bg-brand-bg rounded-lg flex items-center justify-center">
      <p className="text-brand-text-secondary">Chart visualization would go here</p>
    </div>
  </div>
);

const Analytics: React.FC = () => {
    const { campaigns, transactions, influencers } = useStore();
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (reportRef.current) {
            setIsDownloading(true);
            await exportPageToPdf(reportRef.current, 'analytics_report.pdf');
            setIsDownloading(false);
        }
    };

    // Prepare data for charts
    const totalRevenue = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const activeCampaigns = campaigns.filter(c => new Date(c.endDate) >= new Date()).length;

    const campaignPerformanceData = campaigns.map(c => ({
        label: c.name,
        value: c.roi, // using ROI for value
        color: '#8B5CF6' // purple
    }));
    
    const influencerFollowerData = [...influencers]
        .sort((a, b) => b.followers - a.followers)
        .slice(0, 5)
        .map(i => ({
            label: i.name,
            value: i.followers,
            color: '#3B82F6' // blue
        }));

    const platformDistributionData = influencers.reduce((acc, influencer) => {
        const platform = influencer.platform;
        const existing = acc.find(item => item.label === platform);
        if (existing) {
            existing.value++;
        } else {
            // FIX: Implemented a mock fallback for when the API key is a placeholder.
            acc.push({ label: platform, value: 1, color: platform === 'Instagram' ? '#E1306C' : platform === 'TikTok' ? '#00F2EA' : '#FF0000' });
        }
        return acc;
    }, [] as {label: string, value: number, color: string}[]);

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
        color: '#10B981' // green
    }));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Analytics Overview</h1>
                 <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors disabled:bg-brand-secondary disabled:cursor-wait"
                >
                    {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {isDownloading ? 'Generating...' : 'Download PDF Report'}
                </button>
            </div>
            
            <div ref={reportRef} className="p-1 bg-brand-bg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <DashboardCard title="Total Revenue" value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                    <DashboardCard title="Total Expenses" value={totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                    <DashboardCard title="Net Profit" value={(totalRevenue - totalExpenses).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} _changeType={(totalRevenue - totalExpenses) >= 0 ? 'increase' : 'decrease'}/>
                    <DashboardCard title="Active Campaigns" value={activeCampaigns} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <Chart type="bar" title="Campaign ROI (%)" data={campaignPerformanceData} />
                    </div>
                     <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <Chart type="bar" title="Top 5 Influencers by Followers" data={influencerFollowerData} />
                    </div>
                     <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <Chart type="bar" title="Influencers per Platform" data={platformDistributionData} />
                    </div>
                    <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <Chart type="bar" title="Monthly Income" data={incomeData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
