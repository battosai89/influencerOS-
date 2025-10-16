
import * as React from 'react';
import { useState, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { CampaignContent, Campaign } from '../types';
import { exportPageToPdf } from '../services/downloadUtils';
import { Download, Loader2, Share2, Copy, Check } from 'lucide-react';
import Image from 'next/image';

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

const ContentCard: React.FC<{ content: CampaignContent }> = ({ content }) => (
    <div className="bg-brand-bg p-4 rounded-lg">
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline block truncate">{content.url}</a>
        <div className="flex justify-between text-sm text-brand-text-secondary mt-2">
            <span>Views: {content.performance?.views.toLocaleString() || 'N/A'}</span>
            <span>Likes: {content.performance?.likes.toLocaleString() || 'N/A'}</span>
            <span>Comments: {content.performance?.comments.toLocaleString() || 'N/A'}</span>
        </div>
    </div>
);

const TabButton: React.FC<{ name: string; label: string; activeTab: string; setActiveTab: (name: string) => void; }> = ({ name, label, activeTab, setActiveTab }) => {
    const isActive = activeTab === name;
    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`py-3 px-1 text-lg font-semibold transition-colors relative ${isActive ? 'text-brand-text-primary' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
        >
            {label}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
        </button>
    );
};

const FinancialsTab: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { transactions, getInfluencer } = useStore();

    const financialSummary = useMemo(() => {
        if (!campaign) return { totalSpend: 0, influencerPayouts: 0, totalRevenue: 0, profit: 0, profitMargin: 0, remainingBudget: 0, campaignTransactions: [] };

        const campaignTransactions = transactions.filter(t => t.campaignId === campaign.id);

        const totalSpend = campaignTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const influencerPayouts = campaignTransactions
            .filter(t => t.type === 'expense' && t.category === 'Influencer Payouts')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalRevenue = campaignTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const profit = totalRevenue - totalSpend;
        const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
        const remainingBudget = campaign.budget - totalSpend;

        return { totalSpend, influencerPayouts, totalRevenue, profit, profitMargin, remainingBudget, campaignTransactions };
    }, [campaign, transactions]);

    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Budget" value={formatCurrency(campaign.budget)} />
                <DashboardCard title="Total Spend" value={formatCurrency(financialSummary.totalSpend)} />
                <DashboardCard title="Remaining Budget" value={formatCurrency(financialSummary.remainingBudget)} _changeType={financialSummary.remainingBudget >= 0 ? 'increase' : 'decrease'} />
                <DashboardCard title="Profit Margin" value={`${financialSummary.profitMargin.toFixed(1)}%`} _changeType={financialSummary.profitMargin >= 0 ? 'increase' : 'decrease'}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 futuristic-border bg-brand-surface rounded-xl p-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Transaction History</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {financialSummary.campaignTransactions.length > 0 ? financialSummary.campaignTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                            <div key={t.id} className="bg-brand-bg p-3 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold text-brand-text-primary">{t.description}</p>
                                    <p className="text-xs text-brand-text-secondary">
                                        {new Date(t.date).toLocaleDateString()}
                                        {t.influencerId && ` - Payout to ${getInfluencer(t.influencerId)?.name}`}
                                    </p>
                                </div>
                                <p className={`font-bold ${t.type === 'income' ? 'text-brand-success' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                            </div>
                        )) : (
                            <p className="text-brand-text-secondary text-center py-8">No transactions logged for this campaign yet.</p>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                     <DashboardCard title="Total Revenue" value={formatCurrency(financialSummary.totalRevenue)} />
                     <DashboardCard title="Influencer Payouts" value={formatCurrency(financialSummary.influencerPayouts)} />
                     <DashboardCard title="Net Profit" value={formatCurrency(financialSummary.profit)} _changeType={financialSummary.profit >= 0 ? 'increase' : 'decrease'} />
                </div>
            </div>
        </div>
    );
};


const CampaignDetail: React.FC = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { getCampaign, getBrand, getInfluencer } = useStore();
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    const campaign = getCampaign(campaignId!);

    if (!campaign) {
        return <div className="text-center text-brand-text-primary">Campaign not found.</div>;
    }

    const sharableLink = `${window.location.origin}${window.location.pathname.replace(window.location.hash, '')}#/report/campaign/${campaign.id}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(sharableLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleDownload = async () => {
        if (reportRef.current) {
            setIsDownloading(true);
            await exportPageToPdf(reportRef.current, `campaign_report_${campaign.name.replace(/\s/g, '_')}.pdf`);
            setIsDownloading(false);
        }
    };

    const brand = getBrand(campaign.brandId);
    const influencers = campaign.influencerIds.map(id => getInfluencer(id)).filter(Boolean);
    const isActive = new Date(campaign.endDate) >= new Date();
    
    const totalViews = campaign.content.reduce((sum, c) => sum + (c.performance?.views || 0), 0);
    const totalLikes = campaign.content.reduce((sum, c) => sum + (c.performance?.likes || 0), 0);
    const totalComments = campaign.content.reduce((sum, c) => sum + (c.performance?.comments || 0), 0);
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : 0;
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'financials':
                return <FinancialsTab campaign={campaign} />;
            case 'content':
                return (
                    <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <h2 className="text-xl font-bold text-brand-text-primary mb-4">Content Pieces</h2>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {campaign.content.map(c => <ContentCard key={c.id} content={c} />)}
                        </div>
                    </div>
                );
            case 'influencers':
                return (
                    <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                        <h2 className="text-xl font-bold text-brand-text-primary mb-4">Participating Influencers</h2>
                         <div className="space-y-3">
                            {influencers.map(i => i && (
                                <Link key={i.id} href={`/influencers/${i.id}`} className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg hover:bg-brand-bg/50">
                                    <Image src={i.avatarUrl || '/default-avatar.jpg'} alt={i.name} width={40} height={40} className="w-10 h-10 rounded-full"/>
                                    <div>
                                        <p className="font-semibold text-brand-text-primary">{i.name}</p>
                                        <p className="text-sm text-brand-text-secondary">{i.platform}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard title="Total Views" value={totalViews.toLocaleString()} />
                        <DashboardCard title="Total Likes" value={totalLikes.toLocaleString()} />
                        <DashboardCard title="Total Comments" value={totalComments.toLocaleString()} />
                        <DashboardCard title="Engagement Rate" value={`${engagementRate}%`} />
                    </div>
                );
        }
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                     <h1 className="text-4xl font-bold font-display text-brand-text-primary">{campaign.name}</h1>
                      <p className="text-lg text-brand-text-secondary mt-1">
                        Campaign Report
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setShowShareLink(prev => !prev)}
                            className="flex items-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Report
                        </button>
                        {showShareLink && (
                             <div className="absolute top-full right-0 mt-2 w-80 bg-brand-surface futuristic-border rounded-xl shadow-lg p-4 z-10 animate-page-enter">
                                <p className="text-sm font-semibold text-brand-text-primary mb-2">Sharable Client Link</p>
                                <div className="flex items-center gap-2">
                                    <input type="text" readOnly value={sharableLink} className="w-full bg-brand-bg border border-brand-border rounded-md px-2 py-1 text-xs text-brand-text-secondary focus:outline-none"/>
                                    <button onClick={handleCopyLink} className="p-2 bg-brand-primary rounded-md text-white hover:bg-brand-accent">
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors disabled:bg-brand-secondary disabled:cursor-wait"
                    >
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </div>
            
            <div className="futuristic-border p-6 bg-brand-surface rounded-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text-primary">{campaign.name}</h2>
                        <p className="text-md text-brand-text-secondary mt-1">
                            For <Link href={`/brands/${brand?.id}`} className="text-brand-primary hover:underline">{brand?.name}</Link>
                        </p>
                    </div>
                     <div className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${isActive ? 'bg-green-500/20 text-green-400 border-green-700' : 'bg-gray-500/20 text-gray-400 border-gray-600'}`}>
                        {isActive ? 'Active' : 'Finished'}
                    </div>
                </div>
                <p className="text-brand-text-secondary mt-2">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
            </div>
            
             <div className="border-b border-brand-border flex items-center gap-8">
                <TabButton name="overview" label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="financials" label="Financials" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="content" label="Content" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="influencers" label="Influencers" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div ref={reportRef} className="p-1 bg-brand-bg">
                <div className="animate-page-enter">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CampaignDetail;