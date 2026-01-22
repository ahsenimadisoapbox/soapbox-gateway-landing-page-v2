import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useReview } from '../../contexts/ReviewContext';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  ListTodo,
  AlertTriangle,
  Users,
  BarChart3,
  FileText,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'Review Calendar', path: '/calendar', icon: CalendarDays },
    ],
  },
  {
    title: 'Review Execution',
    items: [
      { label: 'Reviews', path: '/reviews', icon: ClipboardCheck },
      { label: 'ISO Inputs', path: '/iso-inputs', icon: FileText },
      { label: 'Decisions', path: '/decisions', icon: ListTodo },
    ],
  },
  {
    title: 'Actions & CAPA',
    items: [
      { label: 'Actions', path: '/actions', icon: ListTodo },
      { label: 'CAPA', path: '/capa', icon: AlertTriangle },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Attendance', path: '/attendance', icon: Users },
      { label: 'Reports & Evidence', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings & Administration', path: '/settings', icon: Settings },
      { label: 'Security', path: '/security', icon: Shield },
      { label: 'Help & Training', path: '/help', icon: HelpCircle },
    ],
  },
];

export function AppSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useReview();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    navSections.map(s => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 h-screen sticky top-0 z-40',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header - Module Name */}
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        {!sidebarCollapsed ? (
          <div>
            <h2 className="text-base font-bold text-sidebar-foreground leading-tight">Management Review</h2>
            <p className="text-xs text-sidebar-muted">Module</p>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-xs font-bold text-sidebar-foreground">MR</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-1">
            {!sidebarCollapsed && (
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wider text-sidebar-muted font-semibold hover:text-sidebar-foreground transition-colors"
              >
                <span>{section.title}</span>
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
            )}
            {(sidebarCollapsed || expandedSections.includes(section.title)) && (
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md transition-all',
                      isActive(item.path)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="text-xs text-sidebar-muted text-center">
              <p>© soapbox.cloud 2025</p>
              <p>Version 1.0.0</p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="w-full flex items-center justify-center p-2 rounded-md border border-sidebar-border hover:bg-sidebar-accent text-sidebar-muted hover:text-sidebar-foreground transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-sidebar-muted text-center">
              <p>v1.0</p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-full flex items-center justify-center p-2 rounded-md border border-sidebar-border hover:bg-sidebar-accent text-sidebar-muted hover:text-sidebar-foreground transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}