import { ElementType } from "react";

export interface NavItem {
  label: string;
  path: string;
  icon?: ElementType; // Lucide icon component
}

export interface NavSection {
  title?: string; // optional if you want flat menu
  items: NavItem[];
}

export interface NavigationSection {
  title?: string;
  items: NavigationItem[];
}
