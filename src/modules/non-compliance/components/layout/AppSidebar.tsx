import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  CheckSquare,
  Search,
  ClipboardList,
  CheckCircle,
  Database,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Shield,
} from 'lucide-react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const mainNavItems = [
  { path: '/non-compliance', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/non-compliance/create-ncr', label: 'Create New NCR', icon: FilePlus },
  { path: '/non-compliance/drafts', label: 'Draft NCR List', icon: FileText },
  { path: '/non-compliance/review', label: 'NCR Review & Validation', icon: CheckSquare },
  { path: '/non-compliance/rca', label: 'RCA Workspace', icon: Search },
  { path: '/non-compliance/capa', label: 'CAPA List & Update', icon: ClipboardList },
  { path: '/non-compliance/verification', label: 'Verification & Closure', icon: CheckCircle },
  { path: '/non-compliance/register', label: 'NCR Global Register', icon: Database },
  { path: '/non-compliance/reports', label: 'Reports & Analytics', icon: BarChart3 },
];

const adminNavItems = [
  { path: '/non-compliance/settings', label: 'Settings & Administration', icon: Settings },
  { path: '/non-compliance/security', label: 'Security', icon: Shield },
];

const supportNavItems = [
  { path: '/non-compliance/help', label: 'Help & Training', icon: HelpCircle },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();

  const NavItem = ({ path, label, icon: Icon }: { path: string; label: string; icon: any }) => {
    const isActive = location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));

    return (
      <NavLink
        to={path}
        className={cn(
          'sidebar-item',
          isActive && 'sidebar-item-active'
        )}
        title={collapsed ? label : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-base font-bold text-sidebar-foreground">Non-compliance Reporting</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {/* Main Navigation */}
        {!collapsed && (
          <div className="sidebar-section-title">Main Navigation</div>
        )}
        <div className="space-y-1">
          {mainNavItems.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Administration */}
        {!collapsed && (
          <div className="sidebar-section-title mt-6">Administration</div>
        )}
        {collapsed && <div className="border-t border-sidebar-border my-4 mx-2" />}
        <div className="space-y-1">
          {adminNavItems.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Support */}
        {!collapsed && (
          <div className="sidebar-section-title mt-6">Support</div>
        )}
        {collapsed && <div className="border-t border-sidebar-border my-4 mx-2" />}
        <div className="space-y-1">
          {supportNavItems.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <p className="text-xs text-sidebar-muted text-center">
            soapbox.cloud 2025
          </p>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors w-full flex justify-center",
            !collapsed && "mt-2"
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>
    </aside>
  );
}
