import type { NavigationSection } from "@/components/layout/types";

export const qualityEventsNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/quality-events" },
    ],
  },
  {
    title: "Event Management",
    items: [
      { label: "All Events", path: "/quality-events/events" },
      { label: "Create Event", path: "/quality-events/events/create" },
      { label: "Drafts", path: "/quality-events/events/drafts" },
      { label: "My Work", path: "/quality-events/my-work" },
      { label: "Search", path: "/quality-events/search" },
    ],
  },
  {
    title: "Event Lifecycle",
    items: [
      { label: "Triage", path: "/quality-events/triage" },
      { label: "Risk Assessment", path: "/quality-events/risk-assessment" },
      { label: "QA Classification", path: "/quality-events/classification" },
      { label: "QA Review", path: "/quality-events/qa-review" },
      { label: "Effectiveness", path: "/quality-events/effectiveness" },
      { label: "Lessons Learned", path: "/quality-events/lessons-learned" },
    ],
  },
  {
    title: "Incidents",
    items: [
      { label: "Incidents", path: "/quality-events/incidents" },
      { label: "Containment", path: "/quality-events/incidents/containment" },
      { label: "Investigation", path: "/quality-events/incidents/investigation" },
      { label: "Corrective Actions", path: "/quality-events/incidents/corrective-actions" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Events Analytics", path: "/quality-events/analytics/events" },
      { label: "Incidents Dashboard", path: "/quality-events/analytics/incidents" },
      { label: "Risk Heatmap", path: "/quality-events/analytics/risk-heatmap" },
      { label: "Executive Overview", path: "/quality-events/analytics/executive" },
    ],
  },
  {
    title: "Audit & Registers",
    items: [
      { label: "Event Register", path: "/quality-events/audit/events" },
      { label: "Incident Register", path: "/quality-events/audit/incidents" },
      { label: "Audit Trail", path: "/quality-events/audit/trail" },
      { label: "Evidence Repository", path: "/quality-events/audit/evidence" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Notifications", path: "/quality-events/notifications" },
      { label: "Administration", path: "/quality-events/administration" },
      { label: "Security", path: "/quality-events/security" },
      { label: "Help", path: "/quality-events/help" },
    ],
  },
];
