import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  ListChecks,
  Layers,
  Globe,
  Scale,
  FileText,
  ShieldCheck,
  Map,
  ClipboardList,
  Users,
  UserCheck,
  History,
  AlertTriangle,
  FileCheck,
  PlayCircle,
  Wand2,
  HelpCircle,
  RefreshCw,
  XCircle,
  CheckCircle2,
  BarChart3,
  Settings,
} from "lucide-react";

export const complianceNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/compliance",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Masters",
    items: [
      {
        label: "Event Type Master",
        path: "/compliance/event-type-master",
        icon: ListChecks,
      },
      {
        label: "Frameworks",
        path: "/compliance/frameworks",
        icon: Layers,
      },
      {
        label: "Domain",
        path: "/compliance/domain",
        icon: Globe,
      },
      {
        label: "Regulations",
        path: "/compliance/regulations",
        icon: Scale,
      },
      {
        label: "Regulation Clauses",
        path: "/compliance/regulation-clauses",
        icon: FileText,
      },
      {
        label: "Control Master",
        path: "/compliance/control-master",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Obligations & Tasks",
    items: [
      {
        label: "Obligations",
        path: "/compliance/obligations",
        icon: ClipboardList,
      },
      {
        label: "Site Mapping",
        path: "/compliance/obligation-site-mapping",
        icon: Map,
      },
      {
        label: "Tasks",
        path: "/compliance/tasks",
        icon: ListChecks,
      },
      {
        label: "Task Owner Log",
        path: "/compliance/task-owner-log",
        icon: Users,
      },
      {
        label: "Task Assignment Log",
        path: "/compliance/task-assignment-log",
        icon: UserCheck,
      },
      {
        label: "Task Version Log",
        path: "/compliance/task-version-log",
        icon: History,
      },
      {
        label: "Task Occurrences Log",
        path: "/compliance/task-occurrences-log",
        icon: RefreshCw,
      },
      {
        label: "Task Exceptions",
        path: "/compliance/tasks-exceptions",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Assessments",
    items: [
      {
        label: "Assessment Templates",
        path: "/compliance/assessment-templates",
        icon: FileCheck,
      },
      {
        label: "Assessment Runs",
        path: "/compliance/assessment-runs",
        icon: PlayCircle,
      },
      {
        label: "Assessment Wizard",
        path: "/compliance/assessment-wizard",
        icon: Wand2,
      },
      {
        label: "Assessment Questions",
        path: "/compliance/assessment-questions",
        icon: HelpCircle,
      },
      {
        label: "Assessment Responses",
        path: "/compliance/assessment-responses",
        icon: FileText,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Regulatory Changes",
        path: "/compliance/regulatory-changes",
        icon: RefreshCw,
      },
      {
        label: "Non-Compliance",
        path: "/compliance/non-compliance",
        icon: XCircle,
      },
      {
        label: "CAPA",
        path: "/compliance/capa",
        icon: CheckCircle2,
      },
      {
        label: "Gap Analysis",
        path: "/compliance/gap-analysis",
        icon: BarChart3,
      },
      {
        label: "Reporting",
        path: "/compliance/compliance-reporting",
        icon: FileText,
      },
      {
        label: "Analytics",
        path: "/compliance/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        path: "/compliance/settings",
        icon: Settings,
      },
      {
        label: "Help",
        path: "/compliance/help",
        icon: HelpCircle,
      },
    ],
  },
];
