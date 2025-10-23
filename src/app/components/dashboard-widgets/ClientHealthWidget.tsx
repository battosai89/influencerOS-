import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Heart, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const ClientHealthWidget: React.FC = () => {
  const { brands, contracts, supabaseLoading } = useStore();

  const clientHealthData = React.useMemo(() => {
    return brands.map(brand => {
      const brandContracts = contracts.filter(c => c.brandId === brand.id);
      const activeContracts = brandContracts.filter(c => c.status === 'Signed');
      const recentContracts = brandContracts.filter(c =>
        c.dateSigned && new Date(c.dateSigned) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
      );

      // Calculate health score based on multiple factors
      let healthScore = brand.satisfaction || 50;

      // Adjust based on contract activity
      if (activeContracts.length > 0) {
        healthScore += 10;
      }

      if (recentContracts.length > 0) {
        healthScore += 15;
      }

      // Cap at 100
      healthScore = Math.min(healthScore, 100);

      return {
        ...brand,
        healthScore,
        activeContracts: activeContracts.length,
        recentContracts: recentContracts.length,
        totalContracts: brandContracts.length
      };
    }).sort((a, b) => b.healthScore - a.healthScore).slice(0, 6); // Top 6 clients
  }, [brands, contracts]);

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'text-green-500', icon: CheckCircle };
    if (score >= 60) return { status: 'Good', color: 'text-blue-500', icon: TrendingUp };
    if (score >= 40) return { status: 'Fair', color: 'text-yellow-500', icon: Clock };
    return { status: 'Needs Attention', color: 'text-red-500', icon: AlertCircle };
  };

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
        <h3 className="text-lg font-semibold text-brand-text-primary">Client Health</h3>
        <Heart className="w-5 h-5 text-brand-primary" />
      </div>

      {clientHealthData.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-brand-text-secondary">
          No client data available
        </div>
      ) : (
        <div className="space-y-3">
          {clientHealthData.map((client) => {
            const health = getHealthStatus(client.healthScore);
            const IconComponent = health.icon;

            return (
              <div key={client.id} className="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className={`w-4 h-4 ${health.color}`} />
                  </div>
                  <div>
                    <div className="font-medium text-brand-text-primary text-sm">{client.name}</div>
                    <div className="text-xs text-brand-text-secondary">
                      {client.activeContracts} active • {client.totalContracts} total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${health.color}`}>
                    {client.healthScore}%
                  </div>
                  <div className={`text-xs ${health.color}`}>
                    {health.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-3 border-t border-brand-border text-center">
        <div className="text-sm text-brand-text-secondary">
          Overall Health Score:{' '}
          <span className="font-semibold text-brand-text-primary">
            {clientHealthData.length > 0
              ? Math.round(clientHealthData.reduce((sum, client) => sum + client.healthScore, 0) / clientHealthData.length)
              : 0
            }%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientHealthWidget;