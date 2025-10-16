import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

const PerformanceMetricsWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
        <PieChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">94%</div>
        <p className="text-xs text-muted-foreground">
          Overall performance
        </p>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsWidget;