// src/modules/risk/navigation.ts

import {
  LayoutDashboard,
  ShieldAlert,
  PlusCircle,
  ClipboardCheck,
  CheckCircle2,
  FileSearch,
  Activity,
  AlertTriangle,
  Brain,
  GitBranch,
  Gavel,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

import type { NavigationSection } from "@/components/layout/types";

export const riskNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/risk",
        icon: LayoutDashboard,
      },
      {
        label: "Risk Register",
        path: "/risk/risks",
        icon: ShieldAlert,
      },
      {
        label: "Create Risk",
        path: "/risk/risks/new",
        icon: PlusCircle,
      },
    ],
  },
  {
    title: "Risk Lifecycle",
    items: [
      {
        label: "Assessments",
        path: "/risk/assessments",
        icon: ClipboardCheck,
      },
      {
        label: "Mitigations",
        path: "/risk/mitigations",
        icon: CheckCircle2,
      },
      {
        label: "Audits",
        path: "/risk/audits",
        icon: FileSearch,
      },
    ],
  },
  {
    title: "Advanced Intelligence",
    items: [
      {
        label: "Scenario Modeling",
        path: "/risk/scenario-modeling",
        icon: Brain,
      },
      {
        label: "Risk Alerts",
        path: "/risk/risk-alerts",
        icon: AlertTriangle,
      },
      {
        label: "Risk Simulation",
        path: "/risk/risk-simulation",
        icon: Activity,
      },
      {
        label: "Risk Approval",
        path: "/risk/risk-approval",
        icon: Gavel,
      },
      {
        label: "Risk Treatment",
        path: "/risk/risk-treatment",
        icon: GitBranch,
      },
    ],
  },
  {
    title: "Governance",
    items: [
      {
        label: "Reports",
        path: "/risk/reports",
        icon: BarChart3,
      },
      {
        label: "Compliance",
        path: "/risk/compliance",
        icon: ShieldAlert,
      },
      {
        label: "Users",
        path: "/risk/users",
        icon: Users,
      },
      {
        label: "Settings",
        path: "/risk/settings",
        icon: Settings,
      },
    ],
  },
];
