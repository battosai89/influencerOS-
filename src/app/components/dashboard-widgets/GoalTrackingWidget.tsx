import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';

const GoalTrackingWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Goal Tracking</CardTitle>
        <Flag className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">78%</div>
        <p className="text-xs text-muted-foreground">
          Quarterly goals achieved
        </p>
      </CardContent>
    </Card>
  );
};

export default GoalTrackingWidget;