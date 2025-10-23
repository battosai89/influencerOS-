import React from 'react';
import Modal from './Modal';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  showIcon?: boolean; // New: Optional icon display
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  showIcon = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    info: 'bg-brand-primary hover:bg-brand-accent text-white'
  };

  const cancelButtonStyles = {
    danger: 'bg-brand-surface border border-red-200 text-red-600 hover:bg-red-50',
    warning: 'bg-brand-surface border border-yellow-200 text-yellow-600 hover:bg-yellow-50',
    info: 'bg-brand-surface border border-brand-border text-brand-text-primary hover:bg-brand-border'
  };

  const iconStyles = {
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  const getIcon = () => {
    if (!showIcon) return null;

    const iconProps = {
      size: 24,
      className: iconStyles[variant],
      'aria-hidden': true
    };

    switch (variant) {
      case 'danger':
        return <AlertTriangle {...iconProps} />;
      case 'warning':
        return <AlertCircle {...iconProps} />;
      case 'info':
      default:
        return <Info {...iconProps} />;
    }
  };

  const iconElement = getIcon();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-6">
        {/* Content with optional icon */}
        <div className="flex items-start gap-4">
          {iconElement && (
            <div className="flex-shrink-0 mt-1">
              {iconElement}
            </div>
          )}
          <div className="flex-1">
            <p className="text-brand-text-secondary leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-brand-border">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${cancelButtonStyles[variant]}`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;