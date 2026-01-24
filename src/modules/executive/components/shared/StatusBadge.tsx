import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'severity';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusStyles = () => {
    const lowerStatus = status.toLowerCase();
    
    if (variant === 'severity') {
      switch (lowerStatus) {
        case 'critical':
          return 'bg-destructive/10 text-destructive border-destructive/20';
        case 'high':
          return 'bg-warning/10 text-warning border-warning/20';
        case 'medium':
          return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
        case 'low':
          return 'bg-success/10 text-success border-success/20';
        default:
          return 'bg-muted text-muted-foreground';
      }
    }
    
    switch (lowerStatus) {
      case 'open':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'in-progress':
      case 'investigating':
      case 'mitigating':
        return 'bg-info/10 text-info border-info/20';
      case 'verification':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'closed':
      case 'compliant':
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'ineffective':
      case 'suspended':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'partial':
      case 'conditional':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", getStatusStyles())}
    >
      {status.replace('-', ' ')}
    </Badge>
  );
};

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'default';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  size = 'sm',
}) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-accent"
          onClick={onView}
          title="View"
        >
          <Eye className={iconSize} />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-info"
          onClick={onEdit}
          title="Edit"
        >
          <Edit className={iconSize} />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 className={iconSize} />
        </Button>
      )}
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  colorClass?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = true,
  colorClass = 'bg-accent',
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && <span className="text-sm font-medium">{value}%</span>}
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface TrendIndicatorProps {
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  suffix?: string;
  positive?: 'up' | 'down';
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  trend,
  suffix = '',
  positive = 'up',
}) => {
  const isPositive = trend === positive;
  const isNegative = trend !== positive && trend !== 'stable';
  
  return (
    <span
      className={cn(
        "inline-flex items-center text-sm font-medium",
        isPositive && "text-success",
        isNegative && "text-destructive",
        trend === 'stable' && "text-muted-foreground"
      )}
    >
      {trend === 'up' && '↑'}
      {trend === 'down' && '↓'}
      {trend === 'stable' && '—'}
      {' '}
      {value}{suffix}
    </span>
  );
};

export default StatusBadge;
