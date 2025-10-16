import { useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import useStore from '../../../hooks/useStore';

interface Transaction {
    type: 'income' | 'expense';
    amount: number;
    date: string;
}

const FinancialOverviewWidget: React.FC = () => {
    const { transactions } = useStore();
    const svgRef = useRef<SVGSVGElement>(null);

    const { totalIncome, totalExpenses, netProfit, monthlyData } = useMemo(() => {
        const income = d3.sum(transactions.filter(t => t.type === 'income'), (t: Transaction) => t.amount) || 0;
        const expenses = d3.sum(transactions.filter(t => t.type === 'expense'), (t: Transaction) => t.amount) || 0;

        const data = d3.rollups(
            transactions,
            v => d3.sum(v, (d: Transaction) => d.amount) || 0,
            (d: Transaction) => `${new Date(d.date).getFullYear()}-${String(new Date(d.date).getMonth() + 1).padStart(2, '0')}`,
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
        <div className="flex flex-col h-full space-y-4 futuristic-border rounded-lg p-4 hover:shadow-glow-md transition-all duration-300">
             <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-brand-bg p-3 rounded-lg hover:shadow-glow-sm transition-all duration-300">
                    <p className="text-xs text-brand-text-secondary">Total Revenue</p>
                    <p className="font-bold text-lg text-brand-success">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg hover:shadow-glow-sm transition-all duration-300">
                    <p className="text-xs text-brand-text-secondary">Total Expenses</p>
                    <p className="font-bold text-lg text-brand-warning">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="bg-brand-bg p-3 rounded-lg hover:shadow-glow-sm transition-all duration-300">
                    <p className="text-xs text-brand-text-secondary">Net Profit</p>
                    <p className={`font-bold text-lg ${netProfit >= 0 ? 'text-brand-success' : 'text-red-500'}`}>{formatCurrency(netProfit)}</p>
                </div>
            </div>
            <div className="flex-grow">
                <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
        </div>
    );
};

export default FinancialOverviewWidget;