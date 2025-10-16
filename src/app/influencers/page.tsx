"use client";

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import useStore from '@/hooks/useStore';
import { Plus, Users, Star, MapPin, TrendingUp, Filter } from 'lucide-react';
import Image from 'next/image';

const Influencers: React.FC = () => {
    const { supabaseInfluencers: influencers } = useStore();
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInfluencers = influencers.filter(influencer => {
        const matchesFilter = filter === 'all' || influencer.status === filter;
        const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            influencer.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            influencer.platform.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-brand-success bg-brand-success/10';
            case 'inactive': return 'text-brand-text-secondary bg-brand-border';
            case 'lead': return 'text-brand-warning bg-brand-warning/10';
            default: return 'text-brand-text-secondary bg-brand-border';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Influencers</h1>
                    <p className="text-brand-text-secondary">Manage your influencer network</p>
                </div>
                <Link
                    href="/influencers/new"
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Influencer
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Influencers</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{influencers.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Active</p>
                            <p className="text-2xl font-bold text-brand-success">{influencers.filter(i => i.status === 'active').length}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-brand-success" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Leads</p>
                            <p className="text-2xl font-bold text-brand-warning">{influencers.filter(i => i.status === 'lead').length}</p>
                        </div>
                        <Star className="w-8 h-8 text-brand-warning" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Avg. Engagement</p>
                            <p className="text-2xl font-bold text-brand-text-primary">
                                {influencers.length > 0 ? Math.round(influencers.reduce((sum, i) => sum + i.engagementRate, 0) / influencers.length) : 0}%
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search influencers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <Filter className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-secondary" />
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['all', 'active', 'inactive', 'lead'] as const).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                filter === filterType
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-surface-hover'
                            }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Influencers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInfluencers.map((influencer) => (
                    <Link
                        key={influencer.id}
                        href={`/influencers/${influencer.id}`}
                        className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center">
                                {influencer.avatarUrl ? (
                                    <Image 
                                        src={influencer.avatarUrl} 
                                        alt={influencer.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-bold text-brand-text-primary">
                                        {influencer.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-brand-text-primary">{influencer.name}</h3>
                                <p className="text-sm text-brand-text-secondary">{influencer.platform}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(influencer.status)}`}>
                                {influencer.status}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-text-secondary">Followers</span>
                                <span className="text-brand-text-primary font-medium">{formatNumber(influencer.followers)}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-text-secondary">Engagement</span>
                                <span className="text-brand-text-primary font-medium">{influencer.engagementRate}%</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-text-secondary">Niche</span>
                                <span className="text-brand-text-primary font-medium">{influencer.niche}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                                <MapPin className="w-3 h-3" />
                                <span>{influencer.location}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredInfluencers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-brand-border mb-4" />
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No influencers found</h3>
                    <p className="text-brand-text-secondary mb-4">
                        {searchTerm ? "No influencers match your search" : "Get started by adding your first influencer"}
                    </p>
                    {!searchTerm && (
                        <Link
                            href="/influencers/new"
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Influencer
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Influencers;
