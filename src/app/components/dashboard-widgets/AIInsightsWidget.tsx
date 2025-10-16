import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const AIInsightsWidget = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">7</div>
        <p className="text-xs text-muted-foreground">
          New insights today
        </p>
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;