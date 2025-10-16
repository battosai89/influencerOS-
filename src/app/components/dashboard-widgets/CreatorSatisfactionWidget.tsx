import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const CreatorSatisfactionWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Creator Satisfaction</CardTitle>
        <Heart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4.8/5</div>
        <p className="text-xs text-muted-foreground">
          Based on 24 reviews
        </p>
      </CardContent>
    </Card>
  );
};

export default CreatorSatisfactionWidget;