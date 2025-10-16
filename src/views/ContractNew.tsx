

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../hooks/useStore';
import notificationService from '../services/notificationService';

const ContractNew: React.FC = () => {
    const router = useRouter();
    const { influencers, brands } = useStore();

    // Pre-fill from navigation state if available
    const [title, setTitle] = useState('');
    const [influencerName, setInfluencerName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [status, setStatus] = useState('Draft');
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would create a new contract object and save it.
        console.log({
            title,
            influencerName,
            brandName,
            status,
            value
        });
        notificationService.show({
            message: `Contract "${title}" drafted successfully!`,
            type: 'success',
        });
        // Navigate to the main contracts page after creation
        router.push('/contracts');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-8">Draft New Contract</h1>
            
            <div className="max-w-2xl mx-auto futuristic-border bg-brand-surface rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-brand-text-secondary mb-1">Contract Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="e.g., Q4 Holiday Campaign"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="influencer" className="block text-sm font-medium text-brand-text-secondary mb-1">Influencer</label>
                        <input
                            type="text"
                            id="influencer"
                            value={influencerName}
                            onChange={(e) => setInfluencerName(e.target.value)}
                            list="influencers-list"
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="Select or type an influencer"
                            required
                        />
                        <datalist id="influencers-list">
                            {influencers.map(i => <option key={i.id} value={i.name} />)}
                        </datalist>
                    </div>

                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-brand-text-secondary mb-1">Brand</label>
                         <input
                            type="text"
                            id="brand"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            list="brands-list"
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder="Select or type a brand"
                            required
                        />
                        <datalist id="brands-list">
                            {brands.map(b => <option key={b.id} value={b.name} />)}
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-brand-text-secondary mb-1">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            >
                                <option>Draft</option>
                                <option>Pending</option>
                                <option>Signed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-brand-text-secondary mb-1">Contract Value ($)</label>
                            <input
                                type="number"
                                id="value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                placeholder="e.g., 25000"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => window.location.href = '/contracts'} className="bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent">
                            Save Draft
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContractNew;
