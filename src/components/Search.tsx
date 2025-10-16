
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// FIX: Replaced useHistory with useNavigate for react-router-dom v6 compatibility.
import { useRouter } from 'next/navigation';
import useStore from '../hooks/useStore';
import {
    Search as SearchIcon, LayoutDashboard, Users, Briefcase, Star, FileText,
    Banknote, Calendar, BarChart3, Settings, BookOpen, ClipboardList
} from 'lucide-react';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
    type: string;
    name: string;
    path: string;
    icon: React.ReactNode;
    details?: string;
}

interface GroupedSearchResults {
    [category: string]: SearchResult[];
}

const pageCommands = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Clients', path: '/clients', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Projects', path: '/projects', icon: <Star className="w-5 h-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { name: 'Contracts', path: '/contracts', icon: <FileText className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Financials', path: '/financials', icon: <Banknote className="w-5 h-5" /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Academy', path: '/academy', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    // FIX: Replaced useHistory with useNavigate for react-router-dom v6 compatibility.
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const activeItemRef = useRef<HTMLLIElement>(null);
    const { influencers, brands, campaigns, contracts } = useStore();

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            // Calculate scrollbar width and apply padding to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
            
            setSearchTerm('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // This else block is for when the component is still mounted but not open
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        }

        // Cleanup function to reset styles when component unmounts or isOpen becomes false
        return () => {
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const results = useMemo<GroupedSearchResults>(() => {
        if (!searchTerm) return {};
        const term = searchTerm.toLowerCase();
        
        const pageResults = pageCommands.filter(p => p.name.toLowerCase().includes(term));
        const influencerResults = influencers.filter(i => i.name.toLowerCase().includes(term));
        const brandResults = brands.filter(b => b.name.toLowerCase().includes(term));
        const campaignResults = campaigns.filter(c => c.name.toLowerCase().includes(term));
        const contractResults = contracts.filter(c => c.title.toLowerCase().includes(term));

        const grouped = {
            ...(pageResults.length && { 'Pages': pageResults.map(p => ({ type: 'Page', name: p.name, path: p.path, icon: p.icon })) }),
            ...(influencerResults.length && { 'Influencers': influencerResults.map(i => ({ type: 'Influencer', name: i.name, path: `/influencers/${i.id}`, icon: <Users className="w-5 h-5" />, details: i.platform })) }),
            ...(brandResults.length && { 'Brands': brandResults.map(b => ({ type: 'Brand', name: b.name, path: `/brands/${b.id}`, icon: <Briefcase className="w-5 h-5" />, details: b.industry })) }),
            ...(campaignResults.length && { 'Campaigns': campaignResults.map(c => ({ type: 'Campaign', name: c.name, path: `/campaigns/${c.id}`, icon: <Star className="w-5 h-5" />, details: `Ends: ${new Date(c.endDate).toLocaleDateString()}` })) }),
            ...(contractResults.length && { 'Contracts': contractResults.map(c => ({ type: 'Contract', name: c.title, path: `/contracts/${c.id}`, icon: <FileText className="w-5 h-5" />, details: c.status })) }),
        };
        return grouped;
    }, [searchTerm, influencers, brands, campaigns, contracts]);

    const flatResults: SearchResult[] = useMemo(() => Object.values(results).flat(), [results]);
    
    useEffect(() => setActiveIndex(0), [flatResults]);

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const handleSelect = useCallback((path: string) => {
        // FIX: Replaced history.push with navigate for react-router-dom v6 compatibility.
        router.push(path);
        onClose();
    // FIX: Replaced history with navigate in useCallback dependency array.
    }, [router, onClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % (flatResults.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + (flatResults.length || 1)) % (flatResults.length || 1));
            } else if (e.key === 'Enter' && flatResults[activeIndex]) {
                e.preventDefault();
                handleSelect(flatResults[activeIndex].path);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose, flatResults, activeIndex, handleSelect]);

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black backdrop-blur-md z-50 flex items-start justify-center pt-[15vh] ${isClosing ? 'animate-search-backdrop-out' : 'animate-search-backdrop-in'}`}
            onClick={handleClose}
        >
            <div 
                className={`rounded-xl w-full max-w-2xl bg-gray-900 opacity-100`} 
                onClick={e => e.stopPropagation()}
            >
                <div className="relative border-b border-brand-border/50">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-text-secondary" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for anything..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-lg pl-16 pr-6 py-5 text-brand-text-primary focus:outline-none placeholder:text-brand-text-secondary"
                    />
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto">
                    {searchTerm ? (
                        flatResults.length > 0 ? (
                            <ul className="p-2 space-y-2">
                                {Object.entries(results).map(([category, items]) => (
                                    <li key={category}>
                                        <h3 className="text-xs font-semibold text-brand-text-secondary uppercase px-3 pt-2 pb-1">{category}</h3>
                                        <ul>
                                            {Array.isArray(items) && items.map(item => {
                                                const currentIndex = flatResults.findIndex(r => r.path === item.path);
                                                return (
                                                    <li
                                                        key={item.path}
                                                        ref={currentIndex === activeIndex ? activeItemRef : null}
                                                        onClick={() => handleSelect(item.path)}
                                                        onMouseMove={() => setActiveIndex(currentIndex)}
                                                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                                                            currentIndex === activeIndex ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-surface/50'
                                                        }`}
                                                    >
                                                        <div className="flex-shrink-0">{item.icon}</div>
                                                        <div className="flex-grow overflow-hidden">
                                                          <p className="font-semibold truncate text-brand-text-primary">{item.name}</p>
                                                          {item.details && <p className="text-xs truncate">{item.details}</p>}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-10 text-center text-brand-text-secondary">No results found for &quot;{searchTerm}&quot;.</div>
                        )
                    ) : (
                        <div className="p-10 text-center text-brand-text-secondary">Start typing to search across your agency.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
