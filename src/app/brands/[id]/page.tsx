"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useStore from '../../../hooks/useStore';
import { ArrowLeft, ExternalLink, Edit, Trash2, Building2, Globe, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import { Brand } from '../../../types';

interface BrandDetailsParams { id: string; }

const BrandDetailsPage: React.FC = () => {
    const params = useParams() as unknown as BrandDetailsParams;
    const { getBrand, deleteBrand } = useStore();
    const router = useRouter();

    const [brand, setBrand] = useState<Brand | null>(null);

    useEffect(() => {
        if (params.id) {
            const foundBrand = getBrand(params.id as string);
            setBrand(foundBrand || null);
        }
    }, [params.id, getBrand]);

    if (!brand) {
        return (
            <div className="min-h-screen bg-brand-bg text-brand-text-primary p-8">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Building2 className="w-16 h-16 mx-auto text-brand-border mb-4" />
                        <p className="text-brand-text-secondary">Brand not found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const getSatisfactionColor = (satisfaction: number) => {
        if (satisfaction >= 80) return 'text-green-400 bg-green-500/20';
        if (satisfaction >= 60) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text-primary p-8">
            <button onClick={() => router.back()} className="flex items-center text-brand-text-secondary hover:text-brand-primary transition-colors mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Clients
            </button>

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-brand-bg flex items-center justify-center overflow-hidden border-2 border-brand-border flex-shrink-0">
                                {brand.logoUrl ? (
                                    <Image
                                        src={brand.logoUrl}
                                        alt={`${brand.name} logo`}
                                        className="w-full h-full rounded-full object-cover"
                                        width={96}
                                        height={96}
                                    />
                                ) : (
                                    <Building2 className="w-12 h-12 text-brand-text-secondary" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-brand-text-primary">{brand.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSatisfactionColor(brand.satisfaction || 0)}`}>
                                        {brand.satisfaction || 0}% Satisfaction
                                    </span>
                                </div>
                                <p className="text-brand-text-secondary mb-2">{brand.industry} Brand</p>
                                {brand.website && (
                                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-primary hover:underline text-sm">
                                        <Globe className="w-4 h-4" /> {brand.website}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-brand-bg futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{brand.satisfaction || 0}%</p>
                            <p className="text-sm text-brand-text-secondary">Satisfaction</p>
                        </div>
                        <div className="bg-brand-bg futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">{brand.portalAccess ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-brand-text-secondary">Portal Access</p>
                        </div>
                        <div className="bg-brand-bg futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">
                                {brand.portalAccess && brand.portalUserEmail ? 'Active' : 'Inactive'}
                            </p>
                            <p className="text-sm text-brand-text-secondary">Portal Status</p>
                        </div>
                        <div className="bg-brand-bg futuristic-border rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-brand-text-primary">0</p>
                            <p className="text-sm text-brand-text-secondary">Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand-text-secondary" />
                            <span className="text-brand-text-secondary">Email:</span>
                            <span className="text-brand-text-primary">
                                {brand.portalAccess && brand.portalUserEmail ? brand.portalUserEmail : 'Not provided'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-brand-text-secondary" />
                            <span className="text-brand-text-secondary">Industry:</span>
                            <span className="text-brand-text-primary">{brand.industry}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-brand-text-secondary" />
                            <span className="text-brand-text-secondary">Website:</span>
                            <span className="text-brand-text-primary">{brand.website || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-brand-text-secondary">Portal Access:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${brand.portalAccess ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {brand.portalAccess ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>
                    {brand.notes && (
                        <div className="mt-4">
                            <h4 className="font-medium text-brand-text-primary mb-2">Notes:</h4>
                            <p className="text-brand-text-secondary bg-brand-bg p-3 rounded-lg">{brand.notes}</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity Section */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-brand-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="bg-brand-bg border border-brand-border rounded-lg p-4">
                            <h4 className="font-semibold text-brand-text-primary mb-1">Brand Portal Access</h4>
                            <p className="text-sm text-brand-text-secondary">
                                Portal access is {brand.portalAccess ? 'enabled' : 'disabled'}
                                {brand.portalAccess && brand.portalUserEmail && ` for ${brand.portalUserEmail}`}
                            </p>
                        </div>
                        <div className="bg-brand-bg border border-brand-border rounded-lg p-4">
                            <h4 className="font-semibold text-brand-text-primary mb-1">Satisfaction Rating</h4>
                            <p className="text-sm text-brand-text-secondary">
                                Current satisfaction score: {brand.satisfaction || 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => {
                            // TODO: Add edit functionality
                            alert('Edit functionality coming soon!');
                        }}
                        className="flex items-center px-4 py-2 bg-brand-secondary text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                    >
                        <Edit className="w-4 h-4 mr-2" /> Edit Brand
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`)) {
                                deleteBrand(brand.id);
                                router.push('/clients');
                            }
                        }}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Brand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandDetailsPage;