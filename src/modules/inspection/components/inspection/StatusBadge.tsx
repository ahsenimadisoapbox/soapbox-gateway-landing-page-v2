import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { statusColors } from "../../lib/mockData";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const colorClass = statusColors[status as keyof typeof statusColors] || "muted";

  const displayStatus = status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge variant="outline" className={cn(`border-${colorClass} text-${colorClass} bg-${colorClass}/10`, className)}>
      {displayStatus}
    </Badge>
  );
};
