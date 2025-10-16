import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '../types';

interface BrandCardProps {
    brand: Brand;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
    return (
        <Link href={`/brands/${brand.id}`} className="block futuristic-border bg-brand-surface rounded-xl p-4 text-center transition-all duration-300 hover:shadow-glow-sm group">
            <Image 
                src={brand.logoUrl} 
                alt={`${brand.name} logo`}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-brand-border transition-transform duration-300 group-hover:scale-105" 
            />
            <h3 className="text-lg font-bold text-brand-text-primary font-display">{brand.name}</h3>
            <p className="text-brand-text-secondary">{brand.industry}</p>
        </Link>
    );
};

export default BrandCard;