import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { ContentPiece } from '../types';
import { Plus, MessageSquare, ClipboardCheck } from 'lucide-react';
import { InstagramIcon, TikTokIcon, YouTubeIcon } from '../components/icons/Icon';
import EmptyState from '../components/EmptyState';
import Image from 'next/image';

const statusConfig: { [key in ContentPiece['status']]: { title: string; color: string } } = {
    'Submitted': { title: 'Submitted', color: 'bg-blue-500/20 text-blue-400 border-blue-500' },
    'Agency Review': { title: 'Agency Review', color: 'bg-purple-500/20 text-purple-400 border-purple-500' },
    'Client Review': { title: 'Client Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500' },
    'Revisions Requested': { title: 'Revisions Requested', color: 'bg-red-500/20 text-red-400 border-red-500' },
    'Approved': { title: 'Approved', color: 'bg-green-500/20 text-green-400 border-green-500' },
};

const ContentCard: React.FC<{ content: ContentPiece }> = ({ content }) => {
    const { getInfluencer } = useStore();
    const influencer = getInfluencer(content.influencerId);

    const platformIcons = {
        Instagram: <InstagramIcon className="w-4 h-4" />,
        TikTok: <TikTokIcon className="w-4 h-4" />,
        YouTube: <YouTubeIcon className="w-4 h-4" />,
    };

    return (
        <Link
            href={`/content-hub/${content.id}`}
            className="block futuristic-border bg-brand-surface rounded-xl p-4 transition-all duration-300 hover:shadow-glow-sm cursor-grab active:cursor-grabbing"
        >
            <Image src={content.thumbnailUrl || '/placeholder-image.jpg'} alt={content.title} className="w-full h-32 object-cover rounded-lg mb-4" width={320} height={128} />
            <h4 className="font-bold text-brand-text-primary leading-tight truncate">{content.title}</h4>
            
            <div className="flex items-center gap-2 text-xs text-brand-text-secondary mt-2">
                {platformIcons[content.platform]}
                <span>{content.platform}</span>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm">
                <Image src={influencer?.avatarUrl || '/placeholder-avatar.jpg'} alt={influencer?.name || 'Influencer avatar'} className="w-6 h-6 rounded-full" width={24} height={24} />
                <span className="text-brand-text-secondary">{influencer?.name}</span>
            </div>

            <div className="flex justify-between items-center mt-4 text-xs">
                <span className="text-brand-text-secondary">Version {content.version}</span>
                <div className="flex items-center gap-1 text-brand-text-secondary">
                    <MessageSquare className="w-3 h-3" />
                    <span>{content.comments.length}</span>
                </div>
            </div>
        </Link>
    );
};

const ContentHub: React.FC = () => {
    const { contentPieces, updateContentPieceStatus } = useStore();
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const statuses: ContentPiece['status'][] = ['Submitted', 'Agency Review', 'Client Review', 'Revisions Requested', 'Approved'];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, contentId: string) => {
        setDraggedItemId(contentId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', contentId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-brand-border/30');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('bg-brand-border/30');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: ContentPiece['status']) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-brand-border/30');
        const contentId = e.dataTransfer.getData('text/plain');
        if (contentId) {
            updateContentPieceStatus(contentId, newStatus);
        }
    };
    
    const handleDragEnd = () => {
        setDraggedItemId(null);
        document.querySelectorAll('.bg-brand-border/30').forEach(el => el.classList.remove('bg-brand-border/30'));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-brand-text-primary">Content Hub</h1>
                <button className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors whitespace-nowrap">
                    <Plus className="w-5 h-5" />
                    Submit Content
                </button>
            </div>
            
            {contentPieces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
                    {statuses.map(status => (
                        <div 
                            key={status}
                            className="bg-brand-bg rounded-xl transition-colors duration-300 flex flex-col h-full"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, status)}
                        >
                            <div className={`p-4 border-b ${statusConfig[status].color.replace('bg-', 'border-').replace('/20','')} sticky top-0 bg-brand-bg rounded-t-xl z-10`}>
                                <h3 className="font-bold text-brand-text-primary text-center flex justify-center items-center">
                                    <span className="truncate" title={status}>{status}</span>
                                    <span className={`ml-2 flex-shrink-0 text-sm font-semibold px-2 py-0.5 rounded-full ${statusConfig[status].color}`}>
                                        {contentPieces.filter(c => c.status === status).length}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-4 flex-grow min-h-[200px]">
                                {contentPieces.filter(c => c.status === status).map(content => (
                                    <div 
                                        key={content.id} 
                                        draggable 
                                        onDragStart={(e) => handleDragStart(e, content.id)}
                                        onDragEnd={handleDragEnd}
                                        className={`transition-opacity ${draggedItemId === content.id ? 'opacity-30' : 'opacity-100'}`}
                                    >
                                        <ContentCard content={content} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={<ClipboardCheck />}
                    title="Your Content Hub is Ready"
                    description="This is where you'll manage the entire content approval workflow. Get started by submitting a piece of content for review."
                    cta={
                        <button className="flex items-center mx-auto gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                            <Plus className="w-5 h-5" />
                            Submit Content
                        </button>
                    }
                />
            )}
        </div>
    );
};

export default ContentHub;
