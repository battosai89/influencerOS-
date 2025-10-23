import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Brand } from '../types';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

interface BrandCardProps {
    brand: Brand;
    onEdit?: (brand: Brand) => void;
    onDelete?: (brandId: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onEdit, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit?.(brand);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        onDelete?.(brand.id);
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="relative futuristic-border bg-brand-surface rounded-xl p-4 transition-all duration-300 hover:shadow-glow-sm group">
                {/* Action Buttons - TOP RIGHT CORNER */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                        onClick={handleEdit}
                        className="p-1.5 text-brand-text-secondary hover:text-brand-primary rounded-full hover:bg-brand-bg transition-colors"
                        title="Edit brand"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-brand-text-secondary hover:text-red-500 rounded-full hover:bg-brand-bg transition-colors"
                        title="Delete brand"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>

                <Link href={`/brands/${brand.id}`} className="block text-center">
                    <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        width={100}
                        height={100}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-brand-border transition-transform duration-300 group-hover:scale-105"
                    />
                    <h3 className="text-lg font-bold text-brand-text-primary font-display">{brand.name}</h3>
                    <p className="text-brand-text-secondary">{brand.industry}</p>
                    {brand.website && (
                        <div className="flex items-center justify-center gap-1 mt-2 text-sm text-brand-text-secondary">
                            <ExternalLink className="w-3 h-3" />
                            <span>Website</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Brand"
                message={`Are you sure you want to delete "${brand.name}"? This action cannot be undone.`}
                confirmText="Delete Brand"
            />
        </>
    );
};

export default BrandCard;