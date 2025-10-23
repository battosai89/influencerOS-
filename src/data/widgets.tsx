import { 
  Activity, 
  AlertCircle, 
  BarChart3, 
  BarChartBig,
  Calendar, 
  CircleDollarSign, 
  Clock, 
  Command, 
  FileText, 
  Flag, 
  Heart, 
  LineChart, 
  ListTodo, 
  MessageSquare, 
  PieChart, 
  Settings, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Users, 
  Wallet,
  type LucideIcon,
  Terminal, TrendingUp as TrendingUpIcon, ArrowRightLeft, Users as UsersIcon, DollarSign, StickyNote,
  AlertTriangle, CalendarCheck, MessageSquareWarning, Sparkles as SparklesIcon, AlertCircle as AlertCircleIcon,
  Activity as ActivityIcon, Rocket, Radar, UserCheck, GaugeCircle, Clock as ClockIcon, FileText as FileTextIcon,
  UserPlus, KanbanSquare, ClipboardX, FileWarning, History,
  PieChart as PieChartIcon, LineChart as LineChartIcon, CheckSquare, CalendarDays, Star as StarIcon, Smile, Layers,
  Percent, Landmark, HandCoins, FileClock, Goal, CandlestickChart,
  Briefcase, Wallet as WalletIcon, Target, ListFilter, Award, CalendarClock, FolderKanban,
  HeartHandshake, MapPin, LayoutGrid, GanttChartSquare, ClipboardCheck,
  BarChartHorizontal, Timer, Shapes, CalendarRange, CircleDollarSign as CircleDollarSignIcon,
  BarChartBig as BarChartBigIcon, CheckCircle2, Users2, Lightbulb, UserCog, ShieldAlert,
  Zap, Signal, Telescope, Paintbrush, HeartCrack, Scaling, LayoutDashboard,
  PlusSquare, Info, TrendingDown, Move, XCircle, ChevronLeft, ChevronRight,
  X, Plus, Layout, GripVertical, ArrowUpRight, ArrowDownRight, CheckCircle,
  Eye, Calendar as CalendarIcon, MessageSquare as MessageSquareIcon,
  BarChart, Zap as ZapIcon, Target as TargetIcon, Filter, Home
} from 'lucide-react';

import React from 'react';

// Import all widget components from dashboard-widgets directory
import AIInsightsWidget from '@/app/components/dashboard-widgets/AIInsightsWidget';
import CampaignAlertsWidget from '@/app/components/dashboard-widgets/CampaignAlertsWidget';
import CampaignPerformanceWidget from '@/app/components/dashboard-widgets/CampaignPerformanceWidget';
import ContentQualityWidget from '@/app/components/dashboard-widgets/ContentQualityWidget';
import ContentVelocityWidget from '@/app/components/dashboard-widgets/ContentVelocityWidget';
import ContractStatusWidget from '@/app/components/dashboard-widgets/ContractStatusWidget';
import CreatorMessagesWidget from '@/app/components/dashboard-widgets/CreatorMessagesWidget';
import CreatorRosterWidget from '@/app/components/dashboard-widgets/CreatorRosterWidget';
import CreatorSatisfactionWidget from '@/app/components/dashboard-widgets/CreatorSatisfactionWidget';
import GoalTrackingWidget from '@/app/components/dashboard-widgets/GoalTrackingWidget';
import LiveCampaignsWidget from '@/app/components/dashboard-widgets/LiveCampaignsWidget';
import MonthlyRevenueWidget from '@/app/components/dashboard-widgets/MonthlyRevenueWidget';
import PaymentTrackingWidget from '@/app/components/dashboard-widgets/PaymentTrackingWidget';
import PerformanceMetricsWidget from '@/app/components/dashboard-widgets/PerformanceMetricsWidget';
import QuickStatsWidget from '@/app/components/dashboard-widgets/QuickStatsWidget';
import QuickTasksWidget from '@/app/components/dashboard-widgets/QuickTasksWidget';
import RevenueForecastWidget from '@/app/components/dashboard-widgets/RevenueForecastWidget';
import SystemStatusWidget from '@/app/components/dashboard-widgets/SystemStatusWidget';
import TimeTrackingWidget from '@/app/components/dashboard-widgets/TimeTrackingWidget';
import UpcomingDeadlinesWidget from '@/app/components/dashboard-widgets/UpcomingDeadlinesWidget';

// Import widget component from dashboard/widgets directory
import FinancialOverviewWidget from '@/app/dashboard/widgets/FinancialOverviewWidget';

// Import new priority widgets
import ActiveCampaignsMetricWidget from '@/app/components/dashboard-widgets/ActiveCampaignsMetricWidget';
import RevenueByClientWidget from '@/app/components/dashboard-widgets/RevenueByClientWidget';
import ClientHealthWidget from '@/app/components/dashboard-widgets/ClientHealthWidget';
import UpcomingRenewalsWidget from '@/app/components/dashboard-widgets/UpcomingRenewalsWidget';
import OverdueTasksWidget from '@/app/components/dashboard-widgets/OverdueTasksWidget';
import OverdueInvoicesWidget from '@/app/components/dashboard-widgets/OverdueInvoicesWidget';
import NewLeadsWidget from '@/app/components/dashboard-widgets/NewLeadsWidget';
import ClientPipelineWidget from '@/app/components/dashboard-widgets/ClientPipelineWidget';
import TodaysAgendaWidget from '@/app/components/dashboard-widgets/TodaysAgendaWidget';
import OpportunityRadarWidget from '@/app/components/dashboard-widgets/OpportunityRadarWidget';
import { CommandCenterWidget, TalentSpotlightWidget } from '../views/Dashboard';

import useStore from '@/hooks/useStore';

export type WidgetConfig = {
  component: React.FC;
  title: string;
  icon: React.ReactNode;
  description: string;
  defaultSpan: number;
  category: string;
};

export const WIDGET_REGISTRY: { [key: string]: WidgetConfig } = {
  // Essential Analytics Widgets
  'command-center': {
    component: CommandCenterWidget,
    title: "Command Center",
    icon: <Command className="w-5 h-5" />,
    description: "Your daily action items and key stats at a glance.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'live-campaigns': {
    component: LiveCampaignsWidget,
    title: "Live Campaigns",
    icon: <TrendingUpIcon className="w-5 h-5" />,
    description: "Track progress and ROI of your active campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'financial-overview': {
    component: FinancialOverviewWidget,
    title: "Financial Overview",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    description: "A clear summary of income, expenses, and profitability.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },

  // Essential Metrics Widgets
  'total-active-creators': {
    component: () => {
      const { influencers } = useStore();
      const activeCreators = influencers.filter(i => i.status === 'active').length;
      return (
        <div className="flex flex-col h-full justify-center items-center text-center">
          <p className="text-6xl font-bold text-brand-text-primary">{activeCreators}</p>
          <p className="text-xs text-brand-text-secondary">Active Creators</p>
        </div>
      );
    },
    title: "Active Creators",
    icon: <UsersIcon className="w-5 h-5" />,
    description: "Number of active creators in your network.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'estimated-mrr': {
    component: () => {
      const { contracts } = useStore();
      const estimatedMrr = contracts.reduce((sum, c) => sum + (c.value || 0), 0);
      return (
        <div className="flex flex-col h-full justify-center items-center text-center">
          <p className="text-6xl font-bold text-brand-text-primary">${estimatedMrr.toLocaleString()}</p>
          <p className="text-xs text-brand-text-secondary">Estimated MRR</p>
        </div>
      );
    },
    title: "Estimated MRR",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Estimated MRR from active, signed contracts.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },

  // Core Business Metrics Widgets
  'active-campaigns-metric': {
    component: ActiveCampaignsMetricWidget,
    title: "Active Campaigns",
    icon: <ActivityIcon className="w-5 h-5" />,
    description: "Track active and completed campaigns with key metrics.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'revenue-by-client': {
    component: RevenueByClientWidget,
    title: "Revenue by Client",
    icon: <UsersIcon className="w-5 h-5" />,
    description: "Top clients by revenue with contract counts and percentages.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'client-health': {
    component: ClientHealthWidget,
    title: "Client Health",
    icon: <HeartHandshake className="w-5 h-5" />,
    description: "Client relationship health scores and satisfaction metrics.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'upcoming-renewals': {
    component: UpcomingRenewalsWidget,
    title: "Contract Renewals",
    icon: <CalendarClock className="w-5 h-5" />,
    description: "Upcoming contract renewals and expiration alerts.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'overdue-tasks': {
    component: OverdueTasksWidget,
    title: "Overdue Tasks",
    icon: <ClockIcon className="w-5 h-5" />,
    description: "High-priority list of past due tasks to prevent missed deadlines.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'overdue-invoices': {
    component: OverdueInvoicesWidget,
    title: "Overdue Invoices",
    icon: <FileWarning className="w-5 h-5" />,
    description: "Invoice tracking to protect cash flow and highlight payment issues.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'new-leads': {
    component: NewLeadsWidget,
    title: "New Leads",
    icon: <UserPlus className="w-5 h-5" />,
    description: "Feed of recently added opportunities and prospects.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'client-pipeline': {
    component: ClientPipelineWidget,
    title: "Client Pipeline",
    icon: <KanbanSquare className="w-5 h-5" />,
    description: "Kanban-style client acquisition stages and pipeline management.",
    defaultSpan: 6,
    category: 'Essential Metrics'
  },
  'todays-agenda': {
    component: TodaysAgendaWidget,
    title: "Today's Agenda",
    icon: <CalendarIcon className="w-5 h-5" />,
    description: "Daily tasks and calendar events for today with progress tracking.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },

  // Utility Widgets
  'notes': {
    component: () => {
      const { dashboardNotes, updateDashboardNotes } = useStore();
      const [note, setNote] = React.useState(dashboardNotes);

      React.useEffect(() => {
        setNote(dashboardNotes);
      }, [dashboardNotes]);

      const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNote = e.target.value;
        setNote(newNote);
        // Debounced save
        const timeoutId = setTimeout(() => {
          updateDashboardNotes(newNote);
        }, 500);
        return () => clearTimeout(timeoutId);
      };

      return (
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Jot down a quick note..."
          className="w-full h-full bg-transparent text-brand-text-secondary resize-none focus:outline-none placeholder:text-brand-text-secondary/70"
        />
      );
    },
    title: "Scratchpad",
    icon: <StickyNote className="w-5 h-5" />,
    description: "A quick place to jot down notes and reminders.",
    defaultSpan: 3,
    category: 'Utility'
  },

  // Analytics & Info Widgets
  'ai-insights': {
    component: AIInsightsWidget,
    title: "AI Insights",
    icon: <SparklesIcon className="w-5 h-5" />,
    description: "AI-powered insights and recommendations for your campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'campaign-alerts': {
    component: CampaignAlertsWidget,
    title: "Campaign Alerts",
    icon: <AlertCircleIcon className="w-5 h-5" />,
    description: "Important alerts and notifications for your campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'campaign-performance': {
    component: CampaignPerformanceWidget,
    title: "Campaign Performance",
    icon: <BarChart className="w-5 h-5" />,
    description: "Track the performance metrics of your campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'content-quality': {
    component: ContentQualityWidget,
    title: "Content Quality",
    icon: <CheckCircle className="w-5 h-5" />,
    description: "Monitor the quality metrics of your content pieces.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'content-velocity': {
    component: ContentVelocityWidget,
    title: "Content Velocity",
    icon: <Rocket className="w-5 h-5" />,
    description: "Track the speed and volume of content creation and approval.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },
  'contract-status': {
    component: ContractStatusWidget,
    title: "Contract Status",
    icon: <FileTextIcon className="w-5 h-5" />,
    description: "Overview of all contract statuses and progress.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'creator-messages': {
    component: CreatorMessagesWidget,
    title: "Creator Messages",
    icon: <MessageSquareIcon className="w-5 h-5" />,
    description: "Recent messages and communications with creators.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'creator-roster': {
    component: CreatorRosterWidget,
    title: "Creator Roster",
    icon: <UsersIcon className="w-5 h-5" />,
    description: "Overview of all creators in your network.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },
  'creator-satisfaction': {
    component: CreatorSatisfactionWidget,
    title: "Creator Satisfaction",
    icon: <Smile className="w-5 h-5" />,
    description: "Track creator satisfaction and feedback scores.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'goal-tracking': {
    component: GoalTrackingWidget,
    title: "Goal Tracking",
    icon: <TargetIcon className="w-5 h-5" />,
    description: "Monitor progress towards your business goals.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'monthly-revenue': {
    component: MonthlyRevenueWidget,
    title: "Monthly Revenue",
    icon: <TrendingUpIcon className="w-5 h-5" />,
    description: "Track monthly revenue trends and projections.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'payment-tracking': {
    component: PaymentTrackingWidget,
    title: "Payment Tracking",
    icon: <HandCoins className="w-5 h-5" />,
    description: "Monitor payment statuses and schedules.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'performance-metrics': {
    component: PerformanceMetricsWidget,
    title: "Performance Metrics",
    icon: <ActivityIcon className="w-5 h-5" />,
    description: "Key performance indicators and metrics dashboard.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },
  'quick-stats': {
    component: QuickStatsWidget,
    title: "Quick Stats",
    icon: <ActivityIcon className="w-5 h-5" />,
    description: "Key statistics at a glance for quick overview.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'quick-tasks': {
    component: QuickTasksWidget,
    title: "Quick Tasks",
    icon: <ListTodo className="w-5 h-5" />,
    description: "Your most pressing tasks and to-dos.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'revenue-forecast': {
    component: RevenueForecastWidget,
    title: "Revenue Forecast",
    icon: <LineChartIcon className="w-5 h-5" />,
    description: "Future revenue projections and financial outlook.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'system-status': {
    component: SystemStatusWidget,
    title: "System Status",
    icon: <Settings className="w-5 h-5" />,
    description: "Real-time status and health of the Agency OS platform.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'time-tracking': {
    component: TimeTrackingWidget,
    title: "Time Tracking",
    icon: <ClockIcon className="w-5 h-5" />,
    description: "Monitor time spent on projects and tasks.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'upcoming-deadlines': {
    component: UpcomingDeadlinesWidget,
    title: "Upcoming Deadlines",
    icon: <CalendarDays className="w-5 h-5" />,
    description: "Important project deadlines and milestones.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'opportunity-radar': {
    component: OpportunityRadarWidget,
    title: "Opportunity Radar",
    icon: <Radar className="w-5 h-5" />,
    description: "AI-powered discovery of market trends and insights.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'talent-spotlight': {
    component: TalentSpotlightWidget,
    title: "Talent Spotlight",
    icon: <UserCheck className="w-5 h-5" />,
    description: "Highlighting top influencer performance and growth.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
};