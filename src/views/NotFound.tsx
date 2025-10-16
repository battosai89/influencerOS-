import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <AlertTriangle className="w-16 h-16 text-brand-warning mb-4" />
      <h1 className="text-4xl font-bold text-brand-text-primary">404 - Page Not Found</h1>
      <p className="text-lg text-brand-text-secondary mt-2 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;