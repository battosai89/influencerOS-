import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const SystemStatusWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">Online</div>
        <p className="text-xs text-muted-foreground">
          All systems operational
        </p>
      </CardContent>
    </Card>
  );
};

export default SystemStatusWidget;