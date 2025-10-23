import * as React from 'react';
import useStore from '../../../hooks/useStore';
import { Radar, TrendingUp, Target, DollarSign, Users, Globe } from 'lucide-react';
import * as d3 from 'd3';

interface ChartData {
    category: string;
    value: number;
    potential: number;
    color: string;
}

interface OpportunityData {
  category: string;
  value: number;
  potential: number;
  color: string;
}

const OpportunityRadarWidget: React.FC = () => {
  const { supabaseInfluencers, supabaseBrands, contracts, supabaseLoading } = useStore();

  const opportunityData = React.useMemo((): OpportunityData[] => {
    const totalInfluencers = supabaseInfluencers.length;
    const totalBrands = supabaseBrands.length;
    const activeContracts = contracts.filter(c => c.status === 'Signed').length;
    const totalRevenue = contracts
      .filter(c => c.status === 'Signed')
      .reduce((sum, c) => sum + (c.value || 0), 0);

    // Calculate opportunities based on available data
    const newInfluencerLeads = supabaseInfluencers.filter(i =>
      i.status === 'lead' || i.status === 'contacted'
    ).length;

    const newBrandProspects = supabaseBrands.filter(b =>
      !b.website || b.notes?.toLowerCase().includes('prospect')
    ).length;

    const expansionOpportunities = Math.floor(totalBrands * 0.3); // 30% expansion potential
    const revenueGrowth = Math.floor(totalRevenue * 0.25); // 25% growth potential

    return [
      {
        category: 'New Partnerships',
        value: Math.min(newInfluencerLeads + newBrandProspects, 100),
        potential: 85,
        color: '#8B5CF6'
      },
      {
        category: 'Campaign Opportunities',
        value: Math.min(activeContracts * 15, 100),
        potential: 90,
        color: '#06B6D4'
      },
      {
        category: 'Market Expansion',
        value: Math.min(expansionOpportunities * 10, 100),
        potential: 75,
        color: '#10B981'
      },
      {
        category: 'Revenue Growth',
        value: Math.min((revenueGrowth / 10000) * 5, 100),
        potential: 95,
        color: '#F59E0B'
      },
      {
        category: 'Content Opportunities',
        value: Math.min(totalInfluencers * 8, 100),
        potential: 80,
        color: '#EF4444'
      },
      {
        category: 'Brand Collaborations',
        value: Math.min(totalBrands * 12, 100),
        potential: 88,
        color: '#EC4899'
      }
    ];
  }, [supabaseInfluencers, supabaseBrands, contracts]);

  const renderRadarChart = React.useCallback(() => {
    const svg = d3.select('#radar-chart');
    svg.selectAll('*').remove(); // Clear previous render

    // Use responsive width detection like the Vite component
    const node = svg.node();
    const parent = node && 'parentElement' in node ? (node as SVGSVGElement).parentElement : null;
    const width = parent?.clientWidth || 280;
    const height = 200;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const angleSlice = (Math.PI * 2) / opportunityData.length;

    // Create scales
    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    // Create radial lines (axes)
    const axes = svg.selectAll('.axis')
      .data(opportunityData)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', width / 2)
      .attr('y1', height / 2)
      .attr('x2', width / 2)
      .attr('y2', height / 2)
      .style('stroke', '#E5E7EB')
      .style('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .duration(700)
      .delay((d, i) => i * 120)
      .ease(d3.easeExpOut)
      .attr('x2', (d, i) => width / 2 + radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => height / 2 + radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style('opacity', 1);

    // Add grid circles with staggered animation
    for (let level = 1; level <= 5; level++) {
      svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 0)
        .style('fill', 'none')
        .style('stroke', '#E5E7EB')
        .style('stroke-width', 0.5)
        .style('opacity', 0)
        .transition()
        .duration(600)
        .delay(level * 80)
        .ease(d3.easeCircleOut)
        .attr('r', (radius / 5) * level)
        .style('opacity', 0.3);
    }

    // Create data area
    const line = d3.lineRadial<OpportunityData>()
      .radius((d: OpportunityData) => rScale(d.value))
      .angle((d: OpportunityData, i: number) => angleSlice * i)
      .curve(d3.curveLinearClosed);

    // Current values area with smooth animation
    svg.append('path')
      .datum(opportunityData)
      .attr('d', (data) => line(data))
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .style('fill', 'rgba(59, 130, 246, 0.1)')
      .style('stroke', '#3B82F6')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .style('opacity', 1);

    // Potential values area
    const potentialLine = d3.lineRadial<OpportunityData>()
      .radius((d: OpportunityData) => rScale(d.potential))
      .angle((d: OpportunityData, i: number) => angleSlice * i)
      .curve(d3.curveLinearClosed);

    svg.append('path')
      .datum(opportunityData)
      .attr('d', (data) => potentialLine(data))
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .style('fill', 'none')
      .style('stroke', '#10B981')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5,5')
      .style('opacity', 0.6);

    // Add data points for current values with animation
    svg.selectAll('.data-point')
      .data(opportunityData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d, i) => width / 2 + rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => height / 2 + rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('r', 0)
      .style('fill', '#3B82F6')
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .ease(d3.easeBackOut)
      .attr('r', 4);

    // Add category labels with final animation
    svg.selectAll('.label')
      .data(opportunityData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', (d, i) => width / 2 + (radius + 15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => height / 2 + (radius + 15) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('text-anchor', (d, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        if (Math.abs(angle) < Math.PI / 12) return 'middle';
        return angle > 0 ? 'start' : 'end';
      })
      .attr('dominant-baseline', 'middle')
      .style('font-size', '10px')
      .style('fill', '#6B7280')
      .style('opacity', 0)
      .text(d => d.category)
      .transition()
      .duration(500)
      .delay((d, i) => 1000 + i * 100)
      .style('opacity', 1);

  }, [opportunityData]);

  React.useEffect(() => {
    if (opportunityData.length > 0) {
      renderRadarChart();
    }
  }, [renderRadarChart]);

  // Re-render on window resize for full responsiveness
  React.useEffect(() => {
    const handleResize = () => {
      if (opportunityData.length > 0) {
        setTimeout(renderRadarChart, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [opportunityData.length, renderRadarChart]);

  if (supabaseLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-brand-text-secondary">Loading...</div>
      </div>
    );
  }

  const totalOpportunityScore = React.useMemo(() => {
    return Math.round(opportunityData.reduce((sum, opp) => sum + opp.value, 0) / opportunityData.length);
  }, [opportunityData]);

  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-text-primary">Opportunity Radar</h3>
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-brand-primary" />
          <span className="text-sm font-medium text-brand-primary">{totalOpportunityScore}%</span>
        </div>
      </div>

      {opportunityData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Target className="w-12 h-12 text-brand-text-secondary mb-2" />
          <p className="text-brand-text-secondary text-sm">No opportunity data</p>
          <p className="text-xs text-brand-text-secondary/70">Opportunities will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Radar Chart */}
          <div className="flex justify-center w-full">
            <svg
              ref={(node) => {
                if (node && !node.hasAttribute('data-initialized')) {
                  node.setAttribute('data-initialized', 'true');
                  // Re-render chart when SVG is mounted for proper width calculation
                  if (opportunityData.length > 0) {
                    setTimeout(() => renderRadarChart(), 100);
                  }
                }
              }}
              id="radar-chart"
              width="100%"
              height="200"
              className="overflow-visible"
              style={{ minWidth: '200px' }}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-brand-text-secondary">Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-green-500" style={{ background: 'repeating-linear-gradient(to right, #10B981 0px, #10B981 5px, transparent 5px, transparent 8px)' }}></div>
              <span className="text-brand-text-secondary">Potential</span>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="space-y-2">
            {opportunityData.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-brand-bg rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: opportunity.color }}
                  ></div>
                  <span className="text-sm text-brand-text-primary truncate">
                    {opportunity.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-brand-text-primary text-sm">
                    {opportunity.value}%
                  </div>
                  <div className="text-xs text-brand-text-secondary">
                    of {opportunity.potential}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="pt-3 border-t border-brand-border">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-brand-text-primary">
                  {opportunityData.length}
                </div>
                <div className="text-xs text-brand-text-secondary">
                  Opportunity Areas
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-brand-text-primary">
                  {totalOpportunityScore}%
                </div>
                <div className="text-xs text-brand-text-secondary">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityRadarWidget;