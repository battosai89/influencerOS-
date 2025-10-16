"use client";

import * as React from 'react';
import { useState } from 'react';
import useStore from '@/hooks/useStore';
import { User, Building2, Palette, Moon, Sun, Save, Bell, Shield, Download, Trash2 } from 'lucide-react';


type SettingsTabId = 'profile' | 'agency' | 'appearance' | 'notifications' | 'data';

const Settings: React.FC = () => {
    const {
        userName,
        userRole,
        userAvatarUrl,
        agencyName,
        agencyLogoUrl,
        theme,
        accentColor,
        updateUserProfile,
        updateAgencyProfile,
        setTheme,
        setAccentColor,
        dashboardNotes,
        updateDashboardNotes
    } = useStore();

    const [activeTab, setActiveTab] = useState<'profile' | 'agency' | 'appearance' | 'notifications' | 'data'>('profile');
    const [formData, setFormData] = useState({
        userName,
        userRole,
        userAvatarUrl,
        agencyName,
        agencyLogoUrl,
        dashboardNotes
    });

    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [selectedAccentColor, setSelectedAccentColor] = useState(accentColor);

    const accentColors = [
        { name: 'Purple', value: 'purple' },
        { name: 'Blue', value: 'blue' },
        { name: 'Green', value: 'green' },
        { name: 'Amber', value: 'amber' },
        { name: 'Red', value: 'red' },
        { name: 'Orange', value: 'orange' },
        { name: 'Pink', value: 'pink' }
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserProfile({
            name: formData.userName,
            role: formData.userRole,
            avatarUrl: formData.userAvatarUrl
        });
    };

    const handleAgencySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateAgencyProfile({
            name: formData.agencyName,
            logoUrl: formData.agencyLogoUrl
        });
        updateDashboardNotes(formData.dashboardNotes);
    };

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setSelectedTheme(newTheme);
        setTheme(newTheme);
    };

    const handleAccentColorChange = (newColor: string) => {
        setSelectedAccentColor(newColor);
        setAccentColor(newColor);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
        { id: 'agency', label: 'Agency', icon: <Building2 className="w-5 h-5" /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
        { id: 'data', label: 'Data & Privacy', icon: <Shield className="w-5 h-5" /> },
    ];

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-brand-text-primary font-display">Settings</h1>
                <p className="text-brand-text-secondary">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-brand-surface futuristic-border rounded-xl p-4">
                        <nav className="space-y-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTabId)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                        activeTab === tab.id
                                            ? 'bg-brand-primary text-white'
                                            : 'text-brand-text-secondary hover:bg-brand-bg'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">User Profile</h3>
                                    <p className="text-brand-text-secondary">Manage your personal information and role</p>
                                </div>

                                <form onSubmit={handleUserSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.userName}
                                            onChange={(e) => handleInputChange('userName', e.target.value)}
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Role</label>
                                        <select
                                            value={formData.userRole}
                                            onChange={(e) => handleInputChange('userRole', e.target.value)}
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        >
                                            <option value="Agency Director">Agency Director</option>
                                            <option value="Campaign Manager">Campaign Manager</option>
                                            <option value="Account Manager">Account Manager</option>
                                            <option value="Content Creator">Content Creator</option>
                                            <option value="Analyst">Analyst</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Avatar URL</label>
                                        <input
                                            type="url"
                                            value={formData.userAvatarUrl}
                                            onChange={(e) => handleInputChange('userAvatarUrl', e.target.value)}
                                            placeholder="https://example.com/avatar.jpg"
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'agency' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Agency Settings</h3>
                                    <p className="text-brand-text-secondary">Configure your agency branding and information</p>
                                </div>

                                <form onSubmit={handleAgencySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Agency Name</label>
                                        <input
                                            type="text"
                                            value={formData.agencyName}
                                            onChange={(e) => handleInputChange('agencyName', e.target.value)}
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Logo URL</label>
                                        <input
                                            type="url"
                                            value={formData.agencyLogoUrl}
                                            onChange={(e) => handleInputChange('agencyLogoUrl', e.target.value)}
                                            placeholder="https://example.com/logo.png"
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-brand-text-primary mb-2">Dashboard Notes</label>
                                        <textarea
                                            value={formData.dashboardNotes}
                                            onChange={(e) => handleInputChange('dashboardNotes', e.target.value)}
                                            rows={4}
                                            placeholder="Add notes that will appear on your dashboard..."
                                            className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Agency Settings
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Appearance Settings</h3>
                                    <p className="text-brand-text-secondary">Customize the look and feel of your dashboard</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Theme Toggle */}
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-3">Theme</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleThemeChange('light')}
                                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ease-in-out hover:scale-105 flex items-center justify-center gap-2 ${
                                                    selectedTheme === 'light'
                                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                        : 'border-brand-border bg-brand-bg text-brand-text-secondary hover:border-brand-primary'
                                                }`}
                                            >
                                                <Sun className="w-4 h-4" />
                                                Light
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleThemeChange('dark')}
                                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ease-in-out hover:scale-105 flex items-center justify-center gap-2 ${
                                                    selectedTheme === 'dark'
                                                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                        : 'border-brand-border bg-brand-bg text-brand-text-secondary hover:border-brand-primary'
                                                }`}
                                            >
                                                <Moon className="w-4 h-4" />
                                                Dark
                                            </button>
                                        </div>
                                    </div>

                                    {/* Accent Color */}
                                    <div>
                                        <label className="block text-sm font-medium text-brand-text-primary mb-3">Accent Color</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {accentColors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    onClick={() => handleAccentColorChange(color.value)}
                                                    className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ease-in-out hover:scale-105 ${
                                                        selectedAccentColor === color.value
                                                            ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                            : 'border-brand-border bg-brand-bg text-brand-text-secondary hover:border-brand-primary'
                                                    }`}
                                                >
                                                    {color.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Notification Preferences</h3>
                                    <p className="text-brand-text-secondary">Configure how you receive notifications</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { title: 'Email Notifications', description: 'Receive notifications via email' },
                                        { title: 'Push Notifications', description: 'Receive browser push notifications' },
                                        { title: 'Campaign Alerts', description: 'Get notified about campaign milestones' },
                                        { title: 'Contract Reminders', description: 'Reminders about upcoming contract renewals' },
                                        { title: 'Financial Alerts', description: 'Notifications about payments and invoices' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-brand-bg rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-brand-text-primary">{item.title}</h4>
                                                <p className="text-sm text-brand-text-secondary">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                                                <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">Data & Privacy</h3>
                                    <p className="text-brand-text-secondary">Manage your data and privacy settings</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-brand-bg rounded-lg border border-brand-border">
                                        <h4 className="font-medium text-brand-text-primary mb-2">Export Data</h4>
                                        <p className="text-sm text-brand-text-secondary mb-3">
                                            Download all your data including influencers, campaigns, and transactions
                                        </p>
                                        <button className="px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Export Data
                                        </button>
                                    </div>

                                    <div className="p-4 bg-brand-bg rounded-lg border border-brand-border">
                                        <h4 className="font-medium text-brand-text-primary mb-2">Data Retention</h4>
                                        <p className="text-sm text-brand-text-secondary mb-3">
                                            Choose how long to keep your data (currently: Forever)
                                        </p>
                                        <select className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                            <option value="forever">Keep indefinitely</option>
                                            <option value="7years">7 years</option>
                                            <option value="3years">3 years</option>
                                            <option value="1year">1 year</option>
                                        </select>
                                    </div>

                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h4 className="font-medium text-red-400 mb-2">Danger Zone</h4>
                                        <p className="text-sm text-brand-text-secondary mb-3">
                                            Permanently delete your account and all associated data
                                        </p>
                                        <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2">
                                            <Trash2 className="w-4 h-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
