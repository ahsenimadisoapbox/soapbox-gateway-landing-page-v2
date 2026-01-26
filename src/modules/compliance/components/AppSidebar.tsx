import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Calendar as CalendarIcon,
  ClipboardCheck,
  RefreshCw,
  BarChart3,
  FileBarChart,
  PieChart,
  Settings,
  HelpCircle,
  BookOpen,
  Layers,
  FileCode,
  GitBranch,
  Target,
  CheckCircle,
  History,
  UserCheck,
  Clock,
  RotateCcw,
  MapPin,
  FileQuestion,
  Play,
  AlertTriangle,
  Tag,
  FileOutput,
  XCircle,
  Files,
  ScrollText,
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
  SidebarHeader,
} from "./ui/sidebar";

const complianceItems = [
  { title: "Dashboard", url: "/compliance/", icon: LayoutDashboard },
  { title: "Event Type Master", url: "/compliance/event-type-master", icon: Tag },
  { title: "Calendar", url: "/compliance/calendar", icon: CalendarIcon },
  { title: "Frameworks", url: "/compliance/frameworks", icon: BookOpen },
  { title: "Domain", url: "/compliance/domain", icon: Layers },
  { title: "Regulations", url: "/compliance/regulations", icon: FileCode },
  { title: "Regulation Clauses", url: "/compliance/regulation-clauses", icon: GitBranch },
  { title: "Control Master", url: "/compliance/control-master", icon: Target },
  { title: "Obligations", url: "/compliance/obligations", icon: FileText },
  { title: "Obligation Site Mapping", url: "/compliance/obligation-site-mapping", icon: MapPin },
  { title: "Tasks", url: "/compliance/tasks", icon: CheckCircle },
  { title: "Task Owner Log", url: "/compliance/task-owner-log", icon: UserCheck },
  { title: "Task Assignment Log", url: "/compliance/task-assignment-log", icon: History },
  { title: "Task Version Log", url: "/compliance/task-version-log", icon: Clock },
  { title: "Task Occurrences Log", url: "/compliance/task-occurrences-log", icon: RotateCcw },
  { title: "Tasks Exceptions", url: "/compliance/tasks-exceptions", icon: AlertTriangle },
  { title: "Evidence", url: "/compliance/evidence", icon: FolderOpen },
];

const assessmentItems = [
  { title: "Assessment Templates", url: "/compliance/assessment-templates", icon: ClipboardCheck },
  { title: "Assessment Runs", url: "/compliance/assessment/runs", icon: Play },
  { title: "Assessment Questions", url: "/compliance/assessment-questions", icon: FileQuestion },
  { title: "Assessment Responses", url: "/compliance/assessment-responses", icon: FileOutput },
];

const reportingItems = [
  { title: "Regulatory Changes", url: "/compliance/regulatory-changes", icon: RefreshCw },
  { title: "Obligation Report Templates", url: "/compliance/obligation-report-templates", icon: Files },
  { title: "Obligation Closure", url: "/compliance/obligation-closure", icon: XCircle },
  { title: "Report Versions", url: "/compliance/report-versions", icon: FileBarChart },
  { title: "Audit Logs", url: "/compliance/audit-logs", icon: ScrollText },
  { title: "Gap Analysis", url: "/compliance/gap-analysis", icon: BarChart3 },
  { title: "Analytics", url: "/compliance/analytics", icon: PieChart },
];

const systemItems = [
  { title: "Settings", url: "/compliance/settings", icon: Settings },
  { title: "Help & Training", url: "/compliance/help", icon: HelpCircle },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <h2 className="text-lg font-bold">Compliance Management</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold">Compliance Module</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {complianceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}>
                      <item.icon className="w-4 h-4" /><span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold">Assessments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {assessmentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}>
                      <item.icon className="w-4 h-4" /><span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold">Reporting & Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}>
                      <item.icon className="w-4 h-4" /><span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}>
                      <item.icon className="w-4 h-4" /><span>{item.title}</span>
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
