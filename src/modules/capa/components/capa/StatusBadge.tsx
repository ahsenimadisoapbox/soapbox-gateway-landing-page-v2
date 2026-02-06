import { Badge } from "../ui/badge";
import { CapaStatus } from "../../types/capa";

interface StatusBadgeProps {
  status: CapaStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<CapaStatus, { label: string; className: string }> = {
    open: { label: "Open", className: "bg-status-open text-white" },
    "in-progress": { label: "In Progress", className: "bg-status-in-progress text-white" },
    "pending-review": { label: "Pending Review", className: "bg-info text-white" },
    closed: { label: "Closed", className: "bg-status-closed text-white" },
    overdue: { label: "Overdue", className: "bg-status-overdue text-white" },
  };

  const { label, className } = variants[status];

  return <Badge className={className}>{label}</Badge>;
}
