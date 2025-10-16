"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import Image from 'next/image';
import Clock from './Clock';
import useStore from '../hooks/useStore';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { userName, userAvatarUrl, notifications, markNotificationsAsRead } = useStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setIsPanelOpen(prev => !prev);
    if (!isPanelOpen) {
      markNotificationsAsRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center animate-page-enter">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary font-display">Welcome back, {userName}</h1>
        <p className="text-brand-text-secondary">Here&apos;s what&apos;s happening today.</p>
      </div>
      <div className="flex items-center gap-6">
        <Clock />
        <button 
          onClick={onSearchClick} 
          className="text-brand-text-secondary hover:text-brand-text-primary transition-all duration-200 ease-in-out hover:scale-110"
          aria-label="Open search"
        >
          <Search className="w-6 h-6" />
        </button>
        
        <div className="relative" ref={panelRef}>
            <button 
                onClick={handleBellClick}
                className="relative text-brand-text-secondary hover:text-brand-text-primary transition-all duration-200 ease-in-out hover:scale-110" 
                aria-label="View notifications"
                aria-expanded={isPanelOpen}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-brand-surface">
                        {unreadCount}
                    </span>
                )}
            </button>
            <NotificationPanel isOpen={isPanelOpen} />
        </div>
        
        <div className="w-10 h-10 rounded-full bg-brand-surface border-2 border-brand-border flex items-center justify-center font-bold text-brand-text-primary transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-glow-sm">
          {userAvatarUrl ? (
            <Image src={userAvatarUrl} alt={userName} className="w-full h-full rounded-full object-cover" width={40} height={40} />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;