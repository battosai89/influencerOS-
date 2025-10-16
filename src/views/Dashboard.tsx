import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import SkeletonLoader from '../components/SkeletonLoader';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import notificationService from '../services/notificationService';

import { 
    Terminal, TrendingUp, Rocket, Radar, UserCheck, GaugeCircle, Clock, FileText,
    ArrowRightLeft, Plus, XCircle, AlertTriangle, CalendarCheck, MessageSquareWarning, ArrowUpRight, ArrowDownRight,
    UserPlus, KanbanSquare, ClipboardX, ListTodo, FileWarning, History, PieChart, LineChart, Move, Layout, StickyNote, CheckSquare, CalendarDays, ChevronLeft, ChevronRight, X,
    Users, DollarSign, Star, Smile, Layers, Percent, Activity,
    Landmark, HandCoins, FileClock, Goal, CandlestickChart, Briefcase, Wallet, Target, ListFilter,
    Award, CalendarClock, FolderKanban, HeartHandshake, MapPin, LayoutGrid,
    GanttChartSquare, ClipboardCheck, BarChartHorizontal, Timer, Shapes, CalendarRange, CircleDollarSign, BarChartBig, CheckCircle2, Users2,
    Lightbulb, UserCog, ShieldAlert, Zap, Signal, Telescope, Paintbrush, HeartCrack, Scaling, LayoutDashboard, PlusSquare
} from 'lucide-react';
import { Influencer, Brand, ContentPiece, Transaction, Invoice, DashboardTemplate, DashboardLayoutItem, Lead } from '../types';
import * as d3 from 'd3';
import MagicBento from '../components/MagicBento';
import Image from 'next/image';

// --- WIDGETS ---
// All-new, redesigned widgets for a more modern and insightful dashboard.

const CommandCenterWidget: React.FC = () => {
    const { contracts, campaigns, tasks } = useStore();
    const actionItems = [
        { icon: <AlertTriangle className="w-5 h-5 text-brand-warning flex-shrink-0" />, title: "Overdue Task", description: "Review Campaign Y Analytics", link: "/tasks" },
        { icon: <CalendarCheck className="w-5 h-5 text-brand-insight flex-shrink-0" />, title: "Upcoming Meeting", description: "Client X Pitch (Tomorrow, 10 AM)", link: "/calendar" },
        { icon: <MessageSquareWarning className="w-5 h-5 text-brand-primary flex-shrink-0" />, title: "3 Unread Messages", description: "Awaiting your response", link: "/inbox" },
    ];
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="space-y-3">
                {actionItems.map((item, index) => (
                    <Link href={item.link} key={index} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg hover:bg-brand-bg/50 cursor-pointer transition-colors">
                        {item.icon}
                        <div>
                            <p className="font-semibold text-brand-text-primary text-sm">{item.title}</p>
                            <p className="text-xs text-brand-text-secondary">{item.description}</p>
                        </div>
                    </Link>
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

const LiveCampaignsWidget: React.FC = () => {
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
                                <Image src={brand?.logoUrl || '/placeholder-avatar.png'} alt={brand?.name || 'Brand logo'} className="w-5 h-5 rounded-full" width={20} height={20} />
                                <span className="font-semibold text-brand-text-primary">{c.name}</span>
                            </div>
                            <span className={`font-bold ${c.roi > 200 ? 'text-brand-success' : 'text-brand-warning'}`}>{c.roi}% ROI</span>
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

const ContentVelocityWidget: React.FC = () => {
    const { contentPieces } = useStore();
    // FIX: Corrected the content piece statuses to align with the `ContentPiece['status']` type definition.
    const stages: (ContentPiece['status'])[] = ['Submitted', 'Agency Review', 'Client Review', 'Approved'];
    const counts = stages.reduce((acc, stage) => {
        acc[stage] = contentPieces.filter(p => p.status === stage).length;
        return acc;
    }, {} as Record<ContentPiece['status'], number>);

    return (
        <div className="flex items-center h-full">
            <div className="w-full relative px-4">
                <div className="h-1 bg-brand-border rounded-full absolute top-1/2 -translate-y-1/2 left-0 right-0" />
                <div className="relative flex justify-between items-center">
                    {stages.map((stage) => (
                        <div key={stage} className="text-center relative">
                            <div className="w-10 h-10 rounded-full bg-brand-bg border-2 border-brand-primary flex items-center justify-center font-bold text-brand-primary z-10 relative shadow-md shadow-brand-primary/20">
                                {counts[stage]}
                            </div>
                            <p className="text-xs text-brand-text-secondary mt-3 whitespace-nowrap">{stage}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OpportunityRadarWidget: React.FC = () => {
    const trends = [
        { top: '20%', left: '70%' },
        { top: '65%', left: '15%' },
        { top: '50%', left: '80%' },
    ];
    return (
        <div className="h-full flex items-center justify-center">
            <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border border-brand-primary/20"></div>
                <div className="absolute inset-4 rounded-full border border-brand-primary/20"></div>
                <div className="absolute inset-8 rounded-full border border-brand-primary/20"></div>
                <div className="absolute w-full h-px bg-gradient-to-l from-transparent via-brand-insight to-transparent animate-[spin_4s_linear_infinite]"></div>
                {trends.map((trend, i) => (
                     <div key={i} className="absolute w-2.5 h-2.5 bg-brand-insight rounded-full" style={{ top: trend.top, left: trend.left }}></div>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs font-bold text-brand-insight">Scanning...</p>
                </div>
            </div>
        </div>
    );
};

const TalentSpotlightWidget: React.FC = () => {
    const { influencers } = useStore();
    const topInfluencer = [...influencers].sort((a,b) => b.engagementRate - a.engagementRate)[0];

    if (!topInfluencer) {
        return (
            <div className="flex flex-col h-full items-center justify-center text-brand-text-secondary">
                <p className="text-sm">No influencers available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-4">
                <Image src={topInfluencer.avatarUrl || '/default-avatar.jpg'} alt={topInfluencer.name} className="w-16 h-16 rounded-full border-2 border-brand-primary" width={64} height={64}/>
                <div>
                    <p className="text-lg font-bold text-brand-text-primary">{topInfluencer.name}</p>
                    <p className="text-sm text-brand-text-secondary">{topInfluencer.platform} Creator</p>
                </div>
            </div>
            <div className="flex-grow flex flex-col justify-center mt-4">
                <p className="text-xs text-brand-text-secondary">Follower Growth (30d)</p>
                <div className="h-16 mt-2 flex items-end gap-1">
                    {[3,5,4,6,8,7,9].map((h, i) => <div key={i} className="w-full bg-brand-primary/50 rounded-t-sm" style={{height: `${h*10}%`}}></div>)}
                </div>
            </div>
        </div>
    );
};

const ClientHealthWidget = () => {
    const clients: { name: string; health: number }[] = [
        { name: 'Aura Beauty', health: 92 },
        { name: 'GadgetFlow', health: 85 },
        { name: 'Wanderlust', health: 65 },
    ];
    return (
        <div className="flex justify-around items-center h-full text-center">
            {clients.map(client => (
                <div key={client.name}>
                    <div className="relative w-24 h-24">
                         <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="stroke-current text-brand-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                            <path className={`stroke-current ${client.health > 80 ? 'text-brand-success' : client.health > 60 ? 'text-brand-warning' : 'text-red-500'}`} strokeDasharray={`${client.health}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-brand-text-primary">{client.health}</span>
                            <span className="text-xs">Health</span>
                        </div>
                    </div>
                    <p className="text-xs text-brand-text-secondary mt-2 font-semibold">{client.name}</p>
                </div>
            ))}
        </div>
    );
};

const ContractStatusWidget: React.FC = () => {
    const { contracts } = useStore();
    const statusCounts = useMemo(() => {
        return contracts.reduce<Record<string, number>>((acc, contract) => {
            acc[contract.status] = (acc[contract.status] || 0) + 1;
            return acc;
        }, {});
    }, [contracts]);

    return (
        <div className="grid grid-cols-2 gap-4 text-center h-full content-center">
            <div>
                <p className="text-3xl font-bold text-brand-success">{statusCounts['Signed'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Signed</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-brand-warning">{statusCounts['Pending'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Pending</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-brand-text-primary/70">{statusCounts['Draft'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Draft</p>
            </div>
             <div>
                <p className="text-3xl font-bold text-red-500">{statusCounts['Expired'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Expired</p>
            </div>
        </div>
    );
};

const UpcomingRenewalsWidget: React.FC = () => {
    const { contracts, getInfluencer, getBrand } = useStore();
    const upcomingRenewals = useMemo(() => {
        const today = new Date();
        return contracts
            .filter(c => c.status === 'Signed' && c.endDate)
            .map(c => {
                const endDate = new Date(c.endDate!);
                const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return { ...c, daysLeft, influencer: getInfluencer(c.influencerId), brand: getBrand(c.brandId) };
            })
            .filter(c => c.daysLeft > 0 && c.daysLeft <= 90)
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 3);
    }, [contracts, getInfluencer, getBrand]);

    return (
        <>
            {upcomingRenewals.length > 0 ? (
                <ul className="space-y-3">
                    {upcomingRenewals.map(contract => (
                        <li key={contract.id} className="flex items-center justify-between text-sm">
                            <div>
                                <p className="font-semibold text-brand-text-primary truncate">{contract.influencer?.name}</p>
                                <p className="text-xs text-brand-text-secondary">{contract.brand?.name}</p>
                            </div>
                            <span className={`font-bold px-2 py-1 rounded-md text-xs ${
                                contract.daysLeft <= 30 ? 'bg-red-500/20 text-red-400' :
                                contract.daysLeft <= 60 ? 'text-brand-warning bg-brand-warning/20' : 'text-brand-text-secondary'
                            }`}>
                                {contract.daysLeft} days
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-brand-text-secondary text-center h-full flex items-center justify-center">No renewals in 90 days.</p>
            )}
        </>
    );
};

const FinancialOverviewWidget: React.FC = () => {
    const { transactions } = useStore();
    const svgRef = useRef<SVGSVGElement>(null);

    const { totalIncome, totalExpenses, netProfit, monthlyData } = useMemo(() => {
        const income = d3.sum(transactions.filter(t => t.type === 'income'), (t: Transaction) => t.amount) || 0;
        const expenses = d3.sum(transactions.filter(t => t.type === 'expense'), (t: Transaction) => t.amount) || 0;
        
        const data = d3.rollups(
            transactions,
            v => d3.sum(v, (d: Transaction) => d.amount) || 0,
            (d: Transaction) => `${new Date(d.date).getFullYear()}-${String(new Date(d.date).getMonth() + 1).padStart(2, '0')}`, // YYYY-MM
            (d: Transaction) => d.type
        ).sort(([a], [b]) => d3.ascending(a, b));

        const formattedMonthly = data.map(([month, types]) => {
            const incomeEntry = types.find(([type]) => type === 'income');
            const expenseEntry = types.find(([type]) => type === 'expense');
            return {
                month: month,
                income: incomeEntry ? incomeEntry[1] : 0,
                expenses: expenseEntry ? expenseEntry[1] : 0,
            };
        });

        return {
            totalIncome: income,
            totalExpenses: expenses,
            netProfit: income - expenses,
            monthlyData: formattedMonthly,
        };
    }, [transactions]);
    
    useEffect(() => {
        if (!monthlyData.length || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        const margin = { top: 10, right: 0, bottom: 20, left: 0 };
        const width = svg.node()!.parentElement!.getBoundingClientRect().width - margin.left - margin.right;
        const height = 150 - margin.top - margin.bottom;

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(monthlyData.map(d => d.month))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, d3.max(monthlyData, d => Math.max(d.income, d.expenses))!])
            .nice()
            .range([height, 0]);

        g.selectAll(".bar-income")
            .data(monthlyData)
            .join("rect")
            .attr("class", "bar-income")
            .attr("x", d => x(d.month)!)
            .attr("y", d => y(d.income))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y(d.income))
            .attr("fill", "var(--color-success)");

        g.selectAll(".bar-expense")
            .data(monthlyData)
            .join("rect")
            .attr("class", "bar-expense")
            .attr("x", d => (x(d.month) || 0) + x.bandwidth() / 2)
            .attr("y", d => y(d.expenses))
            .attr("width", x.bandwidth() / 2)
            .attr("height", d => height - y(d.expenses))
            .attr("fill", "var(--color-warning)");

        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat((d: string) => d3.timeFormat("%b")(new Date(d + '-02'))))
            .selectAll("text")
            .style("fill", "var(--color-text-secondary)");
            
        g.selectAll(".domain, .tick line").remove();

    }, [monthlyData]);


    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

    return (
        <div className="flex flex-col h-full space-y-4">
             <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-xs text-brand-text-secondary">Total Revenue</p>
                    <p className="font-bold text-lg text-brand-success">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-xs text-brand-text-secondary">Total Expenses</p>
                    <p className="font-bold text-lg text-brand-warning">{formatCurrency(totalExpenses)}</p>
                </div>
                 <div className="bg-brand-bg p-3 rounded-lg">
                    <p className="text-xs text-brand-text-secondary">Net Profit</p>
                    <p className={`font-bold text-lg ${netProfit >= 0 ? 'text-brand-text-primary' : 'text-red-500'}`}>{formatCurrency(netProfit)}</p>
                </div>
            </div>
            <div>
                 <p className="text-sm font-semibold text-brand-text-primary mb-2">Monthly Cash Flow</p>
                 <svg ref={svgRef} width="100%" height="150"></svg>
            </div>
        </div>
    );
};

const NewLeadsWidget: React.FC = () => {
    const { influencers, brands, campaigns } = useStore();

    const newLeads = useMemo<Lead[]>(() => {
        const getCampaignForBrand = (brandId: string) => {
            return campaigns.find(c => c.brandId === brandId);
        };
        
        const iLeads = influencers.filter(i => i.status === 'lead').map(i => ({ type: 'Influencer' as const, ...i }));
        const bLeads = brands.map(b => ({ ...b, status: 'lead' as const })).filter(b => influencers.every(i => i.status !== 'signed' || getCampaignForBrand(b.id) === null)).map(b => ({ type: 'Brand' as const, ...b }));
        return [...iLeads, ...bLeads].slice(0, 4);
    }, [influencers, brands, campaigns]);
    
    return (
        <ul className="space-y-3">
            {newLeads.map(lead => {
                 const imageSrc = lead.type === 'Influencer' ? (lead as Influencer).avatarUrl : (lead as Brand).logoUrl;
                 return (
                     <li key={lead.id} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg">
                         <Image src={imageSrc || '/placeholder-avatar.png'} alt={lead.name} className="w-8 h-8 rounded-full" width={32} height={32}/>
                         <div>
                             <p className="font-semibold text-brand-text-primary text-sm">{lead.name}</p>
                             <p className="text-xs text-brand-text-secondary">{lead.type}</p>
                         </div>
                     </li>
                 );
            })}
        </ul>
    );
};

const ClientPipelineWidget: React.FC = () => {
    const { influencers } = useStore();
    const pipelineStages: Influencer['status'][] = ['lead', 'contacted', 'negotiating', 'signed'];
    const counts = pipelineStages.reduce((acc, stage) => {
        acc[stage] = influencers.filter(i => i.status === stage).length;
        return acc;
    }, {} as Record<Influencer['status'], number>);
    
    return (
        <div className="grid grid-cols-2 gap-4 h-full content-center">
            {pipelineStages.map(stage => (
                <div key={stage} className="bg-brand-bg p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-primary">{counts[stage] || 0}</p>
                    <p className="text-xs text-brand-text-secondary capitalize">{stage}</p>
                </div>
            ))}
        </div>
    );
};

const OverdueTasksWidget: React.FC = () => {
    const { tasks } = useStore();
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = useMemo(() => {
        return tasks.filter(t => t.status === 'pending' && t.dueDate < today).slice(0, 4);
    }, [tasks, today]);

    return (
        <ul className="space-y-3">
            {overdueTasks.map(task => (
                <li key={task.id} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-brand-warning flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-brand-text-primary text-sm">{task.title}</p>
                        <p className="text-xs text-brand-warning">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const TodaysAgendaWidget: React.FC = () => {
    const { tasks, events } = useStore();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todaysAgenda = useMemo(() => {
        const todaysTasks = tasks.filter(t => t.dueDate === todayStr && t.status === 'pending').map(t => ({ time: 'All Day', title: t.title, type: 'Task' }));
        const todaysEvents = events.filter(e => e.start.toISOString().split('T')[0] === todayStr).map(e => ({ time: e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}), title: e.title, type: 'Event' }));
        return [...todaysTasks, ...todaysEvents].slice(0, 4);
    }, [tasks, events, todayStr]);

    return (
        <ul className="space-y-3">
            {todaysAgenda.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-brand-text-secondary w-16 text-right">{item.time}</span>
                    <div className="h-full w-px bg-brand-border"></div>
                    <div>
                        <p className="font-semibold text-brand-text-primary text-sm">{item.title}</p>
                        <p className={`text-xs ${item.type === 'Task' ? 'text-brand-insight' : 'text-brand-primary'}`}>{item.type}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const OverdueInvoicesWidget: React.FC = () => {
    const { invoices, getBrand } = useStore();
    const overdueInvoices = useMemo(() => invoices.filter(inv => inv.status === 'Overdue').slice(0,3), [invoices]);
    
    return (
        <ul className="space-y-2">
            {overdueInvoices.map(inv => {
                const brand = getBrand(inv.brandId);
                return (
                    <li key={inv.id} className="flex justify-between items-center text-sm bg-brand-bg p-3 rounded-lg">
                        <div>
                            <p className="font-semibold text-brand-text-primary">{inv.invoiceNumber}</p>
                            <p className="text-xs text-brand-text-secondary">{brand?.name}</p>
                        </div>
                        <p className="font-bold text-brand-warning">{inv.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </li>
                );
            })}
        </ul>
    );
};

const RecentTransactionsWidget: React.FC = () => {
    const { transactions } = useStore();
    const recent = useMemo(() => [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4), [transactions]);
    
    return (
        <ul className="space-y-3">
            {recent.map(t => (
                <li key={t.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-brand-success"/> : <ArrowDownRight className="w-4 h-4 text-red-500"/>}
                        <div>
                             <p className="font-semibold text-brand-text-primary">{t.description}</p>
                             <p className="text-xs text-brand-text-secondary">{t.category}</p>
                        </div>
                    </div>
                    <p className={`font-bold ${t.type === 'income' ? 'text-brand-success' : 'text-red-500'}`}>
                        {t.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </li>
            ))}
        </ul>
    );
};

const PlatformPerformanceWidget: React.FC = () => {
    const { influencers } = useStore();
    const platformData = useMemo(() => {
      const counts = d3.rollup(influencers, (v: Influencer[]) => v.length, (i: Influencer) => i.platform);
      
      const total = influencers.length;
      const colors: Record<string, string> = { Instagram: '#E1306C', TikTok: '#00F2EA', YouTube: '#FF0000' };
        
      let cumulativePercent = 0;
      return Array.from(counts.entries(), ([name, value]: [string, number]) => {
            const percent = (value / total) * 100;
            const startAngle = (cumulativePercent / 100) * 360;
            cumulativePercent += percent;
            const endAngle = (cumulativePercent / 100) * 360;
            return { name, value, percent, color: colors[name] || '#A3A3A3', startAngle, endAngle };
        });
    }, [influencers]);

    return (
        <div className="flex items-center justify-center h-full gap-8">
            <div className="w-32 h-32 rounded-full" style={{
                background: `conic-gradient(${platformData.map(s => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`).join(', ')})`
            }}></div>
            <div className="space-y-2">
                {platformData.map((item) => (
                    <div key={item.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-brand-text-primary font-semibold">{item.name}</span>
                         <span className="text-sm text-brand-text-secondary ml-2">({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FollowerGrowthWidget: React.FC = () => {
    // Mock data as historical data isn't available
    const growthData = [
        { month: 'Jan', growth: 12000 },
        { month: 'Feb', growth: 15000 },
        { month: 'Mar', growth: 13000 },
        { month: 'Apr', growth: 18000 },
        { month: 'May', growth: 22000 },
        { month: 'Jun', growth: 25000 },
    ];
    const maxGrowth = Math.max(...growthData.map(d => d.growth));
    
    return (
        <div className="flex flex-col h-full justify-end">
             <p className="text-xs text-brand-text-secondary mb-2">Total Follower Growth (Last 6 Months)</p>
             <div className="w-full h-40 flex items-end justify-around gap-2 p-4 bg-brand-bg rounded-lg">
                {growthData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div className="w-full rounded-t-md transition-all duration-500 bg-brand-primary/80 hover:bg-brand-primary"
                            style={{ height: `${(item.growth / maxGrowth) * 100}%` }}
                            title={`${item.month}: ${item.growth.toLocaleString()}`}
                        ></div>
                        <p className="text-xs text-center mt-2 text-brand-text-secondary truncate">{item.month}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const NotesWidget: React.FC = () => {
    const { dashboardNotes, updateDashboardNotes } = useStore();
    const [note, setNote] = useState(dashboardNotes);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        setNote(dashboardNotes);
    }, [dashboardNotes]);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNote = e.target.value;
        setNote(newNote);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            updateDashboardNotes(newNote);
        }, 500); // Debounced save
    };
    
    return (
        <textarea 
            value={note} 
            onChange={handleNoteChange}
            placeholder="Jot down a quick note..."
            className="w-full h-full bg-transparent text-brand-text-secondary resize-none focus:outline-none placeholder:text-brand-text-secondary/70"
        />
    );
};

const TodoListWidget: React.FC = () => {
    const { tasks, addTask, updateTask } = useStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const pendingTasks = useMemo(() => {
        return tasks
            .filter(t => t.status === 'pending')
            .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5); // Show top 5 urgent tasks
    }, [tasks]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle.trim(),
                dueDate: new Date().toISOString().split('T')[0],
                status: 'pending'
            });
            setNewTaskTitle('');
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <ul className="space-y-2.5 flex-grow overflow-y-auto pr-2">
                {pendingTasks.map(task => (
                    <li key={task.id} className="flex items-center gap-2.5 text-sm group">
                        <input
                            type="checkbox"
                            checked={false} // Always unchecked for 'pending'
                            onChange={() => updateTask(task.id, { status: 'completed' })}
                            className="form-checkbox h-4 w-4 rounded-sm bg-brand-bg border-brand-border text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <span className="text-brand-text-primary group-hover:line-through cursor-pointer" onClick={() => updateTask(task.id, { status: 'completed' })}>
                            {task.title}
                        </span>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddTask} className="mt-auto pt-2 border-t border-brand-border flex gap-2">
                <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a quick task..."
                    className="flex-grow bg-transparent text-sm focus:outline-none text-brand-text-primary placeholder:text-brand-text-secondary"
                />
                <button type="submit" className="text-brand-primary hover:text-brand-accent disabled:opacity-50" disabled={!newTaskTitle.trim()}>
                    <Plus className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

const CalendarWidget: React.FC = () => {
    const { events } = useStore();
    const [currentDate, setCurrentDate] = useState(new Date());

    const { calendarDays, monthYear } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const eventDays = new Set<string>();
        events.forEach(event => {
            const eventDate = new Date(event.start);
            if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
                eventDays.add(eventDate.toISOString().split('T')[0]);
            }
        });

        const today = new Date();
        const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-start-${i}`}></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dayStr = dayDate.toISOString().split('T')[0];
            const hasEvent = eventDays.has(dayStr);
            const isToday = isSameDay(dayDate, today);

            days.push(
                <div key={day} className={`relative w-8 h-8 flex items-center justify-center text-xs rounded-full ${isToday ? 'bg-brand-primary text-white font-bold' : 'text-brand-text-secondary'}`}>
                    {day}
                    {hasEvent && !isToday && <div className="absolute bottom-1 w-1.5 h-1.5 bg-brand-insight rounded-full"></div>}
                </div>
            );
        }
        return { 
            calendarDays: days, 
            monthYear: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
        };
    }, [currentDate, events]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <button onClick={() => changeMonth(-1)} className="p-1 text-brand-text-secondary hover:text-brand-text-primary"><ChevronLeft className="w-5 h-5"/></button>
                <p className="font-semibold text-brand-text-primary text-sm">{monthYear}</p>
                <button onClick={() => changeMonth(1)} className="p-1 text-brand-text-secondary hover:text-brand-text-primary"><ChevronRight className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-bold text-brand-text-secondary pb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 place-items-center flex-grow">
                {calendarDays}
            </div>
        </div>
    );
};

// --- NEW ESSENTIAL METRICS WIDGETS ---

const TotalActiveCreatorsWidget: React.FC = () => {
    const { influencers } = useStore();
    const activeCreators = influencers.filter(i => i.status === 'active').length;
    const previousMonthCreators = activeCreators - 3; // Mock data for trend
    const growth = previousMonthCreators > 0 ? (((activeCreators - previousMonthCreators) / previousMonthCreators) * 100).toFixed(1) : 100;

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{activeCreators}</p>
            <p className="text-brand-text-secondary mt-2">Active Creators</p>
            <div className="mt-4 flex items-center text-brand-success">
                <ArrowUpRight className="w-5 h-5" />
                <p className="font-semibold">{growth}% from last month</p>
            </div>
        </div>
    );
};

const MonthlyRecurringRevenueWidget: React.FC = () => {
    const { contracts } = useStore();
    const mrr = useMemo(() => {
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
    const lastYearMRR = mrr * 0.8; // Mock YoY
    const yoyGrowth = lastYearMRR > 0 ? (((mrr - lastYearMRR) / lastYearMRR) * 100).toFixed(0) : 100;

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{mrr.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p className="text-brand-text-secondary mt-2">Estimated MRR</p>
            <div className="mt-4 flex items-center text-brand-success">
                <ArrowUpRight className="w-5 h-5" />
                <p className="font-semibold">{yoyGrowth}% YoY Growth</p>
            </div>
        </div>
    );
};

const ActiveCampaignsMetricWidget: React.FC = () => {
    const { campaigns } = useStore();
    const activeCampaigns = campaigns.filter(c => new Date(c.endDate) >= new Date());
    const calculateProgress = (start: string, end: string) => {
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();
        const now = new Date().getTime();
        if (now < startDate) return 0;
        if (now > endDate) return 100;
        return ((now - startDate) / (endDate - startDate)) * 100;
    };
    const avgCompletion = d3.mean(activeCampaigns, c => calculateProgress(c.startDate, c.endDate)) || 0;

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{activeCampaigns.length}</p>
            <p className="text-brand-text-secondary mt-2">Active Campaigns</p>
            <div className="w-full bg-brand-bg rounded-full h-2.5 mt-4">
                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${avgCompletion}%` }}></div>
            </div>
            <p className="text-xs text-brand-text-secondary mt-2">{avgCompletion.toFixed(0)}% Avg. Completion</p>
        </div>
    );
};

const CampaignSuccessRateWidget: React.FC = () => {
    const { campaigns } = useStore();
    const successfulCampaigns = campaigns.filter(c => c.roi > 100).length;
    const successRate = campaigns.length > 0 ? (successfulCampaigns / campaigns.length) * 100 : 0;
    const industryBenchmark = 75; // Mock

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
             <div className="relative w-32 h-32">
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="stroke-current text-brand-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                    <path className="stroke-current text-brand-success" strokeDasharray={`${successRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-brand-text-primary">{successRate.toFixed(0)}%</span>
                </div>
            </div>
            <p className="text-brand-text-secondary mt-2">Success Rate</p>
            <p className="text-xs text-brand-text-secondary mt-1">vs {industryBenchmark}% Benchmark</p>
        </div>
    );
};

const AverageCampaignROIWidget: React.FC = () => {
    const { campaigns } = useStore();
    const avgROI = d3.mean(campaigns, c => c.roi) || 0;
    
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{avgROI.toFixed(0)}%</p>
            <p className="text-brand-text-secondary mt-2">Average Campaign ROI</p>
            <div className="mt-4 flex items-center text-brand-success">
                <TrendingUp className="w-5 h-5" />
                <p className="font-semibold ml-1">Trending Up</p>
            </div>
        </div>
    );
};

const CreatorEngagementRateWidget: React.FC = () => {
    const { influencers } = useStore();
    const avgEngagement = d3.mean(influencers, i => i.engagementRate) || 0;
    const platformEngagement = d3.rollups(
        influencers,
        v => d3.mean(v, d => d.engagementRate),
        d => d.platform
    );

    return (
        <div className="flex flex-col h-full justify-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{avgEngagement.toFixed(1)}%</p>
            <p className="text-brand-text-secondary mt-2">Avg. Creator Engagement</p>
            <div className="mt-4 space-y-2 text-xs w-full px-4">
                {platformEngagement.map(([platform, rate]) => (
                    <div key={platform} className="flex justify-between items-center bg-brand-bg p-2 rounded-md">
                        <span className="font-semibold text-brand-text-primary">{platform}</span>
                        <span className="font-bold text-brand-insight">{(rate || 0).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ClientSatisfactionScoreWidget: React.FC = () => {
    const score = 8.7; // Mock data
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{score}<span className="text-4xl text-brand-text-secondary">/10</span></p>
            <p className="text-brand-text-secondary mt-2">Client Satisfaction (NPS)</p>
            <p className="text-xs text-brand-text-secondary mt-4 italic">&quot;Great communication!&quot;</p>
        </div>
    );
};

const PipelineValueWidget: React.FC = () => {
    const { contracts } = useStore();
    const pipelineValue = contracts
        .filter(c => c.status === 'Pending' || c.status === 'Draft')
        .reduce((sum, c) => sum + c.value, 0);

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{pipelineValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p className="text-brand-text-secondary mt-2">Pipeline Value</p>
            <p className="text-xs text-brand-text-secondary mt-1">(Draft & Pending Deals)</p>
        </div>
    );
};

const MonthlyProfitMarginWidget: React.FC = () => {
    const { transactions } = useStore();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const { income, expenses } = transactions.reduce((acc, t) => {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
            if (t.type === 'income') acc.income += t.amount;
            else acc.expenses += t.amount;
        }
        return acc;
    }, { income: 0, expenses: 0 });

    const profitMargin = income > 0 ? ((income - expenses) / income) * 100 : 0;
    
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
             <p className="text-6xl font-bold text-brand-text-primary">{profitMargin.toFixed(0)}%</p>
             <p className="text-brand-text-secondary mt-2">Monthly Profit Margin</p>
             <div className="mt-4 text-xs space-y-1">
                 <p className="text-brand-success">Income: {income.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
                 <p className="text-brand-warning">Costs: {expenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}</p>
             </div>
        </div>
    );
};

const TeamProductivityScoreWidget: React.FC = () => {
    const { tasks } = useStore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTasks = tasks.filter(t => new Date(t.dueDate) > thirtyDaysAgo);
    const completedTasks = recentTasks.filter(t => t.status === 'completed').length;
    const productivity = recentTasks.length > 0 ? (completedTasks / recentTasks.length) * 100 : 100;

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{productivity.toFixed(0)}%</p>
            <p className="text-brand-text-secondary mt-2">Team Productivity</p>
            <p className="text-xs text-brand-text-secondary mt-1">(Tasks completed in last 30d)</p>
        </div>
    );
};

// --- NEW FINANCIAL & REVENUE WIDGETS ---
const RevenueByClientWidget: React.FC = () => {
    const { transactions, getBrand } = useStore();
    const revenueByClient = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income' && t.brandId);
        const grouped = d3.group(income, d => d.brandId!);
        const totalRevenue = d3.sum(income, d => d.amount);

        return Array.from(grouped, ([brandId, transactions]) => ({
            brand: getBrand(brandId),
            revenue: d3.sum(transactions, t => t.amount),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)
        .map(item => ({...item, percentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0 }));
    }, [transactions, getBrand]);

    return (
        <div className="space-y-3">
            {revenueByClient.map(client => (
                <div key={client.brand?.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-semibold text-brand-text-primary">{client.brand?.name}</span>
                        <span className="text-brand-text-secondary">{client.revenue.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})}</span>
                    </div>
                    <div className="w-full bg-brand-bg rounded-full h-2.5">
                        <div className="bg-brand-primary h-2.5 rounded-full" style={{width: `${client.percentage}%`}} title={`${client.percentage.toFixed(1)}%`}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CreatorPaymentTrackerWidget: React.FC = () => {
    const { transactions, getInfluencer } = useStore();
    const pendingPayments = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense' && t.category === 'Influencer Payouts' && t.status === 'Pending' && t.influencerId)
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4);
    }, [transactions]);
    
    return (
        <ul className="space-y-3">
            {pendingPayments.map(p => {
                const influencer = getInfluencer(p.influencerId!);
                return (
                    <li key={p.id} className="flex justify-between items-center text-sm bg-brand-bg p-3 rounded-lg">
                        <div>
                            <p className="font-semibold text-brand-text-primary">{influencer?.name}</p>
                            <p className="text-xs text-brand-text-secondary">Due: {new Date(p.date).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold text-brand-warning">{p.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </li>
                );
            })}
        </ul>
    );
};

const InvoiceStatusOverviewWidget: React.FC = () => {
    const { invoices } = useStore();
    const statusCounts = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            acc[inv.status] = (acc[inv.status] || 0) + 1;
            return acc;
        }, {} as Record<Invoice['status'], number>);
    }, [invoices]);
    
    return (
        <div className="grid grid-cols-3 gap-4 text-center h-full content-center">
            <div>
                <p className="text-3xl font-bold text-brand-success">{statusCounts['Paid'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Paid</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-brand-warning">{statusCounts['Pending'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Pending</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-red-500">{statusCounts['Overdue'] || 0}</p>
                <p className="text-sm text-brand-text-secondary">Overdue</p>
            </div>
        </div>
    );
};

const BudgetVsActualSpendWidget: React.FC = () => {
    const { campaigns, transactions } = useStore();
    const { totalBudget, totalSpend } = useMemo(() => {
        const totalBudget = d3.sum(campaigns, c => c.budget);
        const totalSpend = d3.sum(transactions.filter(t => t.type === 'expense' && t.campaignId), t => t.amount);
        return { totalBudget, totalSpend };
    }, [campaigns, transactions]);
    
    const utilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
    const isOverBudget = utilization > 100;

    return (
        <div className="flex flex-col h-full justify-center space-y-4">
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold text-brand-text-primary">Total Spend</span>
                    <span className={`text-2xl font-bold ${isOverBudget ? 'text-red-500' : 'text-brand-text-primary'}`}>{totalSpend.toLocaleString('en-US', {style:'currency', currency: 'USD', minimumFractionDigits: 0})}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-sm text-brand-text-secondary">Total Budget</span>
                    <span className="text-lg font-semibold text-brand-text-secondary">{totalBudget.toLocaleString('en-US', {style:'currency', currency: 'USD', minimumFractionDigits: 0})}</span>
                </div>
            </div>
             <div className="w-full bg-brand-bg rounded-full h-4">
                <div className={`${isOverBudget ? 'bg-red-500' : 'bg-brand-primary'} h-4 rounded-full`} style={{width: `${Math.min(utilization, 100)}%`}}></div>
            </div>
             <p className="text-xs text-brand-text-secondary text-center">{utilization.toFixed(0)}% Budget Utilized</p>
        </div>
    );
};

const CashFlowForecastWidget: React.FC = () => {
    const { transactions } = useStore(); // Simplified forecast based on recent trends
    const { monthlyIncome, monthlyExpenses } = useMemo(() => {
        const recentTransactions = transactions.filter(t => new Date(t.date) > new Date(new Date().setMonth(new Date().getMonth() - 3)));
        const avgIncome = d3.mean(recentTransactions.filter(t => t.type === 'income'), t => t.amount) || 5000;
        const avgExpense = d3.mean(recentTransactions.filter(t => t.type === 'expense'), t => t.amount) || 2000;
        return { monthlyIncome: avgIncome * 3, monthlyExpenses: avgExpense * 5 };
    }, [transactions]);

    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0});
    
    return (
        <div className="grid grid-cols-3 gap-4 text-center h-full content-center">
            <div>
                <p className="text-xl font-bold text-brand-primary">{formatCurrency(monthlyIncome - monthlyExpenses)}</p>
                <p className="text-xs text-brand-text-secondary">30-Day</p>
            </div>
             <div>
                <p className="text-xl font-bold text-brand-primary">{formatCurrency((monthlyIncome - monthlyExpenses) * 2)}</p>
                <p className="text-xs text-brand-text-secondary">60-Day</p>
            </div>
             <div>
                <p className="text-xl font-bold text-brand-primary">{formatCurrency((monthlyIncome - monthlyExpenses) * 3)}</p>
                <p className="text-xs text-brand-text-secondary">90-Day</p>
            </div>
        </div>
    );
};

const AverageDealSizeWidget: React.FC = () => {
    const { contracts } = useStore();
    const signedContracts = contracts.filter(c => c.status === 'Signed');
    const avgDealSize = d3.mean(signedContracts, c => c.value) || 0;
    const prevAvg = avgDealSize * 0.9; // Mock trend

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{avgDealSize.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})}</p>
            <p className="text-brand-text-secondary mt-2">Average Deal Size</p>
            <div className="mt-4 flex items-center text-brand-success">
                <ArrowUpRight className="w-5 h-5"/>
                <p className="font-semibold ml-1">vs {prevAvg.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})} prev.</p>
            </div>
        </div>
    );
};

const RevenueGrowthRateWidget: React.FC = () => {
    const { transactions } = useStore();
    const { mom, yoy } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income');
        const now = new Date();
        const currentMonthRevenue = d3.sum(income.filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()), t => t.amount);
        const lastMonthRevenue = d3.sum(income.filter(t => new Date(t.date).getMonth() === now.getMonth() - 1 && new Date(t.date).getFullYear() === now.getFullYear()), t => t.amount);
        const lastYearMonthRevenue = d3.sum(income.filter(t => new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear() - 1), t => t.amount);
        
        const mom = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : currentMonthRevenue > 0 ? 100 : 0;
        const yoy = lastYearMonthRevenue > 0 ? ((currentMonthRevenue - lastYearMonthRevenue) / lastYearMonthRevenue) * 100 : currentMonthRevenue > 0 ? 100 : 0;
        return { mom, yoy };
    }, [transactions]);
    
    return (
        <div className="grid grid-cols-2 gap-4 text-center h-full content-center divide-x divide-brand-border">
            <div>
                <p className={`text-3xl font-bold ${mom >= 0 ? 'text-brand-success' : 'text-red-500'}`}>{mom.toFixed(0)}%</p>
                <p className="text-sm text-brand-text-secondary">MoM Growth</p>
            </div>
             <div>
                <p className={`text-3xl font-bold ${yoy >= 0 ? 'text-brand-success' : 'text-red-500'}`}>{yoy.toFixed(0)}%</p>
                <p className="text-sm text-brand-text-secondary">YoY Growth</p>
            </div>
        </div>
    );
};

const ClientLifetimeValueWidget: React.FC = () => {
    const { transactions } = useStore();
    const clv = useMemo(() => {
        const totalRevenue = d3.sum(transactions.filter(t => t.type === 'income'), t => t.amount);
        const totalClients = new Set(transactions.filter(t => t.brandId).map(t => t.brandId)).size;
        return totalClients > 0 ? totalRevenue / totalClients : 0;
    }, [transactions]);
    
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{clv.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})}</p>
            <p className="text-brand-text-secondary mt-2">Average CLV</p>
            <p className="text-xs text-brand-text-secondary mt-1">Total revenue per client</p>
        </div>
    );
};

const CostPerAcquisitionWidget: React.FC = () => {
    const { transactions, contracts } = useStore();
    const cpa = useMemo(() => {
        const acquisitionCosts = d3.sum(transactions.filter(t => t.category === 'Marketing & Sales'), t => t.amount);
        const newClients = new Set(contracts.map(c => c.brandId)).size; // simplified: all clients are new
        return newClients > 0 ? acquisitionCosts / newClients : 0;
    }, [transactions, contracts]);
    
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{cpa.toLocaleString('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0})}</p>
            <p className="text-brand-text-secondary mt-2">Cost Per Acquisition</p>
            <p className="text-xs text-brand-text-secondary mt-1">Average cost to acquire a new client</p>
        </div>
    );
};

const ProfitByCampaignTypeWidget: React.FC = () => {
    const { campaigns, transactions } = useStore();
    const profitByCategory = useMemo(() => {
        const campaignProfits = campaigns.map(campaign => {
            const revenue = d3.sum(transactions.filter(t => t.campaignId === campaign.id && t.type === 'income'), t => t.amount);
            const costs = d3.sum(transactions.filter(t => t.campaignId === campaign.id && t.type === 'expense'), t => t.amount);
            return { category: campaign.category, profit: revenue - costs };
        });
        
        const grouped = d3.group(campaignProfits, d => d.category);
        return Array.from(grouped, ([category, values]) => ({
            category,
            profit: d3.sum(values, d => d.profit),
        })).sort((a,b) => b.profit - a.profit);
    }, [campaigns, transactions]);

    return (
        <div className="space-y-3">
            {profitByCategory.map(item => (
                <div key={item.category} className="flex justify-between items-center bg-brand-bg p-3 rounded-lg text-sm">
                    <span className="font-semibold text-brand-text-primary">{item.category}</span>
                    <span className={`font-bold ${item.profit >= 0 ? 'text-brand-success' : 'text-red-500'}`}>{item.profit.toLocaleString('en-US', {style:'currency',currency:'USD', minimumFractionDigits: 0})}</span>
                </div>
            ))}
        </div>
    );
};

// --- NEW CREATOR & RELATIONSHIP WIDGETS ---

const TopPerformingCreatorsWidget: React.FC = () => {
    const { influencers, campaigns } = useStore();
    const topPerformers = useMemo(() => {
        return influencers
            .map(influencer => {
                const relatedCampaigns = campaigns.filter(c => c.influencerIds.includes(influencer.id));
                const avgRoi = d3.mean(relatedCampaigns, c => c.roi) || 0;
                // Simple scoring: rating is most important, then engagement, then ROI
                const score = (influencer.rating * 5) + (influencer.engagementRate * 2) + (avgRoi / 100);
                return { ...influencer, score };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }, [influencers, campaigns]);

    return (
        <ul className="space-y-3">
            {topPerformers.map(inf => (
                <li key={inf.id} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg">
                    <Image src={inf.avatarUrl || '/default-avatar.jpg'} alt={inf.name} className="w-10 h-10 rounded-full" width={40} height={40}/>
                    <div className="flex-1">
                        <p className="font-semibold text-brand-text-primary text-sm">{inf.name}</p>
                        <p className="text-xs text-brand-text-secondary">{inf.niche}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current"/>
                        <span className="font-bold">{inf.rating.toFixed(1)}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const CreatorAvailabilityWidget: React.FC = () => {
    const { influencers } = useStore();
    const available = influencers.filter(i => i.availability === 'available').slice(0, 2);
    const booked = influencers.filter(i => i.availability === 'booked').slice(0, 2);

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            <div>
                <h4 className="text-sm font-semibold text-brand-success mb-2 text-center">Available</h4>
                <ul className="space-y-2">
                    {available.map(i => <li key={i.id} className="text-xs text-center bg-brand-bg p-2 rounded-md truncate">{i.name}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-brand-warning mb-2 text-center">Booked</h4>
                 <ul className="space-y-2">
                    {booked.map(i => <li key={i.id} className="text-xs text-center bg-brand-bg p-2 rounded-md truncate">{i.name}</li>)}
                </ul>
            </div>
        </div>
    );
};

const CreatorNicheDistributionWidget: React.FC = () => {
    const { influencers } = useStore();
    const nicheData = useMemo(() => {
        const counts = d3.rollup(influencers, v => v.length, d => d.niche);
        return Array.from(counts, ([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [influencers]);
    
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    return (
        <div className="space-y-2">
            {nicheData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors(index.toString()) }}></div>
                    <span className="font-semibold text-brand-text-primary flex-1">{item.name}</span>
                    <span className="text-brand-text-secondary font-bold">{item.value}</span>
                </div>
            ))}
        </div>
    );
};

const CreatorEngagementTrendsWidget: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const data = [3.2, 3.5, 4.1, 3.9, 4.5, 4.8]; // Mock data
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        
        const margin = { top: 10, right: 10, bottom: 20, left: 25 };
        const width = svg.node()!.parentElement!.clientWidth - margin.left - margin.right;
        const height = 120 - margin.top - margin.bottom;

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
        
        const x = d3.scalePoint().domain(d3.range(data.length).map(String)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(data)!]).range([height, 0]);

        const line = d3.line<number>().x((d, i) => x(String(i))!).y(d => y(d));
        
        g.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'var(--color-primary)')
          .attr('stroke-width', 2)
          .attr('d', line);
          
        g.append("g").call(d3.axisLeft(y).ticks(3).tickFormat(d => `${d}%`)).selectAll("text").style("fill", "var(--color-text-secondary)");
        g.selectAll(".domain, .tick line").remove();
    }, []);

    return (
        <div className="flex flex-col h-full">
            <p className="text-sm font-semibold text-brand-text-primary mb-2">Engagement Rate (6 Months)</p>
            <svg ref={svgRef} width="100%" height="120"></svg>
        </div>
    );
};

const NewCreatorOnboardingWidget: React.FC = () => {
    const { influencers } = useStore();
    const onboarding = influencers.filter(i => ['lead', 'contacted', 'negotiating', 'signed'].includes(i.status)).slice(0, 4);

    return (
        <ul className="space-y-3">
            {onboarding.map(inf => (
                <li key={inf.id} className="text-sm">
                    <p className="font-semibold text-brand-text-primary">{inf.name}</p>
                    <p className="text-xs text-brand-text-secondary capitalize">{inf.status}</p>
                </li>
            ))}
        </ul>
    );
};

const CreatorRatingSystemWidget: React.FC = () => {
    const { influencers } = useStore();
    const avgRating = d3.mean(influencers, i => i.rating) || 0;
    const topRated = [...influencers].sort((a,b) => b.rating - a.rating)[0];

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{avgRating.toFixed(1)}</p>
            <p className="text-brand-text-secondary mt-1">Average Rating</p>
            <div className="mt-4 text-xs bg-brand-bg p-2 rounded-lg">
                <p className="font-semibold text-brand-text-primary">Top Rated: {topRated.name} ({topRated.rating.toFixed(1)})</p>
            </div>
        </div>
    );
};

const BrandRelationshipHealthWidget: React.FC = () => {
    const { brands } = useStore();
    const topBrands = [...brands].sort((a,b) => b.satisfaction - a.satisfaction).slice(0,3);

    return (
        <ul className="space-y-3">
            {topBrands.map(brand => (
                <li key={brand.id} className="flex justify-between items-center text-sm bg-brand-bg p-3 rounded-lg">
                    <span className="font-semibold text-brand-text-primary">{brand.name}</span>
                    <span className={`font-bold ${brand.satisfaction > 90 ? 'text-brand-success' : 'text-brand-warning'}`}>{brand.satisfaction}%</span>
                </li>
            ))}
        </ul>
    );
};

const CreatorPaymentHistoryWidget: React.FC = () => {
    const { transactions, getInfluencer } = useStore();
    const payments = useMemo(() => {
        return transactions.filter(t => t.type === 'expense' && t.category === 'Influencer Payouts').slice(0, 4);
    }, [transactions]);
    
    return (
        <ul className="space-y-3">
            {payments.map(p => (
                 <li key={p.id} className="flex justify-between items-center text-sm">
                    <div>
                        <p className="font-semibold text-brand-text-primary">{getInfluencer(p.influencerId!)?.name}</p>
                        <p className="text-xs text-brand-text-secondary">{new Date(p.date).toLocaleDateString()}</p>
                    </div>
                    <p className="font-bold text-brand-warning">{p.amount.toLocaleString('en-US', {style:'currency',currency:'USD'})}</p>
                </li>
            ))}
        </ul>
    );
};

const CreatorPlatformMixWidget: React.FC = () => {
    return <PlatformPerformanceWidget />; // Reuse the existing component
};

const CreatorGeographicDistributionWidget: React.FC = () => {
    const { influencers } = useStore();
    const locations = useMemo(() => {
        const counts = d3.rollup(influencers, v => v.length, d => d.location.split(', ')[1]); // Group by country
        return Array.from(counts, ([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
    }, [influencers]);

    return (
         <ul className="space-y-3">
            {locations.map(loc => (
                <li key={loc.name} className="flex justify-between items-center text-sm bg-brand-bg p-3 rounded-lg">
                    <span className="font-semibold text-brand-text-primary">{loc.name}</span>
                    <span className="font-bold text-brand-insight">{loc.value} Creator{loc.value > 1 ? 's' : ''}</span>
                </li>
            ))}
        </ul>
    );
};


// --- NEW CAMPAIGN & PERFORMANCE WIDGETS ---

const CampaignTimelineViewWidget: React.FC = () => {
    const { campaigns } = useStore();
    const sortedCampaigns = useMemo(() => {
        return [...campaigns].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [campaigns]);

    const overallStart = d3.min(campaigns, c => new Date(c.startDate));
    const overallEnd = d3.max(campaigns, c => new Date(c.endDate));

    if (!overallStart || !overallEnd) return <p>No campaign data.</p>;

    const totalDuration = overallEnd.getTime() - overallStart.getTime();

    return (
        <div className="space-y-3 text-xs">
            {sortedCampaigns.map(campaign => {
                const campaignStart = new Date(campaign.startDate).getTime();
                const campaignEnd = new Date(campaign.endDate).getTime();
                const left = ((campaignStart - overallStart.getTime()) / totalDuration) * 100;
                const width = ((campaignEnd - campaignStart) / totalDuration) * 100;
                
                return (
                    <div key={campaign.id} className="relative h-8" title={`${campaign.name}: ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`}>
                        <div className="absolute top-0 bg-brand-primary/60 rounded-md h-full" style={{ left: `${left}%`, width: `${width}%` }}>
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-semibold truncate pr-2">{campaign.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ContentApprovalStatusWidget: React.FC = () => {
    const { contentPieces, getCampaign, getInfluencer } = useStore();
    const pending = contentPieces.filter(p => p.status === 'Client Review').slice(0, 4);

    return (
        <ul className="space-y-3">
            {pending.map(p => (
                <li key={p.id} className="bg-brand-bg p-3 rounded-lg text-sm">
                    <p className="font-semibold text-brand-text-primary truncate">{p.title}</p>
                    <p className="text-xs text-brand-text-secondary">
                        for <span className="font-semibold">{getCampaign(p.campaignId)?.name}</span> by <span className="font-semibold">{getInfluencer(p.influencerId)?.name}</span>
                    </p>
                </li>
            ))}
        </ul>
    );
};

const PlatformPerformanceComparisonWidget: React.FC = () => {
    const { campaigns } = useStore();
    const perfData = useMemo(() => {
        const data = { Instagram: 0, TikTok: 0, YouTube: 0 };
        campaigns.forEach(c => c.content.forEach(p => {
            if (p.performance) data[p.platform] += p.performance.views;
        }));
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [campaigns]);

    const maxViews = Math.max(...perfData.map(d => d.value));

    return (
        <div className="space-y-3">
            {perfData.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-semibold text-brand-text-primary">{item.name}</span>
                        <span className="text-brand-text-secondary">{item.value.toLocaleString()} views</span>
                    </div>
                    <div className="w-full bg-brand-bg rounded-full h-2.5">
                        <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(item.value / maxViews) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CampaignDeliveryTrackerWidget: React.FC = () => {
    const { contentPieces } = useStore();
    const onTime = contentPieces.filter(p => p.submissionDate && new Date(p.submissionDate) <= new Date(p.dueDate)).length;
    const totalSubmitted = contentPieces.filter(p => p.submissionDate).length;
    const deliveryRate = totalSubmitted > 0 ? (onTime / totalSubmitted) * 100 : 100;
    
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{deliveryRate.toFixed(0)}%</p>
            <p className="text-brand-text-secondary mt-2">On-Time Delivery</p>
            <p className="text-xs text-brand-text-secondary mt-1">{onTime} of {totalSubmitted} pieces submitted on time</p>
        </div>
    );
};

const EngagementRateByNicheWidget: React.FC = () => {
    const { influencers } = useStore();
    const nicheRates = useMemo(() => {
        const grouped = d3.group(influencers, d => d.niche);
        return Array.from(grouped, ([niche, infs]) => ({
            niche,
            rate: d3.mean(infs, i => i.engagementRate) || 0
        })).sort((a,b) => b.rate - a.rate);
    }, [influencers]);
    
    return (
        <ul className="space-y-3">
            {nicheRates.map(item => (
                <li key={item.niche} className="flex justify-between items-center text-sm bg-brand-bg p-3 rounded-lg">
                    <span className="font-semibold text-brand-text-primary">{item.niche}</span>
                    <span className="font-bold text-brand-insight">{item.rate.toFixed(1)}%</span>
                </li>
            ))}
        </ul>
    );
};

const SeasonalCampaignTrendsWidget: React.FC = () => {
    const { campaigns } = useStore();
    const seasonalData = useMemo(() => {
        const data = d3.rollup(campaigns, v => d3.sum(v, c => c.roi), c => new Date(c.startDate).getMonth());
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames.map((name, i) => ({ name, value: data.get(i) || 0 }));
    }, [campaigns]);

    const maxValue = d3.max(seasonalData, d => d.value) || 1;

    return (
        <div className="flex h-full items-end gap-2">
            {seasonalData.map(item => (
                <div key={item.name} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-brand-primary/80 rounded-t-md hover:bg-brand-primary" style={{ height: `${(item.value / maxValue) * 100}%` }} title={`${item.name}: ${item.value} total ROI`}></div>
                    <p className="text-xs text-center mt-2 text-brand-text-secondary">{item.name}</p>
                </div>
            ))}
        </div>
    );
};

const CampaignBudgetUtilizationWidget: React.FC = () => {
    const { campaigns, transactions } = useStore();
    const campaignBudgets = useMemo(() => {
        return campaigns.map(c => {
            const spent = d3.sum(transactions.filter(t => t.campaignId === c.id && t.type === 'expense'), t => t.amount);
            return { ...c, spent, utilization: c.budget > 0 ? (spent / c.budget) * 100 : 0 };
        }).sort((a,b) => b.utilization - a.utilization).slice(0, 3);
    }, [campaigns, transactions]);

    return (
        <div className="space-y-4">
            {campaignBudgets.map(c => (
                <div key={c.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-semibold text-brand-text-primary">{c.name}</span>
                        <span className="text-brand-text-secondary">{c.spent.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0})} / {c.budget.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0})}</span>
                    </div>
                    <div className="w-full bg-brand-bg rounded-full h-2.5">
                        <div className={`${c.utilization > 100 ? 'bg-red-500' : 'bg-brand-primary'} h-2.5 rounded-full`} style={{width: `${Math.min(c.utilization, 100)}%`}}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ContentPerformanceHeatmapWidget: React.FC = () => {
    const { campaigns } = useStore();
    const perfData = useMemo(() => {
        const data: {[key: string]: number} = { Instagram: 0, TikTok: 0, YouTube: 0 };
        campaigns.forEach(c => c.content.forEach(p => {
            if(p.performance) data[p.platform] += p.performance.likes + p.performance.comments;
        }));
        return Object.entries(data).map(([name, value]) => ({ name, value }));
    }, [campaigns]);

    const maxValue = Math.max(...perfData.map(d => d.value));

    return (
         <div className="space-y-3">
            {perfData.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="font-semibold text-brand-text-primary">{item.name}</span>
                        <span className="text-brand-text-secondary">{item.value.toLocaleString()} engagements</span>
                    </div>
                    <div className="w-full bg-brand-bg rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-brand-insight to-brand-primary h-2.5 rounded-full" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const CampaignCompletionRateWidget: React.FC = () => {
    const { campaigns } = useStore();
    const completedCampaigns = campaigns.filter(c => new Date(c.endDate) < new Date());
    const onTime = completedCampaigns.length; // Simplified
    const completionRate = campaigns.length > 0 ? (onTime / campaigns.length) * 100 : 100;

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-6xl font-bold text-brand-text-primary">{completionRate.toFixed(0)}%</p>
            <p className="text-brand-text-secondary mt-2">Campaign Completion Rate</p>
        </div>
    );
};

const AudienceDemographicsWidget: React.FC = () => {
    const { influencers } = useStore();
    const { gender, locations } = useMemo(() => {
        const total = influencers.length;
        if (total === 0) return { gender: { male: 0, female: 0, other: 0 }, locations: [] };

        const avgGender = influencers.reduce((acc, i) => {
            acc.male += i.audience.gender.male;
            acc.female += i.audience.gender.female;
            acc.other += i.audience.gender.other;
            return acc;
        }, { male: 0, female: 0, other: 0 });
        
        const locs = d3.rollup(influencers.flatMap(i => i.audience.topLocations), v => d3.sum(v, d => d.percentage), d => d.name);

        return {
            gender: { male: avgGender.male / total, female: avgGender.female / total, other: avgGender.other / total },
            locations: Array.from(locs, ([name, value]) => ({ name, value: value / total })).sort((a,b) => b.value - a.value).slice(0, 3)
        };
    }, [influencers]);

    return (
        <div className="flex flex-col h-full justify-center gap-4">
            <div>
                <p className="text-sm font-semibold text-brand-text-primary text-center mb-2">Gender Split</p>
                <div className="flex w-full h-4 rounded-full overflow-hidden bg-brand-bg">
                    <div className="bg-blue-500" style={{ width: `${gender.male}%` }} title={`Male: ${gender.male.toFixed(0)}%`}></div>
                    <div className="bg-pink-500" style={{ width: `${gender.female}%` }} title={`Female: ${gender.female.toFixed(0)}%`}></div>
                    <div className="bg-gray-500" style={{ width: `${gender.other}%` }} title={`Other: ${gender.other.toFixed(0)}%`}></div>
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-brand-text-primary text-center mb-2">Top Locations</p>
                <ul className="space-y-1 text-xs">
                    {locations.map(loc => (
                        <li key={loc.name} className="flex justify-between bg-brand-bg p-2 rounded-md">
                            <span className="font-semibold text-brand-text-primary">{loc.name}</span>
                            <span className="text-brand-text-secondary">{loc.value.toFixed(1)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// --- NEW AI-POWERED SMART WIDGETS ---

const AICampaignOptimizerWidget: React.FC = () => {
    const { campaigns } = useStore();
    const activeCampaign = campaigns.find(c => new Date(c.endDate) >= new Date());
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Lightbulb className="w-5 h-5 text-brand-insight flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Boost posts for &apos;{activeCampaign?.name || 'your top campaign'}&apos; between 6-9 PM for a potential 15% higher engagement.</p>
                </div>
            </li>
             <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Lightbulb className="w-5 h-5 text-brand-insight flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Consider adding a TikTok creator to the &apos;TechForward&apos; campaign to diversify audience reach.</p>
                </div>
            </li>
        </ul>
    );
};

const SmartCreatorRecommendationsWidget: React.FC = () => {
    const { influencers } = useStore();
    const recommended = influencers.filter(i => i.status === 'lead');
    return (
        <div>
            <p className="text-sm text-brand-text-secondary mb-3">For your next &apos;Fashion&apos; campaign:</p>
            <ul className="space-y-3">
                {recommended.slice(0, 2).map(rec => (
                    <li key={rec.id} className="flex items-center gap-3 bg-brand-bg p-3 rounded-lg">
                        <Image src={rec.avatarUrl || '/default-avatar.jpg'} alt={rec.name} width={32} height={32} className="rounded-full"/>
                        <div>
                            <p className="font-semibold text-brand-text-primary text-sm">{rec.name}</p>
                            <p className="text-xs text-brand-text-secondary">{rec.followers.toLocaleString()} Followers</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const PredictiveRevenueForecastWidget: React.FC = () => {
    const { contracts } = useStore();
    const pipelineValue = contracts
        .filter(c => c.status === 'Pending' || c.status === 'Draft')
        .reduce((sum, c) => sum + c.value, 0);
    const predictedRevenue = pipelineValue * 1.25; // AI prediction
    return (
        <div className="flex flex-col h-full justify-center items-center text-center">
            <p className="text-5xl font-bold text-brand-text-primary">{predictedRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <p className="text-brand-text-secondary mt-2">Next Quarter&apos;s Forecast</p>
            <p className="text-xs text-brand-text-secondary mt-1">(Based on pipeline & market trends)</p>
        </div>
    );
};

const RiskAssessmentDashboardWidget: React.FC = () => {
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-brand-warning flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">High Risk: Wanderlust contract renewal is in 30 days but influencer is inactive.</p>
                </div>
            </li>
             <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Medium Risk: Budget for &apos;TechForward&apos; is at 95% utilization with 2 weeks remaining.</p>
                </div>
            </li>
        </ul>
    );
};

const TrendAnalysisWidget: React.FC = () => {
    return (
         <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Zap className="w-5 h-5 text-brand-insight flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Trending: Short-form video content in the &apos;Tech&apos; niche is seeing a 25% MoM growth in engagement.</p>
                </div>
            </li>
             <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Zap className="w-5 h-5 text-brand-insight flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Opportunity: Live shopping events on Instagram are outperforming standard posts for &apos;Beauty&apos; brands.</p>
                </div>
            </li>
        </ul>
    );
};

const PerformanceAnomalyDetectorWidget: React.FC = () => {
    const { influencers } = useStore();
    const anomalyInfluencer = influencers.find(i => i.name === 'Sophie Chen');
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Signal className="w-5 h-5 text-brand-warning flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Engagement for {anomalyInfluencer ? anomalyInfluencer.name : 'a top creator'} has dropped by 30% this week. Recommend investigation.</p>
                </div>
            </li>
        </ul>
    );
};

const CompetitiveIntelligenceWidget: React.FC = () => {
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Telescope className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">Competitor &apos;Glossier&apos; just launched a campaign with micro-influencers on TikTok for their new serum.</p>
                </div>
            </li>
        </ul>
    );
};

const ContentStrategySuggestionsWidget: React.FC = () => {
    return (
         <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Paintbrush className="w-5 h-5 text-brand-insight flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">For &apos;GadgetFlow&apos;, suggest creating &apos;unboxing&apos; videos on YouTube Shorts to reach a younger demographic.</p>
                </div>
            </li>
        </ul>
    );
};

const ChurnRiskIndicatorWidget: React.FC = () => {
    const { brands } = useStore();
    const atRiskClient = brands.find(b => b.satisfaction < 80);
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <HeartCrack className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">{atRiskClient?.name || 'A client'} has a low satisfaction score ({atRiskClient?.satisfaction || 78}%). Suggest a proactive check-in call.</p>
                </div>
            </li>
        </ul>
    );
};

const GrowthOpportunityScannerWidget: React.FC = () => {
    const { brands, campaigns } = useStore();
    const growthClient = brands[0];
    const growthCampaign = campaigns.find(c => c.brandId === growthClient.id);
    return (
        <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3 bg-brand-bg p-3 rounded-lg">
                <Scaling className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5"/>
                <div>
                    <p className="font-semibold text-brand-text-primary">{growthClient.name}&apos;s campaigns have a high ROI ({growthCampaign?.roi || 275}%). Propose a retainer contract to lock in long-term value.</p>
                </div>
            </li>
        </ul>
    );
};


// --- WIDGET REGISTRY ---
interface WidgetConfig {
  component: React.ComponentType<object>;
  title: string;
  icon: React.ReactNode;
  description: string;
  defaultSpan: number;
  category: string;
}

const WIDGET_REGISTRY: Record<string, WidgetConfig> = {
    // Analytics & Info Widgets
    'command-center': { component: CommandCenterWidget, title: "Command Center", icon: <Terminal className="w-5 h-5" />, description: "Your daily action items and key stats at a glance.", defaultSpan: 3, category: 'Analytics & Info' },
    'live-campaigns': { component: LiveCampaignsWidget, title: "Live Campaigns", icon: <TrendingUp className="w-5 h-5" />, description: "Track progress and ROI of your active campaigns.", defaultSpan: 3, category: 'Analytics & Info' },
    'content-velocity': { component: ContentVelocityWidget, title: "Content Velocity", icon: <Rocket className="w-5 h-5" />, description: "A visual overview of your content approval pipeline.", defaultSpan: 6, category: 'Analytics & Info' },
    'opportunity-radar': { component: OpportunityRadarWidget, title: "Opportunity Radar", icon: <Radar className="w-5 h-5" />, description: "AI-powered discovery of market trends and insights.", defaultSpan: 3, category: 'Analytics & Info' },
    'talent-spotlight': { component: TalentSpotlightWidget, title: "Talent Spotlight", icon: <UserCheck className="w-5 h-5" />, description: "Highlighting top influencer performance and growth.", defaultSpan: 3, category: 'Analytics & Info' },
    'client-health': { component: ClientHealthWidget, title: "Client Health", icon: <GaugeCircle className="w-5 h-5" />, description: "Monitor the status and health of key client accounts.", defaultSpan: 6, category: 'Analytics & Info' },
    'contract-status': { component: ContractStatusWidget, title: "Contract Status", icon: <FileText className="w-5 h-5" />, description: "A quick look at contracts by their current status.", defaultSpan: 3, category: 'Analytics & Info' },
    'upcoming-renewals': { component: UpcomingRenewalsWidget, title: "Upcoming Renewals", icon: <Clock className="w-5 h-5" />, description: "Contracts due for renewal in the next 90 days.", defaultSpan: 3, category: 'Analytics & Info' },
    'financial-overview': { component: FinancialOverviewWidget, title: "Financial Overview", icon: <ArrowRightLeft className="w-5 h-5" />, description: "A clear summary of income, expenses, and profitability.", defaultSpan: 6, category: 'Analytics & Info' },
    'new-leads': { component: NewLeadsWidget, title: "New Leads", icon: <UserPlus className="w-5 h-5" />, description: "Recently added influencers and brands that need to be contacted.", defaultSpan: 3, category: 'Analytics & Info' },
    'client-pipeline': { component: ClientPipelineWidget, title: "Client Pipeline", icon: <KanbanSquare className="w-5 h-5" />, description: "A Kanban-style view of your client acquisition stages.", defaultSpan: 3, category: 'Analytics & Info' },
    'overdue-tasks': { component: OverdueTasksWidget, title: "Overdue Tasks", icon: <ClipboardX className="w-5 h-5" />, description: "A high-priority list of all tasks that are past their due date.", defaultSpan: 3, category: 'Analytics & Info' },
    'todays-agenda': { component: TodaysAgendaWidget, title: "Today&apos;s Agenda", icon: <ListTodo className="w-5 h-5" />, description: "A focused list of tasks and calendar events scheduled for today.", defaultSpan: 3, category: 'Analytics & Info' },
    'overdue-invoices': { component: OverdueInvoicesWidget, title: "Overdue Invoices", icon: <FileWarning className="w-5 h-5" />, description: "Track all invoices that are past their due date to follow up on payments.", defaultSpan: 3, category: 'Analytics & Info' },
    'recent-transactions': { component: RecentTransactionsWidget, title: "Recent Transactions", icon: <History className="w-5 h-5" />, description: "A mini-feed showing your last 3-5 income and expense transactions.", defaultSpan: 6, category: 'Analytics & Info' },
    'platform-performance': { component: PlatformPerformanceWidget, title: "Platform Performance", icon: <PieChart className="w-5 h-5" />, description: "A pie chart showing performance breakdown across social platforms.", defaultSpan: 3, category: 'Analytics & Info' },
    'follower-growth': { component: FollowerGrowthWidget, title: "Follower Growth", icon: <LineChart className="w-5 h-5" />, description: "Track total follower growth across all your active influencers.", defaultSpan: 6, category: 'Analytics & Info' },
    // Interactive & Utility Widgets
    'notes': { component: NotesWidget, title: "Scratchpad", icon: <StickyNote className="w-5 h-5" />, description: "A quick place to jot down notes and reminders.", defaultSpan: 3, category: 'Utility' },
    'todo-list': { component: TodoListWidget, title: "Quick Tasks", icon: <CheckSquare className="w-5 h-5" />, description: "Manage your most immediate tasks right here.", defaultSpan: 3, category: 'Utility' },
    'mini-calendar': { component: CalendarWidget, title: "Mini Calendar", icon: <CalendarDays className="w-5 h-5" />, description: "A compact view of your monthly schedule and events.", defaultSpan: 3, category: 'Utility' },
    // Essential Metrics
    'total-active-creators': { component: TotalActiveCreatorsWidget, title: "Total Active Creators", icon: <Users className="w-5 h-5" />, description: "Count of all active creators on your roster.", defaultSpan: 3, category: 'Essential Metrics' },
    'monthly-recurring-revenue': { component: MonthlyRecurringRevenueWidget, title: "Monthly Recurring Revenue (MRR)", icon: <DollarSign className="w-5 h-5" />, description: "Estimated MRR from active, signed contracts.", defaultSpan: 3, category: 'Essential Metrics' },
    'active-campaigns-metric': { component: ActiveCampaignsMetricWidget, title: "Active Campaigns", icon: <Star className="w-5 h-5" />, description: "Live campaigns with average completion percentage.", defaultSpan: 3, category: 'Essential Metrics' },
    'campaign-success-rate': { component: CampaignSuccessRateWidget, title: "Campaign Success Rate", icon: <CheckSquare className="w-5 h-5" />, description: "Percentage of campaigns meeting success criteria (e.g., ROI > 100%).", defaultSpan: 3, category: 'Essential Metrics' },
    'average-campaign-roi': { component: AverageCampaignROIWidget, title: "Average Campaign ROI", icon: <TrendingUp className="w-5 h-5" />, description: "Average return on investment across all campaigns.", defaultSpan: 3, category: 'Essential Metrics' },
    'creator-engagement-rate': { component: CreatorEngagementRateWidget, title: "Creator Engagement Rate", icon: <PieChart className="w-5 h-5" />, description: "Average engagement rate across all creators, with platform breakdown.", defaultSpan: 3, category: 'Essential Metrics' },
    'client-satisfaction-score': { component: ClientSatisfactionScoreWidget, title: "Client Satisfaction Score", icon: <Smile className="w-5 h-5" />, description: "NPS-style rating with a recent feedback snippet.", defaultSpan: 3, category: 'Essential Metrics' },
    'pipeline-value': { component: PipelineValueWidget, title: "Pipeline Value", icon: <Layers className="w-5 h-5" />, description: "Total value of all contracts in Draft or Pending status.", defaultSpan: 3, category: 'Essential Metrics' },
    'monthly-profit-margin': { component: MonthlyProfitMarginWidget, title: "Monthly Profit Margin", icon: <Percent className="w-5 h-5" />, description: "Net profit percentage with a cost breakdown for the current month.", defaultSpan: 3, category: 'Essential Metrics' },
    'team-productivity-score': { component: TeamProductivityScoreWidget, title: "Team Productivity", icon: <Activity className="w-5 h-5" />, description: "Percentage of tasks completed vs. assigned in the last 30 days.", defaultSpan: 3, category: 'Essential Metrics' },
    // Financial & Revenue Widgets
    'revenue-by-client': { component: RevenueByClientWidget, title: "Revenue by Client", icon: <Landmark className="w-5 h-5" />, description: "Top performing clients by revenue contribution.", defaultSpan: 3, category: 'Financial & Revenue' },
    'creator-payment-tracker': { component: CreatorPaymentTrackerWidget, title: "Creator Payment Tracker", icon: <HandCoins className="w-5 h-5" />, description: "Pending payments to influencers.", defaultSpan: 3, category: 'Financial & Revenue' },
    'invoice-status-overview': { component: InvoiceStatusOverviewWidget, title: "Invoice Status Overview", icon: <FileClock className="w-5 h-5" />, description: "Breakdown of invoices by status.", defaultSpan: 3, category: 'Financial & Revenue' },
    'budget-vs-actual-spend': { component: BudgetVsActualSpendWidget, title: "Budget vs. Actual Spend", icon: <Goal className="w-5 h-5" />, description: "Campaign budget utilization with variance.", defaultSpan: 3, category: 'Financial & Revenue' },
    'cash-flow-forecast': { component: CashFlowForecastWidget, title: "Cash Flow Forecast", icon: <CandlestickChart className="w-5 h-5" />, description: "30/60/90 day cash flow projection.", defaultSpan: 3, category: 'Financial & Revenue' },
    'average-deal-size': { component: AverageDealSizeWidget, title: "Average Deal Size", icon: <Briefcase className="w-5 h-5" />, description: "Average value of signed contracts.", defaultSpan: 3, category: 'Financial & Revenue' },
    'revenue-growth-rate': { component: RevenueGrowthRateWidget, title: "Revenue Growth Rate", icon: <TrendingUp className="w-5 h-5" />, description: "Month-over-month and year-over-year growth.", defaultSpan: 3, category: 'Financial & Revenue' },
    'client-lifetime-value': { component: ClientLifetimeValueWidget, title: "Client Lifetime Value (CLV)", icon: <Wallet className="w-5 h-5" />, description: "Average total revenue generated per client.", defaultSpan: 3, category: 'Financial & Revenue' },
    'cost-per-acquisition': { component: CostPerAcquisitionWidget, title: "Cost Per Acquisition (CPA)", icon: <Target className="w-5 h-5" />, description: "Average cost to acquire a new client.", defaultSpan: 3, category: 'Financial & Revenue' },
    'profit-by-campaign-type': { component: ProfitByCampaignTypeWidget, title: "Profit by Campaign Type", icon: <ListFilter className="w-5 h-5" />, description: "Breakdown of profit by campaign category.", defaultSpan: 3, category: 'Financial & Revenue' },
    // Creator & Relationship Widgets
    'top-performing-creators': { component: TopPerformingCreatorsWidget, title: "Top Performing Creators", icon: <Award className="w-5 h-5" />, description: "Ranked by engagement, ROI, and reliability.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-availability': { component: CreatorAvailabilityWidget, title: "Creator Availability", icon: <CalendarClock className="w-5 h-5" />, description: "Who's available for upcoming campaigns.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-niche-distribution': { component: CreatorNicheDistributionWidget, title: "Creator Niche Distribution", icon: <FolderKanban className="w-5 h-5" />, description: "Pie chart of creator categories and specialties.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-engagement-trends': { component: CreatorEngagementTrendsWidget, title: "Creator Engagement Trends", icon: <LineChart className="w-5 h-5" />, description: "Performance over time with platform breakdown.", defaultSpan: 3, category: 'Creator & Relationship' },
    'new-creator-onboarding': { component: NewCreatorOnboardingWidget, title: "New Creator Onboarding", icon: <UserPlus className="w-5 h-5" />, description: "Recent additions with completion status.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-rating-system': { component: CreatorRatingSystemWidget, title: "Creator Rating System", icon: <Star className="w-5 h-5" />, description: "Internal ratings with performance correlation.", defaultSpan: 3, category: 'Creator & Relationship' },
    'brand-relationship-health': { component: BrandRelationshipHealthWidget, title: "Brand Relationship Health", icon: <HeartHandshake className="w-5 h-5" />, description: "Client satisfaction and communication frequency.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-payment-history': { component: CreatorPaymentHistoryWidget, title: "Creator Payment History", icon: <History className="w-5 h-5" />, description: "Payment timing and amounts with trends.", defaultSpan: 3, category: 'Creator & Relationship' },
    'influencer-platform-mix': { component: CreatorPlatformMixWidget, title: "Influencer Platform Mix", icon: <LayoutGrid className="w-5 h-5" />, description: "Instagram, YouTube, TikTok distribution.", defaultSpan: 3, category: 'Creator & Relationship' },
    'creator-geographic-distribution': { component: CreatorGeographicDistributionWidget, title: "Creator Geographic Distribution", icon: <MapPin className="w-5 h-5" />, description: "Map showing creator locations.", defaultSpan: 3, category: 'Creator & Relationship' },
    // Campaign & Performance Widgets
    'campaign-timeline-view': { component: CampaignTimelineViewWidget, title: "Campaign Timeline View", icon: <GanttChartSquare className="w-5 h-5" />, description: "Gantt-style timeline with milestones and deadlines.", defaultSpan: 6, category: 'Campaign Intelligence' },
    'content-approval-status': { component: ContentApprovalStatusWidget, title: "Content Approval Status", icon: <ClipboardCheck className="w-5 h-5" />, description: "Pending approvals with bottleneck identification.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'platform-performance-comparison': { component: PlatformPerformanceComparisonWidget, title: "Platform Performance Comparison", icon: <BarChartHorizontal className="w-5 h-5" />, description: "Instagram vs. YouTube vs. TikTok results.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'campaign-delivery-tracker': { component: CampaignDeliveryTrackerWidget, title: "Campaign Delivery Tracker", icon: <Timer className="w-5 h-5" />, description: "On-time delivery percentage with late alerts.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'engagement-rate-by-niche': { component: EngagementRateByNicheWidget, title: "Engagement Rate by Niche", icon: <Shapes className="w-5 h-5" />, description: "Performance across different creator categories.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'seasonal-campaign-trends': { component: SeasonalCampaignTrendsWidget, title: "Seasonal Campaign Trends", icon: <CalendarRange className="w-5 h-5" />, description: "Historical performance by month/quarter.", defaultSpan: 6, category: 'Campaign Intelligence' },
    'campaign-budget-utilization': { component: CampaignBudgetUtilizationWidget, title: "Campaign Budget Utilization", icon: <CircleDollarSign className="w-5 h-5" />, description: "Spend tracking with remaining budget alerts.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'content-performance-heatmap': { component: ContentPerformanceHeatmapWidget, title: "Content Performance Heatmap", icon: <BarChartBig className="w-5 h-5" />, description: "Best performing content types and timing.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'campaign-completion-rate': { component: CampaignCompletionRateWidget, title: "Campaign Completion Rate", icon: <CheckCircle2 className="w-5 h-5" />, description: "Percentage of campaigns finished on time.", defaultSpan: 3, category: 'Campaign Intelligence' },
    'audience-demographics': { component: AudienceDemographicsWidget, title: "Audience Demographics", icon: <Users2 className="w-5 h-5" />, description: "Combined audience insights from all campaigns.", defaultSpan: 3, category: 'Campaign Intelligence' },
    // AI-Powered Smart Widgets
    'ai-campaign-optimizer': { component: AICampaignOptimizerWidget, title: "AI Campaign Optimizer", icon: <Lightbulb className="w-5 h-5" />, description: "AI-generated suggestions for improving active campaigns.", defaultSpan: 3, category: 'Intelligent Insights' },
    'smart-creator-recommendations': { component: SmartCreatorRecommendationsWidget, title: "Smart Creator Recommendations", icon: <UserCog className="w-5 h-5" />, description: "AI-suggested creator matches for new campaigns.", defaultSpan: 3, category: 'Intelligent Insights' },
    'predictive-revenue-forecast': { component: PredictiveRevenueForecastWidget, title: "Predictive Revenue Forecast", icon: <LineChart className="w-5 h-5" />, description: "AI-powered revenue predictions based on pipeline.", defaultSpan: 3, category: 'Intelligent Insights' },
    'risk-assessment-dashboard': { component: RiskAssessmentDashboardWidget, title: "Risk Assessment Dashboard", icon: <ShieldAlert className="w-5 h-5" />, description: "AI-identified risks in campaigns and relationships.", defaultSpan: 3, category: 'Intelligent Insights' },
    'trend-analysis-widget': { component: TrendAnalysisWidget, title: "Trend Analysis Widget", icon: <Zap className="w-5 h-5" />, description: "AI-detected industry trends and opportunities.", defaultSpan: 3, category: 'Intelligent Insights' },
    'performance-anomaly-detector': { component: PerformanceAnomalyDetectorWidget, title: "Performance Anomaly Detector", icon: <Signal className="w-5 h-5" />, description: "AI alerts for unusual performance patterns.", defaultSpan: 3, category: 'Intelligent Insights' },
    'competitive-intelligence': { component: CompetitiveIntelligenceWidget, title: "Competitive Intelligence", icon: <Telescope className="w-5 h-5" />, description: "AI-gathered insights about competitor activities.", defaultSpan: 3, category: 'Intelligent Insights' },
    'content-strategy-suggestions': { component: ContentStrategySuggestionsWidget, title: "Content Strategy Suggestions", icon: <Paintbrush className="w-5 h-5" />, description: "AI recommendations for content themes and timing.", defaultSpan: 3, category: 'Intelligent Insights' },
    'churn-risk-indicator': { component: ChurnRiskIndicatorWidget, title: "Churn Risk Indicator", icon: <HeartCrack className="w-5 h-5" />, description: "AI-predicted client churn probability with prevention tips.", defaultSpan: 3, category: 'Intelligent Insights' },
    'growth-opportunity-scanner': { component: GrowthOpportunityScannerWidget, title: "Growth Opportunity Scanner", icon: <Scaling className="w-5 h-5" />, description: "AI-identified expansion opportunities with existing clients.", defaultSpan: 3, category: 'Intelligent Insights' },
};

const WidgetWrapper: React.FC<{ 
    widgetItem: DashboardLayoutItem,
    isEditing: boolean,
    isDragging: boolean,
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>, id: string) => void,
    onRemove: (id: string) => void,
}> = ({ widgetItem, isEditing, isDragging, onMouseDown, onRemove }) => {
    const widgetConfig = WIDGET_REGISTRY[widgetItem.id];
    
    if (!widgetConfig) return null;
    const WidgetComponent = widgetConfig.component;
    


    const bentoConfig = {
        title: widgetConfig.title,
        description: widgetConfig.description,
        icon: widgetConfig.icon,
        className: `futuristic-border bento-style bg-brand-surface rounded-xl flex flex-col h-full transition-opacity duration-300 hover:shadow-glow-md min-h-[280px] ${isDragging ? 'opacity-30' : ''}`,
        enableStars: true,
        enableSpotlight: true,
        enableBorderGlow: true,
        enableTilt: true,
        clickEffect: true,
        enableMagnetism: true
    };

    return (
        <MagicBento {...bentoConfig}>
            <header className="flex items-center justify-between p-4 border-b border-brand-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="text-brand-text-secondary">{widgetConfig.icon}</div>
                    <h2 className="font-bold text-brand-text-primary">{widgetConfig.title}</h2>
                </div>
                <div className="flex items-center gap-1">
                    {isEditing && (
                        <div 
                            className="cursor-move text-brand-text-secondary p-1" 
                            aria-label={`Move ${widgetConfig.title} widget`}
                            onMouseDown={(e) => onMouseDown(e, widgetItem.id)}
                        >
                            <Move className="w-5 h-5" />
                        </div>
                    )}
                    <button
                        onClick={() => onRemove(widgetItem.id)}
                        className="text-brand-text-secondary hover:text-red-500 p-1"
                        aria-label={`Remove ${widgetConfig.title} widget`}
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
            </header>
            <div className="p-4 flex-grow overflow-hidden flex flex-col">
                <WidgetComponent />
            </div>
        </MagicBento>
    );
};

const AddWidgetModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { activeDashboardTabId, dashboardTabs, addWidgetToLayout } = useStore();
    const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);
    const dashboardLayout = activeTab ? activeTab.layout : [];


    const categoryOrder = [
        'Analytics & Info',
        'Utility',
        'Essential Metrics',
        'Financial & Revenue',
        'Creator & Relationship',
        'Campaign Intelligence',
        'Intelligent Insights',
    ];

    const groupedWidgets = useMemo(() => {
        const groups: { [category: string]: (typeof WIDGET_REGISTRY[string] & { key: string })[] } = {};
        for (const [key, widget] of Object.entries(WIDGET_REGISTRY)) {
            const category = widget.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push({ key, ...widget });
        }
        return groups;
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Widget to Dashboard" maxWidth="4xl">
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
                {categoryOrder.map(category => {
                    const widgets = groupedWidgets[category];
                    if (!widgets) return null;
                    return (
                        <div key={category}>
                            <h3 className="text-xl font-bold text-brand-text-primary mb-4 pb-2 border-b border-brand-border">{category}</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {widgets.map(widget => {
                                    const { key, ...widgetConfig } = widget;
                                    const isAdded = dashboardLayout.some(item => item.id === key);
                                    const WidgetComponent = widgetConfig.component;
                                    return (
                                        <div key={key} className="bg-brand-bg p-4 rounded-lg flex flex-col gap-4 border border-brand-border">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-brand-text-primary">{widgetConfig.title}</h3>
                                                    <p className="text-sm text-brand-text-secondary mt-1">{widgetConfig.description}</p>
                                                </div>
                                                <button 
                                                    onClick={() => addWidgetToLayout(key, widgetConfig)}
                                                    disabled={isAdded}
                                                    className="bg-brand-primary text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-brand-accent disabled:bg-brand-secondary disabled:cursor-not-allowed whitespace-nowrap ml-4"
                                                >
                                                    {isAdded ? 'Added' : 'Add'}
                                                </button>
                                            </div>
                                            <div className="futuristic-border bg-brand-surface rounded-xl p-4 min-h-[240px] pointer-events-none flex flex-col overflow-hidden">
                                                <WidgetComponent />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Modal>
    );
};

const TemplateLibraryModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { dashboardTemplates, applyTemplate, dashboardTabs, activeDashboardTabId } = useStore();
    
    const handleApplyClick = (template: DashboardTemplate, mode: 'new-tab' | 'current-tab') => {
        applyTemplate(template.id, mode);
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dashboard Template Library" maxWidth="4xl">
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
                <p className="text-brand-text-secondary">Get started quickly with a pre-configured dashboard designed for your agency&apos;s needs.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardTemplates.map(template => {
                        const isCurrentTabEmpty = dashboardTabs.find(t => t.id === activeDashboardTabId)?.layout.length === 0;

                        return (
                            <div key={template.id} className="futuristic-border bg-brand-surface rounded-xl p-5 flex flex-col text-center group">
                                <div className="mx-auto mb-4">{template.icon}</div>
                                <h3 className="font-bold text-lg text-brand-text-primary">{template.name}</h3>
                                <p className="text-sm text-brand-text-secondary flex-grow mt-1 mb-4">{template.description}</p>
                                <div className="w-full h-32 bg-brand-bg rounded-lg p-2 border border-brand-border/50 mb-4">
                                    <div className="grid grid-cols-12 grid-rows-4 gap-1 h-full">
                                        {template.layout.map(item => (
                                            <div key={item.id} className="bg-brand-primary/20 rounded-sm" style={{
                                                gridColumn: `${item.x + 1} / span ${item.w}`,
                                                gridRow: `${item.y + 1} / span ${item.h}`,
                                            }}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-stretch gap-2 mt-auto">
                                    <button
                                        onClick={() => handleApplyClick(template, 'current-tab')}
                                        title={template.id === 'blank-dashboard' ? "Clear all widgets from the current dashboard" : "Add this template&apos;s widgets to your current dashboard"}
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-3 rounded-lg hover:bg-brand-border transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={template.id === 'blank-dashboard' && isCurrentTabEmpty}
                                    >
                                        <Layers className="w-4 h-4" />
                                        {template.id === 'blank-dashboard' ? 'Clear Current' : 'Add to Current'}
                                    </button>
                                    <button
                                        onClick={() => handleApplyClick(template, 'new-tab')}
                                        title="Create a new dashboard tab using this template"
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent transition-colors text-sm"
                                    >
                                        <PlusSquare className="w-4 h-4" />
                                        Add as New Tab
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Modal>
    );
};

const DashboardTabs: React.FC<{ onRemoveTab: (tabId: string) => void }> = ({ onRemoveTab }) => {
    const { dashboardTabs, activeDashboardTabId, setActiveDashboardTab, addDashboardTab, renameDashboardTab } = useStore();
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, tabId: string } | null>(null);
    const [editingTabId, setEditingTabId] = useState<string | null>(null);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showScroll, setShowScroll] = useState({ left: false, right: false });

    const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, tabId });
    };

    const handleRename = () => {
        if (contextMenu) {
            setEditingTabId(contextMenu.tabId);
            setContextMenu(null);
        }
    };
    
    const handleTabNameChange = (e: React.KeyboardEvent<HTMLInputElement>, tabId: string) => {
        if (e.key === 'Enter') {
            renameDashboardTab(tabId, (e.target as HTMLInputElement).value);
            setEditingTabId(null);
        } else if (e.key === 'Escape') {
            setEditingTabId(null);
        }
    };
    
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const checkScroll = useCallback(() => {
        const el = tabsContainerRef.current;
        if (el) {
            const hasOverflow = el.scrollWidth > el.clientWidth;
            setShowScroll({
                left: hasOverflow && el.scrollLeft > 5,
                right: hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 5,
            });
        }
    }, []);

    useEffect(() => {
        checkScroll();
        const el = tabsContainerRef.current;
        el?.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
            el?.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll)
        };
    }, [dashboardTabs, checkScroll]);

    const scroll = (direction: 'left' | 'right') => {
        const el = tabsContainerRef.current;
        if (el) {
            el.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative mb-6">
            <div className="relative overflow-hidden">
                <div 
                    ref={tabsContainerRef} 
                    className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 px-12"
                >
                    {dashboardTabs.map(tab => (
                        <div key={tab.id} onContextMenu={(e) => handleContextMenu(e, tab.id)} className="relative group">
                            {editingTabId === tab.id ? (
                                <input
                                    type="text"
                                    defaultValue={tab.name}
                                    onKeyDown={(e) => handleTabNameChange(e, tab.id)}
                                    onBlur={() => setEditingTabId(null)}
                                    autoFocus
                                    className="bg-brand-bg border border-brand-primary rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-text-primary focus:outline-none w-32"
                                />
                            ) : (
                                <button
                                    onClick={() => setActiveDashboardTab(tab.id)}
                                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                                        activeDashboardTabId === tab.id
                                            ? 'bg-brand-primary text-white'
                                            : 'bg-brand-surface text-brand-text-secondary hover:bg-brand-border'
                                    }`}
                                >
                                    {tab.name}
                                </button>
                            )}
                            {dashboardTabs.length > 1 && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onRemoveTab(tab.id); }}
                                    className="absolute -top-1 -right-1 p-0.5 rounded-full bg-brand-bg text-brand-text-secondary opacity-0 group-hover:opacity-100 hover:bg-brand-border hover:text-brand-text-primary transition-opacity"
                                    aria-label={`Delete ${tab.name} dashboard`}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                     <button onClick={() => addDashboardTab()} className="p-2 bg-brand-surface rounded-full text-brand-text-secondary hover:bg-brand-border flex-shrink-0"><Plus className="w-5 h-5"/></button>
                </div>

                <div className={`absolute left-0 top-0 bottom-0 flex items-center transition-opacity duration-300 ${showScroll.left ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-brand-bg to-transparent pointer-events-none"></div>
                    <button onClick={() => scroll('left')} className="relative z-10 p-2 bg-brand-surface rounded-full hover:bg-brand-border shadow-md">
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                </div>

                <div className={`absolute right-0 top-0 bottom-0 flex items-center transition-opacity duration-300 ${showScroll.right ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-bg to-transparent pointer-events-none"></div>
                    <button onClick={() => scroll('right')} className="relative z-10 p-2 bg-brand-surface rounded-full hover:bg-brand-border shadow-md">
                        <ChevronRight className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {contextMenu && (
                <div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-50 bg-brand-surface futuristic-border rounded-lg shadow-lg py-2 w-40">
                    <button onClick={handleRename} className="w-full text-left px-4 py-2 text-sm hover:bg-brand-border">Rename</button>
                    {dashboardTabs.length > 1 && <button onClick={() => { onRemoveTab(contextMenu.tabId); setContextMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-brand-border">Delete</button>}
                </div>
            )}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { dashboardTabs, activeDashboardTabId, moveWidget, setActiveDashboardTab, removeWidgetFromLayout, removeDashboardTab } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [placeholder, setPlaceholder] = useState<DashboardLayoutItem | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [widgetToRemove, setWidgetToRemove] = useState<string | null>(null);
    const [tabToRemove, setTabToRemove] = useState<string | null>(null);

    const handleConfirmRemoveWidget = () => {
        if (widgetToRemove) {
            removeWidgetFromLayout(widgetToRemove);
            setWidgetToRemove(null);
            notificationService.show({ message: 'Widget removed.', type: 'success' });
        }
    };

    const handleConfirmRemoveTab = () => {
        if (tabToRemove) {
            removeDashboardTab(tabToRemove);
            setTabToRemove(null);
            notificationService.show({ message: 'Dashboard tab removed.', type: 'success' });
        }
    };
    
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
        return () => clearTimeout(timer);
    }, [activeDashboardTabId]);

    const [dragState, setDragState] = useState<{
        isDragging: boolean;
        widgetId: string | null;
        ghostElement: React.ReactNode | null;
        ghostPosition: { x: number; y: number };
        offset: { x: number; y: number };
        widgetSize: { w: number, h: number };
    }>({
        isDragging: false,
        widgetId: null,
        ghostElement: null,
        ghostPosition: { x: 0, y: 0 },
        offset: { x: 0, y: 0 },
        widgetSize: { w: 0, h: 0 }
    });

    const currentIndex = useMemo(() => dashboardTabs.findIndex(t => t.id === activeDashboardTabId), [dashboardTabs, activeDashboardTabId]);


    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        if (!isEditing) return;
        e.preventDefault();

        if(!activeDashboardTabId) return;

        const activeTab = dashboardTabs.find(t => t.id === activeDashboardTabId);
        if(!activeTab) return;

        const widgetConfig = WIDGET_REGISTRY[id];
        const widgetData = activeTab.layout.find(w => w.id === id);
        if (!widgetConfig || !widgetData) return;
        
        const rect = (e.currentTarget.closest('.futuristic-border') as HTMLElement).getBoundingClientRect();

        setDragState({
            isDragging: true,
            widgetId: id,
            ghostElement: <widgetConfig.component />,
            ghostPosition: { x: e.clientX, y: e.clientY },
            offset: { x: e.clientX - rect.left, y: e.clientY - rect.top },
            widgetSize: { w: widgetData.w, h: widgetData.h }
        });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.isDragging || !gridRef.current) return;

        setDragState(prev => ({ ...prev, ghostPosition: { x: e.clientX, y: e.clientY } }));

        const gridRect = gridRef.current.getBoundingClientRect();
        const columnGap = 24;
        const rowGap = 24;
        const rowHeight = 280;
        const columnWidth = (gridRect.width - columnGap * 11) / 12;
        
        const ghostX = e.clientX - dragState.offset.x - gridRect.left;
        const ghostY = e.clientY - dragState.offset.y - gridRect.top;

        let col = Math.round(ghostX / (columnWidth + columnGap));
        let row = Math.round(ghostY / (rowHeight + rowGap));
        
        col = Math.max(0, Math.min(12 - dragState.widgetSize.w, col));
        row = Math.max(0, row);

        if (!placeholder || placeholder.x !== col || placeholder.y !== row) {
            setPlaceholder({ id: 'placeholder', widgetId: 'placeholder', x: col, y: row, w: dragState.widgetSize.w, h: dragState.widgetSize.h });
        }
    }, [dragState.isDragging, dragState.offset, dragState.widgetSize, placeholder]);
    
    const handleMouseUp = useCallback(() => {
        if (!dragState.isDragging || !dragState.widgetId) return;
        
        if (placeholder) {
            moveWidget(dragState.widgetId, placeholder.x, placeholder.y);
        }
        
        setDragState({ isDragging: false, widgetId: null, ghostElement: null, ghostPosition: { x: 0, y: 0 }, offset: {x: 0, y: 0}, widgetSize: { w: 0, h: 0 } });
        setPlaceholder(null);
    }, [dragState.isDragging, dragState.widgetId, placeholder, moveWidget]);

    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

    const goToNextTab = () => {
        const nextIndex = (currentIndex + 1) % dashboardTabs.length;
        setActiveDashboardTab(dashboardTabs[nextIndex].id);
    };

    const goToPrevTab = () => {
        const prevIndex = (currentIndex - 1 + dashboardTabs.length) % dashboardTabs.length;
        setActiveDashboardTab(dashboardTabs[prevIndex].id);
    };

    const tabToRemoveDetails = tabToRemove ? dashboardTabs.find(t => t.id === tabToRemove) : null;

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center gap-4">
                <button
                    onClick={() => setTemplateModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-brand-surface text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border transition-colors"
                >
                    <LayoutGrid className="w-5 h-5" /> Templates
                </button>
                <button
                    onClick={() => setAddWidgetModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-brand-primary/20 text-brand-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary/30 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Add Widget
                </button>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${isEditing ? 'bg-brand-accent text-white' : 'bg-brand-surface hover:bg-brand-border'}`}
                >
                    <Layout className="w-5 h-5" /> {isEditing ? 'Save Layout' : 'Edit Layout'}
                </button>
            </div>
            
            <DashboardTabs onRemoveTab={setTabToRemove} />

            <div className="relative group">
                {dashboardTabs.length > 1 && (
                     <>
                        <button 
                            onClick={goToPrevTab} 
                            aria-label="Previous Dashboard"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 p-2 bg-brand-surface/50 rounded-full text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 group-hover:-translate-x-4"
                        >
                            <ChevronLeft className="w-8 h-8"/> 
                        </button>
                        <button 
                            onClick={goToNextTab} 
                            aria-label="Next Dashboard"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 p-2 bg-brand-surface/50 rounded-full text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-4"
                        > 
                            <ChevronRight className="w-8 h-8"/> 
                        </button>
                    </>
                )}
                <div className="relative overflow-hidden">
                    <div 
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {dashboardTabs.map(tab => (
                            <div key={tab.id} className="w-full flex-shrink-0">
                                <div 
                                    ref={tab.id === activeDashboardTabId ? gridRef : null}
                                    className="relative grid grid-cols-12 gap-6"
                                    style={{ 
                                        gridAutoRows: 'minmax(280px, auto)',
                                        background: isEditing && tab.id === activeDashboardTabId
                                            ? 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)' 
                                            : 'transparent',
                                        backgroundSize: isEditing && tab.id === activeDashboardTabId ? '16px 16px' : '0 0',
                                    }}
                                >
                                    {isLoading && tab.id === activeDashboardTabId ? (
                                        tab.layout.map(item => (
                                             <div
                                                key={item.id}
                                                className="futuristic-border bento-style bg-brand-surface rounded-xl p-4"
                                                style={{
                                                    gridColumn: `${item.x + 1} / span ${item.w}`,
                                                    gridRow: `${item.y + 1} / span ${item.h}`,
                                                }}
                                             >
                                                 <MagicBento
                                                    enableStars={false}
                                                    enableSpotlight={false}
                                                    enableBorderGlow={true}
                                                    enableTilt={false}
                                                    clickEffect={false}
                                                    enableMagnetism={false}
                                                >
                                                    <SkeletonLoader className="h-full w-full bg-brand-bg/50" />
                                                </MagicBento>
                                             </div>
                                        ))
                                    ) : (
                                    <>
                                        {isEditing && placeholder && tab.id === activeDashboardTabId && (
                                            <div 
                                                className="bg-brand-primary/20 border-2 border-dashed border-brand-primary rounded-xl transition-all duration-200"
                                                style={{
                                                    gridColumn: `${placeholder.x + 1} / span ${placeholder.w}`,
                                                    gridRow: `${placeholder.y + 1} / span ${placeholder.h}`,
                                                }}
                                            />
                                        )}
                                        {tab.layout.map(item => (
                                            <WidgetWrapper
                                                key={`${tab.id}-${item.id}`}
                                                widgetItem={item}
                                                isEditing={isEditing}
                                                isDragging={dragState.isDragging && dragState.widgetId === item.id}
                                                onMouseDown={tab.id === activeDashboardTabId ? handleMouseDown : () => {}}
                                                onRemove={setWidgetToRemove}
                                            />
                                        ))}
                                        {tab.layout.length === 0 && !isEditing && tab.id === activeDashboardTabId && (
                                            <div className="col-span-12 text-center py-20 futuristic-border bento-style bg-brand-surface rounded-xl">
                                                <MagicBento
                                                    enableStars={true}
                                                    enableSpotlight={true}
                                                    enableBorderGlow={true}
                                                    enableTilt={true}
                                                    clickEffect={true}
                                                    enableMagnetism={true}
                                                >
                                                    <LayoutDashboard className="w-16 h-16 mx-auto text-brand-border" />
                                                    <h3 className="mt-4 text-xl font-bold text-brand-text-primary">Your Dashboard is a Blank Canvas</h3>
                                                    <p className="mt-2 text-brand-text-secondary">Get started by adding individual widgets or apply a premade template.</p>
                                                    <div className="mt-6 flex justify-center gap-4">
                                                        <button onClick={() => setTemplateModalOpen(true)} className="inline-flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-accent transition-colors">
                                                            <LayoutGrid className="w-5 h-5" /> Choose a Template
                                                        </button>
                                                        <button onClick={() => setAddWidgetModalOpen(true)} className="inline-flex items-center gap-2 bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-6 rounded-lg hover:bg-brand-border transition-colors">
                                                            <Plus className="w-5 h-5" /> Add Widget
                                                        </button>
                                                    </div>
                                                </MagicBento>
                                            </div>
                                        )}
                                    </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {dragState.isDragging && dragState.widgetId && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{
                        left: dragState.ghostPosition.x - dragState.offset.x,
                        top: dragState.ghostPosition.y - dragState.offset.y,
                        width: `${((gridRef.current!.clientWidth - 24 * 11) / 12) * dragState.widgetSize.w + 24 * (dragState.widgetSize.w - 1)}px`,
                        height: '280px'
                    }}
                >
                    <MagicBento
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={false}
                        clickEffect={false}
                        enableMagnetism={false}
                    >
                        <div className="futuristic-border bg-brand-surface rounded-xl flex flex-col h-full scale-105">
                            <header className="flex items-center justify-between p-4 border-b border-brand-border flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="text-brand-text-secondary">{WIDGET_REGISTRY[dragState.widgetId].icon}</div>
                                    <h2 className="font-bold text-brand-text-primary">{WIDGET_REGISTRY[dragState.widgetId].title}</h2>
                                </div>
                            </header>
                            <div className="p-4 flex-grow overflow-hidden flex flex-col">
                                {dragState.ghostElement}
                            </div>
                        </div>
                    </MagicBento>
                </div>
            )}
            
            <AddWidgetModal isOpen={isAddWidgetModalOpen} onClose={() => setAddWidgetModalOpen(false)} />
            <TemplateLibraryModal isOpen={isTemplateModalOpen} onClose={() => setTemplateModalOpen(false)} />
            
            <ConfirmationModal
                isOpen={!!widgetToRemove}
                onClose={() => setWidgetToRemove(null)}
                onConfirm={handleConfirmRemoveWidget}
                title={`Remove Widget: "${widgetToRemove ? WIDGET_REGISTRY[widgetToRemove]?.title : ''}"?`}
                message="Are you sure you want to remove this widget from your dashboard? You can always add it back later."
                confirmText="Remove Widget"
            />
            <ConfirmationModal
                isOpen={!!tabToRemove}
                onClose={() => setTabToRemove(null)}
                onConfirm={handleConfirmRemoveTab}
                title={`Delete Dashboard: "${tabToRemoveDetails?.name}"?`}
                message="Are you sure you want to delete this dashboard tab and its layout? This action cannot be undone."
                confirmText="Delete Dashboard"
            />
        </div>
    );
};

export default Dashboard;

// Export individual widgets for use in dashboard page
export {
    CommandCenterWidget,
    LiveCampaignsWidget,
    ContentVelocityWidget,
    OpportunityRadarWidget,
    TalentSpotlightWidget,
    ClientHealthWidget,
    MonthlyRecurringRevenueWidget,
    ActiveCampaignsMetricWidget,
    CampaignSuccessRateWidget,
    AverageCampaignROIWidget,
    CreatorEngagementRateWidget,
    ClientSatisfactionScoreWidget,
    PipelineValueWidget,
    MonthlyProfitMarginWidget,
    TeamProductivityScoreWidget,
    RevenueByClientWidget,
    ContractStatusWidget,
    UpcomingRenewalsWidget,
    FinancialOverviewWidget,
    NewLeadsWidget,
    ClientPipelineWidget,
    OverdueTasksWidget,
    TodaysAgendaWidget,
    OverdueInvoicesWidget,
    RecentTransactionsWidget,
    PlatformPerformanceWidget,
    FollowerGrowthWidget,
    NotesWidget,
    TodoListWidget,
    CalendarWidget,
    TotalActiveCreatorsWidget,
    CreatorPaymentTrackerWidget,
    InvoiceStatusOverviewWidget,
    BudgetVsActualSpendWidget,
    CashFlowForecastWidget,
    AverageDealSizeWidget,
    RevenueGrowthRateWidget,
    ClientLifetimeValueWidget,
    CostPerAcquisitionWidget,
    ProfitByCampaignTypeWidget,
    TopPerformingCreatorsWidget,
    CreatorAvailabilityWidget,
    CreatorNicheDistributionWidget,
    CreatorEngagementTrendsWidget,
    NewCreatorOnboardingWidget,
    CreatorRatingSystemWidget,
    BrandRelationshipHealthWidget,
    CreatorPaymentHistoryWidget,
    CreatorPlatformMixWidget,
    CreatorGeographicDistributionWidget,
    CampaignTimelineViewWidget,
    ContentApprovalStatusWidget,
    PlatformPerformanceComparisonWidget,
    CampaignDeliveryTrackerWidget,
    EngagementRateByNicheWidget,
    SeasonalCampaignTrendsWidget,
    CampaignBudgetUtilizationWidget,
    ContentPerformanceHeatmapWidget,
    CampaignCompletionRateWidget,
    AudienceDemographicsWidget,
    AICampaignOptimizerWidget,
    SmartCreatorRecommendationsWidget,
    PredictiveRevenueForecastWidget,
    RiskAssessmentDashboardWidget,
    TrendAnalysisWidget,
    PerformanceAnomalyDetectorWidget,
    CompetitiveIntelligenceWidget,
    ContentStrategySuggestionsWidget,
    ChurnRiskIndicatorWidget,
    GrowthOpportunityScannerWidget
};