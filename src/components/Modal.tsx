import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // On component mount, find the portal root.
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Corresponds to animation duration
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function
    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 bg-brand-bg/95 z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-search-backdrop-out' : 'animate-search-backdrop-in'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`futuristic-border bg-brand-surface rounded-xl p-8 w-full ${maxWidthClasses[maxWidth]} relative ${isClosing ? 'animate-search-modal-out' : 'animate-search-modal-in'}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary transition-all duration-200 ease-in-out hover:scale-110" aria-label="Close modal">
          <X className="w-6 h-6" />
        </button>
        <h2 id="modal-title" className="text-2xl font-bold text-brand-text-primary font-display mb-6">{title}</h2>
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;