import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { ContentPiece } from '../types';
import { CheckCircle, AlertCircle, XCircle, Send } from 'lucide-react';
import Image from 'next/image';

const statusConfig: { [key in ContentPiece['status']]: { title: string; color: string; icon: React.ReactNode } } = {
    'Submitted': { title: 'Submitted', color: 'text-blue-400', icon: <AlertCircle /> },
    'Agency Review': { title: 'Agency Review', color: 'text-purple-400', icon: <AlertCircle /> },
    'Client Review': { title: 'Client Review', color: 'text-yellow-400', icon: <AlertCircle /> },
    'Revisions Requested': { title: 'Revisions Requested', color: 'text-red-400', icon: <XCircle /> },
    'Approved': { title: 'Approved', color: 'text-green-400', icon: <CheckCircle /> },
};


const ContentDetail: React.FC = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const { getContentPiece, getInfluencer, getCampaign, updateContentPieceStatus, addContentComment, userAvatarUrl, userName } = useStore();
    const [commentText, setCommentText] = useState('');
    const contentPiece = getContentPiece(contentId!);

    if (!contentPiece) {
        return <div className="text-center text-brand-text-primary">Content piece not found.</div>;
    }
    
    const influencer = getInfluencer(contentPiece.influencerId);
    const campaign = getCampaign(contentPiece.campaignId);

    const handleStatusUpdate = (newStatus: ContentPiece['status']) => {
        updateContentPieceStatus(contentPiece.id, newStatus);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            addContentComment(contentPiece.id, {
                authorName: userName,
                authorAvatarUrl: userAvatarUrl,
                authorRole: 'Agency', // Mocking current user as Agency
                text: commentText.trim(),
            });
            setCommentText('');
        }
    };

    const currentStatus = statusConfig[contentPiece.status];

    return (
        <div className="flex gap-8 h-[calc(100vh-12rem)]">
            {/* Left Column: Content Preview */}
            <div className="w-2/3 futuristic-border bg-brand-surface rounded-xl flex flex-col">
                <header className="p-4 border-b border-brand-border flex-shrink-0">
                    <h2 className="font-bold text-brand-text-primary truncate">{contentPiece.title}</h2>
                    <p className="text-sm text-brand-text-secondary">
                        for <Link href={`/campaigns/${campaign?.id}`} className="hover:underline">{campaign?.name}</Link> by <Link href={`/influencers/${influencer?.id}`} className="hover:underline">{influencer?.name}</Link>
                    </p>
                </header>
                <div className="flex-grow flex items-center justify-center p-8 bg-brand-bg/50 overflow-hidden">
                    <Image src={contentPiece.thumbnailUrl} alt="Content Preview" className="max-w-full max-h-full object-contain rounded-lg" width={800} height={600} />
                </div>
            </div>

            {/* Right Column: Collaboration Panel */}
            <div className="w-1/3 futuristic-border bg-brand-surface rounded-xl flex flex-col">
                {/* Status & Actions */}
                <div className="p-4 border-b border-brand-border flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={currentStatus.color}>{currentStatus.icon}</span>
                        <h3 className={`text-lg font-bold ${currentStatus.color}`}>{currentStatus.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <button onClick={() => handleStatusUpdate('Approved')} className="bg-green-500/20 text-green-300 font-semibold py-2 rounded-lg hover:bg-green-500/30">Approve</button>
                        <button onClick={() => handleStatusUpdate('Revisions Requested')} className="bg-red-500/20 text-red-300 font-semibold py-2 rounded-lg hover:bg-red-500/30">Request Revisions</button>
                    </div>
                </div>

                {/* Comments */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {contentPiece.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Image src={comment.authorAvatarUrl || `https://i.pravatar.cc/150?u=${comment.authorName}`} alt={comment.authorName} className="w-8 h-8 rounded-full flex-shrink-0" width={32} height={32} />
                            <div className="bg-brand-bg p-3 rounded-lg flex-grow">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-brand-text-primary text-sm">{comment.authorName} <span className="text-xs text-brand-text-secondary font-normal">({comment.authorRole})</span></p>
                                    <p className="text-xs text-brand-text-secondary">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <p className="text-sm text-brand-text-secondary mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="p-4 border-t border-brand-border flex items-center gap-3 flex-shrink-0">
                    <Image src={userAvatarUrl || `https://i.pravatar.cc/150?u=${userName}`} alt={userName} className="w-8 h-8 rounded-full" width={32} height={32} />
                    <input 
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-brand-bg border border-brand-border rounded-lg px-4 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button type="submit" className="p-2 bg-brand-primary rounded-full text-white hover:bg-brand-accent disabled:bg-brand-secondary">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContentDetail;