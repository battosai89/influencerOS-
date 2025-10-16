import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

const MonthlyRevenueWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$12,345</div>
        <p className="text-xs text-muted-foreground">
          +5% vs. last month
        </p>
      </CardContent>
    </Card>
  );
};

export default MonthlyRevenueWidget;