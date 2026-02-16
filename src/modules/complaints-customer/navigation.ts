// src/modules/complaints-customer/navigation.ts

import type { NavigationSection } from "@/components/layout/types";

export const complaintsCustomerNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/complaints-customer" },
      { label: "Complaints Register", path: "/complaints-customer/complaints" },
    ],
  },
  {
    title: "Actions & Linked Modules",
    items: [
      { label: "Action Items", path: "/complaints-customer/action-items" },
      { label: "Incidents", path: "/complaints-customer/incidents" },
      { label: "Audits", path: "/complaints-customer/audits" },
      { label: "CAPA", path: "/complaints-customer/capa" },
      { label: "Risk Register", path: "/complaints-customer/risk" },
    ],
  },
  {
    title: "Reports & Portal",
    items: [
      { label: "Reports", path: "/complaints-customer/reports" },
      { label: "Customer Portal", path: "/complaints-customer/customer-portal" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Users", path: "/complaints-customer/users" },
      { label: "Settings", path: "/complaints-customer/settings" },
      { label: "Security", path: "/complaints-customer/security" },
      { label: "Help", path: "/complaints-customer/help" },
    ],
  },
];
