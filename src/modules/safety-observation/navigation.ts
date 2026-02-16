import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldCheck,
  FileSearch,
  SlidersHorizontal,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  Bell,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";

export const safetyObservationNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/safety-observation",
        icon: LayoutDashboard,
      },
      {
        label: "Inspections",
        path: "/safety-observation/inspections",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Assessment & Control",
    items: [
      {
        label: "Compliance",
        path: "/safety-observation/compliance",
        icon: ShieldCheck,
      },
      {
        label: "Assessments",
        path: "/safety-observation/assessments",
        icon: FileSearch,
      },
      {
        label: "Controls",
        path: "/safety-observation/controls",
        icon: SlidersHorizontal,
      },
      {
        label: "Mitigations",
        path: "/safety-observation/mitigations",
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: "Audit & Closure",
    items: [
      {
        label: "Audits",
        path: "/safety-observation/audits",
        icon: ClipboardList,
      },
      {
        label: "Closures",
        path: "/safety-observation/closures",
        icon: CheckCircle2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Notifications",
        path: "/safety-observation/notifications",
        icon: Bell,
      },
      {
        label: "Settings",
        path: "/safety-observation/settings",
        icon: Settings,
      },
      {
        label: "Security",
        path: "/safety-observation/security",
        icon: Shield,
      },
      {
        label: "Help",
        path: "/safety-observation/help",
        icon: HelpCircle,
      },
    ],
  },
];
