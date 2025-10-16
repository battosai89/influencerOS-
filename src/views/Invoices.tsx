import * as React from 'react';
import { useState } from 'react';
import useStore from '../hooks/useStore';
import { Invoice } from '../types';
import { Plus, Download, Receipt } from 'lucide-react';
import { NewInvoiceModal, InvoiceDetailModal } from '../components/CreationModals';
import { exportToCsv } from '../services/downloadUtils';
import EmptyState from '../components/EmptyState';

const statusStyles: { [key: string]: string } = {
  'Paid': 'bg-green-500/20 text-green-400',
  'Pending': 'bg-yellow-500/20 text-yellow-400',
  'Overdue': 'bg-red-500/20 text-red-400',
};

const InvoiceRow: React.FC<{ invoice: Invoice; onView: (invoice: Invoice) => void }> = ({ invoice, onView }) => {
    const { getBrand } = useStore();
    const brand = getBrand(invoice.brandId);

    return (
        <div 
            onClick={() => onView(invoice)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onView(invoice)}
            className="futuristic-border bg-brand-surface rounded-xl p-4 grid grid-cols-5 items-center gap-4 text-sm text-brand-text-secondary cursor-pointer hover:shadow-glow-sm transition-shadow duration-300"
        >
            <div className="font-semibold text-brand-text-primary">{invoice.invoiceNumber}</div>
            <div>{brand?.name || 'N/A'}</div>
            <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
            <div>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[invoice.status]}`}>
                    {invoice.status}
                </span>
            </div>
            <div className="flex justify-end items-center gap-2">
                 <span className="font-bold text-brand-text-primary text-base">
                    {invoice.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
            </div>
        </div>
    );
};

const Invoices: React.FC = () => {
    const { invoices } = useStore();
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailModalOpen(true);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Invoices</h1>
                <div className="flex items-center gap-4">
                     <button
                        onClick={() => exportToCsv('invoices.csv', invoices as unknown as Record<string, unknown>[])}
                        className="flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap"
                    >
                        <Download className="w-5 h-5" />
                        Export CSV
                    </button>
                    <button 
                        onClick={() => setIsNewModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        New Invoice
                    </button>
                </div>
            </div>

            {invoices.length > 0 ? (
                <>
                    {/* Table Header */}
                    <div className="grid grid-cols-5 items-center gap-4 px-4 pb-2 text-xs font-semibold text-brand-text-secondary uppercase">
                        <div>Invoice #</div>
                        <div>Client</div>
                        <div>Due Date</div>
                        <div>Status</div>
                        <div className="text-right">Amount</div>
                    </div>

                    <div className="space-y-3">
                        {invoices.sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).map(invoice => (
                            <InvoiceRow key={invoice.id} invoice={invoice} onView={handleViewInvoice} />
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={<Receipt />}
                    title="No Invoices Yet"
                    description="Keep track of your client billing by creating your first invoice. It&apos;s quick and easy."
                    cta={
                        <button onClick={() => setIsNewModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                            <Plus className="w-5 h-5" />
                            Create an Invoice
                        </button>
                    }
                />
            )}
            <NewInvoiceModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
            <InvoiceDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} invoice={selectedInvoice} />
        </div>
    );
};

export default Invoices;
