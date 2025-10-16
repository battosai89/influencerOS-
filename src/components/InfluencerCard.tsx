import Link from 'next/link';
import Image from 'next/image';
import { Influencer } from '../types';

interface InfluencerCardProps {
    influencer: Influencer;
}

const formatFollowers = (followers: number): string => {
    if (followers >= 1000000) {
        return `${(followers / 1000000).toFixed(1)}M`;
    }
    if (followers >= 1000) {
        return `${(followers / 1000).toFixed(0)}K`;
    }
    return followers.toString();
};


const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer }) => {
    const statusColors: {[key: string]: string} = {
        active: 'bg-green-500/20 text-green-400',
        inactive: 'bg-yellow-500/20 text-yellow-400',
        lead: 'bg-blue-500/20 text-blue-400',
    };

    return (
        <Link href={`/influencers/${influencer.id}`} className="group block futuristic-border bg-brand-surface rounded-xl p-4 text-center transition-all duration-300 hover:shadow-glow-sm">
            <Image
                src={influencer.avatarUrl || '/default-avatar.png'}
                alt={influencer.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-brand-border transition-transform duration-300 group-hover:scale-105"
            />
            <h3 className="text-lg font-bold text-brand-text-primary font-display">{influencer.name}</h3>
            <p className="text-brand-text-secondary">{influencer.platform}</p>
            <p className="text-2xl font-display font-bold text-brand-text-primary my-2">{formatFollowers(influencer.followers)}</p>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[influencer.status]}`}>
                {influencer.status.charAt(0).toUpperCase() + influencer.status.slice(1)}
            </span>
        </Link>
    );
};

export default InfluencerCard;