import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  url?: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  colorIndex?: number;
  hoverBadge?: string;
}

const iconColors = [
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-cyan-100", text: "text-cyan-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
];

const hoverBadges = [
  "Recommended for regulated industries",
  "AI-enabled insights available",
  "Enterprise-grade compliance",
  "Advanced analytics powered",
];

const ModuleCard = ({ 
  title, 
  description, 
  url, 
  icon: Icon, 
  comingSoon, 
  colorIndex = 0,
  hoverBadge 
}: ModuleCardProps) => {
  const isDisabled = !url || comingSoon;
  const colorIdx = colorIndex % iconColors.length;
  const badge = hoverBadge || hoverBadges[colorIndex % hoverBadges.length];

  const handleClick = () => {
    if (url && !comingSoon) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        module-card relative rounded-xl p-4 h-full flex flex-col
        transition-all duration-300 border
        ${
          isDisabled
            ? "glass-card-disabled cursor-not-allowed"
            : "glass-card-hover"
        }
      `}
    >
      {/* Hover Badge */}
      {!isDisabled && (
        <span className="module-badge">
          {badge}
        </span>
      )}
      
      {/* Icon + Title Row */}
      <div className="flex items-center gap-3 mb-2.5">
        <div className={`p-2 rounded-lg ${iconColors[colorIdx].bg} shrink-0`}>
          <Icon className={`h-4 w-4 ${iconColors[colorIdx].text}`} />
        </div>
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-xs leading-relaxed flex-1 line-clamp-2">
        {description}
      </p>

      {/* Coming Soon Badge */}
      {comingSoon && (
        <span className="mt-2.5 px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full w-fit">
          Coming Soon
        </span>
      )}
    </div>
  );
};

export default ModuleCard;
