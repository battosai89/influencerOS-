import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  changeType?: 'increase' | 'decrease';
  changeValue?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  changeType,
  changeValue,
  icon,
  loading = false,
  className = ''
}) => (
  <div className={`futuristic-border bg-brand-surface rounded-xl p-6 ${className}`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-brand-text-secondary">{title}</h3>
      {icon && (
        <div className="text-brand-text-secondary">
          {icon}
        </div>
      )}
    </div>

    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold text-brand-text-primary">
        {loading ? (
          <div className="animate-pulse bg-brand-secondary rounded h-8 w-20"></div>
        ) : (
          value
        )}
      </p>

      {changeType && changeValue && !loading && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          <span>{changeType === 'increase' ? '▲' : '▼'}</span>
          <span>{changeValue}</span>
        </div>
      )}
    </div>

    {changeType && !loading && (
      <div className="mt-2">
        <div className={`text-xs ${
          changeType === 'increase' ? 'text-green-500' : 'text-red-500'
        }`}>
          {changeType === 'increase' ? '↗' : '↘'} vs last period
        </div>
      </div>
    )}
  </div>
);

export default DashboardCard;