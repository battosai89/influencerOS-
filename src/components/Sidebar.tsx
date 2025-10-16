"use client";

import * as React from 'react';
import { useState, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Star, Briefcase, Calendar, ClipboardList, Users, Mail, FileText, Banknote, Receipt, BarChart3, BookOpen, ClipboardCheck, ExternalLink, Settings } from 'lucide-react';
import useStore from '../hooks/useStore';
import Image from 'next/image';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = memo(({ to, icon, label, isActive, onClick }) => {
  return (
    <Link
      href={to}
      onClick={onClick}
      className={`relative z-10 flex items-center p-3 my-1.5 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 ${
        isActive
          ? 'text-white'
          : 'text-brand-text-secondary hover:bg-brand-surface/50 hover:text-brand-text-primary'
      }`}
    >
      {icon}
      <span className="ml-4 font-semibold whitespace-nowrap">{label}</span>
    </Link>
  );
});

NavItem.displayName = 'NavItem';

// Moved navItems outside the component to prevent re-creation on every render, fixing the animation bug.
const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" />, label: 'My Dashboard' },
  { to: '/campaigns', icon: <Star className="w-6 h-6" />, label: 'Projects' },
  { to: '/content-hub', icon: <ClipboardCheck className="w-6 h-6" />, label: 'Content Hub' },
  { to: '/tasks', icon: <ClipboardList className="w-6 h-6" />, label: 'Tasks' },
  { to: '/calendar', icon: <Calendar className="w-6 h-6" />, label: 'Calendar' },
  { to: '/clients', icon: <Briefcase className="w-6 h-6" />, label: 'Clients' },
  { to: '/team', icon: <Users className="w-6 h-6" />, label: 'Team' },
  { to: '/inbox', icon: <Mail className="w-6 h-6" />, label: 'Inbox' },
  { to: '/contracts', icon: <FileText className="w-6 h-6" />, label: 'Contracts' },
  { to: '/financials', icon: <Banknote className="w-6 h-6" />, label: 'Financials' },
  { to: '/invoices', icon: <Receipt className="w-6 h-6" />, label: 'Invoices' },
  { to: '/analytics', icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics' },
  { to: '/academy', icon: <BookOpen className="w-6 h-6" />, label: 'Academy' },
  { to: '/connectors', icon: <ExternalLink className="w-6 h-6" />, label: 'Connectors' },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const [highlightStyle, setHighlightStyle] = useState({ top: 0, height: 0, opacity: 0 });
    const itemsRef = useRef(new Map<string, HTMLLIElement | null>());
    const navRef = useRef<HTMLElement>(null);
    
    // Use specific selectors to minimize re-renders
    const agencyName = useStore(state => state.agencyName);
    const agencyLogoUrl = useStore(state => state.agencyLogoUrl);
    

    const handleNavigation = () => {
        // Removed artificial delay for better performance
        // No need for setIsLoading as navigation should be instant
    };
    
    useEffect(() => {
        const activeItem = itemsRef.current.get(pathname);
        if (activeItem) {
            setHighlightStyle({
                top: activeItem.offsetTop,
                height: activeItem.offsetHeight,
                opacity: 1
            });
        } else {
             setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [pathname]); // Dependency array simplified for stability

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-brand-bg flex flex-col transition-all duration-300 ease-in-out z-40 w-72 p-6 animate-page-enter ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-center pb-8">
            {agencyLogoUrl ? (
                <Image src={agencyLogoUrl} alt={`${agencyName} Logo`} className="h-10 w-auto" width={40} height={40} />
            ) : (
                <h1 className="text-3xl font-bold font-display text-brand-text-primary tracking-wider">{agencyName}</h1>
            )}
        </div>
        
        <nav ref={navRef} className="relative flex-1 overflow-y-auto pr-2 -mr-2">
            <div
                className="absolute left-0 w-full rounded-lg shadow-glow-md pointer-events-none z-0 bg-[size:400%_400%] bg-[linear-gradient(135deg,var(--color-accent-gradient)_0%,var(--color-primary)_50%,var(--color-accent-gradient)_100%)] animate-liquid-pan"
                style={{
                    ...highlightStyle,
                    transition: 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1), height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s'
                }}
            />
            <ul>
                {navItems.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                        <li key={item.to} ref={el => { itemsRef.current.set(item.to, el) }}>
                            <NavItem {...item} isActive={isActive} onClick={handleNavigation} />
                        </li>
                    );
                })}
            </ul>
        </nav>
        
        <div className="mt-auto flex-shrink-0">
             <div className="h-px bg-brand-border my-4"></div>
             <ul>
                 <li ref={el => { itemsRef.current.set('/settings', el) }}>
                    <NavItem to="/settings" icon={<Settings className="w-6 h-6" />} label="Settings" isActive={pathname === '/settings'} />
                </li>
                 <li>
                    <Link
                      href="/portal/login"
                      target="_blank"
                      className="relative z-10 flex items-center p-3 my-1.5 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 text-brand-text-secondary hover:bg-brand-surface/50 hover:text-brand-text-primary"
                    >
                      <ExternalLink className="w-6 h-6" />
                      <span className="ml-4 font-semibold whitespace-nowrap">Client Portal</span>
                    </Link>
                </li>
             </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;