// src/modules/incident/navigation.ts

import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Users,
  AlertTriangle,
  Clock,
  Bell,
  BarChart3,
  FileSearch,
  Download,
  Upload,
  Layers,
  Plug,
  Settings,
} from "lucide-react";

import { NavSection } from "@/components/layout/types";

export const incidentNavigation: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/incident",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Incident Management",
    items: [
      {
        label: "New Incident",
        path: "/incident/incidents/new",
        icon: FilePlus,
      },
      {
        label: "Assignment",
        path: "/incident/incidents/assignment",
        icon: Users,
      },
      {
        label: "Near Miss",
        path: "/incident/near-miss",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Monitoring",
    items: [
      {
        label: "SLA Monitoring",
        path: "/incident/sla-monitoring",
        icon: Clock,
      },
      {
        label: "Notifications",
        path: "/incident/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Analysis & Reports",
    items: [
      {
        label: "Root Cause Analysis",
        path: "/incident/rca",
        icon: FileSearch,
      },
      {
        label: "Reports",
        path: "/incident/reports",
        icon: BarChart3,
      },
      {
        label: "Export Summary",
        path: "/incident/export",
        icon: Download,
      },
    ],
  },
  {
    title: "Templates & Integrations",
    items: [
      {
        label: "Templates",
        path: "/incident/templates",
        icon: Layers,
      },
      {
        label: "Integrations",
        path: "/incident/integrations",
        icon: Plug,
      },
      {
        label: "Bulk Import",
        path: "/incident/import",
        icon: Upload,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/incident/settings",
        icon: Settings,
      },
    ],
  },
];
