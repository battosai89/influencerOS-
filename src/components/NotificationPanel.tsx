"use client";

import * as React from 'react';
import useStore from '../hooks/useStore';
import { Notification } from '../types';
import { Bell, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';

const NotificationPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { notifications, clearNotifications } = useStore();

    if (!isOpen) return null;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-brand-success" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-brand-warning" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-brand-insight" />;
        }
    };

    return (
        <div 
            className="absolute top-full right-0 mt-4 w-80 bg-brand-surface futuristic-border rounded-xl animate-modal-slide-down z-50"
        >
            <div className="flex justify-between items-center p-4 border-b border-brand-border/50">
                <h3 className="font-bold text-brand-text-primary font-display">Notifications</h3>
                {notifications.length > 0 && (
                    <button onClick={clearNotifications} className="text-xs font-semibold text-brand-text-secondary hover:text-brand-primary flex items-center gap-1 transition-all duration-200 hover:scale-105">
                        <Trash2 className="w-3 h-3"/> Clear All
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    <ul className="divide-y divide-brand-border/50">
                        {notifications.map((notif) => (
                            <li key={notif.id} className="p-4 flex items-start gap-3 hover:bg-brand-bg/50 relative transition-all duration-200 group">
                                {!notif.read && (
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                                )}
                                <div className="flex-shrink-0 mt-0.5 pl-2 group-hover:scale-110 transition-transform duration-200">{getIcon(notif.type)}</div>
                                <p className="text-sm text-brand-text-secondary group-hover:text-brand-text-primary transition-colors duration-200">{notif.message}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-10 text-center">
                        <Bell className="w-10 h-10 mx-auto text-brand-border" />
                        <p className="mt-4 text-sm text-brand-text-secondary">You&apos;re all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;