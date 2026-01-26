import { IncidentStatus } from "../lib/mockData";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: IncidentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<IncidentStatus, string> = {
    NEW: "bg-status-new text-white",
    ASSIGNED: "bg-status-assigned text-white",
    IN_PROGRESS: "bg-status-in-progress text-white",
    PENDING_APPROVAL: "bg-status-pending text-white",
    CLOSED: "bg-status-closed text-white",
    REJECTED: "bg-status-rejected text-white",
  };

  const labels: Record<IncidentStatus, string> = {
    NEW: "New",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    PENDING_APPROVAL: "Pending Approval",
    CLOSED: "Closed",
    REJECTED: "Rejected",
  };

  return (
    <Badge className={variants[status]} variant="default">
      {labels[status]}
    </Badge>
  );
}
