import * as React from 'react';
import Link from 'next/link';
import { Contract, Influencer, Brand } from '../types';
import { FileText, Check, Clock, DollarSign } from 'lucide-react';

interface ContractCardProps {
  contract: Contract;
  influencer?: Influencer;
  brand?: Brand;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, influencer, brand }) => {
  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'Draft': return 'bg-gray-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Signed': return 'bg-green-500';
      case 'Expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/contracts/${contract.id}`} className="block">
      <div className="futuristic-border bg-brand-surface rounded-xl p-6 hover:shadow-glow-sm transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(contract.status)}`} />
            <FileText className="w-5 h-5 text-brand-text-secondary" />
            <h3 className="font-semibold text-brand-text-primary group-hover:text-brand-primary transition-colors">
              {contract.title}
            </h3>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            contract.status === 'Signed' ? 'bg-green-500/10 text-green-400' :
            contract.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400' :
            contract.status === 'Draft' ? 'bg-gray-500/10 text-gray-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {contract.status}
          </span>
        </div>

        <div className="space-y-3">
          {influencer && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <span className="font-medium">Influencer:</span>
              <span className="text-brand-text-primary">{influencer.name}</span>
              <span className="text-xs">({influencer.platform})</span>
            </div>
          )}

          {brand && (
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <span className="font-medium">Brand:</span>
              <span className="text-brand-text-primary">{brand.name}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-brand-text-secondary">
                <DollarSign className="w-4 h-4" />
                <span>${contract.value.toLocaleString()}</span>
              </div>

              {contract.endDate && (
                <div className="flex items-center gap-1 text-brand-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(contract.endDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {contract.status === 'Signed' && (
              <div className="flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
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