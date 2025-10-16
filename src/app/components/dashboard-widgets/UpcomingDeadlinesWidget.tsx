import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const UpcomingDeadlinesWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">
          Due this week
        </p>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlinesWidget;