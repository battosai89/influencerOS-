import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

const RevenueForecastWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
        <LineChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,678</div>
        <p className="text-xs text-muted-foreground">
          Projected for next month
        </p>
      </CardContent>
    </Card>
  );
};

export default RevenueForecastWidget;