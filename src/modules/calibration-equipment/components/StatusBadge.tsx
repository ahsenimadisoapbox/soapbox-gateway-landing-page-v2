import { cn } from '../lib/utils';

export type StatusType = 'active' | 'due' | 'overdue' | 'restricted' | 'retired' | 'draft' | 'pending' | 'in_progress' | 'completed' | 'oot' | 'open' | 'investigation' | 'closed' | 'cancelled' | 'pending_review';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string; tooltip: string }> = {
  active: { label: 'Active', className: 'status-active', tooltip: 'Equipment is usable and within specification' },
  due: { label: 'Due', className: 'status-due', tooltip: 'Calibration or maintenance due soon' },
  overdue: { label: 'Overdue', className: 'status-overdue', tooltip: 'Calibration or maintenance is overdue - action required' },
  restricted: { label: 'Not Fit For Use', className: 'status-restricted', tooltip: 'Equipment is locked and cannot be used' },
  retired: { label: 'Retired', className: 'status-retired', tooltip: 'Equipment is no longer in service' },
  draft: { label: 'Draft', className: 'status-draft', tooltip: 'Equipment record is in draft status' },
  pending: { label: 'Pending', className: 'status-due', tooltip: 'Task is pending execution' },
  in_progress: { label: 'In Progress', className: 'status-due', tooltip: 'Task is currently being executed' },
  completed: { label: 'Completed', className: 'status-active', tooltip: 'Task has been completed' },
  oot: { label: 'OOT', className: 'status-overdue', tooltip: 'Out of Tolerance - Investigation required' },
  open: { label: 'Open', className: 'status-overdue', tooltip: 'Investigation is open' },
  investigation: { label: 'Investigation', className: 'status-due', tooltip: 'Under investigation' },
  pending_review: { label: 'Pending Review', className: 'status-due', tooltip: 'Pending review and approval' },
  closed: { label: 'Closed', className: 'status-active', tooltip: 'Investigation closed' },
  cancelled: { label: 'Cancelled', className: 'status-retired', tooltip: 'Task was cancelled' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn('status-badge', config.className, className)}
      title={config.tooltip}
    >
      {config.label}
    </span>
  );
}

// Risk Badge
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  critical: { label: 'Critical', className: 'bg-risk-critical text-white' },
  high: { label: 'High', className: 'bg-risk-high text-white' },
  medium: { label: 'Medium', className: 'bg-risk-medium text-white' },
  low: { label: 'Low', className: 'bg-risk-low text-white' },
};

export function RiskBadge({ level, score, className }: RiskBadgeProps) {
  const config = riskConfig[level];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
      {score !== undefined && ` (${score})`}
    </span>
  );
}
