import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { KanbanSquare, Users, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ClientPipelineWidget: React.FC = () => {
  const { supabaseBrands, supabaseLoading } = useStore();

  const pipelineStages = React.useMemo(() => {
    type StageWithBrands = {
      id: string;
      title: string;
      icon: React.ReactNode;
      color: string;
      bgColor: string;
      borderColor: string;
      textColor: string;
      brands: typeof supabaseBrands;
    };

    const stages: StageWithBrands[] = [
      {
        id: 'lead',
        title: 'Lead',
        icon: <Users className="w-4 h-4" />,
        color: 'bg-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/10',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300',
        brands: []
      },
      {
        id: 'contacted',
        title: 'Contacted',
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        brands: []
      },
      {
        id: 'qualified',
        title: 'Qualified',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/10',
        borderColor: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-700 dark:text-purple-300',
        brands: []
      },
      {
        id: 'proposal',
        title: 'Proposal',
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'bg-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/10',
        borderColor: 'border-orange-200 dark:border-orange-800',
        textColor: 'text-orange-700 dark:text-orange-300',
        brands: []
      },
      {
        id: 'negotiation',
        title: 'Negotiation',
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-indigo-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/10',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        textColor: 'text-indigo-700 dark:text-indigo-300',
        brands: []
      },
      {
        id: 'closed',
        title: 'Closed',
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/10',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        brands: []
      }
    ];

    // Distribute brands across pipeline stages based on their properties
    const brandsInStages = [...stages];

    supabaseBrands.forEach(brand => {
      // Determine stage based on satisfaction score and other factors
      let stageIndex = 0;

      if (brand.satisfaction >= 90) {
        stageIndex = 5; // Closed
      } else if (brand.satisfaction >= 70) {
        stageIndex = 4; // Negotiation
      } else if (brand.satisfaction >= 50) {
        stageIndex = 3; // Proposal
      } else if (brand.satisfaction >= 30) {
        stageIndex = 2; // Qualified
      } else if (brand.satisfaction >= 10 || brand.notes?.toLowerCase().includes('contacted')) {
        stageIndex = 1; // Contacted
      } else {
        stageIndex = 0; // Lead
      }

      // Override based on specific keywords in notes
      if (brand.notes?.toLowerCase().includes('prospect') || brand.notes?.toLowerCase().includes('lead')) {
        stageIndex = 0;
      } else if (brand.notes?.toLowerCase().includes('proposal') || brand.notes?.toLowerCase().includes('quote')) {
        stageIndex = 3;
      } else if (brand.notes?.toLowerCase().includes('negotiating') || brand.notes?.toLowerCase().includes('discussing')) {
        stageIndex = 4;
      } else if (brand.notes?.toLowerCase().includes('closed') || brand.notes?.toLowerCase().includes('won')) {
        stageIndex = 5;
      }

      if (brandsInStages[stageIndex]) {
        brandsInStages[stageIndex].brands.push(brand);
      }
    });

    return brandsInStages;
  }, [supabaseBrands]);

  if (supabaseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-brand-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-text-primary">Client Pipeline</h3>
        <KanbanSquare className="w-5 h-5 text-brand-primary" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 h-full">
        {pipelineStages.map(stage => (
          <div key={stage.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-brand-bg">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <span className="text-xs font-medium text-brand-text-primary flex-1">
                {stage.title}
              </span>
              <span className="text-xs text-brand-text-secondary">
                {stage.brands.length}
              </span>
            </div>

            <div className={`space-y-2 flex-1 min-h-0 ${stage.bgColor} ${stage.borderColor} border rounded-lg p-2`}>
              {stage.brands.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <span className={`text-xs ${stage.textColor} opacity-50`}>
                    No clients
                  </span>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-48">
                  {stage.brands.slice(0, 4).map(brand => (
                    <div key={brand.id} className={`p-2 rounded border ${stage.borderColor} ${stage.bgColor}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-brand-text-primary truncate">
                            {brand.name}
                          </p>
                          <p className="text-xs text-brand-text-secondary truncate">
                            {brand.industry}
                          </p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${stage.bgColor} ${stage.textColor}`}>
                          {brand.satisfaction}%
                        </span>
                        {brand.website && (
                          <span className="text-xs text-brand-text-secondary truncate max-w-16">
                            {brand.website.replace('https://', '')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stage.brands.length > 4 && (
                    <div className={`text-center py-1 ${stage.textColor} opacity-75`}>
                      <span className="text-xs">+{stage.brands.length - 4} more</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-brand-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-text-secondary">Total in Pipeline</span>
          <span className="font-semibold text-brand-text-primary">
            {supabaseBrands.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientPipelineWidget;