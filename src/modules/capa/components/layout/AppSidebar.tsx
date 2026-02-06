import {
  LayoutDashboard,
  FileText,
  CalendarClock,
  TrendingUp,
  GitBranch,
  BarChart3,
  Clock,
  CheckCircle,
  Settings,
  HelpCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/capa",
    icon: LayoutDashboard,
  },
  {
    title: "CAPA Details",
    url: "/capa/capa-details",
    icon: FileText,
  },
  {
    title: "CAPA Planning",
    url: "/capa/capa-planning",
    icon: CalendarClock,
  },
  {
    title: "Effectiveness Tracker",
    url: "/capa/effectiveness",
    icon: TrendingUp,
  },
  {
    title: "Automation Workflow",
    url: "/capa/workflow",
    icon: GitBranch,
  },
  {
    title: "Severity Dashboard",
    url: "/capa/severity",
    icon: BarChart3,
  },
  {
    title: "Timeline Tracker",
    url: "/capa/timeline",
    icon: Clock,
  },
  {
    title: "CAPA Closure",
    url: "/capa/closure",
    icon: CheckCircle,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/capa/settings",
    icon: Settings,
  },
  {
    title: "Help & Training",
    url: "/capa/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        {!isCollapsed && (
          <div className="px-4 py-6">
            <h2 className="text-lg font-bold text-sidebar-foreground">
              Corrective Action &
            </h2>
            <h2 className="text-lg font-bold text-sidebar-foreground">
              Preventive Action Module
            </h2>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <div className="mt-auto px-4 py-4 text-xs text-sidebar-foreground/60">
            <p>Version 1.0.0</p>
            <p>© soapbox.cloud 2025</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
