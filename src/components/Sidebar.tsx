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
       className={`relative z-10 flex items-center p-3 my-1.5 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] hover:shadow-lg group overflow-hidden ${
         isActive
           ? 'text-white shadow-lg backdrop-blur-sm'
           : 'text-brand-text-secondary hover:bg-gradient-to-r hover:from-brand-surface/30 hover:to-brand-surface/60 hover:text-brand-text-primary hover:shadow-md'
       }`}
     >
       <div className={`transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
         {icon}
       </div>
       <span className={`ml-4 font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1 ${isActive ? 'translate-x-1' : ''} text-sm`}>
         {label}
       </span>
       {/* Subtle animated border effect */}
       <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[100%] ${isActive ? 'animate-pulse' : ''}`} />
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
  // { to: '/connectors', icon: <ExternalLink className="w-6 h-6" />, label: 'Connectors' },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const [highlightStyle, setHighlightStyle] = useState({
        top: 0,
        height: 0,
        opacity: 0,
        transform: 'scale(1)'
    });
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
            // Enhanced animation with staggered timing for smooth liquid effect
            requestAnimationFrame(() => {
                setHighlightStyle({
                    top: activeItem.offsetTop,
                    height: activeItem.offsetHeight,
                    opacity: 1,
                    transform: 'scale(1.02)' // Subtle scale for liquid feel
                });

                // Reset scale after animation for performance
                setTimeout(() => {
                    setHighlightStyle(prev => ({ ...prev, transform: 'scale(1)' }));
                }, 400);
            });
        } else {
            setHighlightStyle(prev => ({
                ...prev,
                opacity: 0,
                transform: 'scale(0.95)' // Collapse effect when hiding
            }));
        }
    }, [pathname]); // Optimized dependency array

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
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-purple-900/20 via-brand-bg to-purple-800/30 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-40 w-72 p-6 animate-page-enter backdrop-blur-sm border-r border-purple-500/20 shadow-2xl ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
        } md:translate-x-0 md:shadow-xl`}
        style={{
          background: 'linear-gradient(135deg, rgba(var(--color-bg-rgb), 0.95) 0%, rgba(var(--color-bg-rgb), 0.98) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center justify-center pb-8">
            {agencyLogoUrl ? (
                <Image src={agencyLogoUrl} alt={`${agencyName} Logo`} className="h-10 w-auto" width={40} height={40} />
            ) : (
                <h1 className="text-3xl font-bold font-display text-brand-text-primary tracking-wider">{agencyName}</h1>
            )}
        </div>
        
        <nav ref={navRef} className="relative flex-1 pr-2 -mr-2">
            <div
                className="absolute left-0 w-full rounded-xl shadow-glow-lg pointer-events-none z-0 bg-gradient-to-br from-[var(--color-primary)] via-brand-primary/90 to-[var(--color-accent)] animate-liquid-pan-enhanced"
                style={{
                    ...highlightStyle,
                    transition: 'top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 0 20px rgba(var(--color-accent-rgb), 0.4), 0 0 40px rgba(var(--color-primary-rgb), 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(1px)',
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
              <div className="h-px bg-gradient-to-r from-transparent via-brand-border/60 to-transparent my-4 animate-pulse"></div>
              <ul className="space-y-1">
                  <li ref={el => { itemsRef.current.set('/settings', el) }}>
                     <NavItem to="/settings" icon={<Settings className="w-6 h-6" />} label="Settings" isActive={pathname === '/settings'} />
                 </li>
                  <li>
                     <Link
                       href="/portal/login"
                       target="_blank"
                       className="relative z-10 flex items-center p-3 my-1.5 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] group overflow-hidden text-brand-text-secondary hover:bg-gradient-to-r hover:from-brand-surface/30 hover:to-brand-surface/60 hover:text-brand-text-primary hover:shadow-md"
                     >
                       <div className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110">
                         <ExternalLink className="w-6 h-6" />
                       </div>
                       <span className="ml-4 font-semibold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">Client Portal</span>
                       {/* Subtle animated border effect */}
                       <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-[100%]" />
                     </Link>
                 </li>
              </ul>
         </div>
      </aside>
    </>
  );
};

export default Sidebar;