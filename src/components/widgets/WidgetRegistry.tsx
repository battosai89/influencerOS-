import React from 'react';
import {
  Terminal, TrendingUp, ArrowRightLeft, Users, DollarSign, StickyNote,
  AlertTriangle, CalendarCheck, MessageSquareWarning, Sparkles, AlertCircle,
  Activity, Rocket, Radar, UserCheck, GaugeCircle, Clock, FileText,
  UserPlus, KanbanSquare, ClipboardX, ListTodo, FileWarning, History,
  PieChart, LineChart, CheckSquare, CalendarDays, Star, Smile, Layers,
  Percent, Landmark, HandCoins, FileClock, Goal, CandlestickChart,
  Briefcase, Wallet, Target, ListFilter, Award, CalendarClock, FolderKanban,
  HeartHandshake, MapPin, LayoutGrid, GanttChartSquare, ClipboardCheck,
  BarChartHorizontal, Timer, Shapes, CalendarRange, CircleDollarSign,
  BarChartBig, CheckCircle2, Users2, Lightbulb, UserCog, ShieldAlert,
  Zap, Signal, Telescope, Paintbrush, HeartCrack, Scaling, LayoutDashboard,
  PlusSquare, Info, TrendingDown, Move, XCircle, ChevronLeft, ChevronRight,
  X, Plus, Layout, GripVertical, ArrowUpRight, ArrowDownRight, CheckCircle,
  Eye, TrendingUp as TrendingUpIcon, Calendar as CalendarIcon, MessageSquare,
  BarChart, Zap as ZapIcon, Target as TargetIcon, Filter, Settings, Home
} from 'lucide-react';
import useStore from '@/hooks/useStore';

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

import { WidgetConfig } from '@/data/widgets';

const CommandCenterWidgetComponent: React.FC = () => {
  const { contracts, campaigns, tasks } = useStore();
  const actionItems = [
    {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
      title: "Overdue Task",
      description: "Review Campaign Y Analytics",
      link: "/tasks"
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />,
      title: "Upcoming Meeting",
      description: "Client X Pitch (Tomorrow, 10 AM)",
      link: "/calendar"
    },
    {
      icon: <MessageSquareWarning className="w-5 h-5 text-purple-500 flex-shrink-0" />,
      title: "3 Unread Messages",
      description: "Awaiting your response",
      link: "/inbox"
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-3">
        {actionItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg hover:bg-brand-bg/50 cursor-pointer transition-colors">
            {item.icon}
            <div>
              <p className="font-semibold text-brand-text-primary text-sm">{item.title}</p>
              <p className="text-xs text-brand-text-secondary">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around text-center border-t border-brand-border pt-4 mt-4">
        <div>
          <p className="text-2xl font-bold text-brand-primary">{contracts.filter(c => c.status === 'Pending').length}</p>
          <p className="text-xs text-brand-text-secondary">Pending Contracts</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-brand-primary">{campaigns.length}</p>
          <p className="text-xs text-brand-text-secondary">Active Campaigns</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-brand-primary">{tasks.filter(t => t.status === 'pending').length}</p>
          <p className="text-xs text-brand-text-secondary">Open Tasks</p>
        </div>
      </div>
    </div>
  );
};

const LiveCampaignsWidgetComponent: React.FC = () => {
  const { campaigns, getBrand } = useStore();
  const liveCampaigns = campaigns.slice(0, 4);

  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    return ((now - startDate) / (endDate - startDate)) * 100;
  };

  return (
    <div className="space-y-4">
      {liveCampaigns.map(c => {
        const brand = getBrand(c.brandId);
        const progress = calculateProgress(c.startDate, c.endDate);
        return (
          <div key={c.id}>
            <div className="flex justify-between items-center mb-1.5 text-sm">
              <div className="flex items-center gap-2">
                <img src={brand?.logoUrl} alt={brand?.name} className="w-5 h-5 rounded-full" />
                <span className="font-semibold text-brand-text-primary">{c.name}</span>
              </div>
              <span className={`font-bold ${c.roi > 200 ? 'text-green-500' : 'text-yellow-500'}`}>{c.roi}% ROI</span>
            </div>
            <div className="w-full bg-brand-bg rounded-full h-2">
              <div className="bg-gradient-to-r from-brand-insight to-brand-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FinancialOverviewWidgetComponent: React.FC = () => {
  const { transactions } = useStore();

  const { totalIncome, totalExpenses, netProfit } = React.useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netProfit: income - expenses
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-3 gap-4 text-center h-full content-center">
      <div className="bg-brand-bg p-3 rounded-lg">
        <p className="text-xs text-brand-text-secondary">Total Revenue</p>
        <p className="font-bold text-lg text-green-500">{formatCurrency(totalIncome)}</p>
      </div>
      <div className="bg-brand-bg p-3 rounded-lg">
        <p className="text-xs text-brand-text-secondary">Total Expenses</p>
        <p className="font-bold text-lg text-red-500">{formatCurrency(totalExpenses)}</p>
      </div>
      <div className="bg-brand-bg p-3 rounded-lg">
        <p className="text-xs text-brand-text-secondary">Net Profit</p>
        <p className={`font-bold text-lg ${netProfit >= 0 ? 'text-brand-text-primary' : 'text-red-500'}`}>
          {formatCurrency(netProfit)}
        </p>
      </div>
    </div>
  );
};

export const WidgetRegistry: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Object.entries(WIDGET_REGISTRY).map(([key, widget]) => (
        <div key={key} className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold">{widget.title}</h3>
          <p className="text-sm text-gray-500">{widget.description}</p>
          <p className="text-xs text-gray-400">Category: {widget.category}</p>
          <p className="text-xs text-gray-400">Default Span: {widget.defaultSpan}</p>
        </div>
      ))}
    </div>
  );
};

// Run diagnostic on module load
if (typeof window !== 'undefined') {
  // debugWidgetRegistration();
}

export const WIDGET_REGISTRY: { [key: string]: WidgetConfig } = {
  // Essential Analytics Widgets
  'command-center': {
    component: CommandCenterWidgetComponent,
    title: "Command Center",
    icon: <Terminal className="w-5 h-5" />,
    description: "Your daily action items and key stats at a glance.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'live-campaigns': {
    component: LiveCampaignsWidgetComponent,
    title: "Live Campaigns",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Track progress and ROI of your active campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'financial-overview': {
    component: FinancialOverviewWidgetComponent,
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
          <p className="text-brand-text-secondary mt-2">Active Creators</p>
        </div>
      );
    },
    title: "Total Active Creators",
    icon: <Users className="w-5 h-5" />,
    description: "Count of all active creators on your roster.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },

  'monthly-recurring-revenue': {
    component: () => {
      const { contracts } = useStore();
      const mrr = React.useMemo(() => {
        return contracts
          .filter(c => c.status === 'Signed' && c.endDate && c.dateSigned)
          .reduce((total, c) => {
            const startDate = new Date(c.dateSigned!);
            const endDate = new Date(c.endDate!);
            const durationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            if (durationMonths > 0) {
              return total + c.value / durationMonths;
            }
            return total;
          }, 0);
      }, [contracts]);

      return (
        <div className="flex flex-col h-full justify-center items-center text-center">
          <p className="text-5xl font-bold text-brand-text-primary">
            {mrr.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
          </p>
          <p className="text-brand-text-secondary mt-2">Estimated MRR</p>
        </div>
      );
    },
    title: "Monthly Recurring Revenue",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Estimated MRR from active, signed contracts.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },

  // Core Business Metrics Widgets
  'active-campaigns-metric': {
    component: ActiveCampaignsMetricWidget,
    title: "Active Campaigns",
    icon: <Activity className="w-5 h-5" />,
    description: "Track active and completed campaigns with key metrics.",
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'revenue-by-client': {
    component: RevenueByClientWidget,
    title: "Revenue by Client",
    icon: <Users className="w-5 h-5" />,
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
    icon: <Clock className="w-5 h-5" />,
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
    icon: <Sparkles className="w-5 h-5" />,
    description: "AI-powered insights and recommendations for your campaigns.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'campaign-alerts': {
    component: CampaignAlertsWidget,
    title: "Campaign Alerts",
    icon: <AlertCircle className="w-5 h-5" />,
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
    icon: <FileText className="w-5 h-5" />,
    description: "Overview of all contract statuses and progress.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'creator-messages': {
    component: CreatorMessagesWidget,
    title: "Creator Messages",
    icon: <MessageSquare className="w-5 h-5" />,
    description: "Recent messages and communications with creators.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'creator-roster': {
    component: CreatorRosterWidget,
    title: "Creator Roster",
    icon: <Users className="w-5 h-5" />,
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
    icon: <Target className="w-5 h-5" />,
    description: "Monitor progress towards your business goals.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'monthly-revenue': {
    component: MonthlyRevenueWidget,
    title: "Monthly Revenue",
    icon: <TrendingUp className="w-5 h-5" />,
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
    icon: <Activity className="w-5 h-5" />,
    description: "Key performance indicators and metrics dashboard.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },
  'quick-stats': {
    component: QuickStatsWidget,
    title: "Quick Stats",
    icon: <Activity className="w-5 h-5" />,
    description: "Key statistics at a glance for quick overview.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'quick-tasks': {
    component: QuickTasksWidget,
    title: "Quick Tasks",
    icon: <ListTodo className="w-5 h-5" />,
    description: "Manage your most immediate tasks and priorities.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'revenue-forecast': {
    component: RevenueForecastWidget,
    title: "Revenue Forecast",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "AI-powered revenue forecasting and predictions.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'system-status': {
    component: SystemStatusWidget,
    title: "System Status",
    icon: <Eye className="w-5 h-5" />,
    description: "Monitor system health and operational status.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'time-tracking': {
    component: TimeTrackingWidget,
    title: "Time Tracking",
    icon: <Clock className="w-5 h-5" />,
    description: "Track time spent on projects and tasks.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },
  'upcoming-deadlines': {
    component: UpcomingDeadlinesWidget,
    title: "Upcoming Deadlines",
    icon: <CalendarIcon className="w-5 h-5" />,
    description: "Important deadlines and upcoming milestones.",
    defaultSpan: 3,
    category: 'Analytics & Info'
  },

  // Financial Overview Widget (from dashboard/widgets directory)
  'financial-overview-alt': {
    component: FinancialOverviewWidget,
    title: "Financial Overview (Alt)",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    description: "Alternative financial overview with detailed metrics.",
    defaultSpan: 6,
    category: 'Analytics & Info'
  },
};