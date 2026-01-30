import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Users, 
  FileWarning,
  Archive,
  Settings,
  Shield,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const jsaMenuItems = [
  { title: "JSA Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Pending Actions", url: "/my-pending-actions", icon: CheckSquare },
  { title: "Create New JSA", url: "/create-jsa", icon: FileText },
  { title: "JSA Library", url: "/jsa-library", icon: BookOpen },
  {
    title: "Review & Approval",
    icon: CheckSquare,
    subItems: [
      { title: "L1 Review Queue", url: "/review-l1" },
      { title: "L2 Approvals", url: "/review-l2" },
    ],
  },
  { title: "Active JSAs", url: "/active-jsas", icon: FileWarning },
  { title: "Archive", url: "/archive", icon: Archive },
  { title: "Audit Log", url: "/audit-log", icon: FileText },
];

const systemMenuItems = [
  { title: "Administration", url: "/administration", icon: Settings },
  { title: "Security", url: "/security", icon: Shield },
  { title: "Help & Training", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="px-4 py-6">
          <h2 className={`font-bold text-sidebar-foreground transition-all ${open ? "text-lg" : "text-xs text-center"}`}>
            {open ? "Job Safety Analysis Module" : "JSA"}
          </h2>
        </div>

        {/* JSA Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs">
            {open ? "Job Safety Analysis" : "JSA"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {jsaMenuItems.map((item) => (
                item.subItems ? (
                  <Collapsible key={item.title} defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <item.icon className="h-4 w-4" />
                          {open && <span>{item.title}</span>}
                          {open && <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink 
                                  to={subItem.url}
                                  className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                >
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-xs">
            {open ? "System" : "SYS"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
