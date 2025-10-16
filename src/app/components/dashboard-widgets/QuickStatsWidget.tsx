import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { DollarSign, ListTodo, Activity } from 'lucide-react';

const QuickStatsWidget: React.FC = () => {
    const { campaigns, tasks, transactions } = useStore();

    const activeCampaigns = campaigns.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary flex items-center gap-2"><Activity className="w-4 h-4" /> Active Campaigns</span>
                <span className="text-2xl font-bold text-brand-primary">{activeCampaigns}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary flex items-center gap-2"><DollarSign className="w-4 h-4" /> Total Revenue</span>
                <span className="text-2xl font-bold text-brand-success">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-brand-text-secondary flex items-center gap-2"><ListTodo className="w-4 h-4" /> Pending Tasks</span>
                <span className="text-2xl font-bold text-brand-warning">{pendingTasks}</span>
            </div>
        </div>
    );
};

export default QuickStatsWidget;