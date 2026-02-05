import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  CheckSquare,
  FileSearch,
  AlertCircle,
  Bell,
  BarChart3,
  Settings,
  Link as LinkIcon,
  Smartphone,
  Shield,
  HelpCircle,
  ChevronDown,
  FileText,
  Users,
  Building,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navGroups: NavGroup[] = [
  {
    title: "Dashboard & Overview",
    items: [
      { title: "Dashboard", href: "/inspection/dashboard", icon: LayoutDashboard },
      { title: "My Tasks", href: "/inspection/my-tasks", icon: CheckSquare },
      { title: "Calendar", href: "/inspection/calendar", icon: Calendar },
    ],
  },
  {
    title: "Planning & Scheduling",
    items: [
      { title: "Schedules", href: "/inspection/schedules", icon: Calendar },
      { title: "Create Schedule", href: "/inspection/schedules/create", icon: ClipboardList },
    ],
  },
  {
    title: "Templates & Checklists",
    items: [
      { title: "Template Library", href: "/inspection/templates", icon: FileText },
      { title: "Create Template", href: "/inspection/templates/create", icon: ClipboardList },
    ],
  },
  {
    title: "Execution & Field",
    items: [
      { title: "Execute Inspection", href: "/inspection/execute", icon: CheckSquare },
      { title: "Evidence Library", href: "/inspection/evidence", icon: FileSearch },
    ],
  },
  {
    title: "Review & Approval",
    items: [
      { title: "Review Queue", href: "/inspection/reviews", icon: FileSearch },
      { title: "Approvals", href: "/inspection/approvals", icon: CheckSquare },
    ],
  },
  {
    title: "Findings & CAPA",
    items: [
      { title: "Findings Dashboard", href: "/inspection/findings", icon: AlertCircle },
      { title: "CAPA Management", href: "/inspection/capa", icon: LinkIcon },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      { title: "Analytics", href: "/inspection/analytics", icon: BarChart3 },
      { title: "Reports", href: "/inspection/reports", icon: FileText },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Settings & Admin", href: "/inspection/admin", icon: Settings },
      { title: "User Management", href: "/inspection/admin/users", icon: Users },
      { title: "Organization", href: "/inspection/admin/organization", icon: Building },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Integrations", href: "/inspection/integrations", icon: LinkIcon },
      { title: "Mobile / PWA", href: "/inspection/pwa", icon: Smartphone },
      { title: "Security", href: "/inspection/security", icon: Shield },
      { title: "Help & Training", href: "/inspection/help", icon: HelpCircle },
    ],
  },
];

export const Sidebar = ({ collapsed }: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Dashboard & Overview"]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h2 className={cn("text-sidebar-foreground font-bold text-lg", collapsed && "text-center text-xs")}>
          {collapsed ? "IM" : "Inspection Module"}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navGroups.map((group) => {
          const isExpanded = expandedGroups.includes(group.title);
          
          return (
            <div key={group.title} className="mb-2">
              {!collapsed && (
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent text-xs font-semibold mb-1"
                  onClick={() => toggleGroup(group.title)}
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                  />
                </Button>
              )}
              
              {(isExpanded || collapsed) && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive && "bg-sidebar-primary text-sidebar-primary-foreground font-medium",
                          collapsed && "justify-center"
                        )
                      }
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
