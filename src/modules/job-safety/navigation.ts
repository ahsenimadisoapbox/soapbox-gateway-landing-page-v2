import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  Clock,
  PlusCircle,
  FileEdit,
  Library,
  PlayCircle,
  Archive,
  ListChecks,
  AlertTriangle,
  ShieldCheck,
  GitBranch,
  Grid,
  CheckSquare,
  ClipboardCheck,
  History,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";

export const jobSafetyNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/job-safety",
        icon: LayoutDashboard,
      },
      {
        label: "My Pending Actions",
        path: "/job-safety/my-pending-actions",
        icon: Clock,
      },
    ],
  },
  {
    title: "JSA Management",
    items: [
      {
        label: "Create JSA",
        path: "/job-safety/create-jsa",
        icon: PlusCircle,
      },
      {
        label: "Edit JSA",
        path: "/job-safety/edit-jsa",
        icon: FileEdit,
      },
      {
        label: "JSA Library",
        path: "/job-safety/jsa-library",
        icon: Library,
      },
      {
        label: "Active JSAs",
        path: "/job-safety/active-jsas",
        icon: PlayCircle,
      },
      {
        label: "Archive",
        path: "/job-safety/archive",
        icon: Archive,
      },
    ],
  },
  {
    title: "Hazard & Risk",
    items: [
      {
        label: "Steps Management",
        path: "/job-safety/steps-management",
        icon: ListChecks,
      },
      {
        label: "Hazard Identification",
        path: "/job-safety/hazard-identification",
        icon: AlertTriangle,
      },
      {
        label: "Control Measures",
        path: "/job-safety/control-measures",
        icon: ShieldCheck,
      },
      {
        label: "Job Breakdown",
        path: "/job-safety/job-breakdown",
        icon: GitBranch,
      },
      {
        label: "Risk Matrix",
        path: "/job-safety/risk-matrix",
        icon: Grid,
      },
    ],
  },
  {
    title: "Workflow",
    items: [
      {
        label: "Review L1",
        path: "/job-safety/review-l1",
        icon: CheckSquare,
      },
      {
        label: "Review L2",
        path: "/job-safety/review-l2",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Audit & System",
    items: [
      {
        label: "Audit Log",
        path: "/job-safety/audit-log",
        icon: History,
      },
      {
        label: "Administration",
        path: "/job-safety/administration",
        icon: Settings,
      },
      {
        label: "Security",
        path: "/job-safety/security",
        icon: Shield,
      },
      {
        label: "Help",
        path: "/job-safety/help",
        icon: HelpCircle,
      },
    ],
  },
];
