import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  trendValue,
  colorClass = 'border-l-accent',
  icon,
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColorClass = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <div className={cn(
      "kpi-card border-l-4 flex items-center gap-4",
      colorClass
    )}>
      {icon && (
        <div className="text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="kpi-label truncate">{label}</p>
        <p className="kpi-value text-foreground">{value}</p>
      </div>
      {trend && (
        <div className={cn("flex flex-col items-end", trendColorClass)}>
          <TrendIcon className="h-4 w-4" />
          {trendValue && (
            <span className="text-xs mt-0.5">{trendValue}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface KPIStripProps {
  className?: string;
}

export const KPIStrip: React.FC<KPIStripProps> = ({ className }) => {
  const kpis = [
    { label: 'Risk Score', value: '72/100', trend: 'down' as const, trendValue: '↓ 5%', colorClass: 'border-l-destructive' },
    { label: 'Compliance', value: '94%', trend: 'up' as const, trendValue: '↑ 2%', colorClass: 'border-l-success' },
    { label: 'Incidents', value: '↓ 18%', trend: 'down' as const, trendValue: 'vs Q3', colorClass: 'border-l-info' },
    { label: 'CAPA Aging', value: '12', trend: 'stable' as const, trendValue: '⚠ Overdue', colorClass: 'border-l-warning' },
    { label: 'ESG Rating', value: 'B+', trend: 'up' as const, trendValue: '↑ from B', colorClass: 'border-l-chart-4' },
  ];

  return (
    <div className={cn(
      "bg-card border-b border-border p-4 sticky top-14 z-40",
      className
    )}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
};

export default KPIStrip;
