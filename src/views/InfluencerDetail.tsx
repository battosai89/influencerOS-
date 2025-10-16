

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { InstagramIcon, TikTokIcon, YouTubeIcon } from '../components/icons/Icon';
import { FilePenLine, Send, Mail, Phone, Users } from 'lucide-react';

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
import * as d3 from 'd3';

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

const InfluencerDetail: React.FC = () => {
    const { influencerId } = useParams<{ influencerId: string }>();
    const { getInfluencer, campaigns, contracts, getBrand, logInfluencerInteraction } = useStore();
    const [activeTab, setActiveTab] = useState('overview');
    const [newLog, setNewLog] = useState({ type: 'Note' as 'Note' | 'Email' | 'Call' | 'Meeting', summary: '' });
    
    const influencer = getInfluencer(influencerId!);

    const relatedCampaigns = useMemo(() => {
        if (!influencer) return [];
        return campaigns.filter(c => c.influencerIds.includes(influencer.id));
    }, [campaigns, influencer]);
    
    const relatedContracts = useMemo(() => {
        if (!influencer) return [];
        return contracts.filter(c => c.influencerId === influencer.id);
    }, [contracts, influencer]);

    if (!influencer) {
        return <div className="text-center text-brand-text-primary">Influencer not found.</div>;
    }
    
    const statusColors: {[key: string]: string} = {
        active: 'bg-green-500/20 text-green-400',
        inactive: 'bg-yellow-500/20 text-yellow-400',
        lead: 'bg-blue-500/20 text-blue-400',
        contacted: 'bg-cyan-500/20 text-cyan-400',
        negotiating: 'bg-purple-500/20 text-purple-400',
        signed: 'bg-indigo-500/20 text-indigo-400',
    };
    
    const handleLogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLog.summary.trim()) {
            logInfluencerInteraction(influencer.id, {
                ...newLog,
                date: new Date().toISOString(),
            });
            setNewLog({ type: 'Note', summary: '' });
        }
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'campaigns':
                return (
                     <div className="space-y-4">
                        {relatedCampaigns.length > 0 ? relatedCampaigns.map(c => (
                            <Link key={c.id} href={`/campaigns/${c.id}`} className="block p-4 bg-brand-bg rounded-lg hover:bg-brand-bg/50 futuristic-border">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-brand-text-primary">{c.name}</p>
                                        <p className="text-sm text-brand-text-secondary">{getBrand(c.brandId)?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-brand-primary">{c.roi}% ROI</p>
                                        <p className="text-xs text-brand-text-secondary">{c.status}</p>
                                    </div>
                                </div>
                            </Link>
                        )) : <p className="text-brand-text-secondary text-center py-8">No campaigns found for this influencer.</p>}
                    </div>
                );
            case 'communications':
                {
                 const interactionIcons ={
                    Email: <Mail className="w-4 h-4 text-brand-primary" />,
                    Call: <Phone className="w-4 h-4 text-brand-primary" />,
                    Meeting: <Users className="w-4 h-4 text-brand-primary" />,
                    Note: <FilePenLine className="w-4 h-4 text-brand-primary" />,
                };
                return (
                    <div className="space-y-6">
                        <form onSubmit={handleLogSubmit} className="space-y-3">
                            <textarea
                                value={newLog.summary}
                                onChange={e => setNewLog(prev => ({...prev, summary: e.target.value}))}
                                placeholder="Log a new interaction or note..."
                                rows={3}
                                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                            <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                     {Object.keys(interactionIcons).map(type => (
                                         <button key={type} type="button" onClick={() => setNewLog(prev => ({...prev, type: type as 'Note' | 'Email' | 'Call' | 'Meeting'}))} className={`p-2 rounded-full ${newLog.type === type ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-bg'}`}>
                                             {interactionIcons[type as keyof typeof interactionIcons]}
                                         </button>
                                     ))}
                                 </div>
                                <button type="submit" className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent text-sm"><Send className="w-4 h-4" /> Log Interaction</button>
                            </div>
                        </form>
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                            {influencer.communicationLog.map(log => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <div className="w-8 h-8 flex-shrink-0 bg-brand-bg rounded-full flex items-center justify-center mt-1">{interactionIcons[log.type]}</div>
                                    <div>
                                        <p className="font-semibold text-brand-text-primary">{log.type} on {new Date(log.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-brand-text-secondary">{log.summary}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                }
            case 'contracts':
                return (
                     <div className="space-y-4">
                        {relatedContracts.length > 0 ? relatedContracts.map(c => (
                            <Link key={c.id} href={`/contracts/${c.id}`} className="block p-4 bg-brand-bg rounded-lg hover:bg-brand-bg/50 futuristic-border">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-brand-text-primary">{c.title}</p>
                                    <p className="text-sm text-brand-text-secondary">{c.status}</p>
                                </div>
                            </Link>
                        )) : <p className="text-brand-text-secondary text-center py-8">No contracts found.</p>}
                    </div>
                );
            case 'overview':
            default:
                {
                const avgRoi = d3.mean(relatedCampaigns, c => c.roi) || 0;
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <DashboardCard title="Followers" value={(influencer.followers / 1000000).toFixed(2) + 'M'} />
                            <DashboardCard title="Engagement Rate" value={`${influencer.engagementRate}%`} />
                            <DashboardCard title="Total Campaigns" value={relatedCampaigns.length} />
                            <DashboardCard title="Average ROI" value={`${avgRoi.toFixed(0)}%`} />
                        </div>
                        <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Notes</h2>
                            <p className="text-brand-text-secondary whitespace-pre-wrap">{influencer.notes || 'No notes available.'}</p>
                        </div>
                    </div>
                );
                }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8 p-6 futuristic-border bg-brand-surface rounded-xl">
                <div className="relative w-32 h-32 rounded-full border-4 border-brand-primary overflow-hidden">
                    <Image src={influencer.avatarUrl || '/default-avatar.jpg'} alt={influencer.name} className="rounded-full" fill />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold font-display text-brand-text-primary">{influencer.name}</h1>
                            <p className="text-lg text-brand-text-secondary mt-1">{influencer.platform} Creator</p>
                        </div>
                        <button className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
                            <FilePenLine className="w-5 h-5"/> Edit Profile
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <span className={`px-4 py-1 text-sm font-semibold rounded-full ${statusColors[influencer.status]}`}>
                            {influencer.status.charAt(0).toUpperCase() + influencer.status.slice(1)}
                        </span>
                         <div className="flex items-center gap-4 text-brand-text-secondary">
                            {influencer.instagram && <a href={influencer.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary"><InstagramIcon className="w-6 h-6" /></a>}
                            {influencer.tiktok && <a href={influencer.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary"><TikTokIcon className="w-6 h-6" /></a>}
                            {influencer.youtube && <a href={influencer.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary"><YouTubeIcon className="w-6 h-6" /></a>}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="border-b border-brand-border flex items-center gap-8">
                <TabButton name="overview" label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="campaigns" label="Campaign History" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="communications" label="Communications Log" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="contracts" label="Contracts" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="animate-page-enter">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default InfluencerDetail;