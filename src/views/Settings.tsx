import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import useStore from '../hooks/useStore';
import { User, Shield, Bell, Palette, Camera, Building, Upload } from 'lucide-react';

interface SettingsProps {
  currentTheme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ProfileSettings: React.FC = () => {
    const { userName, userRole, userAvatarUrl, updateUserProfile } = useStore();
    const [localUserName, setLocalUserName] = useState(userName);
    const [localUserRole, setLocalUserRole] = useState(userRole);
    const [localAvatar, setLocalAvatar] = useState<string | null>(userAvatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalUserName(userName);
        setLocalUserRole(userRole);
        setLocalAvatar(userAvatarUrl);
    }, [userName, userRole, userAvatarUrl]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setLocalAvatar(base64);
        }
    };

    const handleSaveChanges = () => {
        if (localUserName.trim()) {
            updateUserProfile({
                name: localUserName.trim(),
                role: localUserRole.trim(),
                avatarUrl: localAvatar || ''
            });
        }
    };

    return (
        <section>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-1">My Profile</h2>
            <p className="text-brand-text-secondary mb-6">Update your personal information and profile picture.</p>
            <div className="space-y-6 max-w-lg">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full bg-brand-bg flex-shrink-0">
                        {localAvatar ? (
                             <Image src={localAvatar} alt={userName} className="w-full h-full rounded-full object-cover" fill />
                        ) : (
                            <div className="w-full h-full rounded-full bg-brand-surface border-2 border-brand-border flex items-center justify-center font-bold text-4xl text-brand-primary">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white hover:bg-brand-accent border-2 border-brand-surface" aria-label="Change profile picture">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-brand-text-primary">{userName}</h3>
                        <p className="text-brand-text-secondary">{userRole}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Name</label>
                        <input type="text" value={localUserName} onChange={(e) => setLocalUserName(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary mb-1">Role/Title</label>
                        <input type="text" value={localUserRole} onChange={(e) => setLocalUserRole(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Email</label>
                    <input type="email" defaultValue="alex@influenceros.com" readOnly className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3 py-2 text-brand-text-secondary cursor-not-allowed" />
                </div>
                <div className="pt-2">
                    <button onClick={handleSaveChanges} className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">Save Changes</button>
                </div>
            </div>
        </section>
    );
};

const AgencyProfileSettings: React.FC = () => {
    const { agencyName, agencyLogoUrl, updateAgencyProfile } = useStore();
    const [localAgencyName, setLocalAgencyName] = useState(agencyName);
    const [localLogo, setLocalLogo] = useState<string | null>(agencyLogoUrl);
    const logoInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setLocalAgencyName(agencyName);
        setLocalLogo(agencyLogoUrl);
    }, [agencyName, agencyLogoUrl]);

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const base64 = await fileToBase64(file);
            setLocalLogo(base64);
        }
    };

    const handleSaveChanges = () => {
        if(localAgencyName.trim()){
            updateAgencyProfile({
                name: localAgencyName.trim(),
                logoUrl: localLogo || ''
            });
        }
    };

    return (
        <section>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-1">Agency Profile</h2>
            <p className="text-brand-text-secondary mb-6">Customize your agency&apos;s branding across the application.</p>
            <div className="space-y-6 max-w-lg">
                 <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Agency Name</label>
                    <input type="text" value={localAgencyName} onChange={(e) => setLocalAgencyName(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">Agency Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-14 bg-brand-bg rounded-lg border border-brand-border flex items-center justify-center relative">
                            {localLogo ? <Image src={localLogo} alt="Agency Logo" className="max-w-full max-h-full object-contain" fill /> : <span className="text-xs text-brand-text-secondary">No Logo</span>}
                        </div>
                        <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                        <button onClick={() => logoInputRef.current?.click()} className="flex items-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border">
                            <Upload className="w-4 h-4" /> Upload Logo
                        </button>
                    </div>
                </div>
                 <div className="pt-2">
                    <button onClick={handleSaveChanges} className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">Save Agency Profile</button>
                </div>
            </div>
        </section>
    );
};

const AppearanceSettings: React.FC<Pick<SettingsProps, 'currentTheme' | 'onThemeChange'>> = ({ currentTheme, onThemeChange }) => {
    const { accentColor, setAccentColor } = useStore();
    const colors = [
        { name: 'purple', class: 'bg-[#8B5CF6]' },
        { name: 'blue', class: 'bg-[#3B82F6]' },
        { name: 'green', class: 'bg-[#10B981]' },
        { name: 'amber', class: 'bg-[#F59E0B]' },
        { name: 'red', class: 'bg-[#EF4444]' },
        { name: 'orange', class: 'bg-[#F97316]' },
        { name: 'pink', class: 'bg-[#EC4899]' },
    ];
    return (
        <section>
            <h2 className="text-2xl font-bold text-brand-text-primary mb-1">Appearance</h2>
            <p className="text-brand-text-secondary mb-6">Customize the look and feel of your workspace.</p>
            <div className="max-w-md space-y-6">
                 <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border">
                    <span className="font-medium text-brand-text-primary">Theme</span>
                    <div className="flex items-center gap-1 p-1 bg-brand-bg rounded-full border border-brand-border">
                        <button onClick={() => onThemeChange('light')} className={`px-4 py-1 rounded-full text-sm font-semibold ${currentTheme === 'light' ? 'bg-brand-surface text-brand-text-primary' : 'text-brand-text-secondary'}`}>
                            Light
                        </button>
                        <button onClick={() => onThemeChange('dark')} className={`px-4 py-1 rounded-full text-sm font-semibold ${currentTheme === 'dark' ? 'bg-brand-surface text-brand-text-primary' : 'text-brand-text-secondary'}`}>
                            Dark
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-brand-bg rounded-lg border border-brand-border">
                    <p className="font-medium text-brand-text-primary mb-3">Accent Color</p>
                    <div className="flex items-center gap-4">
                        {colors.map(color => (
                            <button key={color.name} onClick={() => setAccentColor(color.name)} className={`w-8 h-8 rounded-full ${color.class} ring-2 ring-offset-2 ring-offset-brand-bg ${accentColor === color.name ? 'ring-white' : 'ring-transparent hover:ring-white/50'}`}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const SecuritySettings: React.FC = () => (
    <section>
        <h2 className="text-2xl font-bold text-brand-text-primary mb-1">Security</h2>
        <p className="text-brand-text-secondary mb-6">Manage your password and two-factor authentication.</p>
        <p className="text-brand-text-secondary">Security settings coming soon.</p>
    </section>
);
const NotificationsSettings: React.FC = () => (
    <section>
        <h2 className="text-2xl font-bold text-brand-text-primary mb-1">Notifications</h2>
        <p className="text-brand-text-secondary mb-6">Choose how you want to be notified.</p>
        <p className="text-brand-text-secondary">Notification settings coming soon.</p>
    </section>
);


const Settings: React.FC<SettingsProps> = ({ currentTheme, onThemeChange }) => {
    const [activeTab, setActiveTab] = useState('profile');

    const navItems = [
        { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
        { id: 'agency', label: 'Agency Profile', icon: <Building className="w-5 h-5" /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
        { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileSettings />;
            case 'agency': return <AgencyProfileSettings />;
            case 'appearance': return <AppearanceSettings currentTheme={currentTheme} onThemeChange={onThemeChange} />;
            case 'security': return <SecuritySettings />;
            case 'notifications': return <NotificationsSettings />;
            default: return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-text-primary mb-8">Settings</h1>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <aside className="md:w-1/4 lg:w-1/5">
                    <nav className="space-y-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left font-semibold transition-colors ${
                                    activeTab === item.id ? 'bg-brand-surface text-brand-text-primary' : 'text-brand-text-secondary hover:bg-brand-surface/50 hover:text-brand-text-primary'
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1">
                    <div className="animate-page-enter">
                         {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;