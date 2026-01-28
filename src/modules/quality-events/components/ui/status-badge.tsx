import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        draft: 'bg-muted text-muted-foreground',
        submitted: 'bg-info/10 text-info border border-info/20',
        triage: 'bg-warning/10 text-warning border border-warning/20',
        validated: 'bg-primary/10 text-primary border border-primary/20',
        escalated: 'bg-destructive/10 text-destructive border border-destructive/20',
        closed: 'bg-success/10 text-success border border-success/20',
        open: 'bg-info/10 text-info border border-info/20',
        'in-progress': 'bg-warning/10 text-warning border border-warning/20',
        containment: 'bg-warning/10 text-warning border border-warning/20',
        investigation: 'bg-info/10 text-info border border-info/20',
        'corrective-action': 'bg-primary/10 text-primary border border-primary/20',
        review: 'bg-primary/10 text-primary border border-primary/20',
        pending: 'bg-muted text-muted-foreground border border-border',
        completed: 'bg-success/10 text-success border border-success/20',
        verified: 'bg-success/10 text-success border border-success/20',
        active: 'bg-success/10 text-success border border-success/20',
        inactive: 'bg-muted text-muted-foreground border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const priorityBadgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      priority: {
        low: 'bg-success/10 text-success',
        medium: 'bg-warning/10 text-warning',
        high: 'bg-destructive/20 text-destructive',
        critical: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      priority: 'low',
    },
  }
);

const severityBadgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      severity: {
        minor: 'bg-success/10 text-success',
        major: 'bg-warning/10 text-warning',
        critical: 'bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      severity: 'minor',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

export function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {variant?.toString().replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
    </span>
  );
}

export interface PriorityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof priorityBadgeVariants> {}

export function PriorityBadge({ className, priority, ...props }: PriorityBadgeProps) {
  return (
    <span className={cn(priorityBadgeVariants({ priority }), className)} {...props}>
      {priority}
    </span>
  );
}

export interface SeverityBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof severityBadgeVariants> {}

export function SeverityBadge({ className, severity, ...props }: SeverityBadgeProps) {
  return (
    <span className={cn(severityBadgeVariants({ severity }), className)} {...props}>
      {severity}
    </span>
  );
}

// Risk Score Indicator
interface RiskScoreProps {
  score: number;
  showLabel?: boolean;
}

export function RiskScore({ score, showLabel = true }: RiskScoreProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'High', color: 'bg-destructive', textColor: 'text-destructive' };
    if (score >= 40) return { level: 'Medium', color: 'bg-warning', textColor: 'text-warning' };
    return { level: 'Low', color: 'bg-success', textColor: 'text-success' };
  };

  const { level, color, textColor } = getRiskLevel(score);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-20">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn('text-xs font-medium', textColor)}>
        {score}
        {showLabel && ` (${level})`}
      </span>
    </div>
  );
}
