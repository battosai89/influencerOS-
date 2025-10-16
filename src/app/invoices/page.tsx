"use client";

import * as React from 'react';
import { useState, useMemo } from 'react';
import useStore from '../../hooks/useStore';
import { FileText, Plus, Search, Download, Eye, Send, MoreVertical, Calendar, DollarSign, Building2 } from 'lucide-react';
import Image from 'next/image';
import { NewInvoiceModal, InvoiceDetailModal } from '../../components/CreationModals';


const InvoicesPage: React.FC = () => {
    const { invoices, createInvoice, getBrand } = useStore();
    const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
    const [isInvoiceDetailModalOpen, setIsInvoiceDetailModalOpen] = useState(false);
    const [selectedInvoice] = useState<null>(null);
    
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateInvoice, setShowCreateInvoice] = useState(false);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesFilter = filter === 'all' || invoice.status.toLowerCase() === filter;
            const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                getBrand(invoice.brandId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [invoices, filter, searchTerm, getBrand]);

    const { totalValue, paidValue, pendingValue, overdueValue } = useMemo(() => {
        const total = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const paid = filteredInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
        const pending = filteredInvoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
        const overdue = filteredInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
        return { totalValue: total, paidValue: paid, pendingValue: pending, overdueValue: overdue };
    }, [filteredInvoices]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'text-brand-success bg-brand-success/10';
            case 'pending': return 'text-brand-warning bg-brand-warning/10';
            case 'overdue': return 'text-red-500 bg-red-500/10';
            case 'draft': return 'text-brand-text-secondary bg-brand-border';
            default: return 'text-brand-text-secondary bg-brand-border';
        }
    };

    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Invoices</h1>
                    <p className="text-brand-text-secondary">Manage your invoices and billing</p>
                </div>
                <button
                    onClick={() => setShowCreateInvoice(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Invoice
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Value</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{formatCurrency(totalValue)}</p>
                        </div>
                        <FileText className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Paid</p>
                            <p className="text-2xl font-bold text-brand-success">{formatCurrency(paidValue)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-brand-success" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Pending</p>
                            <p className="text-2xl font-bold text-brand-warning">{formatCurrency(pendingValue)}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-brand-warning" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Overdue</p>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(overdueValue)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-secondary" />
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['all', 'paid', 'pending', 'overdue'] as const).map((filterType) => (
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
            </div>

            {/* Invoices Table */}
            <div className="bg-brand-surface futuristic-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Invoice</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Issue Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-brand-text-secondary uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                            {filteredInvoices.map((invoice) => {
                                const brand = getBrand(invoice.brandId);
                                return (
                                    <tr key={invoice.id} className="hover:bg-brand-bg/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text-primary">
                                            {invoice.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center">
                                                    {brand?.logoUrl ? (
                                                        <Image src={brand.logoUrl} alt={brand.name} className="w-full h-full rounded-full object-cover" width={32} height={32} />
                                                    ) : (
                                                        <Building2 className="w-4 h-4 text-brand-text-secondary" />
                                                    )}
                                                </div>
                                                <span className="text-sm text-brand-text-primary">{brand?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {new Date(invoice.issueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-brand-text-primary">
                                            {formatCurrency(invoice.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                                                    <Send className="w-4 h-4" />
                                                </button>
                                                <button className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredInvoices.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto text-brand-border mb-4" />
                        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No invoices found</h3>
                        <p className="text-brand-text-secondary mb-4">
                            {searchTerm ? "No invoices match your search" : "Get started by creating your first invoice"}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowCreateInvoice(true)}
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Invoice
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Create Invoice Modal */}
            {showCreateInvoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-brand-surface rounded-xl p-6 w-full max-w-2xl">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Create New Invoice</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Client</label>
                                    <select className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                        <option>Select a client...</option>
                                        {/* This would be populated from the brands list */}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Invoice Number</label>
                                    <input
                                        type="text"
                                        placeholder="INV-001"
                                        className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Amount</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text-primary mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Invoice description..."
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateInvoice(false)}
                                className="flex-1 px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors">
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <NewInvoiceModal 
                isOpen={isNewInvoiceModalOpen} 
                onClose={() => setIsNewInvoiceModalOpen(false)} 
                createInvoice={createInvoice}
            />
            <InvoiceDetailModal
                isOpen={isInvoiceDetailModalOpen}
                onClose={() => setIsInvoiceDetailModalOpen(false)}
                invoice={selectedInvoice}
            />
        </div>
    );
};

export default InvoicesPage;