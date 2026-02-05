import { NCRStatus, Severity } from '../../types/ncr';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: NCRStatus;
}

const statusStyles: Record<NCRStatus, string> = {
  'Draft': 'status-draft',
  'Submitted': 'status-submitted',
  'Validated': 'status-validated',
  'Under Investigation': 'status-investigation',
  'RCA Submitted': 'bg-info/20 text-info',
  'RCA Approved': 'bg-success/20 text-success',
  'CAPA In Progress': 'status-investigation',
  'CAPA Completed': 'bg-success/20 text-success',
  'Verification Pending': 'bg-warning/20 text-warning',
  'Closed': 'status-closed',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn('status-badge', statusStyles[status])}>
      {status}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: Severity;
}

const severityStyles: Record<Severity, string> = {
  'Critical': 'severity-critical',
  'Major': 'severity-major',
  'Minor': 'severity-minor',
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span className={cn('status-badge', severityStyles[severity])}>
      {severity}
    </span>
  );
}

interface CAPAStatusBadgeProps {
  status: 'Open' | 'In Progress' | 'Awaiting Verification' | 'Closed';
}

const capaStatusStyles: Record<string, string> = {
  'Open': 'bg-info/20 text-info',
  'In Progress': 'bg-warning/20 text-warning',
  'Awaiting Verification': 'bg-primary/20 text-primary',
  'Closed': 'bg-success/20 text-success',
};

export function CAPAStatusBadge({ status }: CAPAStatusBadgeProps) {
  return (
    <span className={cn('status-badge', capaStatusStyles[status])}>
      {status}
    </span>
  );
}
