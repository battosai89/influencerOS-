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
  type LucideIcon
} from 'lucide-react';

export type Widget = {
  id: string;
  component: string;
  title: string;
  icon: LucideIcon;
  description: string;
  defaultSpan: number;
  category: string;
  config?: Record<string, unknown>;
};

export const WIDGET_REGISTRY: Record<string, Widget> = {
  'command-center': {
    id: 'command-center',
    component: 'CommandCenterWidget',
    title: 'Command Center',
    icon: Command,
    description: 'Central command and control for your agency operations',
    defaultSpan: 3,
    category: 'Essential Metrics'
  },
  'quick-stats': {
    id: 'quick-stats',
    component: 'QuickStatsWidget',
    title: 'Quick Stats',
    icon: BarChartBig,
    description: 'Quick overview of key metrics',
    defaultSpan: 1,
    category: 'Essential Metrics'
  },
  'live-campaigns': {
    id: 'live-campaigns',
    component: 'LiveCampaignsWidget',
    title: 'Active Campaigns',
    icon: Activity,
    description: 'Overview of currently running campaigns',
    defaultSpan: 1,
    category: 'Campaign Intelligence'
  },
  'content-velocity': {
    id: 'content-velocity',
    component: 'ContentVelocityWidget',
    title: 'Content Velocity',
    icon: TrendingUp,
    description: 'Content creation and delivery metrics',
    defaultSpan: 1,
    category: 'Analytics & Info'
  },
  'monthly-revenue': {
    id: 'monthly-revenue',
    component: 'MonthlyRevenueWidget',
    title: 'Monthly Revenue',
    icon: CircleDollarSign,
    description: 'Monthly recurring and total revenue tracking',
    defaultSpan: 1,
    category: 'Financial & Revenue'
  },
  'creator-roster': {
    id: 'creator-roster',
    component: 'CreatorRosterWidget',
    title: 'Creator Roster',
    icon: Users,
    description: 'Active and available content creators',
    defaultSpan: 1,
    category: 'Creator & Relationship'
  },
  'quick-tasks': {
    id: 'quick-tasks',
    component: 'QuickTasksWidget',
    title: 'Quick Tasks',
    icon: ListTodo,
    description: 'Priority tasks and action items',
    defaultSpan: 1,
    category: 'Utility'
  },
  'campaign-performance': {
    id: 'campaign-performance',
    component: 'CampaignPerformanceWidget',
    title: 'Campaign Performance',
    icon: BarChart3,
    description: 'Key performance metrics for campaigns',
    defaultSpan: 2,
    category: 'Campaign Intelligence'
  },
  'creator-satisfaction': {
    id: 'creator-satisfaction',
    component: 'CreatorSatisfactionWidget',
    title: 'Creator Satisfaction',
    icon: Heart,
    description: 'Creator happiness and retention metrics',
    defaultSpan: 1,
    category: 'Creator & Relationship'
  },
  'revenue-forecast': {
    id: 'revenue-forecast',
    component: 'RevenueForecastWidget',
    title: 'Revenue Forecast',
    icon: LineChart,
    description: 'Projected revenue and financial trends',
    defaultSpan: 2,
    category: 'Financial & Revenue'
  },
  'upcoming-deadlines': {
    id: 'upcoming-deadlines',
    component: 'UpcomingDeadlinesWidget',
    title: 'Upcoming Deadlines',
    icon: Calendar,
    description: 'Critical dates and deadlines',
    defaultSpan: 1,
    category: 'Utility'
  },
  'content-quality': {
    id: 'content-quality',
    component: 'ContentQualityWidget',
    title: 'Content Quality',
    icon: Star,
    description: 'Content quality metrics and trends',
    defaultSpan: 1,
    category: 'Analytics & Info'
  },
  'ai-insights': {
    id: 'ai-insights',
    component: 'AIInsightsWidget',
    title: 'AI Insights',
    icon: Sparkles,
    description: 'AI-powered analytics and recommendations',
    defaultSpan: 2,
    category: 'Intelligent Insights'
  },
  'contract-status': {
    id: 'contract-status',
    component: 'ContractStatusWidget',
    title: 'Contract Status',
    icon: FileText,
    description: 'Active and pending contracts overview',
    defaultSpan: 1,
    category: 'Essential Metrics'
  },
  'payment-tracking': {
    id: 'payment-tracking',
    component: 'PaymentTrackingWidget',
    title: 'Payment Tracking',
    icon: Wallet,
    description: 'Payment status and financial tracking',
    defaultSpan: 1,
    category: 'Financial & Revenue'
  },
  'campaign-alerts': {
    id: 'campaign-alerts',
    component: 'CampaignAlertsWidget',
    title: 'Campaign Alerts',
    icon: AlertCircle,
    description: 'Important campaign notifications and alerts',
    defaultSpan: 1,
    category: 'Campaign Intelligence'
  },
  'performance-metrics': {
    id: 'performance-metrics',
    component: 'PerformanceMetricsWidget',
    title: 'Performance Metrics',
    icon: PieChart,
    description: 'Key performance indicators and metrics',
    defaultSpan: 2,
    category: 'Analytics & Info'
  },
  'creator-messages': {
    id: 'creator-messages',
    component: 'CreatorMessagesWidget',
    title: 'Creator Messages',
    icon: MessageSquare,
    description: 'Recent messages and communications',
    defaultSpan: 1,
    category: 'Creator & Relationship'
  },
  'goal-tracking': {
    id: 'goal-tracking',
    component: 'GoalTrackingWidget',
    title: 'Goal Tracking',
    icon: Flag,
    description: 'Progress tracking for agency goals',
    defaultSpan: 1,
    category: 'Essential Metrics'
  },
  'time-tracking': {
    id: 'time-tracking',
    component: 'TimeTrackingWidget',
    title: 'Time Tracking',
    icon: Clock,
    description: 'Time allocation and productivity metrics',
    defaultSpan: 1,
    category: 'Utility'
  },
  'system-status': {
    id: 'system-status',
    component: 'SystemStatusWidget',
    title: 'System Status',
    icon: Settings,
    description: 'System health and status overview',
    defaultSpan: 1,
    category: 'Utility'
  }
};