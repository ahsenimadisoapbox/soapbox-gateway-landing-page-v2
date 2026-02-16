import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  CalendarClock,
  FileText,
  PlayCircle,
  Camera,
  CheckSquare,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  FileBarChart2,
  Settings,
  Users,
  Building2,
  Plug,
  Smartphone,
  Shield,
  HelpCircle,
} from "lucide-react";

export const inspectionNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/inspection",
        icon: LayoutDashboard,
      },
      {
        label: "My Tasks",
        path: "/inspection/my-tasks",
        icon: ClipboardCheck,
      },
      {
        label: "Calendar",
        path: "/inspection/calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Planning",
    items: [
      {
        label: "Schedules",
        path: "/inspection/schedules",
        icon: CalendarClock,
      },
      {
        label: "Templates",
        path: "/inspection/templates",
        icon: FileText,
      },
    ],
  },
  {
    title: "Execution",
    items: [
      {
        label: "Execute Inspection",
        path: "/inspection/execute",
        icon: PlayCircle,
      },
      {
        label: "Evidence",
        path: "/inspection/evidence",
        icon: Camera,
      },
      {
        label: "Reviews",
        path: "/inspection/reviews",
        icon: CheckSquare,
      },
      {
        label: "Approvals",
        path: "/inspection/approvals",
        icon: ThumbsUp,
      },
    ],
  },
  {
    title: "Findings & CAPA",
    items: [
      {
        label: "Findings",
        path: "/inspection/findings",
        icon: AlertTriangle,
      },
      {
        label: "CAPA",
        path: "/inspection/capa",
        icon: CheckCircle2,
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "Analytics",
        path: "/inspection/analytics",
        icon: BarChart3,
      },
      {
        label: "Reports",
        path: "/inspection/reports",
        icon: FileBarChart2,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Admin",
        path: "/inspection/admin",
        icon: Settings,
      },
      {
        label: "Users",
        path: "/inspection/admin/users",
        icon: Users,
      },
      {
        label: "Organization",
        path: "/inspection/admin/organization",
        icon: Building2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Integrations",
        path: "/inspection/integrations",
        icon: Plug,
      },
      {
        label: "PWA",
        path: "/inspection/pwa",
        icon: Smartphone,
      },
      {
        label: "Security",
        path: "/inspection/security",
        icon: Shield,
      },
      {
        label: "Help",
        path: "/inspection/help",
        icon: HelpCircle,
      },
    ],
  },
];
