import type { NavigationSection } from "@/components/layout/types";

export const calibrationEquipmentNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/calibration-equipment" },
    ],
  },
  {
    title: "Equipment Management",
    items: [
      { label: "Equipment", path: "/calibration-equipment/equipment" },
      { label: "Calibration", path: "/calibration-equipment/calibration" },
    ],
  },
  {
    title: "Monitoring & Compliance",
    items: [
      { label: "Out of Tolerance (OOT)", path: "/calibration-equipment/oot" },
      { label: "Preventive Maintenance", path: "/calibration-equipment/pm" },
      { label: "Risk Assessment", path: "/calibration-equipment/risk" },
      { label: "Audit", path: "/calibration-equipment/audit" },
    ],
  },
  {
    title: "Reporting",
    items: [
      { label: "Reports", path: "/calibration-equipment/reports" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", path: "/calibration-equipment/settings" },
      { label: "Security", path: "/calibration-equipment/security" },
      { label: "Help", path: "/calibration-equipment/help" },
    ],
  },
];
