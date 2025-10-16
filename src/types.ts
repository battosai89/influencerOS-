// types.ts

import { OpenAI } from 'openai';
import React from 'react';

export interface CommunicationLogItem {
  id: string;
  date: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Note';
  summary: string;
}

export interface Influencer {
  id: string;
  name: string;
  avatarUrl?: string;
  avatar?: string; // For backwards compatibility
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  followers: number;
  status: 'active' | 'inactive' | 'lead' | 'contacted' | 'negotiating' | 'signed';
  engagementRate: number;
  notes?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  // New fields for Creator & Relationship widgets
  niche: string;
  rating: number; // 1-5 star rating
  location: string; // e.g., "New York, USA"
  availability: 'available' | 'booked' | 'on-hold';
  // New field for Audience Demographics widget
  audience: {
    gender: { male: number; female: number; other: number }; // percentages
    topLocations: { name: string; percentage: number }[];
  };
  // New field for CRM
  communicationLog: CommunicationLogItem[];
  // Additional fields for influencer detail view
  contact?: {
    email: string;
    phone: string;
  };
  joinedDate?: string;
  lastActive?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  campaigns?: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
  }>;
  contracts?: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  website?: string;
  notes?: string;
  // New field for Brand Relationship Health widget
  satisfaction: number; // 0-100 score
  // New fields for Client Portal
  portalAccess: boolean;
  portalUserEmail?: string;
  portalPassword?: string; // In a real app, this would be a hash
}

export interface ContractClause {
  title: string;
  content: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  clauses: ContractClause[];
}

export interface Contract {
  id: string;
  title: string;
  influencerId: string;
  brandId: string;
  status: 'Draft' | 'Pending' | 'Signed' | 'Expired';
  dateSigned?: Date;
  endDate?: string;
  value: number;
  templateId?: string;
  clauses: ContractClause[];
}

export interface CampaignContent {
    id:string;
    url: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube';
    performance?: {
        views: number;
        likes: number;
        comments: number;
    };
}

export interface Campaign {
  id: string;
  name: string;
  brandId: string;
  influencerIds: string[];
  startDate: string;
  endDate: string;
  content: CampaignContent[];
  roi: number;
  budget: number;
  category: string;
  milestones: { name: string; date: string }[];
  status: 'Planning' | 'Creator Outreach' | 'Content Creation' | 'Approval' | 'Live' | 'Completed';
}

export interface ContentComment {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  authorRole: 'Agency' | 'Client' | 'Influencer';
  text: string;
  timestamp: string;
}

export interface ContentPiece {
    id: string;
    title: string;
    campaignId: string;
    influencerId: string;
    status: 'Submitted' | 'Agency Review' | 'Client Review' | 'Revisions Requested' | 'Approved';
    dueDate: string;
    submissionDate?: string;
    // New fields
    thumbnailUrl: string;
    contentUrl: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube';
    comments: ContentComment[];
    version: number;
}


export interface Task {
  id:string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed';
  relatedContractId?: string;
  relatedCampaignId?: string;
  parentId?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Overdue';
  brandId?: string;
  influencerId?: string;
  campaignId?: string;
}

export type EventType = 'Appointment' | 'Deadline' | 'Meeting' | 'Campaign Milestone';

export interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    type: EventType;
    brandId?: string;
    campaignId?: string;
}

export interface DashboardTab {
  id: string;
  name: string;
  layout: DashboardLayoutItem[];
  isPinned?: boolean;
}

export interface UserPreferences {
  userName: string;
  userRole?: string;
  userAvatarUrl?: string;
  agencyName?: string;
  agencyLogoUrl?: string;
  pageVisits: { [key: string]: number };
  lastVisit: string;
  theme?: 'light' | 'dark';
  accentColor?: string;
  dashboardNotes?: string;
  dashboardTabs?: DashboardTab[];
  activeDashboardTabId?: string;
}

export interface Notification {
   id: number;
   message: string;
   type: 'success' | 'error' | 'warning' | 'info';
   duration?: number;
   read: boolean;
   timestamp: Date;
 }

export interface Invoice {
  id: string;
  invoiceNumber: string;
  brandId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export type FieldType = 'text' | 'date' | 'select' | 'number' | 'checkbox';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ChatForm {
  id: string;
  title: string;
  fields: FormField[];
}

export interface DisplayChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  plan?: string[];
  requiresConfirmation?: {
    text: string;
    tool_call: OpenAI.Chat.Completions.ChatCompletionMessageToolCall;
  };
  form?: ChatForm;
}

export type Lead = (Influencer & { type: 'Influencer' }) | (Brand & { type: 'Brand' });

export interface DashboardLayoutItem {
  id: string;
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DashboardTemplate {
   id: string;
   name: string;
   description: string;
   icon: React.ReactNode;
   layout: DashboardLayoutItem[];
 }

export interface Connection {
   id: string;
   name: string;
   type: 'google' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';
   status: 'connected' | 'disconnected' | 'error';
   lastSync?: Date;
   accountId?: string;
   accountName?: string;
}
