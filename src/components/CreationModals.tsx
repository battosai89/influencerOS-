import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import useStore from '@/hooks/useStore';
import Modal from './Modal';

// Simple fallback for ConfirmationModal
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  disabled?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', disabled = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={disabled}
            className={`px-4 py-2 border rounded ${
              disabled
                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                : 'text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className={`px-4 py-2 rounded transition-all duration-200 ${
              disabled
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
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

const FormButton: React.FC<{ children: React.ReactNode, onClick?: () => void, type?: 'submit' | 'button', disabled?: boolean }> = ({ children, onClick, type = 'submit', disabled = false }: { children: React.ReactNode, onClick?: () => void, type?: 'submit' | 'button', disabled?: boolean }) => (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         className={`font-semibold py-3 px-6 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
           disabled
             ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
             : 'bg-brand-primary text-white hover:bg-brand-accent hover:shadow-glow-md'
         }`}
     >
         {children}
     </button>
 );

 const CancelButton: React.FC<{ children?: React.ReactNode; onClick: () => void; disabled?: boolean }> = ({ children, onClick, disabled = false }: { children?: React.ReactNode; onClick: () => void; disabled?: boolean }) => (
      <button
         type="button"
         onClick={onClick}
         disabled={disabled}
         className={`border font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
           disabled
             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
             : 'bg-brand-surface border-brand-border text-brand-text-primary hover:bg-brand-border hover:border-brand-primary'
         }`}
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
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setType('influencer');
            setName('');
            setPlatform('Instagram');
            setFollowers(0);
            setStatus('lead');
            setIndustry('');
            setWebsite('');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (type === 'influencer') {
            if (followers < 0) {
                newErrors.followers = 'Followers cannot be negative';
            }
        } else {
            if (!industry.trim()) {
                newErrors.industry = 'Industry is required for brands';
            }
            if (website && !website.match(/^https?:\/\/.+/)) {
                newErrors.website = 'Website must be a valid URL (include http:// or https://)';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (type === 'influencer') {
                addClient({
                    name: name.trim(),
                    platform,
                    followers,
                    status,
                    engagementRate: 0
                }, 'influencer');
                notificationService.show({
                    message: 'Influencer client created successfully!',
                    type: 'success'
                });
            } else {
                addClient({
                    name: name.trim(),
                    industry: industry.trim(),
                    website: website.trim()
                }, 'brand');
                notificationService.show({
                    message: 'Brand client created successfully!',
                    type: 'success'
                });
            }
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to create client. Please try again.',
                type: 'error'
            });
            console.error('Error creating client:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                
                <div>
                    <FormField label="Name">
                        <FormInput
                            type="text"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter client name..."
                        />
                    </FormField>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {type === 'influencer' ? (
                    <>
                        <FormField label="Platform">
                            <FormSelect value={platform} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatform(e.target.value as 'Instagram' | 'TikTok' | 'YouTube')}>
                                <option>Instagram</option><option>TikTok</option><option>YouTube</option>
                            </FormSelect>
                        </FormField>
                        <div>
                            <FormField label="Followers">
                                <FormInput
                                    type="number"
                                    value={followers}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowers(Number(e.target.value))}
                                    min="0"
                                    className={errors.followers ? 'border-red-500 focus:ring-red-500' : ''}
                                />
                            </FormField>
                            {errors.followers && <p className="text-red-500 text-sm mt-1">{errors.followers}</p>}
                        </div>
                        <FormField label="Status">
                             <FormSelect value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Influencer['status'])}>
                                <option value="lead">Lead</option><option value="contacted">Contacted</option><option value="negotiating">Negotiating</option>
                                <option value="signed">Signed</option><option value="active">Active</option><option value="inactive">Inactive</option>
                            </FormSelect>
                        </FormField>
                    </>
                ) : (
                    <>
                        <div>
                            <FormField label="Industry">
                                <FormInput
                                    type="text"
                                    value={industry}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                                    className={errors.industry ? 'border-red-500 focus:ring-red-500' : ''}
                                    placeholder="e.g., Fashion, Technology, Beauty..."
                                />
                            </FormField>
                            {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                        </div>
                        <div>
                            <FormField label="Website">
                                <FormInput
                                    type="url"
                                    placeholder="https://example.com"
                                    value={website}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)}
                                    className={errors.website ? 'border-red-500 focus:ring-red-500' : ''}
                                />
                            </FormField>
                            {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Create Client</FormButton>
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
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setName('');
            setBrandId('');
            setInfluencerIds([]);
            setStartDate('');
            setEndDate('');
            setBudget(0);
            setCategory('');
            setStatus('Planning');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!name.trim()) {
            newErrors.name = 'Campaign name is required';
        }

        if (!brandId) {
            newErrors.brandId = 'Please select a brand';
        }

        if (influencerIds.length === 0) {
            newErrors.influencerIds = 'Please select at least one influencer';
        }

        if (!startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!endDate) {
            newErrors.endDate = 'End date is required';
        } else if (startDate && new Date(endDate) <= new Date(startDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (budget <= 0) {
            newErrors.budget = 'Budget must be greater than 0';
        }

        if (!category.trim()) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            createCampaign({
                name: name.trim(),
                brandId,
                influencerIds,
                startDate,
                endDate,
                budget,
                category: category.trim(),
                status,
                milestones: []
            });

            notificationService.show({
                message: 'Campaign created successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to create campaign. Please try again.',
                type: 'error'
            });
            console.error('Error creating campaign:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Campaign">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Campaign Name">
                        <FormInput
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter campaign name..."
                        />
                    </FormField>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <FormField label="Brand">
                        <FormSelect
                            value={brandId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)}
                            required
                            className={errors.brandId ? 'border-red-500 focus:ring-red-500' : ''}
                        >
                            <option value="">Select a brand</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </FormSelect>
                    </FormField>
                    {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
                </div>

                <div>
                    <FormField label="Influencers">
                        <FormSelect
                            multiple
                            value={influencerIds}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInfluencerIds(Array.from(e.target.selectedOptions, option => (option as HTMLOptionElement).value))}
                            className={errors.influencerIds ? 'border-red-500 focus:ring-red-500' : ''}
                        >
                            {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </FormSelect>
                    </FormField>
                    {errors.influencerIds && <p className="text-red-500 text-sm mt-1">{errors.influencerIds}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField label="Start Date">
                            <FormInput
                                type="date"
                                value={startDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                                required
                                className={errors.startDate ? 'border-red-500 focus:ring-red-500' : ''}
                            />
                        </FormField>
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                        <FormField label="End Date">
                            <FormInput
                                type="date"
                                value={endDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                                required
                                className={errors.endDate ? 'border-red-500 focus:ring-red-500' : ''}
                            />
                        </FormField>
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField label="Budget ($)">
                            <FormInput
                                type="number"
                                value={budget}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(Number(e.target.value))}
                                required
                                min="0.01"
                                step="0.01"
                                className={errors.budget ? 'border-red-500 focus:ring-red-500' : ''}
                                placeholder="0.00"
                            />
                        </FormField>
                        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                    </div>
                    <div>
                        <FormField label="Category">
                            <FormInput
                                value={category}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                                placeholder="e.g., Beauty, Tech, Fashion"
                                required
                                className={errors.category ? 'border-red-500 focus:ring-red-500' : ''}
                            />
                        </FormField>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
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
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Create Campaign</FormButton>
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
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setBrandId('');
            setInfluencerId('');
            setValue(0);
            setTemplateId('');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!title.trim()) {
            newErrors.title = 'Contract title is required';
        }

        if (!brandId) {
            newErrors.brandId = 'Please select a brand';
        }

        if (!influencerId) {
            newErrors.influencerId = 'Please select an influencer';
        }

        if (value <= 0) {
            newErrors.value = 'Contract value must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            addContract({
                title: title.trim(),
                brandId,
                influencerId,
                value,
                status: 'Draft',
                templateId: templateId || undefined
            });

            notificationService.show({
                message: 'Contract created successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to create contract. Please try again.',
                type: 'error'
            });
            console.error('Error creating contract:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Contract">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Contract Title">
                        <FormInput
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            placeholder="e.g., Q4 Holiday Campaign"
                            required
                            className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
                        />
                    </FormField>
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <FormField label="Brand">
                        <FormSelect
                            value={brandId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)}
                            required
                            className={errors.brandId ? 'border-red-500 focus:ring-red-500' : ''}
                        >
                            <option value="">Select Brand</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </FormSelect>
                    </FormField>
                    {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
                </div>

                <div>
                    <FormField label="Influencer">
                        <FormSelect
                            value={influencerId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInfluencerId(e.target.value)}
                            required
                            className={errors.influencerId ? 'border-red-500 focus:ring-red-500' : ''}
                        >
                            <option value="">Select Influencer</option>
                            {influencers.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </FormSelect>
                    </FormField>
                    {errors.influencerId && <p className="text-red-500 text-sm mt-1">{errors.influencerId}</p>}
                </div>

                <FormField label="Template">
                    <FormSelect value={templateId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTemplateId(e.target.value)}>
                        <option value="">Select a template (optional)</option>
                        {contractTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </FormSelect>
                </FormField>

                <div>
                    <FormField label="Value ($)">
                        <FormInput
                            type="number"
                            value={value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))}
                            required
                            min="0.01"
                            step="0.01"
                            className={errors.value ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="0.00"
                        />
                    </FormField>
                    {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Create Contract</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const NewTemplateModal: React.FC<CreationModalProps> = ({ isOpen, onClose }: CreationModalProps) => {
    const { addContractTemplate } = useStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!name.trim()) {
            newErrors.name = 'Template name is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            addContractTemplate({
                name: name.trim(),
                description: description.trim()
            });

            notificationService.show({
                message: 'Contract template created successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to create template. Please try again.',
                type: 'error'
            });
            console.error('Error creating template:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
         <Modal isOpen={isOpen} onClose={onClose} title="Create New Template">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Template Name">
                        <FormInput
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            required
                            className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter template name..."
                        />
                    </FormField>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <FormField label="Description">
                        <FormInput
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            required
                            className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter template description..."
                        />
                    </FormField>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Create Template</FormButton>
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
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setBrandId('');
            setAmount(0);
            setDueDate('');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!brandId) {
            newErrors.brandId = 'Please select a brand';
        }

        if (amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        if (!dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else if (new Date(dueDate) < new Date(new Date().toDateString())) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (createInvoice) {
                createInvoice({
                    brandId,
                    amount,
                    dueDate
                });

                notificationService.show({
                    message: 'Invoice created successfully!',
                    type: 'success'
                });
                onClose();
            }
        } catch (error) {
            notificationService.show({
                message: 'Failed to create invoice. Please try again.',
                type: 'error'
            });
            console.error('Error creating invoice:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Brand">
                        <FormSelect
                            value={brandId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBrandId(e.target.value)}
                            required
                            className={errors.brandId ? 'border-red-500 focus:ring-red-500' : ''}
                        >
                            <option value="">Select a brand</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </FormSelect>
                    </FormField>
                    {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId}</p>}
                </div>

                <div>
                    <FormField label="Amount ($)">
                        <FormInput
                            type="number"
                            value={amount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                            required
                            min="0.01"
                            step="0.01"
                            className={errors.amount ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="0.00"
                        />
                    </FormField>
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                <div>
                    <FormField label="Due Date">
                        <FormInput
                            type="date"
                            value={dueDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
                            required
                            className={errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}
                        />
                    </FormField>
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Create Invoice</FormButton>
                </div>
            </form>
        </Modal>
    );
};

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ isOpen, onClose, invoice }: InvoiceDetailModalProps) => {
    const { getBrand, agencyName, agencyLogoUrl } = useStore();
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setIsDownloading(false);
            setDownloadError(null);
        }
    }, [isOpen]);

    const handleDownload = async () => {
        if (!invoiceRef.current || !invoice) {
            setDownloadError('Unable to generate PDF. Invoice data is missing.');
            return;
        }

        setIsDownloading(true);
        setDownloadError(null);

        try {
            await exportPageToPdf(invoiceRef.current, `invoice_${invoice.invoiceNumber}.pdf`);

            notificationService.show({
                message: 'Invoice PDF downloaded successfully!',
                type: 'success'
            });
        } catch (error) {
            const errorMessage = 'Failed to download PDF. Please try again.';
            setDownloadError(errorMessage);

            notificationService.show({
                message: errorMessage,
                type: 'error'
            });
            console.error('Error downloading invoice PDF:', error);
        } finally {
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

                {downloadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm">{downloadError}</p>
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <CancelButton onClick={onClose} disabled={isDownloading}>Close</CancelButton>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || !invoice}
                        className={`flex items-center gap-2 font-semibold py-2 px-6 rounded-lg transition-all duration-200 ${
                            isDownloading || !invoice
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-brand-primary text-white hover:bg-brand-accent hover:shadow-glow-md'
                        }`}
                    >
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5"/>}
                        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
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
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [type, setType] = useState<EventType>('Meeting');
    const [allDay, setAllDay] = useState(true);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#3B82F6');
    const [linkedEntity, setLinkedEntity] = useState('');
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            const initialDate = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
            setTitle('');
            setStartDate(initialDate);
            setEndDate(initialDate);
            setStartTime('09:00');
            setEndTime('10:00');
            setType('Meeting');
            setAllDay(true);
            setLocation('');
            setDescription('');
            setColor('#3B82F6');
            setLinkedEntity('');
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, selectedDate]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!endDate) {
            newErrors.endDate = 'End date is required';
        } else if (startDate && new Date(endDate) < new Date(startDate)) {
            newErrors.endDate = 'End date must be on or after start date';
        }

        if (!allDay) {
            if (!startTime) {
                newErrors.startTime = 'Start time is required';
            }
            if (!endTime) {
                newErrors.endTime = 'End time is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const [entityType, entityId] = linkedEntity.split('-') || ['', ''];

            // Create date objects in user's local timezone
            const startDateTime = new Date(`${startDate}T00:00:00`);
            const endDateTime = new Date(`${endDate}T23:59:59`);

            const eventData = {
                id: `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                title: title.trim(),
                start: `${startDate}T00:00:00.000Z`,
                end: `${endDate}T23:59:59.000Z`,
                allDay: allDay,
                type: type as EventType,
                brandId: entityType === 'brand' ? entityId : undefined,
                campaignId: entityType === 'campaign' ? entityId : undefined,
            };

            scheduleEvent(eventData);

            notificationService.show({
                message: 'Event scheduled successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to schedule event. Please try again.',
                type: 'error'
            });
            console.error('Error scheduling event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Event">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Event Title">
                        <FormInput
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            required
                            className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter event title..."
                        />
                    </FormField>
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <FormField label="Start Date">
                            <FormInput
                                type="date"
                                value={startDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                                required
                                className={errors.startDate ? 'border-red-500 focus:ring-red-500' : ''}
                            />
                        </FormField>
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>
                    <div>
                        <FormField label="End Date">
                            <FormInput
                                type="date"
                                value={endDate}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                                required
                                className={errors.endDate ? 'border-red-500 focus:ring-red-500' : ''}
                            />
                        </FormField>
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                    </div>
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
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Schedule Event</FormButton>
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
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen && eventToView) {
            setEditedEvent(eventToView);
            setIsEditing(false);
            setIsConfirmingDelete(false);
            setIsSaving(false);
            setIsDeleting(false);
            setErrors({});
        } else if (!isOpen) {
            setIsEditing(false);
            setEditedEvent(null);
            setIsConfirmingDelete(false);
            setIsSaving(false);
            setIsDeleting(false);
            setErrors({});
        }
    }, [isOpen, eventToView]);

    const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

    // Enhanced form validation
    const validateForm = () => {
        if (!editedEvent) return false;

        const newErrors: {[key: string]: string} = {};

        if (!editedEvent.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!editedEvent.start) {
            newErrors.start = 'Start date is required';
        }

        if (!editedEvent.end) {
            newErrors.end = 'End date is required';
        } else if (editedEvent.start && editedEvent.end < editedEvent.start) {
            newErrors.end = 'End date must be on or after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!editedEvent || !validateForm() || isSaving) return;

        setIsSaving(true);

        try {
            updateEvent(editedEvent.id, editedEvent);

            notificationService.show({
                message: 'Event updated successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to update event. Please try again.',
                type: 'error'
            });
            console.error('Error updating event:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!editedEvent || isDeleting) return;

        setIsDeleting(true);

        try {
            deleteEvent(editedEvent.id);

            notificationService.show({
                message: 'Event deleted successfully!',
                type: 'success'
            });
            setIsConfirmingDelete(false);
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to delete event. Please try again.',
                type: 'error'
            });
            console.error('Error deleting event:', error);
        } finally {
            setIsDeleting(false);
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
                    <div>
                        <FormField label="Event Title">
                            <FormInput
                                value={editedEvent.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('title', e.target.value)}
                                className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
                                placeholder="Enter event title..."
                            />
                        </FormField>
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FormField label="Start Date">
                                <FormInput
                                    type="date"
                                    value={formatDateForInput(editedEvent.start)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('start', new Date(e.target.value))}
                                    className={errors.start ? 'border-red-500 focus:ring-red-500' : ''}
                                />
                            </FormField>
                            {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
                        </div>
                        <div>
                            <FormField label="End Date">
                                <FormInput
                                    type="date"
                                    value={formatDateForInput(editedEvent.end)}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('end', new Date(e.target.value))}
                                    className={errors.end ? 'border-red-500 focus:ring-red-500' : ''}
                                />
                            </FormField>
                            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
                        </div>
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
                        <CancelButton onClick={() => setIsEditing(false)} disabled={isSaving} />
                        <FormButton onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </FormButton>
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
                        <button
                            onClick={() => setIsConfirmingDelete(true)}
                            disabled={isDeleting}
                            className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                                isDeleting
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-500 hover:bg-red-500/10'
                            }`}
                        >
                            <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isDeleting}
                            className={`flex items-center gap-2 border text-brand-text-primary font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                                isDeleting
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-brand-surface border-brand-border hover:bg-brand-border'
                            }`}
                        >
                           <FilePenLine className="w-4 h-4" /> Edit
                        </button>
                    </div>
                </div>
            )}
             <ConfirmationModal
                isOpen={isConfirmingDelete}
                onClose={() => !isDeleting && setIsConfirmingDelete(false)}
                onConfirm={handleDelete}
                title={`Delete Event: "${editedEvent?.title}"?`}
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText={isDeleting ? "Deleting..." : "Delete Event"}
                disabled={isDeleting}
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced form reset with proper initialization
  useEffect(() => {
    if (isOpen) {
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
      setErrors({});
      setIsSubmitting(false);
    }
  }, [taskToEdit, isOpen]);

  // Enhanced form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(dueDate) < new Date(new Date().toDateString())) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || isSubmitting) return;

      setIsSubmitting(true);

      try {
          const [type, id] = linkedEntity.split('-');
          const taskData: Omit<Task, 'id'> = {
              title: title.trim(),
              dueDate,
              status,
              relatedCampaignId: type === 'campaign' ? id : undefined,
              relatedContractId: type === 'contract' ? id : undefined,
              parentId: parentId,
          };

          console.log('Creating task with data:', taskData);

          if (taskToEdit) {
              updateTask(taskToEdit.id, taskData);
              notificationService.show({
                  message: 'Task updated successfully!',
                  type: 'success'
              });
          } else {
              console.log('Calling addTask...');
              await addTask(taskData);
              console.log('addTask completed successfully');
              notificationService.show({
                  message: 'Task created successfully!',
                  type: 'success'
              });
          }
          onClose();
      } catch (error) {
          console.error('Error saving task:', error);
          notificationService.show({
              message: `Failed to save task: ${error instanceof Error ? error.message : 'Unknown error'}`,
              type: 'error'
          });
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? 'Edit Task' : (parentId ? 'Add Subtask' : 'Create New Task')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FormField label="Title">
            <FormInput
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              required
              className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
              placeholder="Enter task title..."
            />
          </FormField>
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <FormField label="Due Date">
            <FormInput
              type="date"
              value={dueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              required
              className={errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}
            />
          </FormField>
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
        </div>

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
            <CancelButton onClick={onClose} disabled={isSubmitting} />
            <FormButton disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (taskToEdit ? 'Save Changes' : 'Create Task')}
            </FormButton>
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
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Enhanced form reset with proper initialization
    useEffect(() => {
        if (isOpen) {
            setDescription('');
            setType('expense');
            setCategory('');
            setAmount(0);
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Enhanced form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            logTransaction({
                description: description.trim(),
                type,
                category: category.trim(),
                amount
            });

            notificationService.show({
                message: 'Transaction logged successfully!',
                type: 'success'
            });
            onClose();
        } catch (error) {
            notificationService.show({
                message: 'Failed to log transaction. Please try again.',
                type: 'error'
            });
            console.error('Error logging transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Log New Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <FormField label="Description">
                        <FormInput
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                            required
                            className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
                            placeholder="Enter transaction description..."
                        />
                    </FormField>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <FormField label="Type">
                        <FormSelect value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as 'income' | 'expense')}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </FormSelect>
                    </FormField>
                    <div>
                        <FormField label="Amount ($)">
                            <FormInput
                                type="number"
                                value={amount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                                required
                                min="0.01"
                                step="0.01"
                                className={errors.amount ? 'border-red-500 focus:ring-red-500' : ''}
                                placeholder="0.00"
                            />
                        </FormField>
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                </div>

                <div>
                    <FormField label="Category">
                        <FormInput
                            value={category}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                            placeholder="e.g., Software, Payouts, Campaign Payment"
                            required
                            className={errors.category ? 'border-red-500 focus:ring-red-500' : ''}
                        />
                    </FormField>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <CancelButton onClick={onClose} disabled={isSubmitting} />
                    <FormButton disabled={isSubmitting}>Log Transaction</FormButton>
                </div>
            </form>
        </Modal>
    );
};