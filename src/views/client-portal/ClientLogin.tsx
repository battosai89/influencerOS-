import * as React from 'react';
import { useState, useEffect } from 'react';
import useStore from '../../hooks/useStore';
import { LogIn } from 'lucide-react';
import Image from 'next/image';

const ClientLogin: React.FC = () => {
    const { clientLogin, agencyName, agencyLogoUrl } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = clientLogin(email, password);
        if (success) {
            window.location.href = '/portal/dashboard';
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 font-sans">
             <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    {agencyLogoUrl ? (
                        <Image src={agencyLogoUrl} alt={agencyName} className="h-12 w-auto mx-auto" width={48} height={48} />
                    ) : (
                        <h1 className="text-4xl font-bold text-gray-800">{agencyName}</h1>
                    )}
                    <h2 className="mt-4 text-2xl font-semibold text-gray-700">Client Portal Login</h2>
                    <p className="text-gray-500">Welcome back! Please sign in to view your projects.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                             <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div>
                            <button type="submit" className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                                <LogIn className="w-5 h-5" />
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientLogin;