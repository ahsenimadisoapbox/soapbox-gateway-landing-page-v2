import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-destructive/15 text-destructive',
  info: 'bg-info/15 text-info',
  muted: 'bg-muted text-muted-foreground',
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper functions for common status mappings
export function getEmployeeStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'muted';
    case 'on-leave': return 'warning';
    default: return 'default';
  }
}

export function getExamStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'completed': return 'success';
    case 'scheduled': return 'info';
    case 'in-progress': return 'warning';
    case 'cancelled': return 'muted';
    default: return 'default';
  }
}

export function getExamResultVariant(result: string): BadgeVariant {
  switch (result) {
    case 'fit': return 'success';
    case 'fit-with-restrictions': return 'warning';
    case 'unfit': return 'error';
    case 'pending': return 'muted';
    default: return 'default';
  }
}

export function getTriageVariant(level: string): BadgeVariant {
  switch (level) {
    case 'red': return 'error';
    case 'amber': return 'warning';
    case 'green': return 'success';
    default: return 'default';
  }
}

export function getIllnessStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'open': return 'info';
    case 'investigating': return 'warning';
    case 'treatment': return 'warning';
    case 'closed': return 'success';
    default: return 'default';
  }
}

export function getRiskLevelVariant(level: string): BadgeVariant {
  switch (level) {
    case 'low': return 'success';
    case 'medium': return 'warning';
    case 'high': return 'error';
    default: return 'default';
  }
}
