import * as React from 'react';
import Link from 'next/link';
import useStore from '../../hooks/useStore';
import { Campaign } from '../../types';

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const statusStyles: { [key: string]: string } = {
        'Planning': 'bg-gray-100 text-gray-600',
        'Creator Outreach': 'bg-blue-100 text-blue-600',
        'Content Creation': 'bg-purple-100 text-purple-600',
        'Approval': 'bg-yellow-100 text-yellow-600',
        'Live': 'bg-green-100 text-green-600',
        'Completed': 'bg-indigo-100 text-indigo-600',
    };
    
     const calculateProgress = (start: string, end: string) => {
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();
        const now = new Date().getTime();
        if (now < startDate) return 0;
        if (now > endDate) return 100;
        return ((now - startDate) / (endDate - startDate)) * 100;
    };
    const progress = calculateProgress(campaign.startDate, campaign.endDate);

    return (
        <Link href={`/portal/campaigns/${campaign.id}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[campaign.status]}`}>
                    {campaign.status}
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </p>
            <div className="mt-4">
                 <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
             <div className="flex justify-end mt-4">
                <span className="text-sm font-semibold text-purple-600">View Details &rarr;</span>
            </div>
        </Link>
    );
};

const ClientDashboard: React.FC = () => {
    const { loggedInClient, campaigns } = useStore();

    if (!loggedInClient) return null;

    const clientCampaigns = campaigns.filter(c => c.brandId === loggedInClient.id);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {loggedInClient.name}</h1>
            <p className="mt-2 text-lg text-gray-600">Here&apos;s an overview of your current and past campaigns.</p>

            <div className="mt-8 space-y-6">
                {clientCampaigns.length > 0 ? (
                    clientCampaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700">No Campaigns Yet</h3>
                        <p className="text-gray-500 mt-2">Your campaigns will appear here once they are created.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;