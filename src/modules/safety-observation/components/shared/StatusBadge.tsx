import React from 'react';
import { cn } from '../../lib/utils';

type StatusType = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'active' | 'inactive' |
  'compliant' | 'non-compliant' | 'pending-review' | 'draft' | 'submitted' | 'approved' | 'rejected' |
  'effective' | 'partially-effective' | 'ineffective' | 'open' | 'planned' | 'cancelled' |
  'internal' | 'external' | 'low' | 'medium' | 'high' | 'critical';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-badge bg-warning/15 text-warning' },
  'in-progress': { label: 'In Progress', className: 'status-badge bg-info/15 text-info' },
  completed: { label: 'Completed', className: 'status-badge bg-success/15 text-success' },
  overdue: { label: 'Overdue', className: 'status-badge bg-destructive/15 text-destructive' },
  active: { label: 'Active', className: 'status-badge bg-success/15 text-success' },
  inactive: { label: 'Inactive', className: 'status-badge bg-muted text-muted-foreground' },
  compliant: { label: 'Compliant', className: 'status-badge bg-success/15 text-success' },
  'non-compliant': { label: 'Non-Compliant', className: 'status-badge bg-destructive/15 text-destructive' },
  'pending-review': { label: 'Pending Review', className: 'status-badge bg-warning/15 text-warning' },
  draft: { label: 'Draft', className: 'status-badge bg-muted text-muted-foreground' },
  submitted: { label: 'Submitted', className: 'status-badge bg-info/15 text-info' },
  approved: { label: 'Approved', className: 'status-badge bg-success/15 text-success' },
  rejected: { label: 'Rejected', className: 'status-badge bg-destructive/15 text-destructive' },
  effective: { label: 'Effective', className: 'status-badge bg-success/15 text-success' },
  'partially-effective': { label: 'Partially Effective', className: 'status-badge bg-warning/15 text-warning' },
  ineffective: { label: 'Ineffective', className: 'status-badge bg-destructive/15 text-destructive' },
  open: { label: 'Open', className: 'status-badge bg-info/15 text-info' },
  planned: { label: 'Planned', className: 'status-badge bg-primary/15 text-primary' },
  cancelled: { label: 'Cancelled', className: 'status-badge bg-muted text-muted-foreground' },
  internal: { label: 'Internal', className: 'status-badge bg-primary/15 text-primary' },
  external: { label: 'External', className: 'status-badge bg-accent text-accent-foreground' },
  low: { label: 'Low', className: 'status-badge bg-success/15 text-success' },
  medium: { label: 'Medium', className: 'status-badge bg-warning/15 text-warning' },
  high: { label: 'High', className: 'status-badge bg-destructive/15 text-destructive' },
  critical: { label: 'Critical', className: 'status-badge bg-destructive text-destructive-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'status-badge bg-muted text-muted-foreground' };

  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}
