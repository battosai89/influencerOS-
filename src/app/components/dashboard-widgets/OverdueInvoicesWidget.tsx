import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { FileWarning, DollarSign, Calendar } from 'lucide-react';

const OverdueInvoicesWidget: React.FC = () => {
  const { supabaseInvoices, supabaseBrands, supabaseLoading } = useStore();

  const overdueInvoices = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return supabaseInvoices.filter(invoice =>
      invoice.status === 'Overdue' ||
      (invoice.dueDate < today && invoice.status === 'Pending')
    ).slice(0, 5); // Limit to top 5 for widget display
  }, [supabaseInvoices]);

  const totalOverdueAmount = React.useMemo(() => {
    return overdueInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  }, [overdueInvoices]);

  const getBrandName = (brandId: string) => {
    const brand = supabaseBrands.find(b => b.id === brandId);
    return brand?.name || 'Unknown Brand';
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) return '1 day overdue';
    if (daysDiff > 1) return `${daysDiff} days overdue`;
    return 'Due today';
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
        <h3 className="text-lg font-semibold text-brand-text-primary">Overdue Invoices</h3>
        <div className="flex items-center gap-2">
          <FileWarning className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-500">{overdueInvoices.length}</span>
        </div>
      </div>

      {overdueInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <DollarSign className="w-12 h-12 text-green-500 mb-2" />
          <p className="text-brand-text-secondary text-sm">All caught up!</p>
          <p className="text-xs text-brand-text-secondary/70">No overdue invoices</p>
        </div>
      ) : (
        <>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalOverdueAmount)}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Total Outstanding
            </div>
          </div>

          <div className="space-y-3">
            {overdueInvoices.map(invoice => (
              <div key={invoice.id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-brand-text-primary text-sm">
                        {invoice.invoiceNumber}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'Overdue'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>

                    <p className="text-sm text-brand-text-secondary truncate">
                      {getBrandName(invoice.brandId)}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-brand-text-secondary" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        {formatDueDate(invoice.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign className="w-3 h-3 text-brand-text-secondary" />
                      <span className="text-sm font-medium text-brand-text-primary">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {supabaseInvoices.filter(invoice =>
              invoice.status === 'Overdue' ||
              (invoice.dueDate < new Date().toISOString().split('T')[0] && invoice.status === 'Pending')
            ).length > 5 && (
              <div className="text-center pt-2">
                <button className="text-xs text-brand-primary hover:text-brand-primary/80 font-medium">
                  View all overdue invoices
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OverdueInvoicesWidget;