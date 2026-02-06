import { Badge } from "../ui/badge";
import { CapaPriority } from "../../types/capa";

interface PriorityBadgeProps {
  priority: CapaPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variants: Record<CapaPriority, { label: string; className: string }> = {
    critical: { label: "Critical", className: "bg-priority-critical text-white" },
    high: { label: "High", className: "bg-priority-high text-white" },
    medium: { label: "Medium", className: "bg-priority-medium text-white" },
    low: { label: "Low", className: "bg-priority-low text-white" },
  };

  const { label, className } = variants[priority];

  return <Badge className={className}>{label}</Badge>;
}
