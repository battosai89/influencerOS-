import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';

const LiveCampaignsWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Live Campaigns</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12</div>
        <p className="text-xs text-muted-foreground">
          Active campaigns running
        </p>
        <div className="flex items-center pt-1">
          <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-xs text-green-500">+3 this week</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveCampaignsWidget;