// FIX: Implemented the BrandDetail component, which was previously missing.
// This resolves the "is not a module" error in App.tsx.
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { FilePenLine, Lock, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ChartData {
  label: string;
  value: number;
}

// Simple Chart component fallback since Chart component doesn't exist
const Chart: React.FC<{ type: string; title: string; data: ChartData[] }> = ({ title }) => {
  return (
    <div className="bg-brand-bg rounded-lg p-4 h-64 flex items-center justify-center">
      <p className="text-brand-text-secondary">Chart: {title}</p>
    </div>
  );
};

// Simple notification service fallback
const notificationService = {
  show: ({ message, type }: { message: string; type: string }) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};

const TabButton: React.FC<{ name: string; label: string; activeTab: string; setActiveTab: (name: string) => void; }> = ({ name, label, activeTab, setActiveTab }) => {
    const isActive = activeTab === name;
    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`py-3 px-1 text-lg font-semibold transition-colors relative ${isActive ? 'text-brand-text-primary' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
        >
            {label}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
        </button>
    );
};

const ClientPortalTab: React.FC<{ brandId: string }> = ({ brandId }) => {
    const { getBrand, enablePortalAccess } = useStore();
    const brand = getBrand(brandId);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!brand) return null;
    
    const handleEnableAccess = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            enablePortalAccess(brandId, email, password);
        } else {
             notificationService.show({ message: 'Please provide both email and password.', type: 'error' });
        }
    };

    return (
        <div className="futuristic-border bg-brand-surface rounded-xl p-6">
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">Client Portal Access</h2>
            {brand.portalAccess ? (
                <div className="space-y-4">
                    <p className="text-brand-success">Portal access is active for this client.</p>
                    <div>
                        <p className="text-sm font-semibold text-brand-text-secondary">Login Email</p>
                        <p className="text-brand-text-primary">{brand.portalUserEmail}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-brand-text-secondary">Password</p>
                        <p className="text-brand-text-primary text-xs">Password is securely stored. You can set a new one if needed.</p>
                    </div>
                    <a href="#/portal/login" target="_blank" className="inline-block mt-4 text-brand-primary hover:underline">
                        Go to Client Portal Login &rarr;
                    </a>
                </div>
            ) : (
                <form onSubmit={handleEnableAccess} className="space-y-4 max-w-md">
                    <p className="text-brand-text-secondary">Create a secure login for your client to view their campaign progress and approve content.</p>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Client Login Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Set Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-text-secondary">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors">
                            <Lock className="w-4 h-4" /> Enable Portal Access
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};


const BrandDetail: React.FC = () => {
    const { brandId } = useParams<{ brandId: string }>();
    const { getBrand, campaigns, getInfluencer } = useStore();
    const [activeTab, setActiveTab] = useState('overview');

    const brand = getBrand(brandId!);

    if (!brand) {
        return <div className="text-center text-brand-text-primary">Brand not found.</div>;
    }

    const relatedCampaigns = campaigns.filter(c => c.brandId === brand.id);
    const relatedInfluencers = Array.from(new Set(relatedCampaigns.flatMap(c => c.influencerIds)))
        .map(id => getInfluencer(id))
        .filter(Boolean);

    const roiData = [
        { label: 'Q1', value: 150, color: '#3182CE' },
        { label: 'Q2', value: 220, color: '#38A169' },
        { label: 'Q3', value: 180, color: '#DD6B20' },
        { label: 'Q4', value: 250, color: '#D53F8C' },
    ];
    
     const renderTabContent = () => {
        switch (activeTab) {
            case 'portal':
                return <ClientPortalTab brandId={brand.id} />;
            case 'overview':
            default:
                return (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Campaign ROI (%)</h2>
                                <Chart type="bar" title="Quarterly Return on Investment" data={roiData} />
                            </div>
                             <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Notes</h2>
                                <p className="text-brand-text-secondary whitespace-pre-wrap">{brand.notes || 'No notes available.'}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Active Campaigns</h2>
                                <div className="space-y-3">
                                    {relatedCampaigns.length > 0 ? relatedCampaigns.map(c => (
                                        <Link key={c.id} href={`/campaigns/${c.id}`} className="block p-3 bg-brand-bg rounded-lg hover:bg-brand-bg/50">
                                            <p className="font-semibold text-brand-text-primary">{c.name}</p>
                                            <p className="text-sm text-brand-text-secondary">
                                                Ends: {new Date(c.endDate).toLocaleDateString()}
                                            </p>
                                        </Link>
                                    )) : <p className="text-brand-text-secondary">No active campaigns.</p>}
                                </div>
                            </div>
                             <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                                <h2 className="text-xl font-bold text-brand-text-primary mb-4">Collaborating Influencers</h2>
                                <div className="space-y-3">
                                    {relatedInfluencers.length > 0 ? relatedInfluencers.map(i => i && (
                                        <Link key={i.id} href={`/influencers/${i.id}`} className="flex items-center gap-3 p-2 bg-brand-bg rounded-lg hover:bg-brand-bg/50">
                                            <Image src={i.avatarUrl || '/default-avatar.png'} alt={i.name} width={32} height={32} className="w-8 h-8 rounded-full"/>
                                            <p className="font-semibold text-brand-text-primary">{i.name}</p>
                                        </Link>
                                    )) : <p className="text-brand-text-secondary">No influencers found.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-8 p-6 futuristic-border bg-brand-surface rounded-xl">
                <Image src={brand.logoUrl} alt={`${brand.name} logo`} width={128} height={128} className="w-32 h-32 rounded-full border-4 border-brand-primary object-cover" />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold font-display text-brand-text-primary">{brand.name}</h1>
                            <p className="text-lg text-brand-text-secondary mt-1">{brand.industry}</p>
                        </div>
                         <button className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors">
                            <FilePenLine className="w-5 h-5"/> Edit
                        </button>
                    </div>
                    {brand.website && (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-brand-primary hover:underline mt-4">
                            <ExternalLink className="w-5 h-5" />
                            {brand.website}
                        </a>
                    )}
                </div>
            </div>
            
            <div className="border-b border-brand-border flex items-center gap-8">
                <TabButton name="overview" label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton name="portal" label="Client Portal" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="animate-page-enter">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default BrandDetail;