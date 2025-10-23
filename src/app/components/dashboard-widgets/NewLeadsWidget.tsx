import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { UserPlus, TrendingUp, Clock, Star } from 'lucide-react';

const NewLeadsWidget: React.FC = () => {
  const { supabaseInfluencers, supabaseBrands, supabaseLoading } = useStore();

  const newLeads = React.useMemo(() => {
    // Get recent leads - since we don't have createdDate, we'll use status-based filtering
    // and sort by engagement rate as a proxy for "newness"
    const leads = [
      ...supabaseInfluencers
        .filter(influencer =>
          influencer.status === 'lead' ||
          influencer.status === 'contacted' ||
          influencer.status === 'negotiating'
        )
        .map(influencer => ({
          id: influencer.id,
          name: influencer.name,
          type: 'Influencer' as const,
          platform: influencer.platform,
          followers: influencer.followers,
          engagementRate: influencer.engagementRate,
          status: influencer.status,
          avatarUrl: influencer.avatarUrl,
          niche: influencer.niche,
          location: influencer.location,
          rating: influencer.rating
        })),
      ...supabaseBrands
        .filter(brand =>
          brand.notes?.toLowerCase().includes('prospect') ||
          brand.notes?.toLowerCase().includes('lead') ||
          !brand.website // Brands without websites might be new prospects
        )
        .slice(0, 3) // Limit brands to avoid overwhelming the widget
        .map(brand => ({
          id: brand.id,
          name: brand.name,
          type: 'Brand' as const,
          industry: brand.industry,
          website: brand.website,
          satisfaction: brand.satisfaction,
          logoUrl: brand.logoUrl
        }))
    ];

    // Sort by engagement rate (proxy for recency) and limit to 6 items
    return leads
      .sort((a, b) => {
        if ('engagementRate' in a && 'engagementRate' in b) {
          return b.engagementRate - a.engagementRate;
        }
        if ('satisfaction' in a && 'satisfaction' in b) {
          return b.satisfaction - a.satisfaction;
        }
        return 0;
      })
      .slice(0, 6);
  }, [supabaseInfluencers, supabaseBrands]);

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    }
    if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  if (supabaseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-brand-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-text-primary">New Leads</h3>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-green-500">{newLeads.length}</span>
        </div>
      </div>

      {newLeads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <UserPlus className="w-12 h-12 text-brand-text-secondary mb-2" />
          <p className="text-brand-text-secondary text-sm">No new leads</p>
          <p className="text-xs text-brand-text-secondary/70">Recent opportunities will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {newLeads.map(lead => (
            <div key={lead.id} className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {lead.type === 'Influencer' ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {lead.name.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">B</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-brand-text-primary text-sm truncate">
                      {lead.name}
                    </p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      lead.type === 'Influencer'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {lead.type}
                    </span>
                  </div>

                  {lead.type === 'Influencer' ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <span>{lead.platform}</span>
                        <span>•</span>
                        <span>{formatFollowers(lead.followers)} followers</span>
                        <span>•</span>
                        <span>{lead.engagementRate.toFixed(1)}% engagement</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <span>{lead.niche}</span>
                        <span>•</span>
                        <span>{lead.location}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{lead.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs text-brand-text-secondary">
                        Industry: {lead.industry}
                      </div>
                      {lead.website && (
                        <div className="text-xs text-brand-text-secondary truncate">
                          {lead.website}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {lead.satisfaction}% satisfaction
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-brand-text-secondary" />
                    <span className="text-xs text-brand-text-secondary capitalize">
                      {lead.type === 'Influencer' ? lead.status : 'Prospect'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {newLeads.length >= 6 && (
            <div className="text-center pt-2">
              <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium">
                View all leads
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewLeadsWidget;