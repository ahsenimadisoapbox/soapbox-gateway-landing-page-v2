import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { severityColors } from "../../lib/mockData";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

export const SeverityBadge = ({ severity, className }: SeverityBadgeProps) => {
  const colorClass = severityColors[severity as keyof typeof severityColors] || "muted";

  return (
    <Badge variant="outline" className={cn(`border-${colorClass} text-${colorClass} bg-${colorClass}/10`, className)}>
      {severity}
    </Badge>
  );
};
