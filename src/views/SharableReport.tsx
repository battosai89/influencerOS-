import * as React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import useStore from '../hooks/useStore';
import { CampaignContent } from '../types';
import { InstagramIcon, TikTokIcon, YouTubeIcon } from '../components/icons/Icon';

const MetricCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const ContentCard: React.FC<{ content: CampaignContent }> = ({ content }) => {
     const platformIcons = {
        Instagram: <InstagramIcon className="w-4 h-4 text-gray-500" />,
        TikTok: <TikTokIcon className="w-4 h-4 text-gray-500" />,
        YouTube: <YouTubeIcon className="w-4 h-4 text-gray-500" />,
    };
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-sm text-gray-600">
                    {platformIcons[content.platform]}
                    <span>{content.platform} Post</span>
                </div>
                <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Post &rarr;</a>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center mt-4 pt-4 border-t">
                <div>
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-bold text-gray-800">{content.performance?.views.toLocaleString() || 'N/A'}</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500">Likes</p>
                    <p className="font-bold text-gray-800">{content.performance?.likes.toLocaleString() || 'N/A'}</p>
                </div>
                 <div>
                    <p className="text-xs text-gray-500">Comments</p>
                    <p className="font-bold text-gray-800">{content.performance?.comments.toLocaleString() || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

const SharableReport: React.FC = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { getCampaign, getBrand, getInfluencer, agencyName, agencyLogoUrl } = useStore();
    
    const campaign = getCampaign(campaignId!);

    if (!campaign) {
        return <div className="p-10 text-center text-gray-600">Campaign report not found or is no longer available.</div>;
    }
    
    const brand = getBrand(campaign.brandId);
    const influencers = campaign.influencerIds.map(id => getInfluencer(id)).filter(Boolean);
    
    const totalViews = campaign.content.reduce((sum, c) => sum + (c.performance?.views || 0), 0);
    const totalLikes = campaign.content.reduce((sum, c) => sum + (c.performance?.likes || 0), 0);
    const totalComments = campaign.content.reduce((sum, c) => sum + (c.performance?.comments || 0), 0);
    const totalEngagements = totalLikes + totalComments;
    const engagementRate = totalViews > 0 ? ((totalEngagements) / totalViews * 100).toFixed(2) : 0;
    
    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 p-4 sm:p-8 md:p-12 animate-page-enter">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start p-8 border-b border-gray-200">
                    <div>
                        {agencyLogoUrl ? (
                            <div className="relative h-12 w-auto mb-4 sm:mb-0">
                                <Image src={agencyLogoUrl} alt={`${agencyName} Logo`} className="h-12 w-auto" fill />
                            </div>
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-800">{agencyName}</h1>
                        )}
                        <p className="text-gray-500 mt-2">Campaign Performance Report</p>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
                        <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
                        <p className="text-gray-500">For {brand?.name}</p>
                         <p className="text-sm text-gray-500 mt-1">
                            {new Date(campaign.startDate).toLocaleDateString()} &ndash; {new Date(campaign.endDate).toLocaleDateString()}
                        </p>
                    </div>
                </header>

                <main className="p-8 space-y-10">
                    {/* Key Metrics */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Key Performance Indicators</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Total Views" value={totalViews.toLocaleString()} />
                            <MetricCard title="Total Engagements" value={totalEngagements.toLocaleString()} />
                            <MetricCard title="Engagement Rate" value={`${engagementRate}%`} />
                            <MetricCard title="Return on Investment" value={`${campaign.roi}%`} />
                        </div>
                    </section>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Influencers */}
                        <section className="lg:col-span-1">
                             <h3 className="text-xl font-bold text-gray-800 mb-4">Collaborating Creators</h3>
                             <div className="space-y-3">
                                {influencers.map(i => i && (
                                    <div key={i.id} className="flex items-center gap-4 p-3 bg-gray-50 border rounded-lg">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                            <Image src={i.avatarUrl || '/default-avatar.jpg'} alt={i.name} className="rounded-full" fill />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{i.name}</p>
                                            <p className="text-sm text-gray-500">{i.platform}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Content Pieces */}
                        <section className="lg:col-span-2">
                             <h3 className="text-xl font-bold text-gray-800 mb-4">Content Showcase</h3>
                             <div className="space-y-4">
                                {campaign.content.map(c => <ContentCard key={c.id} content={c} />)}
                            </div>
                        </section>
                    </div>
                </main>
                <footer className="text-center p-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400">Report generated by InfluencerOS on {new Date().toLocaleDateString()}</p>
                </footer>
            </div>
        </div>
    );
};

export default SharableReport;