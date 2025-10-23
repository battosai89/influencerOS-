import { create } from 'zustand';
import { supabaseCrudService, fetchData } from '@/services/supabaseCrudService';
import {
  Influencer, Brand, Contract, Campaign, Task, Transaction, Event,
  ContentPiece, Invoice, UserPreferences, Notification, DashboardTab,
  DashboardLayoutItem, DashboardTemplate, ContractTemplate, DisplayChatMessage,
  ContentComment, CommunicationLogItem,
} from '@/types';

import { PREMADE_TEMPLATES } from '@/data/templates';

import { getUserPreferences, savePreferences, getNotifications, saveNotifications } from '@/services/userPreferenceService';
import notificationService from '@/services/notificationService';

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

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
      theme: 'dark',
      accentColor: 'purple',
      dashboardNotes: '',
      dashboardTabs: [{ id: 'main', name: 'My Dashboard', layout: [] }],
      activeDashboardTabId: 'main',
    };
  }
  return {
    userName: 'Alex',
    userRole: 'Agency Director',
    userAvatarUrl: '',
    agencyName: 'InfluencerOS',
    agencyLogoUrl: '',
    pageVisits: {},
    lastVisit: new Date().toISOString(),
    theme: 'dark' as const,
    accentColor: 'purple',
    dashboardNotes: '',
    dashboardTabs: [{ id: 'main', name: 'My Dashboard', layout: [] }],
    activeDashboardTabId: 'main',
  };
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

  // Supabase UI State
  supabaseLoading: boolean;
  supabaseError: string | null;
  dataInitialized: boolean;

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
  deleteBrand: (id: string) => void;

  createCampaign: (data: Omit<Campaign, 'id' | 'content' | 'roi'>) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;

  addContract: (data: Partial<Contract>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;

  addContractTemplate: (data: Pick<ContractTemplate, 'name' | 'description'>) => void;
  updateContractTemplate: (id: string, updates: Partial<ContractTemplate>) => void;

  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  scheduleEvent: (event: any) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'issueDate'>) => void;

  logTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
  
  addContentPiece: (contentPiece: Omit<ContentPiece, 'id' | 'comments' | 'version'>) => void;
  updateContentPieceStatus: (id: string, status: ContentPiece['status']) => void;
  addContentComment: (contentId: string, comment: Omit<ContentComment, 'id'|'timestamp'>) => void;
  addManualAttribution: (campaignId: string, attributionData: { influencerId: string; description: string; conversions: number; revenue: number }) => void;

  logInfluencerInteraction: (influencerId: string, log: Omit<CommunicationLogItem, 'id'>) => void;

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
  refreshAllData: () => Promise<void>;
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

  // Supabase UI State Initial State
  supabaseLoading: false,
  supabaseError: null,
  dataInitialized: false,
    
    // --- ACTIONS ---

    // Getters
    getInfluencer: (id) => get().influencers.find(i => i.id === id),
    getBrand: (id) => get().brands.find(b => b.id === id),
    getContract: (id) => get().contracts.find(c => c.id === id),
    getCampaign: (id) => get().campaigns.find(c => c.id === id),
    getContentPiece: (id) => get().contentPieces.find(c => c.id === id),
    getContractTemplate: (id) => get().contractTemplates.find(t => t.id === id),

    // Data mutations
    addClient: async (data, type) => {
      if (type === 'influencer') {
        const newInfluencer = await supabaseCrudService.addInfluencer(data as Partial<Influencer>);
        if (newInfluencer) {
          set((state: StoreState) => ({
            supabaseInfluencers: [...state.supabaseInfluencers, newInfluencer],
            influencers: [...state.influencers, newInfluencer]
          }));
        }
      } else {
        const newBrand = await supabaseCrudService.addBrand(data as Partial<Brand>);
        if (newBrand) {
          set((state: StoreState) => ({
            supabaseBrands: [...state.supabaseBrands, newBrand],
            brands: [...state.brands, newBrand]
          }));
        }
      }
    },
    
    updateInfluencerStatus: async (id, status) => {
      const updatedInfluencer = await supabaseCrudService.updateInfluencer(id, { status });
      if (updatedInfluencer) {
        set((state: StoreState) => ({
          supabaseInfluencers: state.supabaseInfluencers.map(i => i.id === id ? { ...i, status } : i),
          influencers: state.influencers.map(i => i.id === id ? { ...i, status } : i)
        }));
      }
    },

    deleteInfluencer: async (id) => {
      const success = await supabaseCrudService.deleteInfluencer(id);
      if (success) {
        set((state: StoreState) => ({
          supabaseInfluencers: state.supabaseInfluencers.filter(i => i.id !== id),
          influencers: state.influencers.filter(i => i.id !== id)
        }));
      }
    },

    deleteBrand: async (id) => {
      const success = await supabaseCrudService.deleteBrand(id);
      if (success) {
        set((state: StoreState) => ({
          supabaseBrands: state.supabaseBrands.filter(b => b.id !== id),
          brands: state.brands.filter(b => b.id !== id)
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
      const newTask = await supabaseCrudService.addTask(task);
      if (newTask) {
        set((state: StoreState) => ({ supabaseTasks: [...state.supabaseTasks, newTask] }));
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
        set((state: StoreState) => ({
          supabaseEvents: [...state.supabaseEvents, newEvent],
          events: [...state.events, newEvent]
        }));
      }
    },

    updateEvent: async (eventId, updates) => {
      const updatedEvent = await supabaseCrudService.updateEvent(eventId, updates);
      if (updatedEvent) {
        set((state: StoreState) => ({
          supabaseEvents: state.supabaseEvents.map(event => event.id === eventId ? { ...event, ...updates } : event),
          events: state.events.map(event => event.id === eventId ? { ...event, ...updates } : event)
        }));
      }
    },

    deleteEvent: async (eventId) => {
      const success = await supabaseCrudService.deleteEvent(eventId);
      if (success) {
        set((state: StoreState) => ({
          supabaseEvents: state.supabaseEvents.filter(event => event.id !== eventId),
          events: state.events.filter(event => event.id !== eventId)
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
                        { id: generateId(), date: new Date().toISOString(), ...attributionData }
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
    
    logInfluencerInteraction: (influencerId, log) => set((state: StoreState) => ({
        influencers: state.supabaseInfluencers.map(i => 
            i.id === influencerId
            ? { ...i, communicationLog: [{ id: generateId(), ...log }, ...i.communicationLog] }
            : i
        )
    })),

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

        // Simple placement logic: find the first available spot
        const newWidget: DashboardLayoutItem = { id: widgetId, widgetId: widgetId, x: 0, y: 0, w: widgetConfig.defaultSpan, h: 1 };
        const newLayout = [...activeTab.layout, newWidget];
        
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
        if (!template) return;

        if (mode === 'new-tab') {
            const newTab: DashboardTab = { id: generateId(), name: template.name, layout: template.layout };
            set({ dashboardTabs: [...state.dashboardTabs, newTab], activeDashboardTabId: newTab.id });
        } else { // current-tab
             const currentTab = state.dashboardTabs.find(t => t.id === state.activeDashboardTabId);
             if(!currentTab) return;
            const newLayout = template.id === 'blank-dashboard' 
                ? [] 
                : [...currentTab.layout, ...template.layout.filter(l => !currentTab.layout.some(el => el.id === l.id))];
            set({
                dashboardTabs: state.dashboardTabs.map(t => t.id === state.activeDashboardTabId ? { ...t, layout: newLayout } : t)
            });
        }
        get()._savePrefs();
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

    fetchSupabaseData: async (tableName) => {
        set({ supabaseLoading: true, supabaseError: null });
        try {
            switch (tableName) {
                case 'influencers': {
                    const influencerData = await supabaseCrudService.fetchInfluencers() || [];
                    set({ supabaseInfluencers: influencerData, supabaseLoading: false });
                    break;
                }
                case 'brands': {
                    const brandData = await supabaseCrudService.fetchBrands() || [];
                    set({ supabaseBrands: brandData, supabaseLoading: false });
                    break;
                }
                case 'contracts': {
                    const contractData = await supabaseCrudService.fetchContracts() || [];
                    set({ supabaseContracts: contractData, supabaseLoading: false });
                    break;
                }
                case 'campaigns': {
                    const campaignData = await supabaseCrudService.fetchCampaigns() || [];
                    set({ supabaseCampaigns: campaignData, supabaseLoading: false });
                    break;
                }
                case 'tasks': {
                    const taskData = await supabaseCrudService.fetchTasks() || [];
                    set({ supabaseTasks: taskData, supabaseLoading: false });
                    break;
                }
                case 'transactions': {
                    const transactionData = await fetchData('transactions') || [];
                    set({ supabaseTransactions: transactionData as Transaction[], supabaseLoading: false });
                    break;
                }
                case 'events': {
                    const eventData = await supabaseCrudService.fetchEvents() || [];
                    set({ supabaseEvents: eventData, supabaseLoading: false });
                    break;
                }
                case 'content_pieces': {
                    const contentData = await supabaseCrudService.fetchContentPieces() || [];
                    set({ supabaseContentPieces: contentData, supabaseLoading: false });
                    break;
                }
                case 'invoices': {
                    const invoiceData = await supabaseCrudService.fetchInvoices() || [];
                    set({ supabaseInvoices: invoiceData, supabaseLoading: false });
                    break;
                }
                case 'contract_templates': {
                    const templateData = await supabaseCrudService.fetchContractTemplates() || [];
                    set({ supabaseContractTemplates: templateData, supabaseLoading: false });
                    break;
                }
                default:
                    throw new Error(`Unknown table name: ${tableName}`);
            }
        } catch (error) {
            console.error(`Error fetching ${tableName}:`, error);
            set({ supabaseError: error instanceof Error ? error.message : 'Unknown error', supabaseLoading: false });
        }
      },

    refreshAllData: async () => {
      try {
        console.log('Refreshing all data...');
        set({ supabaseLoading: true, supabaseError: null });

        const [influencers, brands, contracts, campaigns, tasks, transactions, events, content_pieces, invoices, contract_templates] = await Promise.all([
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
        ]);

        console.log('Refreshed data:', {
          influencers: influencers?.length || 0,
          brands: brands?.length || 0,
          contracts: contracts?.length || 0,
          campaigns: campaigns?.length || 0
        });

        // Update both Supabase and local collections
        set({
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
          // Also update local collections
          influencers: influencers || [],
          brands: brands || [],
          contracts: contracts || [],
          campaigns: campaigns || [],
          tasks: tasks || [],
          transactions: (transactions as Transaction[]) || [],
          events: events || [],
          contentPieces: content_pieces || [],
          invoices: invoices || [],
          contractTemplates: contract_templates || [],
          supabaseLoading: false,
          dataInitialized: true,
        });

        console.log('All data refreshed successfully');
      } catch (error) {
        console.error('Error refreshing data:', error);
        set({
          supabaseError: error instanceof Error ? error.message : 'Unknown error',
          supabaseLoading: false
        });
      }
    },

  // Supabase Actions

}));

  // Initial data fetch from Supabase
  // This will run once when the store is initialized
  (async () => {
    try {
      console.log('Initializing store with Supabase data...');
      const [influencers, brands, contracts, campaigns, tasks, transactions, events, content_pieces, invoices, contract_templates] = await Promise.all([
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
      ]);

      console.log('Fetched data:', {
        influencers: influencers?.length || 0,
        brands: brands?.length || 0,
        contracts: contracts?.length || 0,
        campaigns: campaigns?.length || 0,
        events: events?.length || 0
      });

      // Initialize with fetched data - populate both Supabase and local collections
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
        // Also populate local collections for immediate UI updates
        influencers: influencers || [],
        brands: brands || [],
        contracts: contracts || [],
        campaigns: campaigns || [],
        tasks: tasks || [],
        transactions: (transactions as Transaction[]) || [],
        events: events || [],
        contentPieces: content_pieces || [],
        invoices: invoices || [],
        contractTemplates: contract_templates || [],
      });

      console.log('Store initialized successfully');

      // Mark data as initialized
      useStore.setState({ dataInitialized: true });
    } catch (error) {
      console.error('Error initializing store:', error);
      // Set empty arrays as fallback
      useStore.setState({
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
      });
    }
  })();

export default useStore;
