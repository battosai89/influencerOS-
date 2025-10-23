import React from 'react';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  type,
  title,
  data,
  loading = false,
  error,
  height = 256,
  className = '',
  showLegend = true,
  showGrid = true
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`futuristic-border bg-brand-surface rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
        <div
          className="bg-brand-bg rounded-lg flex items-center justify-center animate-pulse"
          style={{ height: `${height}px` }}
        >
          <div className="text-brand-text-secondary">Loading chart data...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`futuristic-border bg-brand-surface rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
        <div
          className="bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400"
          style={{ height: `${height}px` }}
        >
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠</div>
            <div className="text-sm">Error loading chart: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!data || data.length === 0) {
    return (
      <div className={`futuristic-border bg-brand-surface rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-4">{title}</h3>
        <div
          className="bg-brand-bg rounded-lg flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <div className="text-brand-text-secondary">No data available</div>
        </div>
      </div>
    );
  }

  // Render chart based on type (placeholder for actual chart library integration)
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart data={data} height={height} showGrid={showGrid} />;
      case 'line':
        return <LineChart data={data} height={height} showGrid={showGrid} />;
      case 'pie':
        return <PieChart data={data} height={height} />;
      case 'area':
        return <AreaChart data={data} height={height} showGrid={showGrid} />;
      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className={`futuristic-border bg-brand-surface rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-text-primary">{title}</h3>
        {showLegend && data.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-brand-text-secondary">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color || '#8B5CF6' }}
                ></div>
                <span className="truncate max-w-20">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {renderChart()}
      </div>
    </div>
  );
};

// Simple chart implementations (replace with actual chart library like Chart.js or Recharts)
const BarChart: React.FC<{ data: ChartDataPoint[]; height: number; showGrid: boolean }> = ({
  data,
  height,
  showGrid
}) => (
  <div className="relative" style={{ height: `${height}px` }}>
    <div className="flex items-end justify-center gap-2 h-full">
      {data.map((item, index) => {
        const maxValue = Math.max(...data.map(d => d.value));
        const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 40) : 0;

        return (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-16">
            <div className="text-xs text-brand-text-secondary truncate w-full text-center">
              {item.label}
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 justify-end">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${Math.max(barHeight, 2)}px`,
                  backgroundColor: item.color || '#8B5CF6',
                  minHeight: '2px'
                }}
              />
              <div className="text-xs font-medium text-brand-text-primary">
                {item.value.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {showGrid && (
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full border-l border-b border-brand-border opacity-20" />
        <div className="absolute top-0 right-0 h-full border-r border-brand-border opacity-20" />
      </div>
    )}
  </div>
);

const LineChart: React.FC<{ data: ChartDataPoint[]; height: number; showGrid: boolean }> = ({
  data,
  height,
  showGrid
}) => (
  <div className="relative" style={{ height: `${height}px` }}>
    <svg className="w-full h-full" viewBox={`0 0 300 ${height}`}>
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 280 + 10;
        const y = height - ((item.value / Math.max(...data.map(d => d.value))) * (height - 40)) - 20;
        const color = item.color || '#8B5CF6';

        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className="hover:r-6 transition-all"
            />
            {index < data.length - 1 && (
              <line
                x1={x}
                y1={y}
                x2={((index + 1) / (data.length - 1)) * 280 + 10}
                y2={height - ((data[index + 1].value / Math.max(...data.map(d => d.value))) * (height - 40)) - 20}
                stroke={color}
                strokeWidth="2"
                className="hover:stroke-3 transition-all"
              />
            )}
          </g>
        );
      })}
    </svg>

    {showGrid && (
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full border-l border-b border-brand-border opacity-20" />
        <div className="absolute top-0 right-0 h-full border-r border-brand-border opacity-20" />
      </div>
    )}
  </div>
);

const PieChart: React.FC<{ data: ChartDataPoint[]; height: number }> = ({
  data,
  height
}) => (
  <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
    <div className="relative">
      <svg width={height - 40} height={height - 40} viewBox={`0 0 ${height - 40} ${height - 40}`}>
        {data.map((item, index) => {
          const total = data.reduce((sum, d) => sum + d.value, 0);
          const percentage = total > 0 ? item.value / total : 0;

          // Simple pie slice calculation (for demo - replace with proper implementation)
          const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 360, 0);
          const endAngle = startAngle + percentage * 360;

          const startAngleRad = (startAngle * Math.PI) / 180;
          const endAngleRad = (endAngle * Math.PI) / 180;

          const x1 = Math.cos(startAngleRad) * 80 + 90;
          const y1 = Math.sin(startAngleRad) * 80 + 90;
          const x2 = Math.cos(endAngleRad) * 80 + 90;
          const y2 = Math.sin(endAngleRad) * 80 + 90;

          const largeArcFlag = percentage > 0.5 ? 1 : 0;

          const pathData = [
            `M 90 90`,
            `L ${x1} ${y1}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-brand-text-primary">
            {data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </div>
          <div className="text-xs text-brand-text-secondary">Total</div>
        </div>
      </div>
    </div>
  </div>
);

const AreaChart: React.FC<{ data: ChartDataPoint[]; height: number; showGrid: boolean }> = ({
  data,
  height,
  showGrid
}) => (
  <div className="relative" style={{ height: `${height}px` }}>
    <svg className="w-full h-full" viewBox={`0 0 300 ${height}`}>
      <defs>
        <linearGradient id={`gradient-${Math.random()}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={`M 10 ${height - 20} ${data.map((item, index) => {
          const x = (index / (data.length - 1)) * 280 + 10;
          const y = height - ((item.value / Math.max(...data.map(d => d.value))) * (height - 40)) - 20;
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')} L ${280 + 10} ${height - 20} Z`}
        fill="url(#gradient)"
      />

      {/* Line */}
      <path
        d={`M ${data.map((item, index) => {
          const x = (index / (data.length - 1)) * 280 + 10;
          const y = height - ((item.value / Math.max(...data.map(d => d.value))) * (height - 40)) - 20;
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')}`}
        stroke="#8B5CF6"
        strokeWidth="2"
        fill="none"
      />

      {/* Points */}
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 280 + 10;
        const y = height - ((item.value / Math.max(...data.map(d => d.value))) * (height - 40)) - 20;

        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="4"
            fill="#8B5CF6"
            className="hover:r-6 transition-all"
          />
        );
      })}
    </svg>

    {showGrid && (
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full border-l border-b border-brand-border opacity-20" />
        <div className="absolute top-0 right-0 h-full border-r border-brand-border opacity-20" />
      </div>
    )}
  </div>
);

export default Chart;