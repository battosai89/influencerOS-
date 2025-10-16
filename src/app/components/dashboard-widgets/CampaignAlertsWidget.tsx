import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const CampaignAlertsWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Campaign Alerts</CardTitle>
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">2</div>
        <p className="text-xs text-muted-foreground">
          Require attention
        </p>
      </CardContent>
    </Card>
  );
};

export default CampaignAlertsWidget;