import * as React from 'react';
import { useState } from 'react';
import useStore from '../hooks/useStore';
import { Transaction } from '../types';

// Simple DashboardCard component
const DashboardCard: React.FC<{ title: string; value: string | number; _changeType?: 'increase' | 'decrease' }> = ({ title, value, _changeType }) => (
  <div className="futuristic-border bg-brand-surface rounded-xl p-6">
    <h3 className="text-sm font-medium text-brand-text-secondary mb-2">{title}</h3>
    <p className="text-2xl font-bold text-brand-text-primary">{value}
      {_changeType && (
        <span className={`ml-2 text-sm font-medium ${
          _changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          {_changeType === 'increase' ? '▲' : '▼'}
        </span>
      )}
    </p>
  </div>
);
import { Download, Plus, Banknote } from 'lucide-react';
import { exportToCsv } from '../services/downloadUtils';
import { NewTransactionModal } from '../components/CreationModals';
import EmptyState from '../components/EmptyState';

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isIncome = transaction.type === 'income';
    const amountColor = isIncome ? 'text-green-400' : 'text-red-400';
    const statusColor = transaction.status === 'Completed' ? 'text-green-400' : 'text-yellow-400';

    return (
        <tr className="border-b border-brand-border hover:bg-brand-surface">
            <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
            <td className="p-4">{transaction.description}</td>
            <td className="p-4">{transaction.category}</td>
            <td className={`p-4 font-semibold ${amountColor}`}>
                {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </td>
            <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor} bg-opacity-20 ${transaction.status === 'Completed' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    {transaction.status}
                </span>
            </td>
        </tr>
    );
};

const Financials: React.FC = () => {
    const { transactions } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Financials</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => exportToCsv('transactions.csv', transactions as unknown as Record<string, unknown>[])}
                        className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export Transactions
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Transaction
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardCard title="Total Income" value={totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                <DashboardCard title="Total Expenses" value={totalExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                <DashboardCard title="Net Profit" value={netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} _changeType={netProfit >= 0 ? 'increase' : 'decrease'}/>
            </div>

            {transactions.length > 0 ? (
                <div className="futuristic-border bg-brand-surface rounded-xl overflow-hidden">
                    <h2 className="text-xl font-bold text-brand-text-primary p-6">Recent Transactions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-brand-text-secondary">
                            <thead className="bg-brand-bg text-sm uppercase">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction => (
                                    <TransactionRow key={transaction.id} transaction={transaction} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                 <EmptyState
                    icon={<Banknote />}
                    title="No Transactions Logged"
                    description="Track your agency&apos;s financial health by logging income from clients and campaign expenses."
                    cta={
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                            <Plus className="w-5 h-5" />
                            Log Your First Transaction
                        </button>
                    }
                />
            )}
            <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Financials;
