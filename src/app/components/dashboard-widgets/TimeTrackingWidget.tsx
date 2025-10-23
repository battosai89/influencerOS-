import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

// Temporary placeholder for TimeTrackingWidget
// TODO: Integrate with store once typing issues are resolved
const TimeTrackingWidget: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Time tracking component coming soon.</p>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingWidget;