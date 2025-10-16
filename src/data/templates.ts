// data/templates.ts
import * as React from 'react';
import { DashboardTemplate } from '../types';
import {
    Rocket, TrendingUp,
    LayoutDashboard, Wallet, HeartHandshake, Briefcase, BarChart3, Layers,
    Lightbulb
} from 'lucide-react';

export const PREMADE_TEMPLATES: DashboardTemplate[] = [
    {
        id: 'blank-dashboard',
        name: 'Blank Dashboard',
        description: 'Start with a clean slate and build your perfect dashboard from scratch.',
        icon: React.createElement(LayoutDashboard, { className: "w-8 h-8 text-brand-primary" }),
        layout: [],
    },
    {
        id: 'new-agency-starter',
        name: 'New Agency Starter',
        description: 'Everything you need to track as you build your agency from the ground up.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(Rocket, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'total-active-creators', widgetId: 'total-active-creators', x: 0, y: 0, w: 3, h: 1 },
            { id: 'monthly-recurring-revenue', widgetId: 'monthly-recurring-revenue', x: 3, y: 0, w: 3, h: 1 },
            { id: 'active-campaigns-metric', widgetId: 'active-campaigns-metric', x: 6, y: 0, w: 3, h: 1 },
            { id: 'new-creator-onboarding', widgetId: 'new-creator-onboarding', x: 9, y: 0, w: 3, h: 1 },
            { id: 'todays-agenda', widgetId: 'todays-agenda', x: 0, y: 1, w: 6, h: 1 },
            { id: 'todo-list', widgetId: 'todo-list', x: 6, y: 1, w: 6, h: 1 },
        ],
    },
    {
        id: 'multi-client-dashboard',
        name: 'Multi-Client Mission Control',
        description: 'A high-level overview to track all client campaigns, financials, and health metrics in one place.',
        icon: React.createElement(Layers, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'campaign-timeline-view', widgetId: 'campaign-timeline-view', x: 0, y: 0, w: 12, h: 1 },
            { id: 'revenue-by-client', widgetId: 'revenue-by-client', x: 0, y: 1, w: 6, h: 1 },
            { id: 'pipeline-value', widgetId: 'pipeline-value', x: 6, y: 1, w: 3, h: 1 },
            { id: 'monthly-profit-margin', widgetId: 'monthly-profit-margin', x: 9, y: 1, w: 3, h: 1 },
            { id: 'client-health', widgetId: 'client-health', x: 0, y: 2, w: 6, h: 1 },
            { id: 'content-approval-status', widgetId: 'content-approval-status', x: 6, y: 2, w: 6, h: 1 },
            { id: 'upcoming-renewals', widgetId: 'upcoming-renewals', x: 0, y: 3, w: 4, h: 1 },
            { id: 'overdue-tasks', widgetId: 'overdue-tasks', x: 4, y: 3, w: 4, h: 1 },
            { id: 'client-satisfaction-score', widgetId: 'client-satisfaction-score', x: 8, y: 3, w: 4, h: 1 },
        ],
    },
    {
        id: 'growth-stage-agency',
        name: 'Growth Stage Agency',
        description: 'Optimize and scale your growing agency operations with performance-focused widgets.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(TrendingUp, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'revenue-growth-rate', widgetId: 'revenue-growth-rate', x: 0, y: 0, w: 3, h: 1 },
            { id: 'live-campaigns', widgetId: 'live-campaigns', x: 3, y: 0, w: 6, h: 1 },
            { id: 'team-productivity-score', widgetId: 'team-productivity-score', x: 9, y: 0, w: 3, h: 1 },
            { id: 'top-performing-creators', widgetId: 'top-performing-creators', x: 0, y: 1, w: 6, h: 1 },
            { id: 'budget-vs-actual-spend', widgetId: 'budget-vs-actual-spend', x: 6, y: 1, w: 6, h: 1 },
        ],
    },
    {
        id: 'enterprise-agency',
        name: 'Enterprise Agency',
        description: 'Enterprise-level insights for large-scale operations and strategic management.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(LayoutDashboard, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'financial-overview', widgetId: 'financial-overview', x: 0, y: 0, w: 6, h: 2 },
            { id: 'risk-assessment-dashboard', widgetId: 'risk-assessment-dashboard', x: 6, y: 0, w: 6, h: 1 },
            { id: 'predictive-revenue-forecast', widgetId: 'predictive-revenue-forecast', x: 6, y: 1, w: 6, h: 1 },
            { id: 'command-center', widgetId: 'command-center', x: 0, y: 2, w: 3, h: 1 },
            { id: 'client-health', widgetId: 'client-health', x: 3, y: 2, w: 9, h: 1 },
        ],
    },
    {
        id: 'creator-focused-agency',
        name: 'Creator-Focused Agency',
        description: 'Maximize your creator relationships and track talent performance.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(HeartHandshake, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'top-performing-creators', widgetId: 'top-performing-creators', x: 0, y: 0, w: 6, h: 1 },
            { id: 'creator-availability', widgetId: 'creator-availability', x: 6, y: 0, w: 3, h: 1 },
            { id: 'creator-payment-tracker', widgetId: 'creator-payment-tracker', x: 9, y: 0, w: 3, h: 1 },
            { id: 'creator-engagement-trends', widgetId: 'creator-engagement-trends', x: 0, y: 1, w: 6, h: 1 },
            { id: 'creator-niche-distribution', widgetId: 'creator-niche-distribution', x: 6, y: 1, w: 6, h: 1 },
        ],
    },
    {
        id: 'brand-focused-agency',
        name: 'Brand-Focused Agency',
        description: 'Deliver exceptional results for your brand partners with these client-centric metrics.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(Briefcase, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'revenue-by-client', widgetId: 'revenue-by-client', x: 0, y: 0, w: 6, h: 1 },
            { id: 'client-satisfaction-score', widgetId: 'client-satisfaction-score', x: 6, y: 0, w: 3, h: 1 },
            { id: 'brand-relationship-health', widgetId: 'brand-relationship-health', x: 9, y: 0, w: 3, h: 1 },
            { id: 'campaign-timeline-view', widgetId: 'campaign-timeline-view', x: 0, y: 1, w: 12, h: 1 },
            { id: 'overdue-invoices', widgetId: 'overdue-invoices', x: 0, y: 2, w: 6, h: 1 },
            { id: 'upcoming-renewals', widgetId: 'upcoming-renewals', x: 6, y: 2, w: 6, h: 1 },
        ],
    },
    {
        id: 'performance-driven-agency',
        name: 'Performance-Driven Agency',
        description: 'Data-driven insights for agencies focused on maximizing ROI and campaign performance.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(BarChart3, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'average-campaign-roi', widgetId: 'average-campaign-roi', x: 0, y: 0, w: 3, h: 1 },
            { id: 'campaign-success-rate', widgetId: 'campaign-success-rate', x: 3, y: 0, w: 3, h: 1 },
            { id: 'platform-performance-comparison', widgetId: 'platform-performance-comparison', x: 6, y: 0, w: 6, h: 1 },
            { id: 'content-performance-heatmap', widgetId: 'content-performance-heatmap', x: 0, y: 1, w: 6, h: 1 },
            { id: 'engagement-rate-by-niche', widgetId: 'engagement-rate-by-niche', x: 6, y: 1, w: 6, h: 1 },
        ],
    },
    {
        id: 'financial-focused-dashboard',
        name: 'Financial-Focused Dashboard',
        description: 'Complete financial visibility and control, from cash flow to client profitability.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(Wallet, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'financial-overview', widgetId: 'financial-overview', x: 0, y: 0, w: 12, h: 2 },
            { id: 'monthly-profit-margin', widgetId: 'monthly-profit-margin', x: 0, y: 2, w: 3, h: 1 },
            { id: 'cash-flow-forecast', widgetId: 'cash-flow-forecast', x: 3, y: 2, w: 3, h: 1 },
            { id: 'invoice-status-overview', widgetId: 'invoice-status-overview', x: 6, y: 2, w: 3, h: 1 },
            { id: 'pipeline-value', widgetId: 'pipeline-value', x: 9, y: 2, w: 3, h: 1 },
        ],
    },
    {
        id: 'ai-powered-executive',
        name: 'AI-Powered Executive',
        description: 'Leverage AI for competitive advantage with predictive insights and smart suggestions.',
        // FIX: Replaced JSX syntax with React.createElement to avoid parsing errors in a .ts file.
        icon: React.createElement(Lightbulb, { className: "w-8 h-8 text-brand-primary" }),
        layout: [
            { id: 'ai-campaign-optimizer', widgetId: 'ai-campaign-optimizer', x: 0, y: 0, w: 6, h: 1 },
            { id: 'smart-creator-recommendations', widgetId: 'smart-creator-recommendations', x: 6, y: 0, w: 6, h: 1 },
            { id: 'predictive-revenue-forecast', widgetId: 'predictive-revenue-forecast', x: 0, y: 1, w: 3, h: 1 },
            { id: 'risk-assessment-dashboard', widgetId: 'risk-assessment-dashboard', x: 3, y: 1, w: 6, h: 1 },
            { id: 'growth-opportunity-scanner', widgetId: 'growth-opportunity-scanner', x: 9, y: 1, w: 3, h: 1 },
        ],
    }
];
