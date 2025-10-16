import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';

import useStore from '../hooks/useStore';
import InfluencerCard from '../components/InfluencerCard';
import BrandCard from '../components/BrandCard';
import { Plus, Search, Download, LayoutGrid, KanbanSquare, Rows, Briefcase } from 'lucide-react';
import { NewClientModal } from '../components/CreationModals';
import { exportToCsv } from '../services/downloadUtils';
import { Influencer } from '../types';
import Link from 'next/link';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

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

const InfluencerTable: React.FC<{ influencers: Influencer[] }> = ({ influencers }) => {
    return (
        <div className="futuristic-border bg-brand-surface rounded-xl overflow-hidden">
            <table className="w-full text-left text-brand-text-secondary">
                <thead className="bg-brand-bg text-sm uppercase">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Platform</th>
                        <th className="p-4">Followers</th>
                        <th className="p-4">Engagement</th>
                        <th className="p-4">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {influencers.map(influencer => (
                        <tr key={influencer.id} className="border-b border-brand-border hover:bg-brand-surface/50">
                            <td className="p-4"><Link href={`/influencers/${influencer.id}`}><a className="font-semibold text-brand-text-primary hover:text-brand-primary">{influencer.name}</a></Link></td>
                            <td className="p-4">{influencer.platform}</td>
                            <td className="p-4">{influencer.followers.toLocaleString()}</td>
                            <td className="p-4">{influencer.engagementRate.toFixed(1)}%</td>
                            <td className="p-4 capitalize">{influencer.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const InfluencerKanbanBoard: React.FC<{ influencers: Influencer[] }> = ({ influencers }) => {
    const { updateInfluencerStatus } = useStore();
    const statuses: Influencer['status'][] = ['lead', 'contacted', 'negotiating', 'signed', 'active', 'inactive'];
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, influencerId: string) => {
        setDraggedItemId(influencerId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', influencerId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-brand-border');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-brand-border');
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Influencer['status']) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-brand-border');
        const influencerId = e.dataTransfer.getData('text/plain');
        if (influencerId) {
            setTimeout(() => {
                updateInfluencerStatus(influencerId, newStatus);
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
                        <h3 className="font-bold text-brand-text-primary capitalize text-center">{status} ({influencers.filter(i => i.status === status).length})</h3>
                    </div>
                    <div className="p-4 space-y-4 flex-grow overflow-y-auto">
                        {influencers.filter(i => i.status === status).map(influencer => (
                            <div 
                                key={influencer.id} 
                                draggable 
                                onDragStart={(e) => handleDragStart(e, influencer.id)}
                                onDragEnd={handleDragEnd}
                                className={`cursor-grab active:cursor-grabbing transition-opacity ${draggedItemId === influencer.id ? 'opacity-50' : 'opacity-100'} ${draggedItemId && draggedItemId !== influencer.id ? 'pointer-events-none' : ''}`}
                            >
                                <InfluencerCard influencer={influencer} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


const Clients: React.FC = () => {
    const { influencers, brands } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'influencers' | 'brands'>('influencers');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const influencersTabRef = useRef<HTMLButtonElement>(null);
    const brandsTabRef = useRef<HTMLButtonElement>(null);
    const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [activeTab, viewMode]);

    useEffect(() => {
        if (activeTab === 'influencers' && influencersTabRef.current) {
            setHighlightStyle({ left: influencersTabRef.current.offsetLeft, width: influencersTabRef.current.offsetWidth, opacity: 1 });
        } else if (activeTab === 'brands' && brandsTabRef.current) {
            setHighlightStyle({ left: brandsTabRef.current.offsetLeft, width: brandsTabRef.current.offsetWidth, opacity: 1 });
        }
    }, [activeTab]);

    const filteredInfluencers = useMemo(() => influencers.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())), [influencers, searchTerm]);
    const filteredBrands = useMemo(() => brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())), [brands, searchTerm]);

    const handleExport = () => {
        if (activeTab === 'influencers') exportToCsv('influencers.csv', filteredInfluencers as unknown as Record<string, unknown>[]);
        else exportToCsv('brands.csv', filteredBrands as unknown as Record<string, unknown>[]);
    };

    const renderContent = () => {
        if (isLoading) {
            if (viewMode === 'grid') {
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="futuristic-border bg-brand-surface rounded-xl p-4 text-center">
                                <SkeletonLoader className="w-24 h-24 rounded-full mx-auto mb-4 bg-brand-bg" />
                                <SkeletonLoader className="h-6 w-3/4 mx-auto bg-brand-bg" />
                                <SkeletonLoader className="h-4 w-1/2 mx-auto mt-2 bg-brand-bg" />
                                <SkeletonLoader className="h-8 w-1/3 mx-auto mt-4 bg-brand-bg" />
                            </div>
                        ))}
                    </div>
                );
            }
            if (viewMode === 'table') {
                return (
                     <div className="futuristic-border bg-brand-surface rounded-xl p-4">
                         <SkeletonLoader className="h-10 w-full mb-2 bg-brand-bg"/>
                         {Array.from({ length: 5 }).map((_, i) => <SkeletonLoader key={i} className="h-12 w-full mt-2 bg-brand-bg"/>)}
                    </div>
                );
            }
             if (viewMode === 'board') {
                return (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
                         {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-brand-bg rounded-xl p-4 space-y-4">
                                <SkeletonLoader className="h-8 w-full bg-brand-surface" />
                                <SkeletonLoader className="h-40 w-full bg-brand-surface" />
                                <SkeletonLoader className="h-40 w-full bg-brand-surface" />
                            </div>
                         ))}
                    </div>
                );
            }
        }

        const data = activeTab === 'influencers' ? filteredInfluencers : filteredBrands;

        if (data.length === 0 && searchTerm === '') {
             return (
                <EmptyState
                    icon={<Briefcase />}
                    title={`No ${activeTab === 'influencers' ? 'Influencers' : 'Brands'} Yet`}
                    description={`Add your first ${activeTab === 'influencers' ? 'influencer' : 'brand'} to start building your client database.`}
                    cta={
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                            <Plus className="w-5 h-5" />
                            Add New Client
                        </button>
                    }
                />
            );
        }
        
        switch(viewMode) {
            case 'board':
                return activeTab === 'influencers' ? <InfluencerKanbanBoard influencers={filteredInfluencers} /> : <p className="text-brand-text-secondary text-center py-10">Board view is available for influencers only.</p>;
            case 'table':
                return activeTab === 'influencers' ? <InfluencerTable influencers={filteredInfluencers} /> : <p className="text-brand-text-secondary text-center py-10">Table view coming soon for brands.</p>;
            case 'grid':
            default:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {activeTab === 'influencers' 
                            ? filteredInfluencers.map(influencer => <InfluencerCard key={influencer.id} influencer={influencer} />)
                            : filteredBrands.map(brand => <BrandCard key={brand.id} brand={brand} />)
                        }
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Clients</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" /><input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-brand-surface border border-brand-border rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary" /></div>
                    <button onClick={handleExport} className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap"><Download className="w-5 h-5" />Export</button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors whitespace-nowrap"><Plus className="w-5 h-5" />New Client</button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-8">
                <div className="relative flex items-center gap-2 p-1 bg-brand-bg rounded-full border border-brand-border max-w-xs">
                    <div className="absolute top-1 bottom-1 rounded-full bg-[size:400%_400%] bg-[linear-gradient(135deg,var(--color-accent-gradient)_0%,var(--color-primary)_50%,var(--color-accent-gradient)_100%)] animate-liquid-pan shadow-md" style={{ ...highlightStyle, transition: 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), width 0.4s cubic-bezier(0.25, 1, 0.5, 1)' }} />
                    <button ref={influencersTabRef} onClick={() => setActiveTab('influencers')} className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 w-full text-center ${activeTab === 'influencers' ? 'text-white' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}>Influencers ({influencers.length})</button>
                    <button ref={brandsTabRef} onClick={() => setActiveTab('brands')} className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 w-full text-center ${activeTab === 'brands' ? 'text-white' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}>Brands ({brands.length})</button>
                </div>
                <ViewSwitcher activeView={viewMode} setActiveView={setViewMode} />
            </div>

            <div key={`${activeTab}-${viewMode}`} className="animate-page-enter">
                {renderContent()}
            </div>
            <NewClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Clients;
