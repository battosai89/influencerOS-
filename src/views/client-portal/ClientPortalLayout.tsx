import * as React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '../../hooks/useStore';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

const ClientPortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loggedInClient, clientLogout, agencyName } = useStore();
    const pathname = usePathname();

    useEffect(() => {
        const htmlEl = document.documentElement;
        const wasDark = htmlEl.classList.contains('dark');
        htmlEl.classList.remove('dark');
        
        // On component unmount, restore the previous theme state
        return () => {
            if (wasDark) {
                htmlEl.classList.add('dark');
            }
        }
    }, []);

    if (!loggedInClient) {
        // This should be handled by the protected route, but as a fallback
        return <div>Loading...</div>;
    }

    const navItems = [
        { name: 'Dashboard', path: '/portal/dashboard' },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-4">
                            <Image src={loggedInClient.logoUrl} alt={loggedInClient.name} className="h-10 w-auto" width={40} height={40} />
                             <div className="h-8 w-px bg-gray-200"></div>
                             <p className="text-sm text-gray-500">Powered by {agencyName}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <nav className="flex items-center gap-4">
                               {navItems.map(item => (
                                   <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`text-sm font-semibold transition-colors ${pathname === item.path ? 'text-purple-600' : 'text-gray-500 hover:text-gray-800'}`}
                                   >
                                       {item.name}
                                   </Link>
                               ))}
                            </nav>
                            <button onClick={clientLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-semibold">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="py-10">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                     <div key={pathname} className="animate-page-enter">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientPortalLayout;