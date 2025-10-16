"use client";

import * as React from 'react';
import { useState, useMemo } from 'react';
import useStore from '@/hooks/useStore';
import { DollarSign, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinancialsPage: React.FC = () => {
    const { transactions, getBrand } = useStore();
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        let startDate: Date;

        switch (timeRange) {
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
        }

        return transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const matchesFilter = filter === 'all' || t.type === filter;
            const inTimeRange = transactionDate >= startDate;
            return matchesFilter && inTimeRange;
        });
    }, [transactions, filter, timeRange]);

    const { totalIncome, totalExpenses, netProfit } = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit: income - expenses
        };
    }, [filteredTransactions]);

    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Financials</h1>
                    <p className="text-brand-text-secondary">Track your financial performance and budgets</p>
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Revenue</p>
                            <p className="text-2xl font-bold text-brand-success">{formatCurrency(totalIncome)}</p>
                        </div>
                        <ArrowUpRight className="w-8 h-8 text-brand-success" />
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-brand-text-secondary">Last {timeRange.replace('d', ' days').replace('y', ' year')}</span>
                    </div>
                </div>

                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</p>
                        </div>
                        <ArrowDownRight className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-brand-text-secondary">Last {timeRange.replace('d', ' days').replace('y', ' year')}</span>
                    </div>
                </div>

                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Net Profit</p>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-brand-success' : 'text-red-500'}`}>
                                {formatCurrency(netProfit)}
                            </p>
                        </div>
                        {netProfit >= 0 ? (
                            <TrendingUp className="w-8 h-8 text-brand-success" />
                        ) : (
                            <TrendingDown className="w-8 h-8 text-red-500" />
                        )}
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-brand-text-secondary">Last {timeRange.replace('d', ' days').replace('y', ' year')}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex gap-2">
                    {(['all', 'income', 'expense'] as const).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                filter === filterType
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                            }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {(['30d', '90d', '1y'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                timeRange === range
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                            }`}
                        >
                            {range.replace('d', 'D').replace('y', 'Y')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-brand-surface futuristic-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-brand-border">
                    <h3 className="text-xl font-semibold text-brand-text-primary">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Related To</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filteredTransactions.map((transaction) => {
                                const relatedBrand = transaction.brandId ? getBrand(transaction.brandId) : null;
                                return (
                                    <tr key={transaction.id} className="hover:bg-brand-bg/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text-primary">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {transaction.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {relatedBrand?.name || '-'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                                            transaction.type === 'income' ? 'text-brand-success' : 'text-red-500'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                        <DollarSign className="w-16 h-16 mx-auto text-brand-border mb-4" />
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No transactions found</h3>
                        <p className="text-brand-text-secondary">
                            {filter === 'all'
                                ? "Get started by adding your first transaction"
                                : `No ${filter} transactions found`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialsPage;
