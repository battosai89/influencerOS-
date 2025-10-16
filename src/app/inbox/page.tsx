"use client";

import * as React from 'react';
import { useState } from 'react';

import Image from 'next/image';

import { Mail, Send, Search, Star, Archive, Trash2, Paperclip, AlertCircle, ArrowLeft } from 'lucide-react';

interface Message {
    id: string;
    sender: {
        name: string;
        email: string;
        avatar?: string;
        type: 'influencer' | 'brand' | 'team' | 'client';
    };
    subject: string;
    preview: string;
    timestamp: string;
    unread: boolean;
    priority: 'high' | 'normal' | 'low';
    category: 'campaign' | 'contract' | 'general' | 'urgent';
    hasAttachments: boolean;
}

const InboxPage: React.FC = () => {

    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'campaign' | 'urgent'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCompose, setShowCompose] = useState(false);

    // Mock messages data
    const messages: Message[] = [
        {
            id: '1',
            sender: {
                name: 'Sophie Chen',
                email: 'sophie.chen@email.com',
                type: 'influencer',
                avatar: '/placeholder-avatar.png'
            },
            subject: 'Campaign Content Ideas for Summer Collection',
            preview: 'Hi! I have some great ideas for the summer campaign content that I think would really resonate with my audience...',
            timestamp: '2024-01-15T10:30:00Z',
            unread: true,
            priority: 'normal',
            category: 'campaign',
            hasAttachments: false
        },
        {
            id: '2',
            sender: {
                name: 'Aura Beauty',
                email: 'contact@aurabeauty.com',
                type: 'brand',
                avatar: '/placeholder-logo.png'
            },
            subject: 'Contract Review - Q1 Campaign',
            preview: 'Thank you for sending over the contract. We have a few questions about the payment terms and deliverables...',
            timestamp: '2024-01-15T09:15:00Z',
            unread: true,
            priority: 'high',
            category: 'contract',
            hasAttachments: true
        },
        {
            id: '3',
            sender: {
                name: 'Sarah Chen',
                email: 'sarah@influenceros.com',
                type: 'team'
            },
            subject: 'Campaign Performance Report',
            preview: 'The latest campaign numbers are looking great! We should discuss scaling this for next quarter...',
            timestamp: '2024-01-14T16:45:00Z',
            unread: false,
            priority: 'normal',
            category: 'campaign',
            hasAttachments: true
        },
        {
            id: '4',
            sender: {
                name: 'TechForward',
                email: 'partnerships@techforward.com',
                type: 'brand'
            },
            subject: 'URGENT: Campaign Deliverables Due',
            preview: 'We need the final content submissions by EOD today. Please confirm receipt of this message...',
            timestamp: '2024-01-14T14:20:00Z',
            unread: false,
            priority: 'high',
            category: 'urgent',
            hasAttachments: false
        },
        {
            id: '5',
            sender: {
                name: 'Noah Williams',
                email: 'noah.w@email.com',
                type: 'influencer'
            },
            subject: 'Collaboration Opportunity',
            preview: 'I came across your agency and would love to discuss potential collaboration opportunities...',
            timestamp: '2024-01-14T11:30:00Z',
            unread: false,
            priority: 'low',
            category: 'general',
            hasAttachments: false
        }
    ];

    const filteredMessages = messages.filter(message => {
        const matchesFilter = filter === 'all' ||
                            (filter === 'unread' && message.unread) ||
                            message.category === filter;
        const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertCircle className="w-4 h-4 text-red-400" />;
            case 'low': return <div className="w-2 h-2 bg-brand-text-secondary rounded-full" />;
            default: return null;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'urgent': return 'border-l-red-500 bg-red-500/5';
            case 'campaign': return 'border-l-blue-500 bg-blue-500/5';
            case 'contract': return 'border-l-green-500 bg-green-500/5';
            default: return 'border-l-brand-border bg-brand-bg/50';
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    if (selectedMessage) {
        return (
            <div className="space-y-6 animate-page-enter">
                {/* Back Button */}
                <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Inbox
                </button>

                {/* Message Header */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold text-brand-text-primary">
                                    {selectedMessage.sender.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text-primary">{selectedMessage.sender.name}</h2>
                                <p className="text-brand-text-secondary">{selectedMessage.sender.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedMessage.category === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                selectedMessage.category === 'campaign' ? 'bg-blue-500/20 text-blue-400' :
                                selectedMessage.category === 'contract' ? 'bg-green-500/20 text-green-400' :
                                'bg-brand-border text-brand-text-secondary'
                            }`}>
                                {selectedMessage.category}
                            </span>
                            <button className="p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg rounded-lg transition-colors">
                                <Archive className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-brand-text-secondary hover:text-red-400 hover:bg-brand-bg rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-brand-text-primary mb-2">{selectedMessage.subject}</h3>
                    <p className="text-sm text-brand-text-secondary">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                    </p>
                </div>

                {/* Message Body */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="w-full">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-brand-text-primary leading-relaxed mb-4">
                                {selectedMessage.preview.length > 100
                                    ? `${selectedMessage.preview}...`
                                    : selectedMessage.preview
                                }
                            </p>
                            {selectedMessage.preview.length > 100 && (
                                <p className="text-brand-text-primary leading-relaxed mb-4">
                                    This is a sample expanded message for demonstration purposes. In a real application,
                                    this would contain the full message content with proper formatting, attachments,
                                    and rich text support.
                                </p>
                            )}

                            <p className="text-brand-text-primary leading-relaxed">
                                The message content would continue here with full formatting, inline images,
                                and proper styling. This demonstrates how the full-width layout provides
                                much more space for reading and composing messages.
                            </p>
                        </div>

                        {selectedMessage.hasAttachments && (
                            <div className="mt-6 p-4 bg-brand-bg rounded-lg">
                                <h4 className="font-medium text-brand-text-primary mb-3">Attachments</h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 p-3 bg-brand-border rounded-lg">
                                        <Paperclip className="w-4 h-4 text-brand-text-secondary" />
                                        <span className="text-sm text-brand-text-primary">Contract_Draft_v2.pdf</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Actions */}
                <div className="bg-brand-surface futuristic-border rounded-xl p-6">
                    <div className="flex gap-3">
                        <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Reply
                        </button>
                        <button className="px-6 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors">
                            Forward
                        </button>
                        <button className="px-6 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Star
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Inbox</h1>
                    <p className="text-brand-text-secondary">View and manage your messages</p>
                </div>
                <button
                    onClick={() => setShowCompose(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    Compose
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 bg-brand-surface border border-brand-border rounded-lg text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-text-secondary" />
                    </div>
                </div>
                <div className="flex gap-2">
                    {(['all', 'unread', 'campaign', 'urgent'] as const).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                                filter === filterType
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                            }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            {filterType === 'unread' && (
                                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {messages.filter(m => m.unread).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages List - Full Width */}
            <div className="bg-brand-surface futuristic-border rounded-xl overflow-hidden">
                {filteredMessages.map((message) => (
                    <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-6 border-b border-brand-border cursor-pointer hover:bg-brand-bg/50 transition-all duration-300 ${getCategoryColor(message.category)} ${
                            message.unread ? 'bg-brand-primary/5' : ''
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center flex-shrink-0">
                                {message.sender.avatar ? (
                                    <Image src={message.sender.avatar} alt={message.sender.name} className="w-full h-full rounded-full object-cover" width={48} height={48} />
                                ) : (
                                    <span className="text-lg font-bold text-brand-text-primary">
                                        {message.sender.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className={`font-semibold truncate ${message.unread ? 'text-brand-text-primary' : 'text-brand-text-secondary'}`}>
                                        {message.sender.name}
                                    </p>
                                    {getPriorityIcon(message.priority)}
                                    {message.hasAttachments && (
                                        <Paperclip className="w-4 h-4 text-brand-text-secondary" />
                                    )}
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-auto ${
                                        message.category === 'urgent' ? 'bg-red-500/20 text-red-400' :
                                        message.category === 'campaign' ? 'bg-blue-500/20 text-blue-400' :
                                        message.category === 'contract' ? 'bg-green-500/20 text-green-400' :
                                        'bg-brand-border text-brand-text-secondary'
                                    }`}>
                                        {message.category}
                                    </span>
                                </div>

                                <p className={`text-base truncate mb-2 ${message.unread ? 'text-brand-text-primary font-medium' : 'text-brand-text-secondary'}`}>
                                    {message.subject}
                                </p>

                                <p className="text-sm text-brand-text-secondary truncate mb-2">
                                    {message.preview}
                                </p>

                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-brand-text-secondary">
                                        {formatTime(message.timestamp)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {message.priority === 'high' && (
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                                                High Priority
                                            </span>
                                        )}
                                        {message.unread && (
                                            <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredMessages.length === 0 && (
                <div className="text-center py-12">
                    <Mail className="w-16 h-16 mx-auto text-brand-border mb-4" />
                    <h3 className="text-lg font-semibold text-brand-text-primary mb-2">No messages found</h3>
                    <p className="text-brand-text-secondary">
                        {searchTerm ? "No messages match your search" : "Your inbox is empty"}
                    </p>
                </div>
            )}

            {/* Compose Modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-brand-surface rounded-xl p-6 w-full max-w-2xl">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Compose Message</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">To</label>
                                <input
                                    type="email"
                                    placeholder="recipient@email.com"
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Message subject"
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Message</label>
                                <textarea
                                    rows={6}
                                    placeholder="Type your message here..."
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCompose(false)}
                                className="flex-1 px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" />
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InboxPage;