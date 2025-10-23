import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Activity, TrendingUp } from 'lucide-react';

const ActiveCampaignsMetricWidget: React.FC = () => {
  const { supabaseCampaigns, supabaseLoading } = useStore();

  const activeCampaigns = React.useMemo(() => {
    return supabaseCampaigns.filter(campaign => campaign.status === 'Live').length;
  }, [supabaseCampaigns]);

  const completedCampaigns = React.useMemo(() => {
    return supabaseCampaigns.filter(campaign => campaign.status === 'Completed').length;
  }, [supabaseCampaigns]);

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
        <h3 className="text-lg font-semibold text-brand-text-primary">Active Campaigns</h3>
        <Activity className="w-5 h-5 text-brand-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-brand-bg p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-brand-primary mb-1">
            {activeCampaigns}
          </div>
          <div className="text-sm text-brand-text-secondary">Active</div>
        </div>

        <div className="bg-brand-bg p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">
            {completedCampaigns}
          </div>
          <div className="text-sm text-brand-text-secondary">Completed</div>
        </div>
      </div>

      <div className="pt-2 border-t border-brand-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-text-secondary">Total Campaigns</span>
          <span className="font-semibold text-brand-text-primary">
            {supabaseCampaigns.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActiveCampaignsMetricWidget;