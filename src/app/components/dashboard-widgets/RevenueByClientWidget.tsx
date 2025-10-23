import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { DollarSign, Users } from 'lucide-react';

const RevenueByClientWidget: React.FC = () => {
  const { brands, contracts, supabaseLoading } = useStore();

  const revenueByClient = React.useMemo(() => {
    const revenueMap = new Map();

    // Calculate revenue from contracts
    contracts.forEach(contract => {
      if (contract.status === 'Signed' && contract.value) {
        const current = revenueMap.get(contract.brandId) || { name: '', totalRevenue: 0, contractCount: 0 };
        revenueMap.set(contract.brandId, {
          ...current,
          totalRevenue: current.totalRevenue + contract.value,
          contractCount: current.contractCount + 1
        });
      }
    });

    // Add brand names and sort by revenue
    const result = Array.from(revenueMap.entries()).map(([brandId, data]) => {
      const brand = brands.find(b => b.id === brandId);
      return {
        ...data,
        name: brand?.name || 'Unknown Client',
        brandId
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return result.slice(0, 5); // Top 5 clients
  }, [contracts, brands]);

  const totalRevenue = React.useMemo(() => {
    return revenueByClient.reduce((sum, client) => sum + client.totalRevenue, 0);
  }, [revenueByClient]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
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
        <h3 className="text-lg font-semibold text-brand-text-primary">Revenue by Client</h3>
        <DollarSign className="w-5 h-5 text-brand-primary" />
      </div>

      {revenueByClient.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-brand-text-secondary">
          No client revenue data available
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {revenueByClient.map((client) => (
              <div key={client.brandId} className="flex items-center justify-between p-3 bg-brand-bg rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-text-primary text-sm">{client.name}</div>
                    <div className="text-xs text-brand-text-secondary">{client.contractCount} contracts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-brand-text-primary">
                    {formatCurrency(client.totalRevenue)}
                  </div>
                  <div className="text-xs text-brand-text-secondary">
                    {((client.totalRevenue / totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-brand-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-text-secondary">Total Revenue</span>
              <span className="font-semibold text-brand-text-primary">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueByClientWidget;