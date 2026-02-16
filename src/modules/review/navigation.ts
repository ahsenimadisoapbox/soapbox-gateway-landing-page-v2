import type { NavigationSection } from "@/components/layout/types";

export const reviewNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/review" },
    ],
  },
  {
    title: "Review Execution",
    items: [
      { label: "Reviews", path: "/review/reviews" },
      { label: "ISO Inputs", path: "/review/iso-inputs" },
      { label: "Decisions", path: "/review/decisions" },
    ],
  },
  {
    title: "Actions & CAPA",
    items: [
      { label: "Actions", path: "/review/actions" },
      { label: "CAPA", path: "/review/capa" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Attendance", path: "/review/attendance" },
      { label: "Reports", path: "/review/reports" },
      { label: "Calendar", path: "/review/calendar" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", path: "/review/settings" },
      { label: "Security", path: "/review/security" },
      { label: "Help", path: "/review/help" },
    ],
  },
];
