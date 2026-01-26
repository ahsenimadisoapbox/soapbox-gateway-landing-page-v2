import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Users,
  BarChart3,
  Plus,
  Clock,
  FileType,
  Link2,
  GitBranch,
  Download,
  Upload,
  AlertCircle,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "./ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/incident/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "New Incident",
    url: "/incident/incidents/new",
    icon: Plus,
  },
  {
    title: "SLA Monitoring",
    url: "/incident/sla-monitoring",
    icon: Clock,
  },
  {
    title: "Assignment",
    url: "/incident/incidents/assignment",
    icon: Users,
  },
  {
    title: "Notifications",
    url: "/incident/notifications",
    icon: Bell,
  },
  {
    title: "Reports",
    url: "/incident/reports",
    icon: BarChart3,
  },
  {
    title: "Templates",
    url: "/incident/templates",
    icon: FileType,
  },
  {
    title: "Integrations",
    url: "/incident/integrations",
    icon: Link2,
  },
  {
    title: "RCA",
    url: "/incident/rca",
    icon: GitBranch,
  },
  {
    title: "Export",
    url: "/incident/export",
    icon: Download,
  },
  {
    title: "Import",
    url: "/incident/import",
    icon: Upload,
  },
  {
    title: "Near-Miss",
    url: "/incident/near-miss",
    icon: AlertCircle,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-4 py-6 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-foreground">
            Incident Management System
          </h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
