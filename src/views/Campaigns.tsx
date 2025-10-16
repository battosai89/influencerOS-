import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { Campaign } from '../types';
import { Plus, Search, Download, LayoutGrid, KanbanSquare, Rows, Star, Users } from 'lucide-react';
import { NewCampaignModal } from '../components/CreationModals';
import { exportToCsv } from '../services/downloadUtils';
import EmptyState from '../components/EmptyState';
import Image from 'next/image';

type ViewMode = 'grid' | 'board' | 'table';

const ViewSwitcher: React.FC<{ activeView: ViewMode, setActiveView: (view: ViewMode) => void }> = ({ activeView, setActiveView }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-brand-bg rounded-full border border-brand-border">
            {(['grid', 'board', 'table'] as const).map(view => {
                const icons = { grid: <LayoutGrid />, board: <KanbanSquare />, table: <Rows /> };
                return (
                    <button 
                        key={view} 
                        onClick={() => setActiveView(view)} 
                        className={`p-2 rounded-full transition-colors ${activeView === view ? 'bg-brand-primary text-white' : 'text-brand-text-secondary hover:bg-brand-surface'}`}
                        aria-label={`Switch to ${view} view`}
                    >
                        {icons[view]}
                    </button>
                );
            })}
        </div>
    );
};

const CampaignGridCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { getBrand, getInfluencer } = useStore();
    const brand = getBrand(campaign.brandId);
    const influencers = campaign.influencerIds.map(id => getInfluencer(id)).filter(Boolean);

    const statusStyles: { [key: string]: string } = {
        'Planning': 'bg-gray-500/20 text-gray-400',
        'Creator Outreach': 'bg-blue-500/20 text-blue-400',
        'Content Creation': 'bg-purple-500/20 text-purple-400',
        'Approval': 'bg-yellow-500/20 text-yellow-400',
        'Live': 'bg-green-500/20 text-green-400',
        'Completed': 'bg-indigo-500/20 text-indigo-400',
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
        <Link href={`/campaigns/${campaign.id}`} className="block futuristic-border bg-brand-surface rounded-xl p-6 transition-all duration-300 hover:shadow-glow-sm">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">{campaign.name}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[campaign.status]}`}>
                    {campaign.status}
                </span>
            </div>
            {brand && <p className="text-sm text-brand-text-secondary mb-4">For {brand.name}</p>}
            
            <div className="mb-4">
                <div className="flex justify-between text-xs text-brand-text-secondary mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-brand-bg rounded-full h-2">
                    <div className="bg-gradient-to-r from-brand-insight to-brand-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-brand-text-secondary">
                <div>
                    <p className="font-semibold text-brand-text-primary">{campaign.roi}%</p>
                    <p>ROI</p>
                </div>
                <div>
                    <p className="font-semibold text-brand-text-primary">{campaign.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
                    <p>Budget</p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-text-secondary" />
                <div className="flex -space-x-2">
                    {influencers.slice(0, 3).map(i => i && <Image key={i.id} src={i.avatarUrl || '/default-avatar.jpg'} alt={i.name} width={24} height={24} className="w-6 h-6 rounded-full border-2 border-brand-surface" />)}
                </div>
                {influencers.length > 3 && <span className="text-xs text-brand-text-secondary">+{influencers.length - 3} more</span>}
            </div>
        </Link>
    );
};

const KanbanCampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    const { getBrand, getInfluencer } = useStore();
    const brand = getBrand(campaign.brandId);
    const influencers = campaign.influencerIds.map(id => getInfluencer(id)).filter(Boolean);

    const statusStyles: { [key: string]: string } = {
        'Planning': 'bg-gray-500/20 text-gray-400',
        'Creator Outreach': 'bg-blue-500/20 text-blue-400',
        'Content Creation': 'bg-purple-500/20 text-purple-400',
        'Approval': 'bg-yellow-500/20 text-yellow-400',
        'Live': 'bg-green-500/20 text-green-400',
        'Completed': 'bg-indigo-500/20 text-indigo-400',
    };

    return (
        <div className="block futuristic-border bg-brand-surface rounded-xl p-4 transition-all duration-300">
            <div className="flex flex-col text-center">
                 <div className="flex justify-center mb-2">
                     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[campaign.status]}`}>
                        {campaign.status}
                    </span>
                </div>
                <h4 className="font-bold text-brand-text-primary leading-tight">{campaign.name}</h4>
                {brand && <p className="text-sm text-brand-text-secondary mt-1">{brand.name}</p>}
                <div className="h-px bg-brand-border my-3"></div>
                <div className="text-xs text-brand-text-secondary text-left">
                    <p>Duration:</p>
                    <p className="font-semibold text-brand-text-primary">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
                 <div className="flex items-center justify-center mt-3">
                    {influencers.map(i => i && <Image key={i.id} src={i.avatarUrl || '/default-avatar.jpg'} alt={i.name} width={24} height={24} className="w-6 h-6 rounded-full border-2 border-brand-surface -ml-2 first:ml-0" title={i.name} />)}
                </div>
            </div>
        </div>
    );
};

const CampaignKanbanBoard: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
    const { updateCampaignStatus } = useStore();
    const statuses: Campaign['status'][] = ['Planning', 'Creator Outreach', 'Content Creation', 'Approval', 'Live', 'Completed'];
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, campaignId: string) => {
        setDraggedItemId(campaignId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', campaignId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-brand-border');
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-brand-border');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Campaign['status']) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-brand-border');
        const campaignId = e.dataTransfer.getData('text/plain');
        if (campaignId) {
            setTimeout(() => {
                updateCampaignStatus(campaignId, newStatus);
            }, 0);
        }
    };
    
    const handleDragEnd = () => {
        setDraggedItemId(null);
        document.querySelectorAll('.bg-brand-border').forEach(el => el.classList.remove('bg-brand-border'));
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
            {statuses.map(status => (
                <div 
                    key={status}
                    className="bg-brand-bg rounded-xl transition-colors duration-300 flex flex-col h-full"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status)}
                >
                    <div className="p-4 border-b border-brand-border sticky top-0 bg-brand-bg rounded-t-xl flex-shrink-0">
                        <h3 className="font-bold text-brand-text-primary text-center flex justify-center items-center">
                            <span className="truncate" title={status}>{status}</span>
                            <span className="ml-2 flex-shrink-0 text-sm font-semibold bg-brand-surface px-2 py-1 rounded-full">{campaigns.filter(c => c.status === status).length}</span>
                        </h3>
                    </div>
                    <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                        {campaigns.filter(c => c.status === status).map(campaign => (
                            <div 
                                key={campaign.id} 
                                draggable 
                                onDragStart={(e) => handleDragStart(e, campaign.id)}
                                onDragEnd={handleDragEnd}
                                className={`cursor-grab active:cursor-grabbing transition-opacity ${draggedItemId === campaign.id ? 'opacity-50' : 'opacity-100'} ${draggedItemId && draggedItemId !== campaign.id ? 'pointer-events-none' : ''}`}
                            >
                                <KanbanCampaignCard campaign={campaign} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const CampaignTable: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => {
    return (
        <div className="futuristic-border bg-brand-surface rounded-xl overflow-hidden">
            <table className="w-full text-left text-brand-text-secondary">
                <thead className="bg-brand-bg text-sm uppercase">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Budget</th>
                        <th className="p-4">ROI</th>
                        <th className="p-4">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map(campaign => (
                        <tr key={campaign.id} className="border-b border-brand-border hover:bg-brand-surface/50">
                            <td className="p-4"><Link href={`/campaigns/${campaign.id}`} className="font-semibold text-brand-text-primary hover:text-brand-primary">{campaign.name}</Link></td>
                            <td className="p-4">{campaign.status}</td>
                            <td className="p-4">{campaign.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            <td className="p-4">{campaign.roi}%</td>
                            <td className="p-4">{new Date(campaign.endDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Campaigns: React.FC = () => {
    const { campaigns } = useStore() as { campaigns: Campaign[] };
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [campaigns, searchTerm]);
    
    const renderContent = () => {
        if (filteredCampaigns.length === 0 && searchTerm === '') {
            return (
                <EmptyState
                    icon={<Star />}
                    title="No Projects Yet"
                    description="Get started by creating your first project. Track its status, budget, and performance all in one place."
                    cta={
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                            <Plus className="w-5 h-5" />
                            Create Your First Project
                        </button>
                    }
                />
            );
        }

        switch(viewMode) {
            case 'board': return <CampaignKanbanBoard campaigns={filteredCampaigns} />;
            case 'table': return <CampaignTable campaigns={filteredCampaigns} />;
            case 'grid':
            default: return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCampaigns.map(campaign => <CampaignGridCard key={campaign.id} campaign={campaign} />)}
                </div>
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Projects</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                        <input type="text" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-brand-surface border border-brand-border rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <button onClick={() => exportToCsv('campaigns.csv', filteredCampaigns as unknown as Record<string, unknown>[])} className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap">
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors whitespace-nowrap">
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-end mb-8">
                 <ViewSwitcher activeView={viewMode} setActiveView={setViewMode} />
            </div>

            <div key={`${viewMode}`} className="animate-page-enter">
                {renderContent()}
            </div>

            <NewCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Campaigns;
