import * as React from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import ContractCard from '../components/ContractCard';
import { Plus, FileText, Check, Download } from 'lucide-react';
import { ContractTemplate } from '../types';
import { NewContractModal, NewTemplateModal } from '../components/CreationModals';
import { exportToCsv } from '../services/downloadUtils';
import EmptyState from '../components/EmptyState';

const TemplateCard: React.FC<{ template: ContractTemplate }> = ({ template }) => {
    return (
        <Link href={`/templates/contracts/${template.id}`} className="flex bg-brand-surface futuristic-border rounded-xl p-6 flex-col justify-between h-full hover:shadow-glow-md transition-all duration-300 group">
            <div className="relative">
                 <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-colors"></div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-brand-primary" />
                        <h2 className="text-xl font-bold text-brand-text-primary">{template.name}</h2>
                    </div>
                    <p className="text-sm text-brand-text-secondary line-clamp-3">{template.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border/50">
                    <p className="text-xs text-brand-text-secondary font-semibold uppercase mb-2">Clauses</p>
                    <ul className="text-sm text-brand-text-secondary space-y-1.5">
                        {template.clauses.map(clause => (
                            <li key={clause.title} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-brand-primary/80 flex-shrink-0 mt-0.5" />
                                <span className="truncate">{clause.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Link>
    );
}


const Contracts: React.FC = () => {
    const { contracts, contractTemplates, getInfluencer, getBrand } = useStore();
    const [statusFilter, setStatusFilter] = useState('All');
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [isContractModalOpen, setContractModalOpen] = useState(false);

    const filteredContracts = useMemo(() => {
        if (statusFilter === 'All') return contracts;
        return contracts.filter(c => c.status === statusFilter);
    }, [contracts, statusFilter]);

    const statuses = ['All', 'Draft', 'Pending', 'Signed', 'Expired'];

    return (
        <div className="space-y-12">
            <div>
                 <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-brand-text-primary">Contract Templates</h1>
                    <button 
                        onClick={() => setTemplateModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Template
                    </button>
                </div>
                <p className="text-brand-text-secondary mb-6 max-w-3xl">
                    Manage your reusable contract templates. Click a template to view or edit its clauses. Select a template when creating a new contract to save time.
                </p>
                {contractTemplates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contractTemplates.map(template => <TemplateCard key={template.id} template={template} />)}
                    </div>
                ) : (
                    <EmptyState
                        icon={<FileText />}
                        title="No Templates Created Yet"
                        description="Streamline your workflow by creating reusable contract templates for different types of collaborations."
                        cta={
                            <button onClick={() => setTemplateModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                                <Plus className="w-5 h-5" />
                                Create a Template
                            </button>
                        }
                    />
                )}
            </div>

            <div>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-brand-text-primary">All Contracts</h1>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <label className="text-brand-text-secondary whitespace-nowrap">Status:</label>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-brand-bg border border-brand-border rounded-lg px-3 py-1.5 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                         <button
                             onClick={() => exportToCsv('contracts.csv', filteredContracts as unknown as Record<string, unknown>[])}
                            className="flex items-center gap-2 bg-brand-bg text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors whitespace-nowrap futuristic-border"
                        >
                            <Download className="w-5 h-5" />
                            Export CSV
                        </button>
                        <button 
                            onClick={() => setContractModalOpen(true)}
                            className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            New Contract
                        </button>
                    </div>
                </div>
                 {filteredContracts.length > 0 ? (
                    <div className="space-y-6">
                        {filteredContracts.map(contract => (
                            <ContractCard 
                                key={contract.id} 
                                contract={contract} 
                                influencer={getInfluencer(contract.influencerId)}
                                brand={getBrand(contract.brandId)}
                            />
                        ))}
                    </div>
                ) : (
                     <EmptyState
                        icon={<FileText />}
                        title="No Contracts Found"
                        description="There are no contracts with the selected status. Try a different filter or create a new contract."
                        cta={
                            <button onClick={() => setContractModalOpen(true)} className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                                <Plus className="w-5 h-5" />
                                Create a Contract
                            </button>
                        }
                    />
                )}
            </div>
            <NewTemplateModal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} />
            <NewContractModal isOpen={isContractModalOpen} onClose={() => setContractModalOpen(false)} />
        </div>
    );
};

export default Contracts;
