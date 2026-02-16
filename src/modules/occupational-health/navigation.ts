import type { NavigationSection } from "@/components/layout/types";
import {
  LayoutDashboard,
  FileHeart,
  Stethoscope,
  Building2,
  HeartPulse,
  Radiation,
  RotateCcw,
  Activity,
  BarChart3,
  Bell,
  Plug,
  Database,
  Settings,
  Shield,
  HelpCircle,
} from "lucide-react";

export const occupationalHealthNavigation: NavigationSection[] = [
  {
    title: "Core Modules",
    items: [
      {
        label: "Dashboard",
        path: "/occupational-health",
        icon: LayoutDashboard,
      },
      {
        label: "EHR",
        path: "/occupational-health/ehr",
        icon: FileHeart,
      },
      {
        label: "PME Exams",
        path: "/occupational-health/exams",
        icon: Stethoscope,
      },
      {
        label: "Clinic Operations",
        path: "/occupational-health/clinic",
        icon: Building2,
      },
    ],
  },
  {
    title: "Health Management",
    items: [
      {
        label: "Occupational Illness",
        path: "/occupational-health/illness",
        icon: HeartPulse,
      },
      {
        label: "Exposure Monitoring",
        path: "/occupational-health/exposure",
        icon: Radiation,
      },
      {
        label: "Return to Work",
        path: "/occupational-health/rtw",
        icon: RotateCcw,
      },
      {
        label: "Wellness Programs",
        path: "/occupational-health/wellness",
        icon: Activity,
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        label: "Reports & Analytics",
        path: "/occupational-health/reports",
        icon: BarChart3,
      },
      {
        label: "Notifications",
        path: "/occupational-health/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Integrations",
        path: "/occupational-health/integrations",
        icon: Plug,
      },
      {
        label: "Master Data",
        path: "/occupational-health/master-data",
        icon: Database,
      },
      {
        label: "Admin",
        path: "/occupational-health/admin",
        icon: Settings,
      },
      {
        label: "Security",
        path: "/occupational-health/security",
        icon: Shield,
      },
      {
        label: "Help",
        path: "/occupational-health/help",
        icon: HelpCircle,
      },
    ],
  },
];
