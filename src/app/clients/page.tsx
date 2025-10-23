"use client";

import * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import InfluencerCard from '../../components/InfluencerCard';
import BrandCard from '../../components/BrandCard';
import { Plus, Search, Download, LayoutGrid, KanbanSquare, Rows, Workflow } from 'lucide-react';
import { exportToCsv } from '../../services/downloadUtils';
import { Influencer, Brand } from '../../types';
import SkeletonLoader from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { NewClientModal } from '../../components/CreationModals';
import { KanbanBoard } from '../../components/shared';

type ViewMode = 'grid' | 'kanban' | 'board' | 'table';

const ViewSwitcher: React.FC<{ activeView: ViewMode, setActiveView: (view: ViewMode) => void }> = ({ activeView, setActiveView }) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-brand-bg rounded-full border border-brand-border">
            {(['grid', 'kanban', 'board', 'table'] as const).map(view => {
                const icons = {
                    grid: <LayoutGrid />,
                    kanban: <Workflow />,
                    board: <KanbanSquare />,
                    table: <Rows />
                };
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
                            <td className="p-4">
                                <a href={`/influencers/${influencer.id}`} className="font-semibold text-brand-text-primary hover:text-brand-primary">
                                    {influencer.name}
                                </a>
                            </td>
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

export default function ClientsPage() {
  const { brands, influencers, deleteInfluencer, deleteBrand, updateInfluencerStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'clients' | 'influencers'>('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (brandId: string) => {
    deleteBrand(brandId);
  };

  const handleItemMove = (itemId: string, newStage: string) => {
    if (activeTab === 'influencers') {
      updateInfluencerStatus(itemId, newStage as Influencer['status']);
    } else {
      // TODO: Add updateBrandLeadStage action
      console.log(`Moving brand ${itemId} to ${newStage}`);
    }
  };

  const filteredInfluencers = useMemo(() =>
    influencers.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [influencers, searchTerm]
  );
  const filteredBrands = useMemo(() =>
    brands.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [brands, searchTerm]
  );

  const handleExport = () => {
    if (activeTab === 'influencers') {
      exportToCsv('influencers.csv', filteredInfluencers as unknown as Record<string, unknown>[]);
    } else {
      exportToCsv('brands.csv', filteredBrands as unknown as Record<string, unknown>[]);
    }
  };

  const renderContent = () => {
    const data = activeTab === 'influencers' ? filteredInfluencers : filteredBrands;

    if (data.length === 0 && searchTerm === '') {
      return (
        <EmptyState
          icon={<LayoutGrid />}
          title={`No ${activeTab === 'influencers' ? 'Influencers' : 'Brands'} Yet`}
          description={`Add your first ${activeTab === 'influencers' ? 'influencer' : 'brand'} to start building your database.`}
          cta={
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New {activeTab === 'influencers' ? 'Influencer' : 'Brand'}
            </button>
          }
        />
      );
    }

    switch(viewMode) {
       case 'table':
         return activeTab === 'influencers'
           ? <InfluencerTable influencers={filteredInfluencers} />
           : <p className="text-brand-text-secondary text-center py-10">Table view coming soon for clients.</p>;
       case 'kanban':
         if (activeTab === 'influencers') {
           const stages = ['new', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
           return (
             <KanbanBoard
               items={data}
               stages={stages}
               onItemMove={handleItemMove}
             />
           );
         } else {
           return <p className="text-brand-text-secondary text-center py-10">Kanban view available for influencers only.</p>;
         }
       case 'board':
         return activeTab === 'influencers'
           ? <p className="text-brand-text-secondary text-center py-10">Board view available for influencers only.</p>
           : <p className="text-brand-text-secondary text-center py-10">Board view is available for influencers only.</p>;
       case 'grid':
       default:
         return (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {activeTab === 'influencers'
               ? filteredInfluencers.map(influencer => <InfluencerCard key={influencer.id} influencer={influencer} />)
               : filteredBrands.map(brand => (
                   <BrandCard
                     key={brand.id}
                     brand={brand}
                     onEdit={handleEditBrand}
                     onDelete={handleDeleteBrand}
                   />
                 ))
             }
           </div>
         );
     }
  };

  const getStatsForTab = () => {
    if (activeTab === 'influencers') {
      return {
        total: influencers.length,
        active: influencers.filter(i => i.status === 'active').length,
        highPerforming: influencers.filter(i => i.engagementRate > 5).length,
        avgEngagement: influencers.length > 0 ? Math.round(influencers.reduce((sum, i) => sum + i.engagementRate, 0) / influencers.length * 10) / 10 : 0
      };
    } else {
      return {
        total: brands.length,
        active: brands.filter(b => b.satisfaction > 70).length,
        portalAccess: brands.filter(b => b.portalAccess).length,
        avgSatisfaction: brands.length > 0 ? Math.round(brands.reduce((sum, b) => sum + (b.satisfaction || 0), 0) / brands.length) : 0
      };
    }
  };

  const stats = getStatsForTab();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-brand-text-primary">Clients</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-brand-surface border border-brand-border rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'clients' | 'influencers')} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-fit grid-cols-2 bg-brand-bg border border-brand-border">
            <TabsTrigger value="clients" className="px-6">
              Brands ({brands.length})
            </TabsTrigger>
            <TabsTrigger value="influencers" className="px-6">
              Influencers ({influencers.length})
            </TabsTrigger>
          </TabsList>
          <ViewSwitcher activeView={viewMode} setActiveView={setViewMode} />
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              Total {activeTab === 'influencers' ? 'Influencers' : 'Brands'}
            </h3>
            <p className="text-3xl font-bold text-brand-primary">{stats.total}</p>
            <p className="text-sm text-brand-text-secondary mt-1">
              {activeTab === 'influencers' ? 'Content creators' : 'Active clients'}
            </p>
          </div>

          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              {activeTab === 'influencers' ? 'Active Creators' : 'High Satisfaction'}
            </h3>
            <p className="text-3xl font-bold text-brand-accent">{stats.active}</p>
            <p className="text-sm text-brand-text-secondary mt-1">
              {activeTab === 'influencers' ? 'Active status' : 'High satisfaction'}
            </p>
          </div>

          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              {activeTab === 'influencers' ? 'High Performers' : 'Portal Access'}
            </h3>
            <p className="text-3xl font-bold text-brand-primary">
              {activeTab === 'influencers' ? stats.highPerforming : stats.portalAccess}
            </p>
            <p className="text-sm text-brand-text-secondary mt-1">
              {activeTab === 'influencers' ? 'High engagement' : 'With portal access'}
            </p>
          </div>

          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
              {activeTab === 'influencers' ? 'Avg. Engagement' : 'Avg. Satisfaction'}
            </h3>
            <p className="text-3xl font-bold text-brand-primary">
              {activeTab === 'influencers' ? `${stats.avgEngagement}%` : `${stats.avgSatisfaction}%`}
            </p>
            <p className="text-sm text-brand-text-secondary mt-1">Average score</p>
          </div>
        </div>

        <TabsContent value="clients" className="mt-6">
          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-xl font-semibold text-brand-text-primary mb-4">Brand List</h3>
            {renderContent()}
          </div>
        </TabsContent>

        <TabsContent value="influencers" className="mt-6">
          <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
            <h3 className="text-xl font-semibold text-brand-text-primary mb-4">Influencer List</h3>
            {renderContent()}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Creation Modal */}
      <NewClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}