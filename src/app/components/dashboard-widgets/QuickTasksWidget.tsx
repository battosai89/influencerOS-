import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo } from 'lucide-react';

const QuickTasksWidget: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Quick Tasks</CardTitle>
        <ListTodo className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">8</div>
        <p className="text-xs text-muted-foreground">
          2 due today
        </p>
      </CardContent>
    </Card>
  );
};

export default QuickTasksWidget;