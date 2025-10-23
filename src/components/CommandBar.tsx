
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../hooks/useStore';
import { LayoutDashboard, User, Building2, Calendar, BarChart3, FileText, Banknote, Settings, Search, Star, BookOpen, ClipboardList, Briefcase } from 'lucide-react';

interface CommandBarProps {
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
  { name: 'Projects', path: '/campaigns', icon: <Star className="w-5 h-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <ClipboardList className="w-5 h-5" /> },
  { name: 'Contracts', path: '/contracts', icon: <FileText className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Financials', path: '/financials', icon: <Banknote className="w-5 h-5" /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Academy', path: '/academy', icon: <BookOpen className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
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
      setSearchTerm('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results = useMemo<GroupedSearchResults>(() => {
    if (!searchTerm) {
        // Return only pages when search is empty
        return { 'Pages': pageCommands.map(p => ({ type: 'Page', name: p.name, path: p.path, icon: p.icon })) };
    }
    const term = searchTerm.toLowerCase();

    const pageResults = pageCommands.filter(p => p.name.toLowerCase().includes(term));
    const influencerResults = influencers.filter(i => i.name.toLowerCase().includes(term));
    const brandResults = brands.filter(b => b.name.toLowerCase().includes(term));
    const campaignResults = campaigns.filter(c => c.name.toLowerCase().includes(term));
    const contractResults = contracts.filter(c => c.title.toLowerCase().includes(term));

    const grouped = {
        ...(pageResults.length && { 'Pages': pageResults.map(p => ({ type: 'Page', name: p.name, path: p.path, icon: p.icon })) }),
        ...(influencerResults.length && { 'Influencers': influencerResults.map(i => ({ type: 'Influencer', name: i.name, path: `/influencers/${i.id}`, icon: <User className="w-5 h-5" />, details: i.platform })) }),
        ...(brandResults.length && { 'Brands': brandResults.map(b => ({ type: 'Brand', name: b.name, path: `/clients`, icon: <Building2 className="w-5 h-5" />, details: b.industry })) }),
        ...(campaignResults.length && { 'Campaigns': campaignResults.map(c => ({ type: 'Campaign', name: c.name, path: `/campaigns/${c.id}`, icon: <Star className="w-5 h-5" />, details: `Ends: ${new Date(c.endDate).toLocaleDateString()}` })) }),
        ...(contractResults.length && { 'Contracts': contractResults.map(c => ({ type: 'Contract', name: c.title, path: `/contracts/${c.id}`, icon: <FileText className="w-5 h-5" />, details: c.status })) }),
    };
    return grouped;
  }, [searchTerm, influencers, brands, campaigns, contracts]);

  const flatResults: SearchResult[] = useMemo(() => Object.values(results).flat(), [results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [flatResults]);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % (flatResults.length || 1));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + (flatResults.length || 1)) % (flatResults.length || 1));
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if(flatResults[activeIndex]) {
            handleSelect(flatResults[activeIndex].path);
        }
    } else if (e.key === 'Escape') {
        handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
        className={`fixed inset-0 bg-brand-bg/50 backdrop-blur-md z-50 flex items-start justify-center pt-20 ${isClosing ? 'animate-search-backdrop-out' : 'animate-search-backdrop-in'}`}
        onClick={handleClose}
    >
      <div
        className={`bg-brand-surface border border-brand-border rounded-xl w-full max-w-2xl shadow-2xl shadow-brand-primary/10 ${isClosing ? 'animate-search-modal-out' : 'animate-modal-slide-down'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search for pages, influencers, brands..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-b border-brand-border text-lg pl-12 pr-4 py-4 text-brand-text-primary focus:outline-none"
            />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
            {flatResults.length > 0 ? (
                <ul className="p-2 space-y-1">
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
                                                currentIndex === activeIndex ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-bg/50'
                                            }`}
                                        >
                                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{item.icon}</div>
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
                <div className="p-10 text-center text-brand-text-secondary">No results found for "{searchTerm}".</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CommandBar;
