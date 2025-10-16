"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import useStore from '@/hooks/useStore';
import { Search, Filter, Plus, Calendar, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Modal from '@/components/Modal';
import ErrorBoundary from '@/components/ErrorBoundary';

type SortOption = 'dueDate' | 'createdDate' | 'title' | 'status';
type FilterStatus = 'all' | 'Submitted' | 'Agency Review' | 'Client Review' | 'Approved' | 'Revisions Requested';

const statusConfig = {
  'Submitted': { color: 'bg-blue-500/20 text-blue-300', icon: <AlertCircle className="w-4 h-4" /> },
  'Agency Review': { color: 'bg-purple-500/20 text-purple-300', icon: <AlertCircle className="w-4 h-4" /> },
  'Client Review': { color: 'bg-yellow-500/20 text-yellow-300', icon: <AlertCircle className="w-4 h-4" /> },
  'Revisions Requested': { color: 'bg-red-500/20 text-red-300', icon: <XCircle className="w-4 h-4" /> },
  'Approved': { color: 'bg-green-500/20 text-green-300', icon: <CheckCircle className="w-4 h-4" /> },
};

const ContentHubContent: React.FC = () => {
  const { campaigns, contentPieces, getInfluencer, getCampaign, updateContentPieceStatus, influencers, addContentPiece } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Content creation form state
  const [newContent, setNewContent] = useState({
    title: '',
    campaignId: '',
    influencerId: '',
    platform: 'Instagram' as 'Instagram' | 'TikTok' | 'YouTube',
    dueDate: '',
    thumbnailUrl: '',
    contentUrl: ''
  });

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.title || !newContent.campaignId || !newContent.influencerId) return;

    // Create the content piece using the store method
    addContentPiece({
      title: newContent.title,
      campaignId: newContent.campaignId,
      influencerId: newContent.influencerId,
      status: 'Submitted',
      dueDate: newContent.dueDate,
      submissionDate: new Date().toISOString(),
      thumbnailUrl: newContent.thumbnailUrl || '/placeholder-content.png',
      contentUrl: newContent.contentUrl,
      platform: newContent.platform,
    });

    // Reset form and close modal
    setNewContent({
      title: '',
      campaignId: '',
      influencerId: '',
      platform: 'Instagram',
      dueDate: '',
      thumbnailUrl: '',
      contentUrl: ''
    });
    setShowCreateModal(false);
  };

  const resetNewContentForm = () => {
    setNewContent({
      title: '',
      campaignId: '',
      influencerId: '',
      platform: 'Instagram',
      dueDate: '',
      thumbnailUrl: '',
      contentUrl: ''
    });
  };

  const filteredAndSortedContent = useMemo(() => {
    const filtered = contentPieces.filter(content => {
      const matchesSearch = searchTerm === '' ||
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getInfluencer(content.influencerId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCampaign(content.campaignId)?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
      const matchesPlatform = platformFilter === 'all' || content.platform === platformFilter;
      const matchesCampaign = campaignFilter === 'all' || content.campaignId === campaignFilter;

      return matchesSearch && matchesStatus && matchesPlatform && matchesCampaign;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'createdDate':
          aValue = a.submissionDate ? new Date(a.submissionDate).getTime() : 0;
          bValue = b.submissionDate ? new Date(b.submissionDate).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [contentPieces, searchTerm, statusFilter, platformFilter, campaignFilter, sortBy, sortOrder]);

  const handleSelectContent = (contentId: string) => {
    setSelectedContent(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContent(
      selectedContent.length === filteredAndSortedContent.length
        ? []
        : filteredAndSortedContent.map(c => c.id)
    );
  };

  const handleBulkStatusUpdate = (status: 'Approved' | 'Revisions Requested') => {
    selectedContent.forEach(contentId => {
      updateContentPieceStatus(contentId, status);
    });
    setSelectedContent([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-text-primary">Content Hub</h1>
          <p className="text-brand-text-secondary mt-1">Manage all your content in one place</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-accent transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Content
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Total Content</h3>
          <p className="text-3xl font-bold text-brand-primary">{contentPieces.length}</p>
          <p className="text-sm text-brand-text-secondary mt-1">Pieces of content</p>
        </div>

        <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Active Campaigns</h3>
          <p className="text-3xl font-bold text-brand-primary">
            {campaigns.filter(c => c.status === 'Live').length}
          </p>
          <p className="text-sm text-brand-text-secondary mt-1">With content</p>
        </div>

        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">In Review</h3>
          <p className="text-3xl font-bold text-brand-accent">{contentPieces.filter(c => c.status === 'Agency Review' || c.status === 'Client Review').length}</p>
          <p className="text-sm text-brand-text-secondary mt-1">Awaiting approval</p>
        </div>

        <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-brand-text-primary mb-2">Approved</h3>
          <p className="text-3xl font-bold text-green-400">{contentPieces.filter(c => c.status === 'Approved').length}</p>
          <p className="text-sm text-brand-text-secondary mt-1">Ready for posting</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
        <div className="flex flex-col gap-4">
          {/* Main Search and Basic Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Search content, influencers, campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Basic Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary hover:bg-brand-border transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Advanced
              </button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="all">All Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Agency Review">Agency Review</option>
                <option value="Client Review">Client Review</option>
                <option value="Approved">Approved</option>
                <option value="Revisions Requested">Revisions Requested</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="dueDate">Due Date</option>
                <option value="createdDate">Submission Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary hover:bg-brand-border transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedSearch && (
            <div className="border-t border-brand-border pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Platform</label>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="all">All Platforms</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-primary mb-2">Campaign</label>
                  <select
                    value={campaignFilter}
                    onChange={(e) => setCampaignFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  >
                    <option value="all">All Campaigns</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPlatformFilter('all');
                      setCampaignFilter('all');
                    }}
                    className="w-full px-3 py-2 bg-brand-border text-brand-text-primary rounded-lg hover:bg-brand-bg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContent.length > 0 && (
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-brand-text-primary font-medium">
              {selectedContent.length} content piece{selectedContent.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('Approved')}
                className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('Revisions Requested')}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Request Revisions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-brand-surface futuristic-border rounded-xl">
        <div className="p-4 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-brand-text-primary">
              Content Pieces ({filteredAndSortedContent.length})
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedContent.length === filteredAndSortedContent.length && filteredAndSortedContent.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-brand-primary bg-brand-bg border-brand-border rounded focus:ring-brand-primary"
              />
              <span className="text-sm text-brand-text-secondary">Select All</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-brand-border">
          {filteredAndSortedContent.map((content) => {
            const campaign = getCampaign(content.campaignId);
            const influencer = getInfluencer(content.influencerId);
            const statusInfo = statusConfig[content.status];

            return (
              <div key={content.id} className="p-4 hover:bg-brand-bg/50 transition-colors">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedContent.includes(content.id)}
                    onChange={() => handleSelectContent(content.id)}
                    className="w-4 h-4 text-brand-primary bg-brand-bg border-brand-border rounded focus:ring-brand-primary"
                  />

                  <div className="flex-shrink-0">
                    <Image
                      src={content.thumbnailUrl}
                      alt={content.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-brand-text-primary truncate">{content.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {content.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-brand-text-secondary">
                      <span>{influencer?.name}</span>
                      <span>•</span>
                      <span>{campaign?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(content.dueDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{content.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(content.contentUrl || '#', '_blank')}
                      className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log('Edit content:', content.id);
                      }}
                      className="p-2 text-brand-text-secondary hover:text-brand-accent hover:bg-brand-bg rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement delete functionality with confirmation
                        console.log('Delete content:', content.id);
                      }}
                      className="p-2 text-brand-text-secondary hover:text-red-400 hover:bg-brand-bg rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedContent.length === 0 && (
          <div className="p-8 text-center text-brand-text-secondary">
            No content pieces found matching your criteria.
          </div>
        )}
      </div>

      {/* Content Creation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetNewContentForm();
        }}
        title="Create New Content"
      >
        <form onSubmit={handleCreateContent} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">Content Title</label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter content title..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">Campaign</label>
              <select
                value={newContent.campaignId}
                onChange={(e) => setNewContent(prev => ({ ...prev, campaignId: e.target.value }))}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="">Select Campaign</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">Influencer</label>
              <select
                value={newContent.influencerId}
                onChange={(e) => setNewContent(prev => ({ ...prev, influencerId: e.target.value }))}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              >
                <option value="">Select Influencer</option>
                {influencers.map(influencer => (
                  <option key={influencer.id} value={influencer.id}>{influencer.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">Platform</label>
              <select
                value={newContent.platform}
                onChange={(e) => setNewContent(prev => ({ ...prev, platform: e.target.value as 'Instagram' | 'TikTok' | 'YouTube' }))}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">Due Date</label>
              <input
                type="date"
                value={newContent.dueDate}
                onChange={(e) => setNewContent(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">Content URL (Optional)</label>
            <input
              type="url"
              value={newContent.contentUrl}
              onChange={(e) => setNewContent(prev => ({ ...prev, contentUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">Thumbnail URL (Optional)</label>
            <input
              type="url"
              value={newContent.thumbnailUrl}
              onChange={(e) => setNewContent(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                resetNewContentForm();
              }}
              className="px-4 py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
            >
              Create Content
            </button>
          </div>
        </form>
      </Modal>
  </div>
);
};

export default function ContentHubPage() {
  return (
      <ErrorBoundary>
          <ContentHubContent />
      </ErrorBoundary>
  );
}