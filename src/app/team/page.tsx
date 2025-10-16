"use client";

import * as React from 'react';
import { useState } from 'react';
import useStore from '@/hooks/useStore';
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Star, Edit, Trash2, MoreVertical } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    location: string;
    joinDate: string;
    avatar?: string;
    status: 'active' | 'inactive' | 'on-leave';
    performance: {
        campaigns: number;
        completedTasks: number;
        rating: number;
    };
    skills: string[];
}

const TeamPage: React.FC = () => {
    const { userName, userRole } = useStore();
    const [showAddMember, setShowAddMember] = useState(false);

    // Mock team data - in a real app this would come from your store/API
    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: userName || 'Alex Johnson',
            role: userRole || 'Agency Director',
            email: 'alex@influenceros.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            joinDate: '2023-01-15',
            status: 'active',
            performance: {
                campaigns: 24,
                completedTasks: 156,
                rating: 4.8
            },
            skills: ['Strategy', 'Client Relations', 'Leadership']
        },
        {
            id: '2',
            name: 'Sarah Chen',
            role: 'Campaign Manager',
            email: 'sarah@influenceros.com',
            phone: '+1 (555) 234-5678',
            location: 'Los Angeles, CA',
            joinDate: '2023-03-20',
            status: 'active',
            performance: {
                campaigns: 18,
                completedTasks: 142,
                rating: 4.6
            },
            skills: ['Campaign Strategy', 'Content Planning', 'Analytics']
        },
        {
            id: '3',
            name: 'Mike Rodriguez',
            role: 'Account Manager',
            email: 'mike@influenceros.com',
            location: 'Miami, FL',
            joinDate: '2023-06-10',
            status: 'active',
            performance: {
                campaigns: 12,
                completedTasks: 98,
                rating: 4.4
            },
            skills: ['Client Relations', 'Negotiation', 'Brand Management']
        },
        {
            id: '4',
            name: 'Emma Thompson',
            role: 'Content Creator',
            email: 'emma@influenceros.com',
            location: 'Austin, TX',
            joinDate: '2023-08-05',
            status: 'on-leave',
            performance: {
                campaigns: 8,
                completedTasks: 76,
                rating: 4.7
            },
            skills: ['Content Creation', 'Video Editing', 'Social Media']
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-brand-success bg-brand-success/10';
            case 'inactive': return 'text-brand-text-secondary bg-brand-border';
            case 'on-leave': return 'text-brand-warning bg-brand-warning/10';
            default: return 'text-brand-text-secondary bg-brand-border';
        }
    };


    return (
        <div className="space-y-6 animate-page-enter">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text-primary font-display">Team</h1>
                    <p className="text-brand-text-secondary">Manage your team members and their performance</p>
                </div>
                <button
                    onClick={() => setShowAddMember(true)}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-all duration-200 ease-in-out hover:scale-105 flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Team Member
                </button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Members</p>
                            <p className="text-2xl font-bold text-brand-text-primary">{teamMembers.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Active</p>
                            <p className="text-2xl font-bold text-brand-success">{teamMembers.filter(m => m.status === 'active').length}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-brand-success" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Avg. Performance</p>
                            <p className="text-2xl font-bold text-brand-text-primary">
                                {(teamMembers.reduce((sum, m) => sum + m.performance.rating, 0) / teamMembers.length).toFixed(1)}
                            </p>
                        </div>
                        <Star className="w-8 h-8 text-brand-warning" />
                    </div>
                </div>
                <div className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-brand-text-secondary">Total Campaigns</p>
                            <p className="text-2xl font-bold text-brand-text-primary">
                                {teamMembers.reduce((sum, m) => sum + m.performance.campaigns, 0)}
                            </p>
                        </div>
                        <Award className="w-8 h-8 text-brand-primary" />
                    </div>
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                    <div key={member.id} className="bg-brand-surface futuristic-border rounded-xl p-6 hover:shadow-glow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-brand-bg rounded-full flex items-center justify-center">
                                    {member.avatar ? (
                                        <Image src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" width={48} height={48} />
                                    ) : (
                                        <span className="text-lg font-bold text-brand-text-primary">
                                            {member.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-brand-text-primary">{member.name}</h3>
                                    <p className="text-sm text-brand-text-secondary">{member.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                    {member.status}
                                </span>
                                <button
                                    onClick={() => {
                                        // TODO: Implement team member actions menu
                                        console.log('Team member actions:', member.id);
                                    }}
                                    className="text-brand-text-secondary hover:text-brand-text-primary"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <Mail className="w-4 h-4" />
                                <span>{member.email}</span>
                            </div>
                            {member.phone && (
                                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                    <Phone className="w-4 h-4" />
                                    <span>{member.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <MapPin className="w-4 h-4" />
                                <span>{member.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Performance Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-brand-bg rounded-lg">
                                <p className="text-lg font-bold text-brand-text-primary">{member.performance.campaigns}</p>
                                <p className="text-xs text-brand-text-secondary">Campaigns</p>
                            </div>
                            <div className="text-center p-2 bg-brand-bg rounded-lg">
                                <p className="text-lg font-bold text-brand-text-primary">{member.performance.completedTasks}</p>
                                <p className="text-xs text-brand-text-secondary">Tasks</p>
                            </div>
                            <div className="text-center p-2 bg-brand-bg rounded-lg">
                                <p className="text-lg font-bold text-brand-text-primary">{member.performance.rating}</p>
                                <p className="text-xs text-brand-text-secondary">Rating</p>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                            <p className="text-sm text-brand-text-secondary mb-2">Skills</p>
                            <div className="flex flex-wrap gap-1">
                                {member.skills.map((skill, index) => (
                                    <span key={index} className="px-2 py-1 bg-brand-bg text-brand-text-primary text-xs rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    // TODO: Implement edit team member functionality
                                    console.log('Edit team member:', member.id);
                                }}
                                className="flex-1 px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors text-sm flex items-center justify-center gap-1"
                            >
                                <Edit className="w-3 h-3" />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement delete team member functionality with confirmation
                                    console.log('Delete team member:', member.id);
                                }}
                                className="px-3 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors text-sm"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Team Member Modal/State */}
            {showAddMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-brand-surface rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-brand-text-primary mb-4">Add Team Member</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Role</label>
                                <select className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                    <option>Campaign Manager</option>
                                    <option>Account Manager</option>
                                    <option>Content Creator</option>
                                    <option>Analyst</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text-primary mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddMember(false)}
                                className="flex-1 px-4 py-2 bg-brand-surface text-brand-text-primary rounded-lg hover:bg-brand-border transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // TODO: Implement add team member functionality
                                    console.log('Add new team member');
                                    setShowAddMember(false);
                                }}
                                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-accent transition-colors"
                            >
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamPage;