import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../../hooks/useStore';
import { ContentPiece } from '../../types';
import { CheckCircle, AlertCircle, XCircle, Send } from 'lucide-react';
import Image from 'next/image';

const statusConfig: { [key in ContentPiece['status']]: { title: string; color: string; icon: React.ReactNode } } = {
    'Submitted': { title: 'Submitted', color: 'text-gray-500', icon: <AlertCircle /> },
    'Agency Review': { title: 'In Review by Agency', color: 'text-purple-500', icon: <AlertCircle /> },
    'Client Review': { title: 'Awaiting Your Approval', color: 'text-yellow-600', icon: <AlertCircle /> },
    'Revisions Requested': { title: 'Revisions Requested', color: 'text-red-500', icon: <XCircle /> },
    'Approved': { title: 'Approved', color: 'text-green-600', icon: <CheckCircle /> },
};

const ClientContentDetail: React.FC = () => {
    const { contentId } = useParams<{ contentId: string }>();
    const { getContentPiece, getInfluencer, getCampaign, updateContentPieceStatus, addContentComment, loggedInClient } = useStore();
    const [commentText, setCommentText] = useState('');
    const contentPiece = getContentPiece(contentId!);

    if (!contentPiece) {
        return <div className="text-center text-gray-600">Content piece not found.</div>;
    }
    
    const influencer = getInfluencer(contentPiece.influencerId);
    const campaign = getCampaign(contentPiece.campaignId);

    const handleStatusUpdate = (newStatus: ContentPiece['status']) => {
        updateContentPieceStatus(contentPiece.id, newStatus);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() && loggedInClient) {
            addContentComment(contentPiece.id, {
                authorName: loggedInClient.name,
                authorAvatarUrl: loggedInClient.logoUrl,
                authorRole: 'Client',
                text: commentText.trim(),
            });
            setCommentText('');
        }
    };

    const currentStatus = statusConfig[contentPiece.status];

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Content Preview */}
            <div className="lg:w-2/3 bg-white border border-gray-200 rounded-xl flex flex-col">
                <header className="p-4 border-b border-gray-200 flex-shrink-0">
                    <Link href={`/portal/campaigns/${campaign?.id}`} className="text-sm font-semibold text-purple-600 hover:underline">&larr; Back to Campaign</Link>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2 truncate">{contentPiece.title}</h2>
                    <p className="text-sm text-gray-500">by {influencer?.name}</p>
                </header>
                <div className="flex-grow flex items-center justify-center p-8 bg-gray-50">
                    <Image src={contentPiece.thumbnailUrl} alt="Content Preview" width={500} height={300} className="max-w-full max-h-full object-contain rounded-lg shadow-md" />
                </div>
            </div>

            {/* Right Column: Collaboration Panel */}
            <div className="lg:w-1/3 bg-white border border-gray-200 rounded-xl flex flex-col h-[calc(100vh-12rem)]">
                {/* Status & Actions */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={currentStatus.color}>{currentStatus.icon}</span>
                        <h3 className={`text-lg font-bold ${currentStatus.color}`}>{currentStatus.title}</h3>
                    </div>
                    {contentPiece.status === 'Client Review' && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <button onClick={() => handleStatusUpdate('Approved')} className="bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700">Approve</button>
                            <button onClick={() => handleStatusUpdate('Revisions Requested')} className="bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700">Request Revisions</button>
                        </div>
                    )}
                </div>

                {/* Comments */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {contentPiece.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Image src={comment.authorAvatarUrl || `https://i.pravatar.cc/150?u=${comment.authorName}`} alt={comment.authorName} width={32} height={32} className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="bg-gray-100 p-3 rounded-lg flex-grow">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-gray-800 text-sm">{comment.authorName} <span className="text-xs text-gray-500 font-normal">({comment.authorRole})</span></p>
                                    <p className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="p-4 border-t border-gray-200 flex items-center gap-3 flex-shrink-0">
                    <Image src={loggedInClient?.logoUrl || ''} alt={loggedInClient?.name || 'Profile'} width={32} height={32} className="w-8 h-8 rounded-full" />
                    <input 
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" className="p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 disabled:bg-gray-400">
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClientContentDetail;