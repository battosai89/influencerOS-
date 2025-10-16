import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import useStore from '../hooks/useStore';
import Modal from './Modal';

// Simple fallback for ConfirmationModal
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};



import { Influencer, Task, Event, EventType, Invoice } from '../types';
import Link from 'next/link';
import { FilePenLine, Trash2, Download, Loader2 } from 'lucide-react';
import { exportPageToPdf } from '../services/downloadUtils';
import notificationService from '../services/notificationService';
import Image from 'next/image';


interface CreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  createInvoice?: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'issueDate'>) => void;
}

interface TaskModalProps extends CreationModalProps {
  taskToEdit?: Task | null;
  parentId?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToView: Event | null;
}

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
}

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-brand-text-secondary mb-2 font-display">{label}</label>
        {children}
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className="w-full futuristic-border bg-brand-bg rounded-lg px-4 py-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 hover:border-brand-primary/50"
    />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
     <select
        {...props}
        className="w-full futuristic-border bg-brand-bg rounded-lg px-4 py-3 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 hover:border-brand-primary/50"
    />
);

const FormButton: React.FC<{ children: React.ReactNode, onClick?: () => void, type?: 'submit' | 'button' }> = ({ children, onClick, type = 'submit' }: { children: React.ReactNode, onClick?: () => void, type?: 'submit' | 'button' }) => (
     <button 
        type={type} 
        onClick={onClick} 
        className="bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-accent hover:shadow-glow-md transition-all duration-200 ease-in-out hover:scale-105"
    >
        {children}
    </button>
);

const CancelButton: React.FC<{ children?: React.ReactNode; onClick: () => void; }> = ({ children, onClick }: { children?: React.ReactNode; onClick: () => void; }) => (
     <button
        type="button"
        onClick={onClick}
        className="bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-brand-border hover:border-brand-primary transition-all duration-200 ease-in-out hover:scale-105"
    >
        {children || 'Cancel'}
    </button>
);


export const NewClientModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { addClient } = useStore();
    const [type, setType] = useState<'influencer' | 'brand'>('influencer');
    const [name, setName] = useState('');
    const [platform, setPlatform] = useState<'Instagram' | 'TikTok' | 'YouTube'>('Instagram');
    const [followers, setFollowers] = useState(0);
    const [status, setStatus] = useState<Influencer['status']>('lead');
    const [industry, setIndustry] = useState('');
    const [website, setWebsite] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'influencer') {
            addClient({ name, platform, followers, status, engagementRate: 0 }, 'influencer');
        } else {
            addClient({ name, industry, website }, 'brand');
        }
        onClose();
    };
    
    useEffect(() => {
        if (isOpen) {
            setName('');
            setFollowers(0);
            setIndustry('');
            setWebsite('');
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Client">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 p-1 bg-brand-bg rounded-full futuristic-border">
                    <button 
                        type="button" 
                        onClick={() => setType('influencer')} 
                        className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${type === 'influencer' ? 'bg-brand-primary text-white shadow-glow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface/50'}`}
                    >
                        Influencer
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setType('brand')} 
                        className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${type === 'brand' ? 'bg-brand-primary text-white shadow-glow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface/50'}`}
                    >
                        Brand
                    </button>
                </div>
                
                <FormField label="Name"><FormInput type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required /></FormField>

                {type === 'influencer' ? (
                    <>
                        <FormField label="Platform">
                            <FormSelect value={platform} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatform(e.target.value as 'Instagram' | 'TikTok' | 'YouTube')}>
                                <option>Instagram</option><option>TikTok</option><option>YouTube</option>
                            </FormSelect>
                        </FormField>
                        <FormField label="Followers"><FormInput type="number" value={followers} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowers(Number(e.target.value))} /></FormField>
                        <FormField label="Status">
                             <FormSelect value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Influencer['status'])}>
                                <option value="lead">Lead</option><option value="contacted">Contacted</option><option value="negotiating">Negotiating</option>
                                <option value="signed">Signed</option><option value="active">Active</option><option value="inactive">Inactive</option>
                            </FormSelect>
                        </FormField>
                    </>
                ) : (
                    <>
                        <FormField label="Industry"><FormInput type="text" value={industry} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)} /></FormField>
                        <FormField label="Website"><FormInput type="url" placeholder="https://example.com" value={website} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)} /></FormField>
                    </>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Create Client</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const NewCampaignModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { createCampaign, brands, influencers } = useStore();
    const [name, setName] = useState('');
    const [brandId, setBrandId] = useState('');
    const [influencerIds, setInfluencerIds] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState(0);
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<'Planning' | 'Creator Outreach' | 'Content Creation' | 'Approval' | 'Live' | 'Completed'>('Planning');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCampaign({ 
            name, 
            brandId, 
            influencerIds, 
            startDate, 
            endDate, 
            budget, 
            category, 
            status,
            milestones: []
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Campaign">
             <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Campaign Name"><FormInput value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required /></FormField>
                <FormField label="Brand">
                    <FormSelect value={brandId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)} required>
                        <option value="">Select a brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </FormSelect>
                </FormField>
                <FormField label="Influencers">
                     <FormSelect multiple value={influencerIds} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInfluencerIds(Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value))}>
                        {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </FormSelect>
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date"><FormInput type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} required /></FormField>
                    <FormField label="End Date"><FormInput type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} required /></FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Budget ($)"><FormInput type="number" value={budget} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(Number(e.target.value))} required /></FormField>
                    <FormField label="Category"><FormInput value={category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} placeholder="e.g., Beauty, Tech, Fashion" required /></FormField>
                </div>
                <FormField label="Status">
                    <FormSelect value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as 'Planning' | 'Creator Outreach' | 'Content Creation' | 'Approval' | 'Live' | 'Completed')} required>
                        <option value="Planning">Planning</option>
                        <option value="Creator Outreach">Creator Outreach</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Approval">Approval</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                    </FormSelect>
                </FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Create Campaign</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const NewContractModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { addContract, brands, influencers, contractTemplates } = useStore();
    const [title, setTitle] = useState('');
    const [brandId, setBrandId] = useState('');
    const [influencerId, setInfluencerId] = useState('');
    const [value, setValue] = useState(0);
    const [templateId, setTemplateId] = useState('');

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContract({ title, brandId, influencerId, value, status: 'Draft', templateId });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Contract">
             <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Contract Title"><FormInput value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="e.g., Q4 Holiday Campaign" required /></FormField>
                <FormField label="Brand"><FormSelect value={brandId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)} required><option value="">Select Brand</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</FormSelect></FormField>
                <FormField label="Influencer"><FormSelect value={influencerId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInfluencerId(e.target.value)} required><option value="">Select Influencer</option>{influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</FormSelect></FormField>
                <FormField label="Template"><FormSelect value={templateId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTemplateId(e.target.value)}><option value="">Select a template (optional)</option>{contractTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</FormSelect></FormField>
                <FormField label="Value ($)"><FormInput type="number" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))} required /></FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Create Contract</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const NewTemplateModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { addContractTemplate } = useStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContractTemplate({ name, description });
        onClose();
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Create New Template">
             <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Template Name"><FormInput value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required /></FormField>
                <FormField label="Description"><FormInput value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required /></FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Create Template</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const NewInvoiceModal: React.FC<CreationModalProps> = ({ isOpen, onClose, createInvoice }: CreationModalProps) => {
    const { brands } = useStore();
    const [brandId, setBrandId] = useState('');
    const [amount, setAmount] = useState(0);
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (createInvoice) {
            createInvoice({ brandId, amount, dueDate });
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Brand"><FormSelect value={brandId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)} required><option value="">Select a brand</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</FormSelect></FormField>
                <FormField label="Amount ($)"><FormInput type="number" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} required /></FormField>
                <FormField label="Due Date"><FormInput type="date" value={dueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)} required /></FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Create Invoice</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ isOpen, onClose, invoice }: InvoiceDetailModalProps) => {
    const { getBrand, agencyName, agencyLogoUrl } = useStore();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (invoiceRef.current && invoice) {
            setIsDownloading(true);
            await exportPageToPdf(invoiceRef.current, `invoice_${invoice.invoiceNumber}.pdf`);
            setIsDownloading(false);
        }
    };

    if (!isOpen || !invoice) return null;
    
    const brand = getBrand(invoice.brandId);
    const statusStyles: { [key: string]: string } = {
        'Paid': 'text-green-600 bg-green-100 border-green-500',
        'Pending': 'text-yellow-600 bg-yellow-100 border-yellow-500',
        'Overdue': 'text-red-600 bg-red-100 border-red-500',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Invoice ${invoice.invoiceNumber}`} maxWidth="2xl">
            <div className="space-y-6">
                <div ref={invoiceRef} className="bg-white text-gray-800 p-8 rounded-lg">
                    <header className="flex justify-between items-start pb-4 border-b">
                        <div>
                            {agencyLogoUrl ? (
                                <Image src={agencyLogoUrl} alt={agencyName} className="h-12 w-auto" width={48} height={48} />
                            ) : (
                                <h1 className="text-2xl font-bold">{agencyName}</h1>
                            )}
                            <p className="text-sm text-gray-500">123 Agency St, Suite 100<br/>City, State, 12345</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold uppercase text-gray-400">Invoice</h2>
                            <p className="text-sm"># {invoice.invoiceNumber}</p>
                        </div>
                    </header>
                    <section className="grid grid-cols-2 gap-8 my-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                            <p className="font-bold">{brand?.name}</p>
                            <p className="text-sm">{brand?.industry}</p>
                            <p className="text-sm">{brand?.website}</p>
                        </div>
                        <div className="text-right">
                             <p><span className="font-semibold text-gray-600">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                             <p><span className="font-semibold text-gray-600">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                             <p className={`mt-2 font-bold text-lg px-3 py-1 inline-block rounded-md border ${statusStyles[invoice.status]}`}>{invoice.status}</p>
                        </div>
                    </section>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 text-sm font-semibold text-gray-600">
                                <th className="p-3">Description</th>
                                <th className="p-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">Influencer Marketing Campaign Services</td>
                                <td className="p-3 text-right font-semibold">{invoice.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                        </tbody>
                    </table>
                    <footer className="flex justify-end mt-6">
                        <div className="w-1/2">
                             <div className="flex justify-between text-lg">
                                <span className="font-semibold text-gray-600">Total</span>
                                <span className="font-bold">{invoice.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-right">Thank you for your business!</p>
                        </div>
                    </footer>
                </div>
                 <div className="flex justify-end gap-4">
                    <CancelButton onClick={onClose}>Close</CancelButton>
                    <button onClick={handleDownload} disabled={isDownloading} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent disabled:bg-brand-secondary">
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5"/>}
                        {isDownloading ? 'Saving...' : 'Download PDF'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export const NewEventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate }: EventModalProps) => {
    const { scheduleEvent, brands, campaigns } = useStore();
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [type, setType] = useState<EventType>('Meeting');
    const [linkedEntity, setLinkedEntity] = useState('');
    
    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        if (isOpen) {
            const initialDate = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
            setTitle('');
            setStartDate(initialDate);
            setEndDate(initialDate);
            setType('Meeting');
            setLinkedEntity('');
        }
    }, [isOpen, selectedDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [entityType, entityId] = linkedEntity.split('-');
        
        scheduleEvent({
            title,
            start: new Date(`${startDate}T00:00:00`),
            end: new Date(`${endDate}T00:00:00`),
            type,
            brandId: entityType === 'brand' ? entityId : undefined,
            campaignId: entityType === 'campaign' ? entityId : undefined,
        });
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Event">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Event Title"><FormInput value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required /></FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date"><FormInput type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} required /></FormField>
                    <FormField label="End Date"><FormInput type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} required /></FormField>
                </div>
                <FormField label="Event Type">
                    <FormSelect value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as EventType)}>
                        <option>Meeting</option>
                        <option>Appointment</option>
                        <option>Deadline</option>
                        <option>Campaign Milestone</option>
                    </FormSelect>
                </FormField>
                <FormField label="Link to (Optional)">
                    <FormSelect value={linkedEntity} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLinkedEntity(e.target.value)}>
                        <option value="">None</option>
                        <optgroup label="Brands">
                            {brands.map(b => <option key={b.id} value={`brand-${b.id}`}>{b.name}</option>)}
                        </optgroup>
                        <optgroup label="Campaigns">
                            {campaigns.map(c => <option key={c.id} value={`campaign-${c.id}`}>{c.name}</option>)}
                        </optgroup>
                    </FormSelect>
                </FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Schedule Event</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, eventToView }: EventDetailModalProps) => {
    const { updateEvent, deleteEvent, getBrand, getCampaign, brands, campaigns } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState<Event | null>(null);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    useEffect(() => {
        if (isOpen && eventToView) {
            setEditedEvent(eventToView);
        } else {
            setIsEditing(false);
            setEditedEvent(null);
        }
    }, [isOpen, eventToView]);

    const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

    const handleSave = () => {
        if (editedEvent) {
            updateEvent(editedEvent.id, editedEvent);
            onClose();
        }
    };
    
    const handleDelete = () => {
        if (editedEvent) {
            deleteEvent(editedEvent.id);
            notificationService.show({ message: 'Event deleted.', type: 'success' });
            setIsConfirmingDelete(false);
            onClose();
        }
    };
    
    const handleChange = (field: keyof Event, value: string | Date | boolean | EventType) => {
        if (editedEvent) {
            setEditedEvent({ ...editedEvent, [field]: value });
        }
    };

    const handleLinkedEntityChange = (value: string) => {
        if (editedEvent) {
            const [type, id] = value.split('-');
            setEditedEvent({ 
                ...editedEvent, 
                brandId: type === 'brand' ? id : undefined,
                campaignId: type === 'campaign' ? id : undefined,
            });
        }
    };


    if (!isOpen || !editedEvent) return null;

    const brand = editedEvent.brandId ? getBrand(editedEvent.brandId) : null;
    const campaign = editedEvent.campaignId ? getCampaign(editedEvent.campaignId) : null;
    const linkedEntityValue = brand ? `brand-${brand.id}` : campaign ? `campaign-${campaign.id}` : '';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Event' : 'Event Details'}>
            {isEditing ? (
                <div className="space-y-4">
                    <FormField label="Event Title"><FormInput value={editedEvent.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)} /></FormField>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Start Date"><FormInput type="date" value={formatDateForInput(editedEvent.start)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('start', new Date(e.target.value))} /></FormField>
                        <FormField label="End Date"><FormInput type="date" value={formatDateForInput(editedEvent.end)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('end', new Date(e.target.value))} /></FormField>
                    </div>
                    <FormField label="Event Type">
                        <FormSelect value={editedEvent.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('type', e.target.value)}>
                             <option>Meeting</option><option>Appointment</option><option>Deadline</option><option>Campaign Milestone</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Link to (Optional)">
                        <FormSelect value={linkedEntityValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleLinkedEntityChange(e.target.value)}>
                             <option value="">None</option>
                            <optgroup label="Brands">{brands.map(b => <option key={b.id} value={`brand-${b.id}`}>{b.name}</option>)}</optgroup>
                            <optgroup label="Campaigns">{campaigns.map(c => <option key={c.id} value={`campaign-${c.id}`}>{c.name}</option>)}</optgroup>
                        </FormSelect>
                    </FormField>
                    <div className="flex justify-end gap-4 pt-4">
                        <CancelButton onClick={() => setIsEditing(false)} />
                        <FormButton onClick={handleSave}>Save Changes</FormButton>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-brand-text-primary">{editedEvent.title}</h3>
                    <p><span className="font-semibold text-brand-text-secondary">Type:</span> {editedEvent.type}</p>
                    <p><span className="font-semibold text-brand-text-secondary">From:</span> {editedEvent.start.toLocaleDateString()}</p>
                    <p><span className="font-semibold text-brand-text-secondary">To:</span> {editedEvent.end.toLocaleDateString()}</p>
                    {brand && <p><span className="font-semibold text-brand-text-secondary">Brand:</span> <Link href={`/brands/${brand.id}`} className="text-brand-primary hover:underline">{brand.name}</Link></p>}
                    {campaign && <p><span className="font-semibold text-brand-text-secondary">Campaign:</span> <Link href={`/campaigns/${campaign.id}`} className="text-brand-primary hover:underline">{campaign.name}</Link></p>}
                    <div className="flex justify-end gap-4 pt-4 border-t border-brand-border">
                        <button onClick={() => setIsConfirmingDelete(true)} className="flex items-center gap-2 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border">
                           <FilePenLine className="w-4 h-4" /> Edit
                        </button>
                    </div>
                </div>
            )}
             <ConfirmationModal
                isOpen={isConfirmingDelete}
                onClose={() => setIsConfirmingDelete(false)}
                onConfirm={handleDelete}
                title={`Delete Event: "${editedEvent?.title}"?`}
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete Event"
            />
        </Modal>
    );
};


export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit, parentId }: TaskModalProps) => {
  const { addTask, updateTask, campaigns, contracts } = useStore();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [linkedEntity, setLinkedEntity] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDueDate(taskToEdit.dueDate);
      setStatus(taskToEdit.status);
      setLinkedEntity(taskToEdit.relatedCampaignId ? `campaign-${taskToEdit.relatedCampaignId}` : taskToEdit.relatedContractId ? `contract-${taskToEdit.relatedContractId}` : '');
    } else {
      setTitle('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setStatus('pending');
      setLinkedEntity('');
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const [type, id] = linkedEntity.split('-');
    const taskData: Omit<Task, 'id'> = {
      title,
      dueDate,
      status,
      relatedCampaignId: type === 'campaign' ? id : undefined,
      relatedContractId: type === 'contract' ? id : undefined,
      parentId: parentId,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'Edit Task' : (parentId ? 'Add Subtask' : 'Create New Task')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title"><FormInput value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required /></FormField>
        <FormField label="Due Date"><FormInput type="date" value={dueDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)} required /></FormField>
        <FormField label="Link to (Optional)">
          <FormSelect value={linkedEntity} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLinkedEntity(e.target.value)}>
            <option value="">None</option>
            <optgroup label="Campaigns">
              {campaigns.map(c => <option key={c.id} value={`campaign-${c.id}`}>{c.name}</option>)}
            </optgroup>
            <optgroup label="Contracts">
              {contracts.map(c => <option key={c.id} value={`contract-${c.id}`}>{c.title}</option>)}
            </optgroup>
          </FormSelect>
        </FormField>
        <div className="flex justify-end gap-4 pt-4">
            <CancelButton onClick={onClose} />
            <FormButton>{taskToEdit ? 'Save Changes' : 'Create Task'}</FormButton>
        </div>
      </form>
    </Modal>
  );
};

export const NewTransactionModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { logTransaction } = useStore();
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !category || amount <= 0) {
            // Add some basic validation feedback
            alert('Please fill out all fields correctly.');
            return;
        }
        logTransaction({ description, type, category, amount });
        onClose();
    };
    
    useEffect(() => {
        if (isOpen) {
            setDescription('');
            setType('expense');
            setCategory('');
            setAmount(0);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log New Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Description"><FormInput value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required /></FormField>
                <div className="grid grid-cols-2 gap-4">
                     <FormField label="Type">
                        <FormSelect value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as 'income' | 'expense')}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </FormSelect>
                    </FormField>
                    <FormField label="Amount ($)"><FormInput type="number" value={amount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))} required min="0.01" step="0.01" /></FormField>
                </div>
                  <FormField label="Category"><FormInput value={category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} placeholder="e.g., Software, Payouts, Campaign Payment" required /></FormField>
                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} />
                    <FormButton>Log Transaction</FormButton>
                </div>
            </form>
        </Modal>
    );
};