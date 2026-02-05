import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useOccupationalHealth } from '../../contexts/OccupationalContext';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  ClipboardList,
  Building2,
  AlertTriangle,
  Activity,
  RotateCcw,
  Heart,
  BarChart3,
  Bell,
  Plug,
  Database,
  Settings,
  Shield,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/occupational-health', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Employee Health',
    items: [
      { label: 'Employee Health Records', href: '/occupational-health/ehr', icon: <Users className="h-4 w-4" /> },
      { label: 'PME & Exams', href: '/occupational-health/exams', icon: <Stethoscope className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Clinical Operations',
    items: [
      { label: 'Clinic Operations', href: '/occupational-health/clinic', icon: <Building2 className="h-4 w-4" /> },
      { label: 'Occupational Illness', href: '/occupational-health/illness', icon: <AlertTriangle className="h-4 w-4" /> },
      { label: 'Exposure Monitoring', href: '/occupational-health/exposure', icon: <Activity className="h-4 w-4" /> },
      { label: 'Return to Work', href: '/occupational-health/rtw', icon: <RotateCcw className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Wellness',
    items: [
      { label: 'Wellness Programs', href: '/occupational-health/wellness', icon: <Heart className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Analytics & Reports',
    items: [
      { label: 'Reports & Analytics', href: '/occupational-health/reports', icon: <BarChart3 className="h-4 w-4" /> },
      { label: 'Notifications', href: '/occupational-health/notifications', icon: <Bell className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Integrations', href: '/occupational-health/integrations', icon: <Plug className="h-4 w-4" /> },
      { label: 'Master Data', href: '/occupational-health/master-data', icon: <Database className="h-4 w-4" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Administration', href: '/occupational-health/admin', icon: <Settings className="h-4 w-4" /> },
      { label: 'Security', href: '/occupational-health/security', icon: <Shield className="h-4 w-4" /> },
      { label: 'Help & Training', href: '/occupational-health/help', icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useOccupationalHealth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
      style={{ background: 'linear-gradient(180deg, hsl(149 29% 15%) 0%, hsl(149 29% 12%) 100%)' }}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-center border-b border-sidebar-border px-3">
        {!sidebarCollapsed && (
          <h2 className="text-sidebar-foreground font-display font-bold text-sm tracking-wide">
            Occupational Health
          </h2>
        )}
      </div>

      {/* Navigation */}
      <nav className="h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin px-2 py-2">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-2">
            {!sidebarCollapsed && (
              <div className="nav-section-header">{section.title}</div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        'nav-item',
                        isActive && 'active',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      {item.icon}
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div 
        className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3"
        style={{ background: 'hsl(149 29% 12%)' }}
      >
        {!sidebarCollapsed ? (
          <div className="text-xs text-sidebar-muted text-center">
            <p>soapbox.cloud © 2025</p>
            <p className="mt-0.5">v1.0.0</p>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mt-2 p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mx-auto" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors mx-auto block"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
