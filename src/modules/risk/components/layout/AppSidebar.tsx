import { 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  ClipboardCheck, 
  Target, 
  Search,
  Plus,
  FileText,
  CheckCircle,
  Users,
  Settings,
  Zap,
  Bell,
  GitBranch,
  CheckSquare,
  Wrench
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
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
} from '../ui/sidebar';
import soapboxLogo from '../../assets/soapbox-cloud-logo.png';

const navItems = [
  { title: 'Dashboard', url: '/risk', icon: BarChart3 },
  { title: 'Risk Register', url: '/risk/risks', icon: Shield },
  { title: 'Create Risk', url: '/risk/risks/new', icon: Plus },
  { title: 'Assessments', url: '/risk/assessments', icon: ClipboardCheck },
  { title: 'Mitigations', url: '/risk/mitigations', icon: Target },
  { title: 'Audits & NCRs', url: '/risk/audits', icon: Search },
  { title: 'Scenario Risk Modeling', url: '/risk/scenario-modeling', icon: GitBranch },
  { title: 'Real-Time Risk Alerts', url: '/risk/risk-alerts', icon: Bell },
  { title: 'Risk Simulation Engine', url: '/risk/risk-simulation', icon: Zap },
  { title: 'Risk Approval Workflow', url: '/risk/risk-approval', icon: CheckSquare },
  { title: 'Risk Treatment Planner', url: '/risk/risk-treatment', icon: Wrench },
  { title: 'Risk Reports', url: '/risk/reports', icon: FileText },
  { title: 'Compliance Status', url: '/risk/compliance', icon: CheckCircle },
  { title: 'Users and Administration', url: '/risk/users', icon: Users },
  { title: 'Settings', url: '/risk/settings', icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img src={soapboxLogo} alt="Soapbox Cloud" className="h-8" />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground font-semibold text-base px-4 py-3">
            Risk Management Module
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-2.5 text-sidebar-foreground ${
                          isActive 
                            ? 'bg-sidebar-primary text-white font-medium' 
                            : 'hover:bg-sidebar-accent hover:text-white'
                        }`
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
    </Sidebar>
  );
}
