// src/modules/capa/navigation.ts

import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Workflow,
  AlertTriangle,
  GitBranch,
  CheckCircle2,
  Settings,
  HelpCircle,
} from "lucide-react";

import type { NavigationSection } from "@/components/layout/types";

export const capaNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/capa",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "CAPA Lifecycle",
    items: [
      {
        label: "CAPA Details",
        path: "/capa/capa-details",
        icon: FileText,
      },
      {
        label: "Planning",
        path: "/capa/capa-planning",
        icon: CalendarDays,
      },
      {
        label: "Workflow",
        path: "/capa/workflow",
        icon: Workflow,
      },
      {
        label: "Severity",
        path: "/capa/severity",
        icon: AlertTriangle,
      },
      {
        label: "Timeline",
        path: "/capa/timeline",
        icon: GitBranch,
      },
      {
        label: "Effectiveness",
        path: "/capa/effectiveness",
        icon: CheckCircle2,
      },
      {
        label: "Closure",
        path: "/capa/closure",
        icon: CheckCircle2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/capa/settings",
        icon: Settings,
      },
      {
        label: "Help",
        path: "/capa/help",
        icon: HelpCircle,
      },
    ],
  },
];
