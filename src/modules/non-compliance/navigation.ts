import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  FileEdit,
  ShieldCheck,
  SearchCheck,
  CheckCircle2,
  FileBarChart2,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";

export const nonComplianceNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/non-compliance",
        icon: LayoutDashboard,
      },
      {
        label: "Global Register",
        path: "/non-compliance/register",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "NCR Lifecycle",
    items: [
      {
        label: "Create NCR",
        path: "/non-compliance/create-ncr",
        icon: PlusCircle,
      },
      {
        label: "Draft NCRs",
        path: "/non-compliance/drafts",
        icon: FileEdit,
      },
      {
        label: "Review & Validation",
        path: "/non-compliance/review",
        icon: ShieldCheck,
      },
      {
        label: "Root Cause Analysis",
        path: "/non-compliance/rca",
        icon: SearchCheck,
      },
      {
        label: "CAPA Management",
        path: "/non-compliance/capa",
        icon: CheckCircle2,
      },
      {
        label: "Verification & Closure",
        path: "/non-compliance/verification",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      {
        label: "Reports",
        path: "/non-compliance/reports",
        icon: FileBarChart2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/non-compliance/settings",
        icon: Settings,
      },
      {
        label: "Security",
        path: "/non-compliance/security",
        icon: Shield,
      },
      {
        label: "Help & Training",
        path: "/non-compliance/help",
        icon: HelpCircle,
      },
    ],
  },
];
