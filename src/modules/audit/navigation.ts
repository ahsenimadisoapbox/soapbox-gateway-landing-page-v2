import { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  ClipboardCheck,
  ListChecks,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Bell,
  Users,
  Settings,
} from "lucide-react";

export const auditNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/audit",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Audit Execution",
    items: [
      {
        label: "Audit Planning",
        path: "/audit/planning",
        icon: ClipboardCheck,
      },
      {
        label: "Checklists",
        path: "/audit/checklists",
        icon: ListChecks,
      },
      {
        label: "Findings",
        path: "/audit/findings",
        icon: AlertTriangle,
      },
      {
        label: "CAPA",
        path: "/audit/capa",
        icon: FileCheck,
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        label: "Reports",
        path: "/audit/reports",
        icon: BarChart3,
      },
      {
        label: "Notifications",
        path: "/audit/notifications",
        icon: Bell,
      },
      {
        label: "Escalations",
        path: "/audit/escalations",
        icon: Bell,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Auditors",
        path: "/audit/auditors",
        icon: Users,
      },
      {
        label: "Admin",
        path: "/audit/admin",
        icon: Users,
      },
      {
        label: "Settings",
        path: "/audit/settings",
        icon: Settings,
      },
    ],
  },
];
