import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  cta: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, cta }) => {
  return (
    <div className="text-center py-20 futuristic-border bg-brand-surface rounded-xl">
      <div className="w-16 h-16 mx-auto text-brand-border flex items-center justify-center">
        {React.isValidElement(icon) ?
          React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
            className: "w-16 h-16"
          }) :
          icon
        }
      </div>
      <h3 className="mt-4 text-xl font-bold text-brand-text-primary">{title}</h3>
      <p className="mt-2 text-brand-text-secondary max-w-md mx-auto">{description}</p>
      <div className="mt-6">
        {cta}
      </div>
    </div>
  );
};

export default EmptyState;
