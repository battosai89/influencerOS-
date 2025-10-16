
"use client";

// FIX: Implemented the CommandBar component, which was previously missing.
// This resolves the "is not a module" error in App.tsx.
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
// FIX: Replaced useHistory with useNavigate for react-router-dom v6 compatibility.
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, Building2, Calendar, BarChart3, FileText, Banknote, Settings, Search } from 'lucide-react';
import { CampaignIcon } from './icons/Icon';

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Influencers', path: '/influencers', icon: <User className="w-5 h-5" /> },
  { name: 'Brands', path: '/brands', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Campaigns', path: '/campaigns', icon: <CampaignIcon className="w-5 h-5" /> },
  { name: 'Calendar', path: '/calendar', icon: <Calendar className="w-5 h-5" /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Contracts', path: '/contracts', icon: <FileText className="w-5 h-5" /> },
  { name: 'Financials', path: '/financials', icon: <Banknote className="w-5 h-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

const CommandBar: React.FC<CommandBarProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  // FIX: Replaced useHistory with useNavigate for react-router-dom v6 compatibility.
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

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
  
  const filteredCommands = useMemo(() => {
    if (!searchTerm) return commands;
    return commands.filter(cmd => cmd.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  useEffect(() => {
    setActiveIndex(0);
  }, [filteredCommands]);

  const handleSelect = (path: string) => {
    // FIX: Replaced history.push with navigate for react-router-dom v6 compatibility.
    router.push(path);
    handleClose();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if(filteredCommands[activeIndex]) {
            handleSelect(filteredCommands[activeIndex].path);
        }
    } else if (e.key === 'Escape') {
        handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className={`fixed inset-0 bg-brand-bg/95 z-50 flex items-start justify-center pt-20 ${isClosing ? 'animate-search-backdrop-out' : 'animate-search-backdrop-in'}`}
        onClick={handleClose}
    >
      <div 
        className={`bg-brand-surface border border-brand-border rounded-xl w-full max-w-lg ${isClosing ? 'animate-search-modal-out' : 'animate-modal-slide-down'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
            <input
                ref={inputRef}
                type="text"
                placeholder="Search for pages or actions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-b border-brand-border text-lg pl-12 pr-4 py-4 text-brand-text-primary focus:outline-none"
            />
        </div>
        <ul className="p-2 max-h-80 overflow-y-auto">
            {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, index) => (
                    <li
                        key={cmd.path}
                        onClick={() => handleSelect(cmd.path)}
                        onMouseMove={() => setActiveIndex(index)}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${
                            index === activeIndex ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-surface'
                        }`}
                    >
                        {cmd.icon}
                        <span className="font-medium">{cmd.name}</span>
                    </li>
                ))
            ) : (
                <li className="p-4 text-center text-brand-text-secondary">No results found.</li>
            )}
        </ul>
      </div>
    </div>
  );
};

export default CommandBar;
