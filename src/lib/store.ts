import { create } from 'zustand';
import { supabaseCrudService, fetchData } from '../services/supabaseCrudService';
import {
   Influencer, Brand, Contract, Campaign, Task, Transaction, Event,
   ContentPiece, Invoice, UserPreferences, Notification, DashboardTab,
   DashboardLayoutItem, DashboardTemplate, ContractTemplate, DisplayChatMessage,
   ContentComment, CommunicationLogItem, InboxMessage, CustomReport, ManualAttribution, TeamMember,
   TimeEntry,
 } from '../types';

import { PREMADE_TEMPLATES } from '../data/templates';

import { getUserPreferences, savePreferences, getNotifications, saveNotifications } from '../services/userPreferenceService';
import notificationService from '../services/notificationService';

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// Helper to compact layout by removing gaps and reordering widgets
const compactLayout = (layout: DashboardLayoutItem[]): DashboardLayoutItem[] => {
    if (layout.length === 0) return layout;

    // Sort widgets by their current Y position
    const sortedWidgets = [...layout].sort((a, b) => a.y - b.y);

    // Group widgets by column (x position)
    const columnGroups: { [key: number]: DashboardLayoutItem[] } = {};
    sortedWidgets.forEach(widget => {
        if (!columnGroups[widget.x]) {
            columnGroups[widget.x] = [];
        }
        columnGroups[widget.x].push(widget);
    });

    // Compact each column by reordering widgets to eliminate gaps
    const compactedLayout: DashboardLayoutItem[] = [];
    Object.values(columnGroups).forEach(columnWidgets => {
        // Sort widgets in this column by Y position
        const sortedColumn = columnWidgets.sort((a, b) => a.y - b.y);

        // Reassign Y positions to be contiguous starting from 0
        let currentY = 0;
        sortedColumn.forEach(widget => {
            compactedLayout.push({
                ...widget,
                y: currentY
            });
            currentY += widget.h;
        });
    });

    return compactedLayout;
};

// Safe localStorage access for SSR compatibility
const safeGetPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') {
    return {
      userName: 'Alex',
      userRole: 'Agency Director',
      userAvatarUrl: '',
      agencyName: 'InfluencerOS',
      agencyLogoUrl: '',
      pageVisits: {},
      lastVisit: new Date().toISOString(),
      theme: 'light' as const,
      accentColor: 'purple',
      dashboardNotes: '',
      dashboardTabs: [{ id: 'main', name: 'My Dashboard', layout: PREMADE_TEMPLATES[1].layout }],
      activeDashboardTabId: 'main'
    };
  }
  return getUserPreferences();
};

const safeGetNotifications = (): Notification[] => {
  if (typeof window === 'undefined') {
    return [
      { id: 1, message: 'Contract for Aura Beauty is pending signature.', type: 'warning', read: false, timestamp: new Date() },
      { id: 2, message: 'New lead "Noah Ito" was added.', type: 'info', read: false, timestamp: new Date() },
      { id: 3, message: 'Campaign "Summer Style Edit" completed successfully.', type: 'success', read: false, timestamp: new Date() },
    ];
  }
  return getNotifications();
};

// Initial state from services
const initialPrefs = safeGetPreferences();
const initialNotifications = safeGetNotifications();

interface StoreState {
   // Supabase Data
   supabaseInfluencers: Influencer[];
   supabaseBrands: Brand[];
   supabaseContracts: Contract[];
   supabaseCampaigns: Campaign[];
   supabaseTasks: Task[];
   supabaseTransactions: Transaction[];
   supabaseEvents: Event[];
   supabaseContentPieces: ContentPiece[];
   supabaseInvoices: Invoice[];
   supabaseContractTemplates: ContractTemplate[];
   supabaseTimeEntries: TimeEntry[];

   // Supabase UI State
   supabaseLoading: boolean;
   supabaseError: string | null;

   // Data
     influencers: Influencer[];
   brands: Brand[];
   contracts: Contract[];
   campaigns: Campaign[];
   tasks: Task[];
   transactions: Transaction[];
   events: Event[];
   contentPieces: ContentPiece[];
   invoices: Invoice[];
   contractTemplates: ContractTemplate[];
   timeEntries: TimeEntry[];
   teamMembers: TeamMember[];
   messages: InboxMessage[];
   selectedMessageId: string | null;
   customReports: CustomReport[];
   dashboardTemplates: DashboardTemplate[];

  // User & Agency Preferences
   userName: string;
   userRole: string;
   userAvatarUrl: string;
   agencyName: string;
   agencyLogoUrl: string;
   theme: 'light' | 'dark';
   accentColor: string;
   dashboardNotes: string;
   pageVisits: { [key: string]: number };
   lastVisit: string;

  // Dashboard layout
  dashboardTabs: DashboardTab[];
  activeDashboardTabId: string;
  
  // Notifications
  notifications: Notification[];

  // UI State
  isAssistantOpen: boolean;
  assistantInitialCommand: string | null;
  chatHistory: DisplayChatMessage[];
  loading: boolean;
  
  // Client Portal State
  loggedInClient: Brand | null;
}

interface StoreActions {
  // Getters
  getInfluencer: (id: string) => Influencer | undefined;
  getBrand: (id: string) => Brand | undefined;
  getContract: (id: string) => Contract | undefined;
  getCampaign: (id: string) => Campaign | undefined;
  getContentPiece: (id: string) => ContentPiece | undefined;
  getContractTemplate: (id: string) => ContractTemplate | undefined;

  // Data mutations
  addClient: (data: Partial<Influencer> | Partial<Brand>, type: 'influencer' | 'brand') => void;
  updateInfluencerStatus: (id: string, status: Influencer['status']) => void;
  deleteInfluencer: (id: string) => void;

  createCampaign: (data: Omit<Campaign, 'id' | 'content' | 'roi'>) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;

  addContract: (data: Partial<Contract>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;

  addContractTemplate: (data: Pick<ContractTemplate, 'name' | 'description'>) => void;
  updateContractTemplate: (id: string, updates: Partial<ContractTemplate>) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  scheduleEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'issueDate'>) => void;

  logTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  
  addContentPiece: (contentPiece: Omit<ContentPiece, 'id' | 'comments' | 'version'>) => void;
  updateContentPieceStatus: (id: string, status: ContentPiece['status']) => void;
  addContentComment: (contentId: string, comment: Omit<ContentComment, 'id'|'timestamp'>) => void;
  addManualAttribution: (campaignId: string, attributionData: Omit<ManualAttribution, 'id'>) => void;

  logInfluencerInteraction: (influencerId: string, log: Omit<CommunicationLogItem, 'id'>) => void;

  // Time Tracking
  startTimeEntry: (taskId?: string, description?: string) => void;
  stopTimeEntry: (id: string) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;

  // New comprehensive tool actions (mocked for now)
  findInfluencers: (criteria: unknown) => Promise<Influencer[]>;
  vetInfluencerProfile: (url: string) => Promise<unknown>;
  logClientInteraction: (client: string, summary: string) => void;
  generateCampaignBrief: (campaignName: string) => Promise<string>;
  sendInvoiceReminder: (invoiceNumber: string) => void;
  logPayment: (invoiceNumber: string, amount: number) => void;
  trackInfluencerPayout: (influencer: string, campaign: string, amount: number) => void;
  calculateCampaignProfitability: (campaignName: string) => Promise<unknown>;
  generateFinancialReport: (reportType: string, period: unknown) => Promise<unknown>;
  sendContractForSignature: (contractTitle: string, email: string) => void;
  flagExpiringContracts: (days: number) => Promise<Contract[]>;
  generateContentIdeas: (brand: string, objective: string) => Promise<string[]>;
  draftSocialMediaCopy: (topic: string) => Promise<string>;
  draftOutreachEmail: (recipient: string, proposal: string) => Promise<string>;
  generateCampaignReport: (campaignName: string) => Promise<unknown>;
  createClient: (clientData: { client_type: 'influencer' | 'brand', name: string, details?: string }) => void;

  // Preferences
  updateUserProfile: (profile: { name: string; role: string; avatarUrl: string }) => void;
  updateAgencyProfile: (profile: { name: string; logoUrl: string }) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string) => void;
  updateDashboardNotes: (notes: string) => void;
  _savePrefs: () => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Dashboard Layout
  setActiveDashboardTab: (tabId: string) => void;
  addDashboardTab: (name?: string) => void;
  renameDashboardTab: (tabId: string, newName: string) => void;
  removeDashboardTab: (tabId: string) => void;
  addWidgetToLayout: (widgetId: string, widgetConfig: { defaultSpan: number }) => void;
  removeWidgetFromLayout: (widgetId: string) => void;
  moveWidget: (widgetId: string, newX: number, newY: number) => void;
  applyTemplate: (templateId: string, mode: 'new-tab' | 'current-tab') => void;

  // AI Assistant
  openAssistant: (command?: string) => void;
  closeAssistant: () => void;
  consumeAssistantCommand: () => void;
  setChatHistory: (history: DisplayChatMessage[]) => void;
  updateChatMessage: (id: number, updates: Partial<DisplayChatMessage>) => void;
  
  // Client Portal
  clientLogin: (email: string, password: string) => boolean;
  clientLogout: () => void;
  initializeClientSession: () => void;
  enablePortalAccess: (brandId: string, email: string, password: string) => void;
  fetchSupabaseData: (tableName: string, setStateKey: keyof StoreState) => Promise<void>;
}

type Store = StoreState & StoreActions;

const useStore = create<Store>((set, get) => ({
     // --- INITIAL STATE ---
         influencers: [],
   brands: [],
   contracts: [],
   campaigns: [],
   tasks: [],
   transactions: [],
   events: [],
   contentPieces: [],
   invoices: [],
   contractTemplates: [],
   timeEntries: [],
   teamMembers: [],
   messages: [],
   selectedMessageId: null,
   customReports: [],
     dashboardTemplates: PREMADE_TEMPLATES,

    userName: initialPrefs.userName,
    userRole: initialPrefs.userRole || 'Agency Director',
    userAvatarUrl: initialPrefs.userAvatarUrl || '',
    agencyName: initialPrefs.agencyName || 'InfluencerOS',
    agencyLogoUrl: initialPrefs.agencyLogoUrl || '',
    theme: initialPrefs.theme || 'dark',
    accentColor: initialPrefs.accentColor || 'purple',
    dashboardNotes: initialPrefs.dashboardNotes || '',
    pageVisits: initialPrefs.pageVisits || {},
    lastVisit: initialPrefs.lastVisit || new Date().toISOString(),
    
    dashboardTabs: initialPrefs.dashboardTabs || [{ id: 'main', name: 'My Dashboard', layout: PREMADE_TEMPLATES[1].layout }],
    activeDashboardTabId: initialPrefs.activeDashboardTabId || 'main',

    notifications: initialNotifications,

    isAssistantOpen: false,
    assistantInitialCommand: null,
    chatHistory: [], // Initialize empty, populate on client-side to avoid hydration mismatch
    loading: false,

    loggedInClient: null,

  // Supabase Data Initial State
  supabaseInfluencers: [],
  supabaseBrands: [],
  supabaseContracts: [],
  supabaseCampaigns: [],
  supabaseTasks: [],
  supabaseTransactions: [],
  supabaseEvents: [],
  supabaseContentPieces: [],
  supabaseInvoices: [],
  supabaseContractTemplates: [],
  supabaseTimeEntries: [],

  // Supabase UI State Initial State
  supabaseLoading: false,
  supabaseError: null,
    
    // --- ACTIONS ---

    // Getters
    getInfluencer: (id) => get().supabaseInfluencers.find(i => i.id === id),
  getBrand: (id) => get().supabaseBrands.find(b => b.id === id),
    getContract: (id) => get().supabaseContracts.find(c => c.id === id),
  getCampaign: (id) => get().supabaseCampaigns.find(c => c.id === id),
  getContentPiece: (id) => get().supabaseContentPieces.find(c => c.id === id),
  getContractTemplate: (id) => get().supabaseContractTemplates.find(t => t.id === id),

    // Data mutations
    addClient: async (data, type) => {
      if (type === 'influencer') {
        const newInfluencer = await supabaseCrudService.addInfluencer(data as Partial<Influencer>);
        if (newInfluencer) {
          set((state: StoreState) => ({ supabaseInfluencers: [...state.supabaseInfluencers, newInfluencer] }));
        }
      } else {
        const newBrand = await supabaseCrudService.addBrand(data as Partial<Brand>);
        if (newBrand) {
          set((state: StoreState) => ({ supabaseBrands: [...state.supabaseBrands, newBrand] }));
        }
      }
    },
    
    updateInfluencerStatus: async (id, status) => {
      const updatedInfluencer = await supabaseCrudService.updateInfluencer(id, { status });
      if (updatedInfluencer) {
        set((state: StoreState) => ({
          supabaseInfluencers: state.supabaseInfluencers.map(i => i.id === id ? { ...i, status } : i)
        }));
      }
    },

    deleteInfluencer: async (id) => {
      const success = await supabaseCrudService.deleteInfluencer(id);
      if (success) {
        set((state: StoreState) => ({
          supabaseInfluencers: state.supabaseInfluencers.filter(i => i.id !== id)
        }));
      }
    },

    createCampaign: (data) => set((state: StoreState) => {
        const newCampaign: Campaign = {
            id: generateId(),
            content: [],
            roi: 0,
            ...data,
        };
        notificationService.show({ message: `New campaign "${newCampaign.name}" created.`, type: 'success' });
        return { campaigns: [...state.campaigns, newCampaign] };
    }),
    
    updateCampaignStatus: async (id, status) => {
      const updatedCampaign = await supabaseCrudService.updateCampaign(id, { status });
      if (updatedCampaign) {
        set((state: StoreState) => ({
          supabaseCampaigns: state.supabaseCampaigns.map(c => c.id === id ? { ...c, status } : c)
        }));
      }
    },

    addContract: async (data) => {
      const newContract = await supabaseCrudService.addContract(data);
      if (newContract) {
        set((state: StoreState) => ({ supabaseContracts: [...state.supabaseContracts, newContract] }));
      }
    },

    updateContract: async (id, updates) => {
      const updatedContract = await supabaseCrudService.updateContract(id, updates);
      if (updatedContract) {
        set((state: StoreState) => ({
          supabaseContracts: state.supabaseContracts.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
      }
    },
    
    addContractTemplate: async (data) => {
      const newTemplate = await supabaseCrudService.addContractTemplate(data);
      if (newTemplate) {
        set((state: StoreState) => ({ supabaseContractTemplates: [...state.supabaseContractTemplates, newTemplate] }));
      }
    },
    
    updateContractTemplate: async (id, updates) => {
      const updatedTemplate = await supabaseCrudService.updateContractTemplate(id, updates);
      if (updatedTemplate) {
        set((state: StoreState) => ({
          supabaseContractTemplates: state.supabaseContractTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
      }
    },

    addTask: async (task) => {
      console.log('Store addTask called with:', task);
      try {
        const newTask = await supabaseCrudService.addTask(task);
        console.log('Supabase addTask returned:', newTask);
        if (newTask) {
          set((state: StoreState) => {
            console.log('Updating state with new task');
            return { supabaseTasks: [...state.supabaseTasks, newTask] };
          });
        } else {
          console.error('addTask returned null');
        }
      } catch (error) {
        console.error('Error in store addTask:', error);
        throw error;
      }
    },
    
    updateTask: async (taskId, updates) => {
      const updatedTask = await supabaseCrudService.updateTask(taskId, updates);
      if (updatedTask) {
        set((state: StoreState) => ({
          supabaseTasks: state.supabaseTasks.map(task => task.id === taskId ? { ...task, ...updates } : task)
        }));
      }
    },

    deleteTask: async (taskId) => {
      const success = await supabaseCrudService.deleteTask(taskId);
      if (success) {
        set((state: StoreState) => ({
          supabaseTasks: state.supabaseTasks.filter(task => task.id !== taskId)
        }));
      }
    },

    scheduleEvent: async (event) => {
      const newEvent = await supabaseCrudService.addEvent(event);
      if (newEvent) {
        set((state: StoreState) => ({ supabaseEvents: [...state.supabaseEvents, newEvent] }));
      }
    },

    updateEvent: async (eventId, updates) => {
      const updatedEvent = await supabaseCrudService.updateEvent(eventId, updates);
      if (updatedEvent) {
        set((state: StoreState) => ({
          supabaseEvents: state.supabaseEvents.map(event => event.id === eventId ? { ...event, ...updates } : event)
        }));
      }
    },

    deleteEvent: async (eventId) => {
      const success = await supabaseCrudService.deleteEvent(eventId);
      if (success) {
        set((state: StoreState) => ({
          supabaseEvents: state.supabaseEvents.filter(event => event.id !== eventId)
        }));
      }
    },
    
    createInvoice: (invoice) => set((state: StoreState) => {
        const newInvoice: Invoice = {
            id: generateId(),
            invoiceNumber: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...invoice,
        };
        return { invoices: [...state.invoices, newInvoice] };
    }),
    
    logTransaction: (transaction) => set((state: StoreState) => ({
        transactions: [...state.transactions, { id: generateId(), date: new Date().toISOString().split('T')[0], status: 'Pending', ...transaction }]
    })),
    
    updateContentPieceStatus: (id, status) => set((state: StoreState) => ({
        contentPieces: state.contentPieces.map(c => c.id === id ? { ...c, status, version: c.version + (status === 'Revisions Requested' ? 0.1 : 0)} : c)
    })),
    
    addContentComment: (contentId, comment) => set((state: StoreState) => ({
        contentPieces: state.contentPieces.map(c =>
            c.id === contentId
            ? { ...c, comments: [...c.comments, { id: generateId(), timestamp: new Date().toISOString(), ...comment }] }
            : c
        )
    })),

    addManualAttribution: (campaignId, attributionData) => set((state: StoreState) => ({
        supabaseCampaigns: state.supabaseCampaigns.map(campaign =>
            campaign.id === campaignId
                ? {
                    ...campaign,
                    attributionData: [
                        ...(campaign.attributionData || []),
                        { id: generateId(), ...attributionData }
                    ]
                }
                : campaign
        )
    })),

    addContentPiece: (contentPiece) => set((state: StoreState) => {
        const newContentPiece: ContentPiece = {
            id: generateId(),
            comments: [],
            version: 1,
            ...contentPiece,
        };
        notificationService.show({ message: `New content piece "${newContentPiece.title}" created.`, type: 'success' });
        return { contentPieces: [...state.contentPieces, newContentPiece] };
    }),
    
    logInfluencerInteraction: (influencerId, log) => set(state => ({
        supabaseInfluencers: state.supabaseInfluencers.map(inf =>
            inf.id === influencerId ? { ...inf, communicationLog: [...(inf.communicationLog || []), { ...log, id: generateId(), timestamp: new Date().toISOString() }] } : inf
        )
    })),

    // Time Tracking Actions
    startTimeEntry: (taskId, description) => set(state => {
        const newEntry: TimeEntry = {
            id: generateId(),
            taskId,
            description: description || 'Manual entry',
            startTime: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
        };
        return { timeEntries: [...state.timeEntries, newEntry] };
    }),

    stopTimeEntry: (id) => set(state => ({
        timeEntries: state.timeEntries.map(entry =>
            entry.id === id && !entry.endTime
                ? {
                    ...entry,
                    endTime: new Date().toISOString(),
                    duration: Math.round((new Date().getTime() - new Date(entry.startTime).getTime()) / 60000)
                }
                : entry
        )
    })),

    addTimeEntry: (entry) => set(state => ({
        timeEntries: [...state.timeEntries, { ...entry, id: generateId() }]
    })),

    updateTimeEntry: (id, updates) => set(state => ({
        timeEntries: state.timeEntries.map(entry => entry.id === id ? { ...entry, ...updates } : entry)
    })),

    deleteTimeEntry: (id) => set(state => ({
        timeEntries: state.timeEntries.filter(entry => entry.id !== id)
    })),

    // New comprehensive tool actions (mocked for now)
    findInfluencers: async (criteria) => {
        console.log("Mock: findInfluencers called with", criteria);
        return Promise.resolve(get().supabaseInfluencers.slice(0, 2)); // Return a couple of mock influencers
    },
    vetInfluencerProfile: async (url) => {
        console.log("Mock: vetInfluencerProfile called with", url);
        return Promise.resolve({ score: 8.5, report: "Profile looks good, high engagement." });
    },
    logClientInteraction: (client, summary) => {
        console.log("Mock: logClientInteraction called with", client, summary);
        // In a real app, you'd update a client's interaction log
    },
    generateCampaignBrief: async (campaignName) => {
        console.log("Mock: generateCampaignBrief called for", campaignName);
        return Promise.resolve(`Brief for ${campaignName}: Target audience is Gen Z, focus on TikTok. Key message: authenticity.`);
    },
    sendInvoiceReminder: (invoiceNumber) => {
        console.log("Mock: sendInvoiceReminder called for", invoiceNumber);
        // Simulate sending an email
    },
    logPayment: (invoiceNumber, amount) => {
       console.log("Mock: logPayment called for", invoiceNumber, amount);
       set(state => ({
           supabaseInvoices: state.supabaseInvoices.map(inv =>
               inv.invoiceNumber === invoiceNumber ? { ...inv, status: 'Paid' } : inv
           )
       }));
   },
    trackInfluencerPayout: (influencer, campaign, amount) => {
        console.log("Mock: trackInfluencerPayout called for", influencer, campaign, amount);
        // Update influencer's payout status
    },
    calculateCampaignProfitability: async (campaignName) => {
        console.log("Mock: calculateCampaignProfitability called for", campaignName);
        return Promise.resolve({ profit: 15000, roi: 1.2 });
    },
    generateFinancialReport: async (reportType, period) => {
        console.log("Mock: generateFinancialReport called for", reportType, period);
        return Promise.resolve({ reportId: "FIN-2023-001", data: "..." });
    },
    sendContractForSignature: (contractTitle, email) => {
       console.log("Mock: sendContractForSignature called for", contractTitle, email);
       set(state => ({
           supabaseContracts: state.supabaseContracts.map(contract =>
               contract.title === contractTitle ? { ...contract, status: 'Pending' } : contract
           )
       }));
   },
    flagExpiringContracts: async (days) => {
       console.log("Mock: flagExpiringContracts called for contracts expiring in", days, "days");
       return Promise.resolve(get().supabaseContracts.filter(c => {
           if (!c.endDate) return false;
           const expiryDate = new Date(c.endDate);
           const diffTime = expiryDate.getTime() - new Date().getTime();
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
           return diffDays <= days && diffDays >= 0;
       }));
   },
    generateContentIdeas: async (brand, objective) => {
        console.log("Mock: generateContentIdeas called for", brand, objective);
        return Promise.resolve(["Idea 1 for " + brand, "Idea 2 for " + brand]);
    },
    draftSocialMediaCopy: async (topic) => {
        console.log("Mock: draftSocialMediaCopy called for", topic);
        return Promise.resolve(`Check out this amazing content about ${topic}! #trending`);
    },
    draftOutreachEmail: async (recipient, proposal) => {
        console.log("Mock: draftOutreachEmail called for", recipient, proposal);
        return Promise.resolve(`Subject: Partnership Proposal for ${recipient} - ${proposal}`);
    },
    generateCampaignReport: async (campaignName) => {
        console.log("Mock: generateCampaignReport called for", campaignName);
        return Promise.resolve({ reportUrl: "https://example.com/report/" + campaignName });
    },
    createClient: (clientData) => {
       console.log("Mock: createClient called with", clientData);
       // Mock method - just log, don't actually create client objects
       // In a real implementation, this would create proper Influencer/Brand objects
   },

    // Preferences
    _savePrefs: () => {
        if (typeof window === 'undefined') return;
        const { userName, userRole, userAvatarUrl, agencyName, agencyLogoUrl, theme, accentColor, dashboardNotes, dashboardTabs, activeDashboardTabId, pageVisits, lastVisit } = get();
        const currentPrefs = getUserPreferences();
        savePreferences({ ...currentPrefs, userName, userRole, userAvatarUrl, agencyName, agencyLogoUrl, theme, accentColor, dashboardNotes, dashboardTabs, activeDashboardTabId, pageVisits, lastVisit });
    },

    updateUserProfile: ({ name, role, avatarUrl }) => {
        set({ userName: name, userRole: role, userAvatarUrl: avatarUrl });
        get()._savePrefs();
    },

    updateAgencyProfile: ({ name, logoUrl }) => {
        set({ agencyName: name, agencyLogoUrl: logoUrl });
        get()._savePrefs();
    },

    setTheme: (theme) => {
        set({ theme });
        get()._savePrefs();
    },

    setAccentColor: (color) => {
        set({ accentColor: color });
        get()._savePrefs();
    },
    
    updateDashboardNotes: (notes) => {
        set({ dashboardNotes: notes });
        get()._savePrefs();
    },

    // Notifications
    addNotification: (notification) => set((state: StoreState) => {
        const newNotifications = [{ id: Date.now(), read: false, ...notification }, ...state.notifications];
        if (typeof window !== 'undefined') {
            saveNotifications(newNotifications);
        }
        return { notifications: newNotifications };
    }),
    markNotificationsAsRead: () => set((state: StoreState) => {
        const newNotifications = state.notifications.map(n => ({...n, read: true}));
        if (typeof window !== 'undefined') {
            saveNotifications(newNotifications);
        }
        return { notifications: newNotifications };
    }),
    clearNotifications: () => set(() => {
        if (typeof window !== 'undefined') {
            saveNotifications([]);
        }
        return { notifications: [] };
    }),

    // Inbox
    selectMessage: (messageId: string | null) => set(state => {
        if (messageId === null) {
            return { selectedMessageId: null };
        }
        const newMessages = state.messages.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
        );
        return { messages: newMessages, selectedMessageId: messageId };
    }),
    archiveMessage: (messageId: string) => set(state => {
        const messageToArchive = state.messages.find(m => m.id === messageId);
        if (!messageToArchive) return {};

        const newMessages = state.messages.map(msg =>
            msg.id === messageId ? { ...msg, folder: 'Archived' as const } : msg
        );

        let newSelectedId = state.selectedMessageId;
        if (state.selectedMessageId === messageId) {
            const remainingMessagesInFolder = state.messages
                .filter(m => m.folder === messageToArchive.folder && m.id !== messageId)
                .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            newSelectedId = remainingMessagesInFolder[0]?.id || null;
        }

        return {
            messages: newMessages,
            selectedMessageId: newSelectedId,
        };
    }),

    // Custom Reports
    saveCustomReport: (report: Omit<CustomReport, 'id' | 'createdAt'> & { id?: string }) => {
        let finalReport: CustomReport;
        let reportId = report.id;

        set(state => {
            const existingReports = state.customReports;
            if (report.id) { // Update existing
                const existing = existingReports.find(r => r.id === report.id);
                if (existing) {
                    finalReport = { ...existing, ...report, id: report.id };
                    const newReports = existingReports.map(r => r.id === report.id ? finalReport! : r);
                    const newPrefs = { ...initialPrefs, customReports: newReports };
                    savePreferences(newPrefs);
                    return { customReports: newReports };
                }
            } else { // Create new
                reportId = generateId();
                finalReport = { ...report, id: reportId, createdAt: new Date().toISOString() };
                const newReports = [...existingReports, finalReport];
                const newPrefs = { ...initialPrefs, customReports: newReports };
                savePreferences(newPrefs);
                return { customReports: newReports };
            }
            return {};
        });
        return reportId!;
    },
    deleteCustomReport: (reportId: string) => set(state => {
        const newReports = state.customReports.filter(r => r.id !== reportId);
        const newPrefs = { ...initialPrefs, customReports: newReports };
        savePreferences(newPrefs);
        return { customReports: newReports };
    }),

    // Dashboard Layout
    setActiveDashboardTab: (tabId) => {
        set({ activeDashboardTabId: tabId });
        get()._savePrefs();
    },
    addDashboardTab: (name) => {
        const newTab: DashboardTab = { id: generateId(), name: name || `Dashboard ${get().dashboardTabs.length + 1}`, layout: [] };
        set((state: StoreState) => ({ dashboardTabs: [...state.dashboardTabs, newTab], activeDashboardTabId: newTab.id }));
        get()._savePrefs();
    },
    renameDashboardTab: (tabId, newName) => {
        set((state: StoreState) => ({ dashboardTabs: state.dashboardTabs.map(t => t.id === tabId ? { ...t, name: newName } : t) }));
        get()._savePrefs();
    },
    removeDashboardTab: (tabId) => {
        const state = get();
        const newTabs = state.dashboardTabs.filter(t => t.id !== tabId);
        if (newTabs.length === 0) return; 
        const newActiveId = state.activeDashboardTabId === tabId ? newTabs[0].id : state.activeDashboardTabId;
        set({ dashboardTabs: newTabs, activeDashboardTabId: newActiveId });
        get()._savePrefs();
    },
    addWidgetToLayout: (widgetId, widgetConfig) => set((state: StoreState) => {
        const activeTab = state.dashboardTabs.find(t => t.id === state.activeDashboardTabId);
        if (!activeTab || activeTab.layout.some(w => w.id === widgetId)) return state;

        // Compact existing layout to remove gaps and ensure widgets start from Y=0
        const compactedLayout = compactLayout(activeTab.layout);

        // Calculate the next available Y position at the bottom of all existing widgets
        let nextY = 0;

        // If there are existing widgets, find the maximum Y position across all columns
        if (compactedLayout.length > 0) {
          // Find the maximum Y position across all widgets (considering their height)
          const maxY = Math.max(...compactedLayout.map(w => w.y + w.h));
          nextY = maxY;
        }

        const newWidget: DashboardLayoutItem = {
            id: widgetId,
            widgetId: widgetId,
            x: 0,
            y: nextY,
            w: widgetConfig.defaultSpan,
            h: 1
        };
        const newLayout = [...compactedLayout, newWidget];

        const newTabs = state.dashboardTabs.map(t => t.id === state.activeDashboardTabId ? { ...t, layout: newLayout } : t);
        get()._savePrefs();
        return { dashboardTabs: newTabs };
    }),
    removeWidgetFromLayout: (widgetId) => {
        set((state: StoreState) => ({
            dashboardTabs: state.dashboardTabs.map(t =>
                t.id === state.activeDashboardTabId
                    ? { ...t, layout: t.layout.filter(w => w.id !== widgetId) }
                    : t
            )
        }));
        get()._savePrefs();
    },
    moveWidget: (widgetId, newX, newY) => {
        set((state: StoreState) => ({
            dashboardTabs: state.dashboardTabs.map(t =>
                t.id === state.activeDashboardTabId
                    ? { ...t, layout: t.layout.map(w => w.id === widgetId ? { ...w, x: newX, y: newY } : w) }
                    : t
            )
        }));
        get()._savePrefs();
    },
    applyTemplate: (templateId, mode) => {
        const state = get();
        const template = state.dashboardTemplates.find(t => t.id === templateId);
        if (!template) return {};

        if (mode === 'new-tab') {
            const newTab: DashboardTab = { id: generateId(), name: template.name, layout: template.layout };
            const newTabs = [...state.dashboardTabs, newTab];
            const newPrefs = { ...initialPrefs, dashboardTabs: newTabs, activeDashboardTabId: newTab.id };
            savePreferences(newPrefs);
            return { dashboardTabs: newTabs, activeDashboardTabId: newTab.id };
        } else { // current-tab
            const newTabs = state.dashboardTabs.map(t => {
                if (t.id === state.activeDashboardTabId) {
                    const existingIds = new Set(t.layout.map(w => w.id));
                    const newWidgets = template.layout.filter(w => !existingIds.has(w.id));
                    const finalLayout = template.id === 'blank-dashboard' ? [] : [...t.layout, ...newWidgets];
                    return { ...t, layout: finalLayout };
                }
                return t;
            });
            const newPrefs = { ...initialPrefs, dashboardTabs: newTabs };
            savePreferences(newPrefs);
            return { dashboardTabs: newTabs };
        }
    },

    // AI Assistant
    openAssistant: (command) => set({ isAssistantOpen: true, assistantInitialCommand: command || null }),
    closeAssistant: () => set({ isAssistantOpen: false, assistantInitialCommand: null }),
    consumeAssistantCommand: () => set({ assistantInitialCommand: null }),
    setChatHistory: (history) => set({ chatHistory: history }),
    updateChatMessage: (id, updates) => set((state: StoreState) => ({
        chatHistory: state.chatHistory.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    })),
    
    // Client Portal
    clientLogin: (email, password) => {
        const brand = get().brands.find(b => b.portalAccess && b.portalUserEmail === email && b.portalPassword === password);
        if (brand) {
            set({ loggedInClient: brand });
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('loggedInClientId', brand.id);
            }
            return true;
        }
        return false;
    },
    clientLogout: () => {
        set({ loggedInClient: null });
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('loggedInClientId');
            // This is a simple way to force a redirect to login page
            window.location.hash = '/portal/login';
        }
    },
    initializeClientSession: () => {
        if (typeof window === 'undefined') return;
        const clientId = sessionStorage.getItem('loggedInClientId');
        if (clientId) {
            const client = get().brands.find(b => b.id === clientId);
            if (client) {
                set({ loggedInClient: client });
            }
        }
    },
    enablePortalAccess: (brandId, email, password) => set((state: StoreState) => ({
        brands: state.brands.map(b => b.id === brandId ? { ...b, portalAccess: true, portalUserEmail: email, portalPassword: password } : b)
    })),

    fetchSupabaseData: async (tableName, setStateKey) => {
        set({ supabaseLoading: true, supabaseError: null });
        let data: unknown = null;
        switch (tableName) {
            case 'influencers':
                data = await supabaseCrudService.fetchInfluencers() as Influencer[] || [];
                break;
            case 'brands':
                data = await supabaseCrudService.fetchBrands() as Brand[] || [];
                break;
            case 'contracts':
                data = await supabaseCrudService.fetchContracts() as Contract[] || [];
                break;
            case 'campaigns':
                data = await supabaseCrudService.fetchCampaigns() as Campaign[] || [];
                break;
            case 'tasks':
                data = await supabaseCrudService.fetchTasks() as Task[] || [];
                break;
            case 'events':
                data = await supabaseCrudService.fetchEvents() as Event[] || [];
                break;
            case 'content_pieces':
                data = await supabaseCrudService.fetchContentPieces() as ContentPiece[] || [];
                break;
            case 'invoices':
                data = await supabaseCrudService.fetchInvoices() as Invoice[] || [];
                break;
            case 'contract_templates':
                data = await supabaseCrudService.fetchContractTemplates() as ContractTemplate[] || [];
                break;
            case 'transactions':
                data = await fetchData('transactions') as Transaction[] || [];
                break;
            case 'time_entries':
                data = await fetchData('time_entries') as TimeEntry[] || [];
                break;
            default:
                throw new Error(`Unknown table name: ${tableName}`);
        }

        set({ [setStateKey]: data, supabaseLoading: false, loading: false });
    },



  // Supabase Actions

}));

  // Initial data fetch from Supabase
  // This will run once when the store is initialized
  // You might want to move this to a dedicated data loading component or hook
  // depending on your application's data loading strategy.
  (async () => {
    const [influencers, brands, contracts, campaigns, tasks, transactions, events, content_pieces, invoices, contract_templates, time_entries] = await Promise.all([
      supabaseCrudService.fetchInfluencers(),
      supabaseCrudService.fetchBrands(),
      supabaseCrudService.fetchContracts(),
      supabaseCrudService.fetchCampaigns(),
      supabaseCrudService.fetchTasks(),
      fetchData('transactions'),
      supabaseCrudService.fetchEvents(),
      supabaseCrudService.fetchContentPieces(),
      supabaseCrudService.fetchInvoices(),
      supabaseCrudService.fetchContractTemplates(),
      fetchData('time_entries'),
    ]);

    // Initialize with fetched data
    useStore.setState({
      supabaseInfluencers: influencers || [],
      supabaseBrands: brands || [],
      supabaseContracts: contracts || [],
      supabaseCampaigns: campaigns || [],
      supabaseTasks: tasks || [],
      supabaseTransactions: (transactions as Transaction[]) || [],
      supabaseEvents: events || [],
      supabaseContentPieces: content_pieces || [],
      supabaseInvoices: invoices || [],
      supabaseContractTemplates: contract_templates || [],
      supabaseTimeEntries: (time_entries as TimeEntry[]) || [],
    });
  })();

export default useStore;
