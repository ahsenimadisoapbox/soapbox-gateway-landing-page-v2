import type { NavigationSection } from "@/components/layout/types";

export const validationNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/validation" },
    ],
  },
  {
    title: "Core Validation",
    items: [
      { label: "Projects", path: "/validation/projects" },
      { label: "Deviations", path: "/validation/deviations" },
      { label: "Continuous Validation", path: "/validation/continuous-validation" },
    ],
  },
  {
    title: "Tasks & Workflow",
    items: [
      { label: "My Tasks", path: "/validation/my-tasks" },
      { label: "Notifications", path: "/validation/notifications" },
      { label: "Calendar", path: "/validation/calendar" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Global Search", path: "/validation/search" },
      { label: "Audit Pack Generator", path: "/validation/audit-pack" },
      { label: "Reports", path: "/validation/reports" },
      { label: "Inspector Mode", path: "/validation/inspector" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", path: "/validation/settings" },
      { label: "Security", path: "/validation/security" },
      { label: "Help", path: "/validation/help" },
    ],
  },
];
