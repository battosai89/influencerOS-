import * as React from 'react';
import Link from 'next/link';
import { Contract, Influencer, Brand } from '../types';
import { FileText, Check, Clock, DollarSign } from 'lucide-react';
import SkeletonLoader from './SkeletonLoader';

interface ContractCardProps {
  contract: Contract;
  influencer?: Influencer;
  brand?: Brand;
  isLoading?: boolean;
  animationDelay?: number;
}

const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  influencer,
  brand,
  isLoading = false,
  animationDelay = 0
}) => {
  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Signed': return 'bg-green-500';
      case 'Expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Loading skeleton component
  if (isLoading) {
    return (
      <div className="futuristic-border bg-brand-surface rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <SkeletonLoader className="w-3 h-3 rounded-full" />
            <SkeletonLoader className="w-5 h-5" />
            <SkeletonLoader className="h-6 w-32" />
          </div>
          <SkeletonLoader className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-3">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-4 w-20" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SkeletonLoader className="h-4 w-16" />
              <SkeletonLoader className="h-4 w-12" />
            </div>
            <SkeletonLoader className="h-4 w-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/contracts/${contract.id}`} className="block">
      <div
        className="futuristic-border bg-brand-surface rounded-xl p-4 sm:p-6 hover:shadow-glow-sm transition-all duration-300 group animate-fade-in"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* Header Section with Status */}
        <div
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4"
          style={{ animationDelay: `${animationDelay + 100}ms` }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(contract.status)} animate-pulse-gentle`}
              style={{ animationDelay: `${animationDelay + 200}ms` }}
            />
            <FileText
              className="w-5 h-5 text-brand-text-secondary flex-shrink-0 group-hover:text-brand-primary transition-colors"
              style={{ animationDelay: `${animationDelay + 150}ms` }}
            />
            <h3 className="font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors truncate">
              {contract.title}
            </h3>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full border self-start sm:self-center flex-shrink-0 ${
              contract.status === 'Signed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              contract.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              contract.status === 'Draft' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
              'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
            style={{ animationDelay: `${animationDelay + 250}ms` }}
          >
            {contract.status}
          </span>
        </div>

        {/* Content Section */}
        <div
          className="space-y-3"
          style={{ animationDelay: `${animationDelay + 300}ms` }}
        >
          {/* Influencer and Brand Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {influencer && (
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <span className="font-medium flex-shrink-0">Influencer:</span>
                <span className="text-brand-text-primary truncate">{influencer.name}</span>
                <span className="text-xs bg-brand-bg px-2 py-0.5 rounded-full flex-shrink-0">
                  {influencer.platform}
                </span>
              </div>
            )}

            {brand && (
              <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                <span className="font-medium flex-shrink-0">Brand:</span>
                <span className="text-brand-text-primary truncate">{brand.name}</span>
              </div>
            )}
          </div>

          {/* Value and Date Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-brand-text-primary">
                  ${contract.value.toLocaleString()}
                </span>
              </div>

              {contract.endDate && (
                <div className="flex items-center gap-1 text-sm text-brand-text-secondary">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-brand-text-primary">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {contract.status === 'Signed' && (
              <div
                className="flex items-center gap-1 text-green-400 self-end sm:self-center"
                style={{ animationDelay: `${animationDelay + 400}ms` }}
              >
                <Check className="w-4 h-4 animate-bounce-gentle" />
                <span className="text-xs font-medium">Signed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContractCard;