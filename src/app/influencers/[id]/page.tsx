"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import useStore from '../../../hooks/useStore';
import { ArrowLeft, ExternalLink, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Influencer } from '../../../types';

type InfluencerStatus = 'active' | 'inactive' | 'lead' | 'contacted' | 'negotiating' | 'signed';

interface InfluencerDetailsParams { id: string; }

const InfluencerDetailsPage: React.FC = () => {
    const params = useParams() as unknown as InfluencerDetailsParams;
    const { getInfluencer, updateInfluencerStatus, deleteInfluencer } = useStore();
    const router = useRouter();

    const [influencer, setInfluencer] = useState<Influencer | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (params.id) {
            const foundInfluencer = getInfluencer(params.id as string);
            setInfluencer(foundInfluencer || null);
        }
    }, [params.id, getInfluencer]);

    if (!influencer) {
        return <div className="flex justify-center items-center h-screen text-brand-text-primary">Influencer not found.</div>;
    }

    const handleStatusChange = (newStatus: InfluencerStatus) => {
        if (influencer) {
            updateInfluencerStatus(influencer.id, newStatus);
            setInfluencer(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const getStatusColor = (status: InfluencerStatus) => {
        switch (status) {
            case 'lead': return 'bg-blue-500/20 text-blue-400';
            case 'active': return 'bg-green-500/20 text-green-400';
            case 'inactive': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num;
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text-primary p-8">
            <button onClick={() => router.back()} className="flex items-center text-brand-text-secondary hover:text-brand-primary transition-colors mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>

            <div className="w-full">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-brand-bg flex items-center justify-center overflow-hidden border-2 border-brand-border flex-shrink-0">
                                {influencer.avatar ? (
                                    <Image
                                        src={influencer.avatar}
                                        alt={influencer.name}
                                        className="w-full h-full rounded-full object-cover"
                                        width={96}
                                        height={96}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-brand-text-primary">
                                        {influencer.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold text-brand-text-primary">{influencer.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(influencer.status)}`}>
                                        {influencer.status}
                                    </span>
                                </div>
                                <p className="text-brand-text-secondary mb-4">{influencer.platform} Influencer</p>
                                
                                {isEditing && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Status</label>
                                        <select
                                            value={influencer.status}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(e.target.value as InfluencerStatus)}
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        >
                                            <option value="lead">Lead</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-brand-surface futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{formatNumber(influencer.followers)}</p>
                            <p className="text-sm text-brand-text-secondary">Followers</p>
                        </div>
                        <div className="bg-brand-surface futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{influencer.engagementRate}%</p>
                            <p className="text-sm text-brand-text-secondary">Engagement</p>
                        </div>
                        <div className="bg-brand-surface futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{influencer.rating}/5</p>
                            <p className="text-sm text-brand-text-secondary">Rating</p>
                        </div>
                        <div className="bg-brand-surface futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{formatNumber(influencer.campaigns?.length || 0)}</p>
                            <p className="text-sm text-brand-text-secondary">Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-text-secondary">
                        <p><span className="font-medium text-brand-text-primary">Email:</span> {influencer.contact?.email || 'Not provided'}</p>
                        <p><span className="font-medium text-brand-text-primary">Phone:</span> {influencer.contact?.phone || 'Not provided'}</p>
                        <p><span className="font-medium text-brand-text-primary">Location:</span> {influencer.location}</p>
                        <p><span className="font-medium text-brand-text-primary">Niche:</span> {influencer.niche}</p>
                        <p><span className="font-medium text-brand-text-primary">Joined:</span> {influencer.joinedDate ? new Date(influencer.joinedDate).toLocaleDateString() : 'Not provided'}</p>
                        <p><span className="font-medium text-brand-text-primary">Last Active:</span> {influencer.lastActive ? new Date(influencer.lastActive).toLocaleDateString() : 'Not provided'}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-medium text-brand-text-primary mb-2">Social Links:</h4>
                        <div className="flex flex-wrap gap-3">
                            {influencer.socialLinks?.map((link, index) => (
                                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-primary hover:underline text-sm">
                                    <ExternalLink className="w-4 h-4" /> {link.platform}
                                </a>
                            )) || <p className="text-brand-text-secondary">No social links available</p>}
                        </div>
                    </div>
                </div>

                {/* Campaigns Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Campaigns</h3>
                    {influencer.campaigns && influencer.campaigns.length > 0 ? (
                        <div className="space-y-4">
                            {influencer.campaigns.map(campaign => (
                                <div key={campaign.id} className="bg-brand-bg border border-brand-border rounded-lg p-4">
                                    <h4 className="font-semibold text-brand-text-primary mb-1">{campaign.name}</h4>
                                    <p className="text-sm text-brand-text-secondary">Status: {campaign.status}</p>
                                    <p className="text-sm text-brand-text-secondary">Start: {new Date(campaign.startDate).toLocaleDateString()} - End: {new Date(campaign.endDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-brand-text-secondary">No campaigns found for this influencer.</p>
                    )}
                </div>

                {/* Contracts Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Contracts</h3>
                    {influencer.contracts && influencer.contracts.length > 0 ? (
                        <div className="space-y-4">
                            {influencer.contracts.map(contract => (
                                <div key={contract.id} className="bg-brand-bg border border-brand-border rounded-lg p-4">
                                    <h4 className="font-semibold text-brand-text-primary mb-1">{contract.name}</h4>
                                    <p className="text-sm text-brand-text-secondary">Status: {contract.status}</p>
                                    <p className="text-sm text-brand-text-secondary">Start: {new Date(contract.startDate).toLocaleDateString()} - End: {new Date(contract.endDate).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-brand-text-secondary">No contracts found for this influencer.</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 bg-brand-secondary text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-2" /> {isEditing ? 'Done Editing' : 'Edit Influencer'}
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this influencer?')) {
                                deleteInfluencer(influencer.id);
                                router.push('/influencers');
                            }
                        }}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Influencer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InfluencerDetailsPage;
