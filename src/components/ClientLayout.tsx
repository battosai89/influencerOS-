"use client";

import { useState } from 'react';
import { ErrorContextProvider } from '../contexts/ErrorContext';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastNotification from './ToastNotification';
import { Notification } from '@/types';



const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <ErrorContextProvider>
      <div className="min-h-screen bg-brand-bg">
        <ErrorBoundary>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-72">
              <Header onSearchClick={() => { /* TODO: Implement search functionality */ }} />

              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg px-4 sm:px-6 lg:px-8">
                <div className="w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>

          <ToastNotification
            notifications={notifications}
            removeNotification={removeNotification}
          />
        </ErrorBoundary>
      </div>
    </ErrorContextProvider>
  );
};

export default ClientLayout;
