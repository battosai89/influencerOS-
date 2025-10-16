import * as React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../../hooks/useStore';
import { ContentPiece } from '../../types';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';
import Image from 'next/image';

const MetricCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
);

const ContentRow: React.FC<{ content: ContentPiece }> = ({ content }) => {
    const { getInfluencer } = useStore();
    const influencer = getInfluencer(content.influencerId);

    const statusConfig: { [key in ContentPiece['status']]: { text: string; icon: React.ReactNode } } = {
        'Submitted': { text: 'Submitted', icon: <Clock className="w-4 h-4 text-gray-500" /> },
        'Agency Review': { text: 'In Review', icon: <Clock className="w-4 h-4 text-purple-500" /> },
        'Client Review': { text: 'Awaiting Your Approval', icon: <AlertCircle className="w-4 h-4 text-yellow-500" /> },
        'Revisions Requested': { text: 'Revisions Requested', icon: <XCircle className="w-4 h-4 text-red-500" /> },
        'Approved': { text: 'Approved', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    };

    const isActionable = content.status === 'Client Review';

    return (
        <div className={`p-4 rounded-lg flex items-center justify-between gap-4 ${isActionable ? 'bg-yellow-50 border border-yellow-300' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center gap-4">
                 <Image src={content.thumbnailUrl} alt={content.title} width={96} height={64} className="w-24 h-16 object-cover rounded-md" />
                 <div>
                    <p className="font-bold text-gray-800">{content.title}</p>
                    <p className="text-sm text-gray-500">by {influencer?.name}</p>
                 </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
                {statusConfig[content.status].icon}
                <span>{statusConfig[content.status].text}</span>
            </div>
            <div>
                {isActionable ? (
                    <Link href={`/portal/content/${content.id}`} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
                        Review & Approve
                    </Link>
                ) : (
                     <Link href={`/portal/content/${content.id}`} className="bg-gray-200 text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm">
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
};

const ClientCampaignDetail: React.FC = () => {
    const { campaignId } = useParams<{ campaignId: string }>();
    const { getCampaign, contentPieces } = useStore();
    
    const campaign = getCampaign(campaignId!);

    if (!campaign) {
        return <div className="text-center text-gray-600">Campaign not found.</div>;
    }
    
    const campaignContent = contentPieces.filter(c => c.campaignId === campaign.id);
    const totalViews = campaign.content.reduce((sum, c) => sum + (c.performance?.views || 0), 0);
    const totalLikes = campaign.content.reduce((sum, c) => sum + (c.performance?.likes || 0), 0);
    const totalComments = campaign.content.reduce((sum, c) => sum + (c.performance?.comments || 0), 0);
    const engagementRate = totalViews > 0 ? (((totalLikes + totalComments) / totalViews) * 100).toFixed(2) : '0';

    return (
        <div className="space-y-8">
            <div>
                <Link href="/portal/dashboard" className="text-sm font-semibold text-purple-600 hover:underline">&larr; Back to Dashboard</Link>
                <h1 className="text-4xl font-bold text-gray-800 mt-2">{campaign.name}</h1>
                <p className="text-lg text-gray-500">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
            </div>

             <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Live Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Views" value={totalViews.toLocaleString()} />
                    <MetricCard title="Total Likes" value={totalLikes.toLocaleString()} />
                    <MetricCard title="Total Comments" value={totalComments.toLocaleString()} />
                    <MetricCard title="Engagement Rate" value={`${engagementRate}%`} />
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Content for Approval</h3>
                 <div className="space-y-4">
                    {campaignContent.length > 0 ? (
                        campaignContent
                            .sort((a) => (a.status === 'Client Review' ? -1 : 1)) // Bring actionable items to the top
                            .map(content => <ContentRow key={content.id} content={content} />)
                    ) : (
                        <p className="text-gray-500">No content has been submitted for this campaign yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ClientCampaignDetail;