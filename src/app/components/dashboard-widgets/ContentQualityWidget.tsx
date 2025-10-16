import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const ContentQualityWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Content Quality</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">92%</div>
        <p className="text-xs text-muted-foreground">
          Average quality score
        </p>
      </CardContent>
    </Card>
  );
};

export default ContentQualityWidget;