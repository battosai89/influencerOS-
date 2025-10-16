# Next.js Migration Documentation

This document outlines all critical settings, styles, colors, and functions of the current React application to ensure an exact replication during the migration to Next.js.

## 1. Project Structure Overview

```
// Directory tree (3 levels, limited to 200 entries)
├── .gitignore
├── App.tsx
├── FEATURES.md
├── FUTURE_ROADMAP.md
├── MARKETING_PLAN.md
├── MIGRATION_TO_NEXTJS.md
├── PROPOSED_FEATURES.md
├── README.md
├── STRATEGY.md
├── STYLE_GUIDE.md
├── components\
│   ├── AgencyOSAssistantCard.tsx
│   ├── BrandCard.tsx
│   ├── Chart.tsx
│   ├── Clock.tsx
│   ├── CommandBar.tsx
│   ├── ConfirmationModal.tsx
│   ├── ConnectorCard.tsx
│   ├── ConnectorsPage.tsx
│   ├── ContractCard.tsx
│   ├── CreationModals.tsx
│   ├── DashboardCard.tsx
│   ├── EmptyState.tsx
│   ├── Header.tsx
│   ├── InfluencerCard.tsx
│   ├── Modal.tsx
│   ├── NotificationPanel.tsx
│   ├── PageAssistant.tsx
│   ├── Search.tsx
│   ├── Sidebar.tsx
│   ├── SkeletonLoader.tsx
│   ├── ToastNotification.tsx
│   └── icons\
│       └── Icon.tsx
├── data\
│   ├── assets.ts
│   ├── mockData.ts
│   ├── quotes.ts
│   ├── tasks.ts
│   └── templates.ts
├── hooks\
│   └── useStore.ts
├── index.html
├── index.tsx
├── metadata.json
├── package-lock.json
├── package.json
├── pages\
│   ├── Academy.tsx
│   ├── Analytics.tsx
│   ├── BrandDetail.tsx
│   ├── Brands.tsx
│   ├── Calendar.tsx
│   ├── CampaignDetail.tsx
│   ├── Campaigns.tsx
│   ├── Clients.tsx
│   ├── ContentDetail.tsx
│   ├── ContentHub.tsx
│   ├── ContractDetail.tsx
│   ├── ContractNew.tsx
│   ├── ContractTemplateDetail.tsx
│   ├── ContractTemplates.tsx
│   ├── Contracts.tsx
│   ├── Dashboard.tsx
│   ├── Financials.tsx
│   ├── Inbox.tsx
│   ├── InfluencerDetail.tsx
│   ├── Influencers.tsx
│   ├── Invoices.tsx
│   ├── NotFound.tsx
│   ├── Settings.tsx
│   ├── SharableReport.tsx
│   ├── Tasks.tsx
│   ├── Team.tsx
│   └── client-portal\
│       ├── ClientCampaignDetail.tsx
│       ├── ClientContentDetail.tsx
│       ├── ClientDashboard.tsx
│       ├── ClientLogin.tsx
│       └── ClientPortalLayout.tsx
├── services\
│   ├── agentTools.ts
│   ├── aiService.ts
│   ├── connectorService.ts
│   ├── downloadUtils.ts
│   ├── geminiService.ts
│   ├── googleConnector.ts
│   ├── notificationService.ts
│   ├── searchService.ts
│   └── userPreferenceService.ts
├── tsconfig.json
├── types.ts
└── vite.config.ts
```

## 2. Dependencies

```json
{
  "dependencies": {
    "@react-oauth/google": "^0.12.2",
    "d3": "^7.9.0",
    "d3-sankey": "^0.12.3",
    "gapi-script": "^1.2.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.3",
    "lucide-react": "^0.417.0",
    "openai": "^4.52.7",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.1",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

## 3. Configuration Files

### `vite.config.ts`
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## 4. Styling (CSS, Tailwind, etc.)

### Tailwind CSS Configuration (from `index.html`)

### Fonts

The application primarily uses the **Inter** font, defined in the Tailwind CSS configuration:

```javascript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  display: ['Inter', 'sans-serif'],
},
```

Additionally, Google Fonts are imported directly in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

This ensures that the Inter font with various weights (300, 400, 500, 600, 700) is available throughout the application.

```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-bg': 'var(--color-bg)',
        'brand-surface': 'var(--color-surface)',
        'brand-border': 'var(--color-border)',
        'brand-primary': 'var(--color-primary)',
        'brand-secondary': 'var(--color-secondary)',
        'brand-accent': 'var(--color-accent)',
        'brand-text-primary': 'var(--color-text-primary)',
        'brand-text-secondary': 'var(--color-text-secondary)',
        'brand-insight': '#38BDF8', /* Light Blue */
        'brand-suggestion': '#8B5CF6', /* Purple */
        'brand-success': '#10B981', /* Green */
        'brand-warning': '#F59E0B', /* Amber */
      },
      boxShadow: {
        'glow-sm': '0 0 5px var(--color-glow)',
        'glow-md': '0 0 15px var(--color-glow)',
        'glow-lg': '0 0 25px var(--color-glow)',
      },
      animation: {
        'page-enter': 'pageEnter 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        'modal-fade-in': 'modalFadeIn 0.2s ease-out',
        'modal-slide-down': 'modalSlideDown 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        'search-backdrop-in': 'search-backdrop-in 0.3s ease-out forwards',
        'search-backdrop-out': 'search-backdrop-out 0.3s ease-out forwards',
        'search-modal-in': 'search-modal-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'search-modal-out': 'search-modal-out 0.3s ease-out forwards',
        'toast-in': 'toastIn 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        'toast-out': 'toastOut 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        'pulsate-glow': 'pulsate-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'liquid-pan': 'liquid-pan 15s ease infinite',
      },
      keyframes: {
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalFadeIn: { '0%': { backgroundColor: 'rgba(0,0,0,0)' }, '100%': { backgroundColor: 'rgba(0,0,0,0.6)' } },
        modalSlideDown: { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'search-backdrop-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'search-backdrop-out': { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
        'search-modal-in': { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'search-modal-out': { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(-20px)', opacity: '0' } },
        toastIn: { '0%': { transform: 'translateY(100%)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        toastOut: { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(100%)', opacity: '0' } },
        'pulsate-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px var(--color-glow), 0 0 4px var(--color-glow)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 18px var(--color-glow), 0 0 10px var(--color-glow)',
            transform: 'scale(1.05)'
          },
        },
        'pulse-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.25)', opacity: '0.75' },
        },
        'liquid-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }
    },
  },
}
```

### Animations and Transitions

The application incorporates various animations and transitions to enhance the user experience, contributing to overall website smoothness. These are primarily defined within the Tailwind CSS configuration and custom CSS.

**Transition Smoothness:**

Many UI elements likely utilize Tailwind CSS utility classes for smooth transitions, such as `transition-colors duration-300 ease-in-out` for color changes, providing a polished feel to interactive elements.

**Animations:**

The following custom animations are defined in the Tailwind CSS configuration:

```javascript
animation: {
  'page-enter': 'pageEnter 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  'modal-fade-in': 'modalFadeIn 0.2s ease-out',
  'modal-slide-down': 'modalSlideDown 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  'search-backdrop-in': 'search-backdrop-in 0.3s ease-out forwards',
  'search-backdrop-out': 'search-backdrop-out 0.3s ease-out forwards',
  'search-modal-in': 'search-modal-in 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards',
  'search-modal-out': 'search-modal-out 0.3s ease-out forwards',
  'toast-in': 'toastIn 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  'toast-out': 'toastOut 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
  'pulsate-glow': 'pulsate-glow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'liquid-pan': 'liquid-pan 15s ease infinite',
},
keyframes: {
  pageEnter: {
    '0%': { opacity: '0', transform: 'translateY(15px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  modalFadeIn: { '0%': { backgroundColor: 'rgba(0,0,0,0)' }, '100%': { backgroundColor: 'rgba(0,0,0,0.6)' } },
  modalSlideDown: { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
  'search-backdrop-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  'search-backdrop-out': { '0%': { opacity: '1' }, '100%': { opacity: '0' } },
  'search-modal-in': { '0%': { transform: 'translateY(-20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
  'search-modal-out': { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(-20px)', opacity: '0' } },
  toastIn: { '0%': { transform: 'translateY(100%)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
  toastOut: { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(100%)', opacity: '0' } },
}
```

These animations are used for various UI elements such as page transitions, modal pop-ups, search interfaces, and toast notifications, contributing to a dynamic and responsive user experience.

### Embedded Styles (from `index.html`)
```css
:root {
  --color-bg: #111111;
  --color-surface: #1C1C1C;
  --color-border: #2D2D2D;
  --color-secondary: #A3A3A3;
  --color-text-primary: #E5E5E5;
  --color-text-secondary: #A3A3A3;
  --color-insight: #38BDF8; /* Light Blue */
  --color-suggestion: #8B5CF6; /* Purple */
  --color-success: #10B981; /* Green */
  --color-warning: #F59E0B; /* Amber */
}

:root[data-accent="purple"] { --color-primary: #8B5CF6; --color-accent: #7C3AED; --color-glow: rgba(139, 92, 246, 0.3); --color-accent-gradient: #EC4899; }
:root[data-accent="blue"] { --color-primary: #3B82F6; --color-accent: #2563EB; --color-glow: rgba(59, 130, 246, 0.3); --color-accent-gradient: #38BDF8; }
:root[data-accent="green"] { --color-primary: #10B981; --color-accent: #059669; --color-glow: rgba(16, 185, 129, 0.3); --color-accent-gradient: #84CC16; }
:root[data-accent="amber"] { --color-primary: #F59E0B; --color-accent: #D97706; --color-glow: rgba(245, 158, 11, 0.3); --color-accent-gradient: #EAB308; }
:root[data-accent="red"] { --color-primary: #EF4444; --color-accent: #DC2626; --color-glow: rgba(239, 68, 68, 0.3); --color-accent-gradient: #F97316; }
:root[data-accent="orange"] { --color-primary: #F97316; --color-accent: #EA580C; --color-glow: rgba(249, 115, 22, 0.3); --color-accent-gradient: #F59E0B; }
:root[data-accent="pink"] { --color-primary: #EC4899; --color-accent: #DB2777; --color-glow: rgba(236, 72, 153, 0.3); --color-accent-gradient: #A855F7; }

html:not(.dark) {
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-secondary: #6B7280;
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-insight: #0EA5E9;
  --color-success: #059669;
  --color-warning: #D97706;
}

html:not(.dark)[data-accent="purple"] { --color-primary: #7C3AED; --color-accent: #6D28D9; --color-glow: rgba(124, 58, 237, 0.3); --color-accent-gradient: #DB2777; }
html:not(.dark)[data-accent="blue"] { --color-primary: #2563EB; --color-accent: #1D4ED8; --color-glow: rgba(37, 99, 235, 0.3); --color-accent-gradient: #0EA5E9; }
html:not(.dark)[data-accent="green"] { --color-primary: #059669; --color-accent: #047857; --color-glow: rgba(5, 150, 105, 0.3); --color-accent-gradient: #65A30D; }
html:not(.dark)[data-accent="amber"] { --color-primary: #D97706; --color-accent: #B45309; --color-glow: rgba(217, 119, 6, 0.3); --color-accent-gradient: #CA8A04; }
html:not(.dark)[data-accent="red"] { --color-primary: #DC2626; --color-accent: #B91C1C; --color-glow: rgba(220, 38, 38, 0.3); --color-accent-gradient: #EA580C; }
html:not(.dark)[data-accent="orange"] { --color-primary: #EA580C; --color-accent: #C2410C; --color-glow: rgba(249, 115, 22, 0.3); --color-accent-gradient: #D97706; }
html:not(.dark)[data-accent="pink"] { --color-primary: #DB2777; --color-accent: #BE185D; --color-glow: rgba(219, 39, 119, 0.3); --color-accent-gradient: #9333EA; }

/* Simple scrollbar styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background-color: var(--color-border); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background-color: var(--color-secondary); }

/* Utility to hide scrollbars */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Global fix to prevent horizontal scrollbars */
html, body {
  overflow-x: hidden;
}


.futuristic-border {
  position: relative;
}

.futuristic-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.75rem; /* Corresponds to rounded-xl */
  padding: 2px; /* Border thickness */
  background: linear-gradient(135deg, var(--color-accent-gradient), var(--color-primary), var(--color-accent-gradient));
  background-size: 400% 400%;
  animation: liquid-pan 15s ease infinite;
  
  /* Mask to create the border effect */
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none; /* THE FIX: Allows clicks to pass through the border overlay */
}

.futuristic-border:hover::before {
  opacity: 1;
}

/* Global transition for interactive elements */
button, a, [role="button"], input, select, textarea {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

/* Accessibility focus styles */
*:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 4px;
}
```

## 5. Color Palette

The application uses CSS variables for its color palette, supporting dark mode and accent color themes. These are defined in the `<style>` block within `index.html`.

### Dark Mode Colors
```css
:root {
  --color-bg: #111111;
  --color-surface: #1C1C1C;
  --color-border: #2D2D2D;
  --color-secondary: #A3A3A3;
  --color-text-primary: #E5E5E5;
  --color-text-secondary: #A3A3A3;
  --color-insight: #38BDF8; /* Light Blue */
  --color-suggestion: #8B5CF6; /* Purple */
  --color-success: #10B981; /* Green */
  --color-warning: #F59E0B; /* Amber */
}
```

### Light Mode Colors
```css
html:not(.dark) {
  --color-bg: #F9FAFB;
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
  --color-secondary: #6B7280;
  --color-text-primary: #1F2937;
  --color-text-secondary: #6B7280;
  --color-insight: #0EA5E9;
  --color-success: #059669;
  --color-warning: #D97706;
}
```

### Accent Colors (Dark Mode)
```css
:root[data-accent="purple"] { --color-primary: #8B5CF6; --color-accent: #7C3AED; --color-glow: rgba(139, 92, 246, 0.3); --color-accent-gradient: #EC4899; }
:root[data-accent="blue"] { --color-primary: #3B82F6; --color-accent: #2563EB; --color-glow: rgba(59, 130, 246, 0.3); --color-accent-gradient: #38BDF8; }
:root[data-accent="green"] { --color-primary: #10B981; --color-accent: #059669; --color-glow: rgba(16, 185, 129, 0.3); --color-accent-gradient: #84CC16; }
:root[data-accent="amber"] { --color-primary: #F59E0B; --color-accent: #D97706; --color-glow: rgba(245, 158, 11, 0.3); --color-accent-gradient: #EAB308; }
:root[data-accent="red"] { --color-primary: #EF4444; --color-accent: #DC2626; --color-glow: rgba(239, 68, 68, 0.3); --color-accent-gradient: #F97316; }
:root[data-accent="orange"] { --color-primary: #F97316; --color-accent: #EA580C; --color-glow: rgba(249, 115, 22, 0.3); --color-accent-gradient: #F59E0B; }
:root[data-accent="pink"] { --color-primary: #EC4899; --color-accent: #DB2777; --color-glow: rgba(236, 72, 153, 0.3); --color-accent-gradient: #A855F7; }
```

### Accent Colors (Light Mode)
```css
html:not(.dark)[data-accent="purple"] { --color-primary: #7C3AED; --color-accent: #6D28D9; --color-glow: rgba(124, 58, 237, 0.3); --color-accent-gradient: #DB2777; }
html:not(.dark)[data-accent="blue"] { --color-primary: #2563EB; --color-accent: #1D4ED8; --color-glow: rgba(37, 99, 235, 0.3); --color-accent-gradient: #0EA5E9; }
html:not(.dark)[data-accent="green"] { --color-primary: #059669; --color-accent: #047857; --color-glow: rgba(5, 150, 105, 0.3); --color-accent-gradient: #65A30D; }
html:not(.dark)[data-accent="amber"] { --color-primary: #D97706; --color-accent: #B45309; --color-glow: rgba(217, 119, 6, 0.3); --color-accent-gradient: #CA8A04; }
html:not(.dark)[data-accent="red"] { --color-primary: #DC2626; --color-accent: #B91C1C; --color-glow: rgba(220, 38, 38, 0.3); --color-accent-gradient: #EA580C; }
html:not(.dark)[data-accent="orange"] { --color-primary: #F97316; --color-accent: #EA580C; --color-glow: rgba(249, 115, 22, 0.3); --color-accent-gradient: #D97706; }
html:not(.dark)[data-accent="pink"] { --color-primary: #DB2777; --color-accent: #BE185D; --color-glow: rgba(219, 39, 119, 0.3); --color-accent-gradient: #9333EA; }
```

## 6. Functions and Utilities

### `hooks/useStore.ts` (Zustand Store)

This file defines the main Zustand store for managing the application's global state. It includes data for influencers, brands, contracts, campaigns, tasks, transactions, events, content pieces, invoices, and contract templates. It also manages user preferences, dashboard layout, notifications, and UI state for the AI assistant and client portal.

```typescript
import { create } from 'zustand';
import {
  Influencer, Brand, Contract, Campaign, Task, Transaction, Event,
  ContentPiece, Invoice, UserPreferences, Notification, DashboardTab,
  DashboardLayoutItem, DashboardTemplate, ContractTemplate, DisplayChatMessage,
  ContentComment, CommunicationLogItem,
} from '../types';
import {
  influencers as mockInfluencers,
  brands as mockBrands,
  contracts as mockContracts,
  campaigns as mockCampaigns,
  tasks as mockTasks,
  transactions as mockTransactions,
  events as mockEvents,
  contentPieces as mockContentPieces,
  invoices as mockInvoices,
  contractTemplates as mockContractTemplates,
} from '../data/mockData';
import { PREMADE_TEMPLATES } from '../data/templates';

import { getPreferences, savePreferences, getNotifications, saveNotifications } from '../services/userPreferenceService';
import { notificationService } from '../services/notificationService';

// Initial state from services
const initialPrefs = getPreferences();
const initialNotifications = getNotifications();

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

interface StoreState {
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

  // Dashboard layout
  dashboardTabs: DashboardTab[];
  activeDashboardTabId: string;
  
  // Notifications
  notifications: Notification[];

  // UI State
  isAssistantOpen: boolean;
  assistantInitialCommand: string | null;
  chatHistory: DisplayChatMessage[];
  
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
  
  updateContentPieceStatus: (id: string, status: ContentPiece['status']) => void;
  addContentComment: (contentId: string, comment: Omit<ContentComment, 'id'|'timestamp'>) => void;

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
}

type Store = StoreState & StoreActions;

const useStore = create<Store>((set, get) => ({
    // --- INITIAL STATE ---
    influencers: mockInfluencers,
    brands: mockBrands,
    contracts: mockContracts,
    campaigns: mockCampaigns,
    tasks: mockTasks,
    transactions: mockTransactions,
    events: mockEvents,
    contentPieces: mockContentPieces,
    invoices: mockInvoices,
    contractTemplates: mockContractTemplates,
    dashboardTemplates: PREMADE_TEMPLATES,

    userName: initialPrefs.userName,
    userRole: initialPrefs.userRole || 'Agency Director',
    userAvatarUrl: initialPrefs.userAvatarUrl || '',
    agencyName: initialPrefs.agencyName || 'InfluencerOS',
    agencyLogoUrl: initialPrefs.agencyLogoUrl || '',
    theme: initialPrefs.theme || 'dark',
    accentColor: initialPrefs.accentColor || 'purple',
    dashboardNotes: initialPrefs.dashboardNotes || '',
    
    dashboardTabs: initialPrefs.dashboardTabs || [{ id: 'main', name: 'My Dashboard', layout: PREMADE_TEMPLATES[1].layout }],
    activeDashboardTabId: initialPrefs.activeDashboardTabId || 'main',

    notifications: initialNotifications,

    isAssistantOpen: false,
    assistantInitialCommand: null,
    chatHistory: [{ id: 0, role: 'system', content: `Today is ${new Date().toLocaleDateString()}. How can I help you manage your agency?` }],

    loggedInClient: null,
    
    // --- ACTIONS ---

    // Getters
    getInfluencer: (id) => get().influencers.find(i => i.id === id),
    getBrand: (id) => get().brands.find(b => b.id === id),
    getContract: (id) => get().contracts.find(c => c.id === id),
    getCampaign: (id) => get().campaigns.find(c => c.id === id),
    getContentPiece: (id) => get().contentPieces.find(c => c.id === id),
    getContractTemplate: (id) => get().contractTemplates.find(t => t.id === id),

    // Data mutations
    addClient: (data, type) => set(state => {
        if (type === 'influencer') {
            const newInfluencer: Influencer = {
                id: generateId(),
                name: 'New Influencer',
                avatarUrl: `https://i.pravatar.cc/150?u=${generateId()}`,
                platform: 'Instagram',
                followers: 0,
                status: 'lead',
                engagementRate: 0,
                niche: 'Lifestyle',
                rating: 3,
                location: 'Unknown',
                availability: 'available',
                audience: { gender: { male: 50, female: 50, other: 0 }, topLocations: []},
                communicationLog: [],
                ...data,
            };
            return { influencers: [...state.influencers, newInfluencer] };
        } else {
            const newBrand: Brand = {
                id: generateId(),
                name: 'New Brand',
                logoUrl: `https://i.pravatar.cc/150?u=${generateId()}`,
                industry: 'Unknown',
                satisfaction: 80,
                portalAccess: false,
                ...data,
            };
            return { brands: [...state.brands, newBrand] };
        }
    }),
    
    updateInfluencerStatus: (id, status) => set(state => ({
        influencers: state.influencers.map(i => i.id === id ? { ...i, status } : i)
    })),

    createCampaign: (data) => set(state => {
        const newCampaign: Campaign = {
            id: generateId(),
            content: [],
            roi: 0,
            status: 'Planning',
            budget: 0,
            category: 'General',
            milestones: [],
            ...data,
        };
        notificationService.show({ message: `New campaign "${newCampaign.name}" created.`, type: 'success' });
        return { campaigns: [...state.campaigns, newCampaign] };
    }),
    
    updateCampaignStatus: (id, status) => set(state => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, status } : c)
    })),

    addContract: (data) => set(state => {
        const template = data.templateId ? state.contractTemplates.find(t => t.id === data.templateId) : null;
        const newContract: Contract = {
            id: generateId(),
            title: 'New Contract',
            status: 'Draft',
            value: 0,
            clauses: template?.clauses || [],
            ...data
        } as Contract;
        notificationService.show({ message: `New contract "${newContract.title}" drafted.`, type: 'success' });
        return { contracts: [...state.contracts, newContract] };
    }),

    updateContract: (id, updates) => set(state => ({
        contracts: state.contracts.map(c => c.id === id ? { ...c, ...updates } : c)
    })),
    
    addContractTemplate: (data) => set(state => {
        const newTemplate: ContractTemplate = {
            id: generateId(),
            name: data.name,
            description: data.description,
            clauses: [{ title: 'Scope of Work', content: '...' }, { title: 'Payment Terms', content: '...' }]
        };
        return { contractTemplates: [...state.contractTemplates, newTemplate] };
    }),
    
    updateContractTemplate: (id, updates) => set(state => ({
        contractTemplates: state.contractTemplates.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    addTask: (task) => set(state => ({
        tasks: [...state.tasks, { id: generateId(), ...task }]
    })),
    
    updateTask: (taskId, updates) => set(state => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    })),

    deleteTask: (taskId) => set(state => ({
        tasks: state.tasks.filter(t => t.id !== taskId && t.parentId !== taskId)
    })),

    scheduleEvent: (event) => set(state => ({
        events: [...state.events, { id: generateId(), ...event }]
    })),

    updateEvent: (eventId, updates) => set(state => ({
        events: state.events.map(e => e.id === eventId ? { ...e, ...updates } : e)
    })),

    deleteEvent: (eventId) => set(state => ({
        events: state.events.filter(e => e.id !== eventId)
    })),
    
    createInvoice: (invoice) => set(state => {
        const newInvoice: Invoice = {
            id: generateId(),
            invoiceNumber: `INV-${String(state.invoices.length + 1).padStart(3, '0')}`,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...invoice,
        };
        return { invoices: [...state.invoices, newInvoice] };
    }),
    
    logTransaction: (transaction) => set(state => ({
        transactions: [...state.transactions, { id: generateId(), date: new Date().toISOString().split('T')[0], status: 'Pending', ...transaction }]
    })),
    
    updateContentPieceStatus: (id, status) => set(state => ({
        contentPieces: state.contentPieces.map(c => c.id === id ? { ...c, status, version: c.version + (status === 'Revisions Requested' ? 0.1 : 0)} : c)
    })),
    
    addContentComment: (contentId, comment) => set(state => ({
        contentPieces: state.contentPieces.map(c => 
            c.id === contentId 
            ? { ...c, comments: [...c.comments, { id: generateId(), timestamp: new Date().toISOString(), ...comment }] } 
            : c
        )
    })),
    
    logInfluencerInteraction: (influencerId, log) => set(state => ({
        influencers: state.influencers.map(i => 
            i.id === influencerId
            ? { ...i, communicationLog: [{ id: generateId(), ...log }, ...i.communicationLog] }
            : i
        )
    })),

    // Preferences
    _savePrefs: () => {
        const { userName, userRole, userAvatarUrl, agencyName, agencyLogoUrl, theme, accentColor, dashboardNotes, dashboardTabs, activeDashboardTabId } = get();
        const currentPrefs = getPreferences();
        savePreferences({ ...currentPrefs, userName, userRole, userAvatarUrl, agencyName, agencyLogoUrl, theme, accentColor, dashboardNotes, dashboardTabs, activeDashboardTabId });
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
    addNotification: (notification) => set(state => {
        const newNotifications = [{ id: Date.now(), read: false, ...notification }, ...state.notifications];
        saveNotifications(newNotifications);
        return { notifications: newNotifications };
    }),
    markNotificationsAsRead: () => set(state => {
        const newNotifications = state.notifications.map(n => ({...n, read: true}));
        saveNotifications(newNotifications);
        return { notifications: newNotifications };
    }),
    clearNotifications: () => set(() => {
        saveNotifications([]);
        return { notifications: [] };
    }),

    // Dashboard Layout
    setActiveDashboardTab: (tabId) => {
        set({ activeDashboardTabId: tabId });
        get()._savePrefs();
    },
    addDashboardTab: (name) => {
        const newTab: DashboardTab = { id: generateId(), name: name || `Dashboard ${get().dashboardTabs.length + 1}`, layout: [] };
        set(state => ({ dashboardTabs: [...state.dashboardTabs, newTab], activeDashboardTabId: newTab.id }));
        get()._savePrefs();
    },
    renameDashboardTab: (tabId, newName) => {
        set(state => ({ dashboardTabs: state.dashboardTabs.map(t => t.id === tabId ? { ...t, name: newName } : t) }));
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
    addWidgetToLayout: (widgetId, widgetConfig) => set(state => {
        const activeTab = state.dashboardTabs.find(t => t.id === state.activeDashboardTabId);
        if (!activeTab || activeTab.layout.some(w => w.id === widgetId)) return state;

        // Simple placement logic: find the first available spot
        const newWidget: DashboardLayoutItem = { id: widgetId, x: 0, y: 100, w: widgetConfig.defaultSpan, h: 1 };
        const newLayout = [...activeTab.layout, newWidget];
        
        const newTabs = state.dashboardTabs.map(t => t.id === state.activeDashboardTabId ? { ...t, layout: newLayout } : t);
        get()._savePrefs();
        return { dashboardTabs: newTabs };
    }),
    removeWidgetFromLayout: (widgetId) => {
        set(state => ({
            dashboardTabs: state.dashboardTabs.map(t =>
                t.id === state.activeDashboardTabId
                    ? { ...t, layout: t.layout.filter(w => w.id !== widgetId) }
                    : t
            )
        }));
        get()._savePrefs();
    },
    moveWidget: (widgetId, newX, newY) => {
        set(state => ({
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
    updateChatMessage: (id, updates) => set(state => ({
        chatHistory: state.chatHistory.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    })),
    
    // Client Portal
    clientLogin: (email, password) => {
        const brand = get().brands.find(b => b.portalAccess && b.portalUserEmail === email && b.portalPassword === password);
        if (brand) {
            set({ loggedInClient: brand });
            sessionStorage.setItem('loggedInClientId', brand.id);
            return true;
        }
        return false;
    },
    clientLogout: () => {
        set({ loggedInClient: null });
        sessionStorage.removeItem('loggedInClientId');
        // This is a simple way to force a redirect to login page
        window.location.hash = '/portal/login';
    },
    initializeClientSession: () => {
        const clientId = sessionStorage.getItem('loggedInClientId');
        if (clientId) {
            const client = get().brands.find(b => b.id === clientId);
            if (client) {
                set({ loggedInClient: client });
            }
        }
    },
    enablePortalAccess: (brandId, email, password) => set(state => ({
        brands: state.brands.map(b => b.id === brandId ? { ...b, portalAccess: true, portalUserEmail: email, portalPassword: password } : b)
    })),
}));

export default useStore;
```

## 7. Routing

The application uses `react-router-dom` for client-side routing. The main routing configuration is found in `App.tsx`.

### `App.tsx` Routing Structure

The `App` component uses `HashRouter` to manage the routing history. It defines several top-level routes:

```typescript
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// ... other imports

const App: React.FC = () => {
  // ... useEffect for client session initialization

  return (
    <Router>
      <RouteTracker /> {/* Tracks page visits */}
      <Routes>
        {/* Standalone pages that don't use any main layout */}
        <Route path="/report/campaign/:campaignId" element={<SharableReport />} />
        <Route path="/portal/login" element={<ClientLogin />} />

        {/* Client Portal protected routes */}
        <Route path="/portal/*" element={<ClientPortalRoutes />} />

        {/* Main application routes */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
};
```

#### `MainLayout` Routes

The `MainLayout` component renders the primary application interface, including the `Sidebar` and `Header`. It contains the `MainAppRoutes` component, which defines the routes for the main application:

```typescript
const MainAppRoutes: React.FC<{ theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void }> = ({ theme, setTheme }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-enter">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/team" element={<Team />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/influencers/:influencerId" element={<InfluencerDetail />} />
          <Route path="/brands/:brandId" element={<BrandDetail />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:campaignId" element={<CampaignDetail />} />
          <Route path="/content-hub" element={<ContentHub />} />
          <Route path="/content-hub/:contentId" element={<ContentDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/new" element={<ContractNew />} />
          <Route path="/contracts/:contractId" element={<ContractDetail />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/connectors" element={<ConnectorsPage />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/templates/contracts/:templateId" element={<ContractTemplateDetail />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/settings" element={<Settings currentTheme={theme} onThemeChange={setTheme} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
};
```

#### `ClientPortalRoutes`

The `ClientPortalRoutes` component handles routing for the client portal, which is protected and requires a logged-in client. If no client is logged in, it redirects to `/portal/login`.

```typescript
const ClientPortalRoutes: React.FC = () => {
    const { loggedInClient } = useStore();
    if (!loggedInClient) {
        return <Navigate to="/portal/login" replace />;
    }
    return (
        <ClientPortalLayout>
            <Routes>
                <Route path="/dashboard" element={<ClientDashboard />} />
                <Route path="/campaigns/:campaignId" element={<ClientCampaignDetail />} />
                <Route path="/content/:contentId" element={<ClientContentDetail />} />
                <Route path="/" element={<Navigate to="/portal/dashboard" replace />} />
            </Routes>
        </ClientPortalLayout>
    );
};
```

The application uses `useParams` to extract route parameters (e.g., `:influencerId`, `:campaignId`), `useNavigate` for programmatic navigation, and `useLocation` to access the current URL.

## 8. Data Fetching and State Management

The application utilizes Zustand for state management, as evidenced by the `useStore.ts` file in the `hooks` directory. This central store manages a wide array of application data and UI states.

### Zustand Store (`useStore.ts`)

The `useStore.ts` file defines a comprehensive Zustand store that includes:

*   **Data Entities**: Influencers, brands, contracts, campaigns, tasks, content, invoices, team members, and client-specific data.
*   **User and Agency Preferences**: Settings related to the user interface, notifications, and application behavior.
*   **Dashboard Layout**: Configuration for the dashboard's widgets and their arrangements.
*   **Notifications**: State for in-app notifications.
*   **UI State**: Various flags and states controlling UI elements, such as loading indicators, modal visibility, and sidebar open/close status.
*   **Client Portal State**: Specific state management for the client-facing portal.
*   **AI Assistant State**: State related to an integrated AI assistant.

The store provides numerous actions for:

*   **Data Manipulation**: Adding, updating, and deleting various data entities.
*   **Preference Updates**: Modifying user and agency settings.
*   **Notification Management**: Adding, removing, and marking notifications as read.
*   **Dashboard Layout Modifications**: Saving and loading dashboard configurations.
*   **AI Assistant Control**: Interacting with the AI assistant's state.
*   **Client Portal Functionalities**: Managing client-specific data and interactions.

Data fetching appears to be handled within the actions defined in `useStore.ts`, where asynchronous operations (e.g., API calls) would update the store's state upon completion. Specific data fetching libraries or patterns (e.g., React Query, SWR, or custom `fetch` wrappers) would need to be identified by examining the implementation details within these actions.

## 9. Layout Components

The application utilizes several key components for its overall layout and navigation, primarily `Header.tsx` and `Sidebar.tsx`.

### `Header.tsx`

The `Header` component is responsible for displaying the top section of the application, including a welcome message, a clock, search functionality, notifications, and the user's avatar.

**Key Features:**
*   **Welcome Message**: Displays a personalized welcome message to the user.
*   **Clock**: Integrates a `Clock` component to show the current time.
*   **Search**: Provides a button to trigger a search functionality (`onSearchClick` prop).
*   **Notifications**: Displays a bell icon with an unread notification count. Clicking it toggles a `NotificationPanel`.
*   **User Avatar**: Shows the user's avatar or their initial if no avatar URL is provided.
*   **State Management**: Uses `useStore` to access `userName`, `userAvatarUrl`, and `notifications`.

**Structure:**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell } from 'lucide-react';
import Clock from './Clock';
import useStore from '../hooks/useStore';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { userName, userAvatarUrl, notifications, markNotificationsAsRead } = useStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleBellClick = () => {
    setIsPanelOpen(prev => !prev);
    if (!isPanelOpen) {
      markNotificationsAsRead();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-brand-text-primary">Welcome back, {userName}</h1>
        <p className="text-brand-text-secondary">Here's what's happening today.</p>
      </div>
      <div className="flex items-center gap-6">
        <Clock />
        <button 
          onClick={onSearchClick} 
          className="text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          aria-label="Open search"
        >
          <Search className="w-6 h-6" />
        </button>
        
        <div className="relative" ref={panelRef}>
            <button 
                onClick={handleBellClick}
                className="relative text-brand-text-secondary hover:text-brand-text-primary transition-colors" 
                aria-label="View notifications"
                aria-expanded={isPanelOpen}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-brand-surface">
                        {unreadCount}
                    </span>
                )}
            </button>
            <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </div>
        
        <div className="w-10 h-10 rounded-full bg-brand-surface border-2 border-brand-border flex items-center justify-center font-bold text-brand-text-primary">
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### `Sidebar.tsx`

The `Sidebar` component provides the main navigation for the application, located on the left side of the screen. It includes a logo/agency name, a list of navigation links, and a link to the client portal.

**Key Features:**
*   **Agency Branding**: Displays the agency logo or name.
*   **Main Navigation**: A list of `NavItem` components for various sections of the application (Dashboard, Projects, Tasks, etc.).
*   **Active Link Highlighting**: Dynamically highlights the currently active navigation item with a animated background.
*   **Secondary Navigation**: Includes a link to settings and a direct link to the client portal.
*   **State Management**: Uses `useStore` to access `agencyName` and `agencyLogoUrl`.
*   **Routing**: Utilizes `NavLink` from `react-router-dom` for navigation.

**Structure:**
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Star, Briefcase, Settings, Plus, BookOpen, ClipboardList, Users, Mail, FileText, Banknote, BarChart3, Receipt, ChevronDown, Calendar, ClipboardCheck, ExternalLink } from 'lucide-react';
import useStore from '../hooks/useStore';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative z-10 flex items-center p-3 my-1.5 rounded-lg transition-colors duration-300 ease-in-out ${
          isActive
            ? 'text-white'
            : 'text-brand-text-secondary hover:bg-brand-surface/50 hover:text-brand-text-primary'
        }`
      }
    >
      {icon}
      <span className="ml-4 font-semibold whitespace-nowrap">{label}</span>
    </NavLink>
  );
};

// Moved navItems outside the component to prevent re-creation on every render, fixing the animation bug.
const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard className="w-6 h-6" />, label: 'My Dashboard' },
  { to: '/campaigns', icon: <Star className="w-6 h-6" />, label: 'Projects' },
  { to: '/content-hub', icon: <ClipboardCheck className="w-6 h-6" />, label: 'Content Hub' },
  { to: '/tasks', icon: <ClipboardList className="w-6 h-6" />, label: 'Tasks' },
  { to: '/calendar', icon: <Calendar className="w-6 h-6" />, label: 'Calendar' },
  { to: '/clients', icon: <Briefcase className="w-6 h-6" />, label: 'Clients' },
  { to: '/team', icon: <Users className="w-6 h-6" />, label: 'Team' },
  { to: '/inbox', icon: <Mail className="w-6 h-6" />, label: 'Inbox' },
  { to: '/contracts', icon: <FileText className="w-6 h-6" />, label: 'Contracts' },
  { to: '/financials', icon: <Banknote className="w-6 h-6" />, label: 'Financials' },
  { to: '/invoices', icon: <Receipt className="w-6 h-6" />, label: 'Invoices' },
  { to: '/analytics', icon: <BarChart3 className="w-6 h-6" />, label: 'Analytics' },
  { to: '/academy', icon: <BookOpen className="w-6 h-6" />, label: 'Academy' },
  { to: '/connectors', icon: <ExternalLink className="w-6 h-6" />, label: 'Connectors' },
];

const secondaryNavItems = [
    { to: '/settings', icon: <Settings className="w-6 h-6" />, label: 'Settings' },
]

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [highlightStyle, setHighlightStyle] = useState({ top: 0, height: 0, opacity: 0 });
    const itemsRef = useRef(new Map<string, HTMLLIElement | null>());
    const navRef = useRef<HTMLElement>(null);
    const { agencyName, agencyLogoUrl } = useStore();
    
    useEffect(() => {
        const activeItem = itemsRef.current.get(location.pathname);
        if (activeItem) {
            setHighlightStyle({
                top: activeItem.offsetTop,
                height: activeItem.offsetHeight,
                opacity: 1
            });
        } else {
             setHighlightStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [location.pathname]); // Dependency array simplified for stability

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-brand-bg flex flex-col transition-all duration-300 ease-in-out z-40 w-72 p-6`}
    >
        <div className="flex items-center justify-center pb-8">
            {agencyLogoUrl ? (
                <img src={agencyLogoUrl} alt={`${agencyName} Logo`} className="h-10 w-auto" />
            ) : (
                <h1 className="text-3xl font-bold font-display text-brand-text-primary tracking-wider">{agencyName}</h1>
            )}
        </div>
        
        <nav ref={navRef} className="relative flex-1 overflow-y-auto pr-2 -mr-2">
            <div
                className="absolute left-0 w-full rounded-lg shadow-glow-md pointer-events-none z-0 bg-[size:400%_400%] bg-[linear-gradient(135deg,var(--color-accent-gradient)_0%,var(--color-primary)_50%,var(--color-accent-gradient)_100%)] animate-liquid-pan"
                style={{
                    ...highlightStyle,
                    transition: 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1), height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s'
                }}
            />
            <ul>
                {navItems.map((item) => (
                    <li key={item.to} ref={el => { itemsRef.current.set(item.to, el) }}>
                        <NavItem {...item} />
                    </li>
                ))}
            </ul>
        </nav>
        
        <div className="mt-auto flex-shrink-0">
             <div className="h-px bg-brand-border my-4"></div>
             <ul>
                 <li ref={el => { itemsRef.current.set('/settings', el) }}>
                    <NavItem to="/settings" icon={<Settings className="w-6 h-6" />} label="Settings" />
                </li>
                 <li>
                    <a
                      href="#/portal/login"
                      target="_blank"
                      className="relative z-10 flex items-center p-3 my-1.5 rounded-lg transition-colors duration-300 text-brand-text-secondary hover:bg-brand-surface/50 hover:text-brand-text-primary"
                    >
                      <ExternalLink className="w-6 h-6" />
                      <span className="ml-4 font-semibold whitespace-nowrap">Client Portal</span>
                    </a>
                </li>
             </ul>
        </div>
    </aside>
  );
};

export default Sidebar;
```

## 10. Other Important Components


## 2. Dependencies

## 3. Configuration Files

## 4. Styling (CSS, Tailwind, etc.)

## 5. Color Palette

## 6. Core Functions and Hooks

## 7. Routing

## 8. Data Fetching

## 9. Layout Structure

## 11. API Integrations and Services

### `aiService.ts`

- **Purpose**: Manages AI functionalities, primarily interacting with the Groq API (OpenAI compatible) for tasks like generating toast notifications and assistant briefings.
- **Key Features**:
    - **API Key Management**: Uses `import.meta.env.VITE_GROQ_API_KEY` for secure API key handling.
    - **Caching**: Implements a `fetchAndCache` utility that leverages `localStorage` to store and retrieve AI responses, reducing redundant API calls and improving performance.
    - **AI Model Interaction**: Configures the Groq client with the `mixtral-8x7b-32768` model.
    - **Tool Calling Logic**: The `runConversationWithTools` function dynamically selects and executes relevant tools (e.g., `draft_new_contract`) based on user input, enabling complex AI-driven workflows.
    - **Streaming Responses**: Handles streaming responses from the Groq API for real-time AI interactions.
- **Migration Considerations**:
    - Ensure secure handling of API keys in the Next.js environment (e.g., using environment variables).
    - Reimplement or adapt the caching mechanism for Next.js (e.g., server-side caching, or a different client-side caching strategy).
    - Verify compatibility of Groq API interactions and streaming with Next.js data fetching methods (e.g., `getServerSideProps`, `getStaticProps`, or API routes).
    - Adapt tool-calling logic to Next.js API routes or serverless functions.

### `geminiService.ts`

- **Purpose**: Currently an empty file, indicating it's a placeholder for future integration with Google's Gemini API or other related services.
- **Migration Considerations**:
    - If Gemini API integration is planned, ensure proper setup and configuration within the Next.js project.
    - Implement API key management and secure access practices.
    - Define clear functionalities and endpoints for Gemini-related operations.

### `connectorService.ts`

- **Purpose**: Manages connections to various third-party services (e.g., Google, GitHub, Notion, Slack) using a `zustand` store for state management and persistence.
- **Key Features**:
    - **Connector Configuration**: Defines `ConnectorType` and `ConnectorConfig` interfaces for various services, including their names, types, icons, descriptions, scopes, and client IDs.
    - **Connection Management**: The `useConnectorStore` provides functions to `addConnection`, `removeConnection`, `updateConnection`, and `getConnectionByType`.
    - **State Persistence**: Uses `zustand/middleware/persist` to store connection data, ensuring that connections are maintained across sessions.
    - **Unique ID Generation**: Includes a `generateId` helper function for creating unique identifiers for connections.
- **Migration Considerations**:
    - Re-evaluate the state management solution for Next.js. While `zustand` can be used, consider if a server-side state management approach or a different client-side library is more appropriate for the Next.js architecture.
    - Ensure secure handling of sensitive information like `accessToken` and `refreshToken`. In a Next.js environment, these should ideally be handled server-side or with secure HTTP-only cookies.
    - Adapt environment variable usage (e.g., `process.env.GOOGLE_CLIENT_ID`) to Next.js's `NEXT_PUBLIC_` prefix for client-side variables or server-side environment variables.
    - Review the `partialize` function in the `persist` middleware to ensure only necessary and safe data is persisted.

### `googleConnector.ts`

- **Purpose**: Facilitates integration with Google APIs, handling authentication, token management, and interactions with Google services such as Google Drive.
- **Key Features**:
    - **Google API Initialization**: Uses `gapi-script` to load and initialize the Google API client with a specified `GOOGLE_CLIENT_ID` and `SCOPES`.
    - **Sign-in and Sign-out**: Provides `signInWithGoogle` and `signOutFromGoogle` functions to manage user authentication with Google. It captures user profile information and stores connection details using `useConnectorStore`.
    - **Token Management**: The `ensureValidToken` function checks for token expiration and refreshes it if necessary, ensuring continuous access to Google services.
    - **Google Drive Integration**: Includes an example function `getGoogleDriveFiles` to demonstrate interaction with the Google Drive API.
- **Dependencies**:
    - `gapi-script`: For loading and interacting with the Google API client library.
    - `connectorService`: For managing and persisting Google connection details.
- **Migration Considerations**:
    - **Authentication Flow**: Re-evaluate the Google authentication flow for Next.js. Consider using NextAuth.js or a similar solution for robust and secure OAuth 2.0 implementation.
    - **Environment Variables**: Ensure `GOOGLE_CLIENT_ID` and other sensitive credentials are securely managed using Next.js environment variables (e.g., `NEXT_PUBLIC_GOOGLE_CLIENT_ID` for client-side, or server-side only).
    - **Server-Side Operations**: For server-side rendering or API routes, consider moving Google API interactions to the server to enhance security and performance.
    - **Token Refresh**:- Implement a robust server-side token refresh mechanism to handle `refresh_token` securely and prevent exposing it to the client.

### `notificationService.ts`

- **Purpose**: Provides a simple event-driven mechanism for managing and broadcasting in-app notifications.
- **Key Features**:
    - **Event Listener Pattern**: Allows components to subscribe to new notifications using the `on` method and unsubscribe using the `off` method.
    - **Notification Broadcasting**: The `show` method broadcasts a new notification object to all registered listeners.
    - **Type Safety**: Uses TypeScript to define `NotificationListener` and ensures that notification objects conform to the `Notification` type (excluding `id` and `read`, which are handled by the store).
- **Dependencies**:
    - `../types`: Imports the `Notification` type definition.
- **Migration Considerations**:
    - **State Management Integration**: If notifications are also managed by a global state store (e.g., Redux, Zustand), ensure proper integration and avoid redundant state management.
    - **Persistent Notifications**: Consider how notifications should persist across page navigations or user sessions in a Next.js application. This might involve using a global context, a dedicated notification store, or server-side storage.
    - **Server-Side Notifications**: For real- For real-time or server-generated notifications, explore using WebSockets or server-sent events (SSE) in conjunction with Next.js API routes.

### `searchService.ts`

- **Purpose**: Handles web search functionality, primarily by integrating with the Serper API to fetch search results.
- **Key Features**:
    - **Serper API Integration**: Makes POST requests to the `https://google.serper.dev/search` endpoint with a provided query and API key.
    - **Mock Data Fallback**: If `SERPER_API_KEY` is not configured, it gracefully falls back to using predefined `mockSearchResults` to prevent application failure during development or in the absence of a valid API key.
    - **Error Handling**: Includes error logging for API response issues and network errors, returning an empty array to ensure the application remains stable.
- **Dependencies**:
    - External API: Serper API (`https://serper.dev`)
- **Migration Considerations**:
    - **API Key Management**: Ensure `SERPER_API_KEY` is securely managed in the Next.js environment, preferably as a server-side environment variable to avoid exposure.
    - **Server-Side Fetching**: For better performance and security, consider moving the `performWebSearch` function to a Next.js API route, allowing the server to handle the API key and make the external request.
    - **Rate Limiting and Caching**: Implement server-side rate limiting and caching mechanisms for search queries to optimize API usage and improve response times.
    - Error Handling and UI: Enhance error handling to provide more informative feedback to the user in the Next.js application's UI.

### `userPreferenceService.ts`

- **Purpose**: Manages user preferences and notifications, persisting them in `localStorage`.
- **Key Features**:
    - **Preference Management**: Provides `getPreferences` and `savePreferences` functions to store and retrieve user settings such as `userName`, `userRole`, `agencyName`, `theme`, `accentColor`, and `dashboardNotes`.
    - **Separate Image Storage**: User avatar and agency logo URLs are stored separately in `localStorage` (`AVATAR_KEY`, `LOGO_KEY`) to avoid exceeding `localStorage` quota limits with large image data.
    - **Notification Management**: Includes `getNotifications` and `saveNotifications` to handle a list of user notifications.
    - **Page Visit Tracking**: The `trackPageVisit` function records page visits and updates the `lastVisit` timestamp.
    - **Preference Initialization**: `initializePreferences` sets up default preferences for new users or when a user's name changes.
- **Dependencies**:
    - `../types`: Imports `UserPreferences` and `Notification` type definitions.
- **Migration Considerations**:
    - **Client-Side Storage**: `localStorage` is a client-side storage mechanism. In Next.js, consider if these preferences should be stored server-side (e.g., in a database) for better persistence, synchronization across devices, and server-side rendering compatibility.
    - **Authentication and User Context**: Integrate preference management with Next.js authentication solutions to ensure preferences are tied to authenticated users.
    - **Server-Side Rendering (SSR)**: If preferences are needed during SSR, `localStorage` will not be available. Implement a strategy to fetch preferences on the server or pass them as props to client components.
    - **Data Hydration**: Ensure proper data hydration for preferences when moving from server-rendered content to client-side interactivity.
    - **Security**: For sensitive user preferences, consider encrypting data stored in `localStorage` or moving it to a more secure server-side storage.

### `agentTools.ts`

- **Purpose**: Defines a comprehensive collection of AI agent tools that enable the application's AI assistant to perform various actions and operations within the system.
- **Key Features**:
    - **Extensive Tool Collection**: Exports `AGENT_TOOLS`, a function that returns an array of over 50 tool definitions structured as `OpenAI.Chat.Completions.ChatCompletionTool` objects.
    - **Function-Based Tools**: Each tool is defined with `type: 'function'`, indicating it's an executable operation with a specific purpose.
    - **Structured Tool Definitions**: Every tool includes:
        - `name`: A unique identifier (e.g., `brave_search`, `create_invoice`, `draft_new_contract`)
        - `description`: A clear explanation of the tool's purpose
        - `parameters`: A JSON Schema object specifying required and optional arguments
    - **Functional Categories**: Tools are organized into logical categories covering:
        - Client & Influencer Management (CRM)
        - Campaign Management
        - Financial Operations
        - Contract Management
        - Content Creation
        - Communication
        - Analytics & Reporting
        - Task & Calendar Management
    - **Dynamic Date Handling**: Uses a `currentDate` parameter to ensure date-related tools have access to the current date.
- **Dependencies**:
    - `OpenAI`: Specifically the `OpenAI.Chat.Completions.ChatCompletionTool` type definition.
- **Migration Considerations**:
    - **Server-Side Implementation**: In Next.js, these tools should be implemented as API routes or serverless functions, ensuring secure execution and proper authentication.
    - **API Key Management**: For tools that interact with external services (like `brave_search`), ensure API keys are securely managed using Next.js environment variables.
    - **Tool Execution Context**: Determine whether each tool should execute on the server-side or client-side based on its functionality and security requirements.
    - **Input Validation**: Implement robust server-side validation for all tool parameters to prevent security vulnerabilities.
    - **Error Handling**: Establish comprehensive error handling and logging mechanisms for tool executions.
    - **Authentication & Authorization**: Ensure proper authentication checks before executing tools, especially those that modify data.
    - **Modular Implementation**: Consider implementing tools as separate modules that can be dynamically imported to improve code organization and maintainability.
    - **TypeScript Integration**: Leverage Next.js's strong TypeScript support to ensure type safety across tool definitions and implementations.

### `downloadUtils.ts`

- **Purpose**: Provides utility functions for client-side data export, specifically for converting data to CSV and exporting HTML elements to PDF.
- **Key Features**:
    - **CSV Export**: `exportToCsv` function takes an array of objects and a filename, converts the data to a CSV string, and triggers a browser download.
    - **PDF Export**: `exportPageToPdf` function utilizes `jspdf` and `html2canvas` to capture an HTML element as a canvas image and then converts it into a multi-page PDF for download.
    - **Error Handling**: Includes basic error logging for PDF generation failures.
- **Dependencies**:
    - `jspdf`: For generating PDF documents.
    - `html2canvas`: For converting HTML elements into canvas images.
- **Migration Considerations**:
    - Ensure that `jspdf` and `html2canvas` are compatible with the Next.js environment. These are client-side libraries, so they should be imported dynamically or used within client components if server-side rendering is a concern.
    - For server-side rendering (SSR) or static site generation (SSG) in Next.js, consider if these functionalities should remain client-side or if server-side alternatives for CSV/PDF generation are needed.
    - Review the handling of large data sets for CSV export and complex HTML structures for PDF export to ensure performance and memory efficiency in the Next.js application.

## 12. Migration Checklist

This step-by-step checklist ensures a proper conversion from Vite React to Next.js while maintaining UI consistency, animations, and overall smoothness.

### 1. Dependencies Migration

- Copy all dependencies from `package.json` in the Vite project, especially:
  - TailwindCSS and related plugins
  - Custom font packages
  - Animation libraries
  - State management libraries (Zustand in this project)
- Install these dependencies in the Next.js project:
  ```bash
  npm install [dependencies]
  # or
  yarn add [dependencies]
  ```
- Review and remove any Vite-specific dependencies that aren't needed in Next.js
- Ensure compatibility of all packages with Next.js (some may require specific versions)

### 2. TailwindCSS Setup

- Install Tailwind in the Next.js project:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- Copy the `tailwind.config.js` file from the Vite project, ensuring all custom theme extensions, plugins, and configurations are preserved
- Set up the Tailwind directives in your global CSS file (e.g., `/styles/globals.css`):
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Verify that all custom Tailwind utilities and extensions are properly migrated
- Ensure Tailwind plugins (like typography, forms, etc.) are correctly configured

### 3. Font & Design Tokens

- Migrate custom fonts:
  - Place font files in `/public/fonts` directory
  - Use Next.js font optimization with `next/font` or import via CSS
  - Verify font configuration in `tailwind.config.js`
- For the Inter font used in this project:
  ```js
  // In Next.js with next/font
  import { Inter } from 'next/font/google';
  
  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
  });
  
  // Then in your layout
  <html lang="en" className={`${inter.variable}`}>
  ```
- Ensure all design tokens are properly transferred:
  - Color palette (including dark mode colors)
  - Gradients
  - Shadows
  - Border radiuses
- Copy any CSS variables defined in global styles

### 4. Component Migration

- Copy React components to appropriate directories:
  - `/components` for reusable UI components
  - `/pages` for page components (or `/app` if using the App Router)
- Update imports to reflect the Next.js project structure
- Convert any React Router routes to Next.js file-based routing:
  - Pages Router: `/pages/[name].tsx`
  - App Router: `/app/[name]/page.tsx`
- For dynamic routes in this project (like `BrandDetail.tsx`, `InfluencerDetail.tsx`):
  - Convert to `/pages/brands/[id].tsx` or `/app/brands/[id]/page.tsx`
  - Update params access from `useParams()` to Next.js's approach
- Add `"use client"` directive to components that use client-side features:
  ```tsx
  "use client"
  
  import React from 'react';
  // Component code...
  ```

### 5. Animation & Transition Smoothness

- Ensure animation libraries are properly installed and configured
- Check for SSR compatibility issues:
  - Wrap client-side animations in `useEffect` hooks
  - Use dynamic imports with `next/dynamic` for client-only components
  - Add the `"use client"` directive at the top of components using client-side animations (App Router)
- For Tailwind animations used in this project:
  - Ensure all keyframes are properly defined in the Tailwind config
  - Test that animation classes work correctly in the Next.js environment
- Test all transitions and animations in the development environment
- Verify that page transitions maintain the same smoothness as in the Vite project
- For components with complex animations (like `Modal.tsx`, `ToastNotification.tsx`):
  - Test thoroughly to ensure animations trigger correctly
  - Consider using `useEffect` to manage animation timing

### 6. Global Styles

- Migrate all global styles from the Vite project to Next.js:
  - Copy global CSS to `/styles/globals.css`
  - Ensure body background, base layout colors, and font smoothing are applied
  - Import the global CSS file in `_app.tsx` (Pages Router) or `layout.tsx` (App Router)
- For embedded styles in this project:
  - Ensure all CSS variables are properly defined
  - Verify that any `@apply` directives work correctly
- Check that global styles don't conflict with Next.js's built-in styles

### 7. Dark Mode

- Confirm dark mode configuration in `tailwind.config.js`:
  ```js
  module.exports = {
    darkMode: 'class', // or 'media'
    // ...
  }
  ```
- If using a theme provider (e.g., `next-themes`), migrate the setup and context
- For this project's dark mode implementation:
  - Migrate the dark mode toggle functionality from `useStore`
  - Ensure theme persistence works correctly
- Test dark mode toggle functionality across all components
- Verify that all color transitions work smoothly when switching themes

### 8. Next.js Routing

- Replace React Router components with Next.js equivalents:
  - `<Link>` from `next/link` instead of React Router's `<Link>`
  - `useRouter` from `next/router` or `next/navigation` instead of React Router hooks
- Update any dynamic routes to use Next.js parameter syntax
- Implement any necessary middleware for protected routes
- For the sidebar navigation in this project:
  - Update `Sidebar.tsx` to use Next.js navigation
  - Ensure active link highlighting works correctly
- Convert any route guards or authentication logic to Next.js middleware

### 9. State Management

- Migrate Zustand store setup to work with Next.js:
  - Ensure proper hydration of initial state
  - Handle any SSR-specific concerns
- For this project's `useStore` hook:
  - Test that all store slices work correctly
  - Verify that persistence works with Next.js
- Consider using Next.js-specific state management patterns for server components
- Ensure any localStorage usage is properly handled in the Next.js environment

### 10. API Integration

- Migrate API services to work with Next.js:
  - Consider converting to API routes for backend functionality
  - Update fetch calls to use Next.js data fetching methods where appropriate
- For this project's services:
  - Update `aiService.ts`, `connectorService.ts`, etc. to work in Next.js
  - Ensure proper error handling in the Next.js context
- Handle environment variables according to Next.js conventions:
  - Client-side variables must be prefixed with `NEXT_PUBLIC_`
  - Server-side variables can be accessed directly in API routes or server components

### 11. Build & Test

- Run the development server:
  ```bash
  npm run dev
  ```
- Check for missing styles, fonts, or broken layouts
- Verify that all pages render correctly
- Test responsive behavior across different screen sizes
- Ensure all interactive elements work as expected
- Test performance using Next.js built-in analytics or Lighthouse

### 12. Debugging Common Issues

- **White/blank pages**: Check if CSS/global styles are loaded correctly
- **Missing fonts**: Verify font imports and file paths
- **Broken animations**: Look for SSR compatibility issues
- **Layout shifts**: Ensure proper CSS loading and font display strategies
- **Console errors**: Address any JavaScript errors related to component rendering
- **Hydration errors**: Fix any mismatches between server and client rendering
- **Image optimization issues**: Convert to Next.js Image component for better performance
- **API errors**: Check for proper implementation of API routes and data fetching

### Final Verification Checklist

- [ ] Tailwind configuration is correctly copied and all classes work
- [ ] Custom fonts are present and properly imported
- [ ] Global CSS and background styles are applied
- [ ] Animations load correctly via client-side effects
- [ ] SSR does not break dynamic styles
- [ ] Dark mode/theme context works (if present)
- [ ] All dependencies are installed and functioning
- [ ] Page transitions are smooth and match the Vite implementation
- [ ] No console errors related to rendering or styling
- [ ] All interactive components function correctly
- [ ] State management works properly across the application
- [ ] API integrations function as expected
- [ ] Authentication and authorization work correctly
- [ ] Performance metrics meet or exceed the Vite implementation