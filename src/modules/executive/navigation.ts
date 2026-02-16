// modules/executive/navigation.ts

import {
  LayoutDashboard,
  FileText,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  Package,
  Leaf,
  Bell,
  Settings,
  Lock,
  HelpCircle,
} from "lucide-react";

import { NavSection } from "@/components/layout/types";

export const executiveNavigation: NavSection[] = [
  {
    title: "Executive Overview",
    items: [
      {
        label: "Executive Dashboard",
        path: "/executive",
        icon: LayoutDashboard,
      },
      {
        label: "Board View",
        path: "/executive/board-view",
        icon: FileText,
      },
    ],
  },
  {
    title: "Risk & Compliance",
    items: [
      {
        label: "Risk & Exposure",
        path: "/executive/risk",
        icon: Shield,
      },
      {
        label: "Compliance & Audits",
        path: "/executive/compliance",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Incident & Quality",
    items: [
      {
        label: "Incident Intelligence",
        path: "/executive/incident-intelligence",
        icon: AlertTriangle,
      },
      {
        label: "CAPA Effectiveness",
        path: "/executive/capa",
        icon: FileCheck,
      },
      {
        label: "Quality & Suppliers",
        path: "/executive/quality",
        icon: Package,
      },
      {
        label: "ESG & Sustainability",
        path: "/executive/esg",
        icon: Leaf,
      },
    ],
  },
  {
    title: "Reports & Alerts",
    items: [
      {
        label: "Alerts Centre",
        path: "/executive/alerts-centre",
        icon: Bell,
      },
      {
        label: "Reports",
        path: "/executive/reports",
        icon: FileText,
      },
      {
        label: "Board Packs",
        path: "/executive/board-packs",
        icon: FileText,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Administration",
        path: "/executive/administration",
        icon: Settings,
      },
      {
        label: "Security",
        path: "/executive/security",
        icon: Lock,
      },
      {
        label: "Help & Training",
        path: "/executive/help",
        icon: HelpCircle,
      },
    ],
  },
];
