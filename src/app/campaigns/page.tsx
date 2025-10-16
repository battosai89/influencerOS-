"use client";

import { useState } from 'react';
import Link from 'next/link';
import useStore from '../../hooks/useStore';
import { Plus, Star, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Campaign } from '../../types';

const Campaigns: React.FC = () => {
    const { campaigns } = useStore() as { campaigns: Campaign[] };
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'planning'>('all');

    const filteredCampaigns = campaigns?.filter(campaign => {
        if (filter === 'all') return true;
        if (filter === 'active') return campaign.status === 'Live';
        const statusMap: { [key: string]: string } = {
            'planning': 'Planning',
            'completed': 'Completed'
        };
        return campaign.status === statusMap[filter];
    }) || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Live': return 'text-brand-success bg-brand-success/10';
            case 'Completed': return 'text-brand-text-secondary bg-brand-border';
            case 'Planning': return 'text-brand-warning bg-brand-warning/10';
            case 'Creator Outreach': return 'text-brand-accent bg-brand-accent/10';
            case 'Content Creation': return 'text-brand-primary bg-brand-primary/10';
            case 'Approval': return 'text-brand-warning bg-brand-warning/10';
            default: return 'text-brand-text-secondary bg-brand-border';
        }
    };

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Campaigns</h1>
                    <p className="text-brand-text-secondary">Manage your influencer marketing campaigns</p>
                </div>
                <Link
                    href="/campaigns/new"
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Campaign
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Campaigns</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{campaigns?.length || 0}</p>
                        </div>
                        <Star className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Active</p>
                            <p className="text-2xl font-bold text-brand-success">{campaigns?.filter(c => c.status === 'Live').length || 0}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-brand-success" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Budget</p>
                            <p className="text-2xl font-bold text-brand-text-primary">${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Avg. ROI</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length) : 0}%</p>
                        </div>
                        <Calendar className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'active', 'planning', 'completed'] as const).map((filterType) => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                            filter === filterType
                                ? 'bg-brand-primary text-white'
                                : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                        }`}
                    >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                ))}
            </div>

            {/* Campaigns List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                    <Link
                        key={campaign.id}
                        href={`/campaigns/${campaign.id}`}
                        className="bg-brand-surface futuristic-border rounded-xl p-6 hover:bg-brand-bg/50 hover:shadow-glow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-brand-text-primary">{campaign.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                {campaign.status}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <DollarSign className="w-4 h-4" />
                                <span>${campaign.budget.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <Users className="w-4 h-4" />
                                <span>{campaign.influencerIds?.length || 0} influencers</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <TrendingUp className="w-4 h-4" />
                                <span>ROI: {campaign.roi}%</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                    <Star className="w-16 h-16 mx-auto text-brand-border mb-4" />
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No campaigns found</h3>
                    <p className="text-brand-text-secondary mb-4">
                        {filter === 'all' 
                            ? "Get started by creating your first campaign"
                            : `No ${filter} campaigns found`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/campaigns/new"
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Create Campaign
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Campaigns;
