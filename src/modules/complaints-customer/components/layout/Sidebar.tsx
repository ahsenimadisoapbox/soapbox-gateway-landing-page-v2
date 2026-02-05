import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useComplaintsCustomer } from '../../context/ComplaintsCustomerContext';
import logo from '../../assets/soapbox-logo.png';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Shield,
  MessageSquareWarning,
  Settings,
  Lock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  FileSearch,
  Megaphone,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/complaints-customer', icon: LayoutDashboard },
      { label: 'Complaints Register', path: '/complaints-customer/complaints', icon: MessageSquareWarning },
      { label: 'My Action Items', path: '/complaints-customer/action-items', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Cross-Module',
    items: [
      { label: 'Incidents', path: '/complaints-customer/incidents', icon: AlertTriangle },
      { label: 'Audits', path: '/complaints-customer/audits', icon: FileSearch },
      { label: 'CAPA', path: '/complaints-customer/capa', icon: FileText },
      { label: 'Risk Register', path: '/complaints-customer/risk', icon: Shield },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', path: '/complaints-customer/reports', icon: BarChart3 },
      { label: 'Customer Portal', path: '/complaints-customer/customer-portal', icon: Megaphone },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Settings & Administration', path: '/complaints-customer/settings', icon: Settings },
      { label: 'Security', path: '/complaints-customer/security', icon: Lock },
      { label: 'User Management', path: '/complaints-customer/users', icon: Users },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & Training', path: '/complaints-customer/help', icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useComplaintsCustomer();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
      style={{ backgroundColor: '#1d2f26' }}
    >
      {/* Module Title */}
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <h2 className="text-sm font-bold text-sidebar-foreground">
            Complaints & Customer Feedback Module
          </h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-4">
            {!sidebarCollapsed && (
              <div className="sidebar-section-title">{section.title}</div>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                const linkContent = (
                  <NavLink
                    to={item.path}
                    className={cn(
                      'sidebar-nav-item',
                      isActive && 'active',
                      sidebarCollapsed && 'justify-center'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </NavLink>
                );

                if (sidebarCollapsed) {
                  return (
                    <li key={item.path}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }

                return <li key={item.path}>{linkContent}</li>;
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer with version and collapse button */}
      <div className="border-t border-sidebar-border">
        {!sidebarCollapsed && (
          <div className="px-4 py-2">
            <p className="text-xs text-sidebar-muted text-center">
              © soapbox.cloud 2025
            </p>
            <p className="text-xs text-sidebar-muted text-center mt-1">
              Version 1.0.0
            </p>
          </div>
        )}
        <div className={cn("px-3 py-3", sidebarCollapsed && "flex justify-center")}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            {sidebarCollapsed && (
              <TooltipContent side="right" className="font-medium">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
