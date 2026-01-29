import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface KPICardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const variantStyles = {
  default: 'border-border',
  success: 'border-status-active border-l-4',
  warning: 'border-status-due border-l-4',
  danger: 'border-status-overdue border-l-4',
};

export function KPICard({ title, value, icon: Icon, variant = 'default', onClick }: KPICardProps) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "kpi-card text-left w-full transition-all",
        variantStyles[variant],
        onClick && "hover:shadow-md cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="kpi-value">{value}</p>
          <p className="kpi-label">{title}</p>
        </div>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === 'success' && "bg-status-active-bg text-status-active",
            variant === 'warning' && "bg-status-due-bg text-status-due",
            variant === 'danger' && "bg-status-overdue-bg text-status-overdue",
            variant === 'default' && "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </button>
  );
}
