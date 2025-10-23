import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Calendar, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const UpcomingRenewalsWidget: React.FC = () => {
  const { contracts, brands, supabaseLoading } = useStore();

  const renewalData = React.useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    return contracts
      .filter(contract => {
        if (!contract.endDate || contract.status !== 'Signed') return false;

        const endDate = new Date(contract.endDate);
        return endDate >= now && endDate <= sixtyDaysFromNow;
      })
      .map(contract => {
        const brand = brands.find(b => b.id === contract.brandId);
        const endDate = new Date(contract.endDate!);
        const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

        return {
          ...contract,
          brandName: brand?.name || 'Unknown Client',
          daysUntilExpiry,
          urgency: daysUntilExpiry <= 30 ? 'high' : 'medium'
        };
      })
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
      .slice(0, 5); // Show next 5 renewals
  }, [contracts, brands]);

  const getUrgencyIcon = (urgency: string, days: number) => {
    if (urgency === 'high' || days <= 30) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getUrgencyColor = (urgency: string, days: number) => {
    if (urgency === 'high' || days <= 30) {
      return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    }
    return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
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
        <h3 className="text-lg font-semibold text-brand-text-primary">Upcoming Renewals</h3>
        <Calendar className="w-5 h-5 text-brand-primary" />
      </div>

      {renewalData.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-brand-text-secondary">
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div>No renewals due in next 60 days</div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {renewalData.map((contract) => (
            <div
              key={contract.id}
              className={`p-3 rounded-lg border-l-4 ${getUrgencyColor(contract.urgency, contract.daysUntilExpiry)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getUrgencyIcon(contract.urgency, contract.daysUntilExpiry)}
                  <div>
                    <div className="font-medium text-brand-text-primary text-sm">
                      {contract.brandName}
                    </div>
                    <div className="text-xs text-brand-text-secondary">
                      ${contract.value.toLocaleString()} • {contract.title}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${
                    contract.daysUntilExpiry <= 30 ? 'text-red-500' : 'text-yellow-600'
                  }`}>
                    {contract.daysUntilExpiry} days
                  </div>
                  <div className="text-xs text-brand-text-secondary">
                    {new Date(contract.endDate!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {renewalData.length > 0 && (
        <div className="pt-3 border-t border-brand-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-secondary">
              Contracts expiring in 30 days:
            </span>
            <span className={`font-semibold ${
              renewalData.filter(c => c.daysUntilExpiry <= 30).length > 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {renewalData.filter(c => c.daysUntilExpiry <= 30).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingRenewalsWidget;