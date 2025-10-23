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
   status: 'lead' | 'contacted' | 'negotiating' | 'signed' | 'active' | 'inactive'; // Reordered for CRM pipeline
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
   leadStage?: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'; // CRM stages
   leadScore?: number; // 0-100, calculated by AI
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
   // CRM fields
   leadStage?: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
   leadScore?: number; // 0-100
   communicationLog: CommunicationLogItem[];
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

export interface ManualAttribution {
    id: string;
    influencerId: string;
    description: string;
    conversions: number;
    revenue: number;
    platform?: 'Instagram' | 'TikTok' | 'YouTube';
    postUrl?: string;
    metrics?: {
        views?: number;
        likes?: number;
        comments?: number;
        shares?: number;
        saves?: number;
        clicks?: number;
    };
    notes?: string;
    date: string;
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
   attributionData?: ManualAttribution[];
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


export interface TimeEntry {
   id: string;
   taskId?: string;
   description: string;
   startTime: string;
   endTime?: string;
   duration?: number; // in minutes
   date: string;
   category?: string;
 }

export interface Task {
   id: string;
   title: string;
   dueDate: string;
   status: 'pending' | 'completed';
   relatedContractId?: string;
   relatedCampaignId?: string;
   parentId?: string;
   dependencies?: string[]; // Array of task IDs this task depends on
   startDate?: string;
   endDate?: string;
   priority?: 'low' | 'medium' | 'high';
   assignee?: string;
   progress?: number; // 0-100
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

export type EventType = 'Appointment' | 'Deadline' | 'Meeting' | 'Campaign Milestone' | 'Task' | 'Reminder';

export interface Event {
     id: string;
     title: string;
     start: Date;
     end: Date;
     allDay?: boolean;
     type: EventType;
     brandId?: string;
     campaignId?: string;
     taskId?: string; // For task integration
     pollOptions?: string[]; // For scheduling polls
     invitees?: string[]; // Emails or IDs
     description?: string;
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

export interface InboxMessage {
    id: string;
    subject: string;
    sender: string;
    senderEmail: string;
    content: string;
    timestamp: string;
    folder: 'Inbox' | 'Sent' | 'Archived' | 'Trash';
    isRead: boolean;
    priority?: 'low' | 'normal' | 'high';
    attachments?: Array<{
        name: string;
        url: string;
        size: number;
    }>;
}

export interface CustomReport {
    id: string;
    name: string;
    description: string;
    type: 'financial' | 'campaign' | 'influencer' | 'client';
    filters: Record<string, any>;
    createdAt: string;
    lastRun?: string;
    schedule?: 'daily' | 'weekly' | 'monthly';
}


export interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    avatarUrl?: string;
    department: string;
    joinDate: string;
    status: 'active' | 'inactive';
}

export interface ToolDependencies {
    influencers: Influencer[];
    brands: Brand[];
    contracts: Contract[];
    campaigns: Campaign[];
    tasks: Task[];
    transactions: Transaction[];
    invoices: Invoice[];
    // Core actions - map store methods to expected format
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    scheduleEvent: (event: any) => void;
    createInvoice: (invoice: any) => void;
    logTransaction: (transaction: any) => void;
    createClient: (clientData: { client_type: 'influencer' | 'brand', name: string, details?: string }) => void;
    updateContract: (id: string, updates: Partial<Contract>) => void;
    addContractTemplate: (templateData: Pick<ContractTemplate, 'name' | 'description'>) => void;
    createCampaign: (campaign: any) => void;
    // Mock implementations for tools that don't exist in store
    findInfluencers: () => Promise<Influencer[]>;
    vetInfluencerProfile: () => Promise<any>;
    logClientInteraction: () => void;
    generateCampaignBrief: () => Promise<string>;
    sendInvoiceReminder: () => void;
    logPayment: () => void;
    trackInfluencerPayout: () => void;
    calculateCampaignProfitability: () => Promise<any>;
    generateFinancialReport: () => Promise<any>;
    sendContractForSignature: () => void;
    flagExpiringContracts: () => Promise<string[]>;
    generateContentIdeas: () => Promise<string[]>;
    draftSocialMediaCopy: () => Promise<string>;
    draftOutreachEmail: () => Promise<string>;
    generateCampaignReport: () => Promise<any>;
}
