import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  RefreshCw,
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  Lock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Bell,
  Calendar,
  Search,
  Package,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useValidation } from '../../context/ValidationContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', path: '/validation/', icon: <LayoutDashboard size={20} /> },
      { label: 'Projects', path: '/validation/projects', icon: <FolderKanban size={20} /> },
      { label: 'My Tasks & Approvals', path: '/validation/my-tasks', icon: <ClipboardCheck size={20} /> },
      { label: 'Notifications', path: '/validation/notifications', icon: <Bell size={20} /> },
      { label: 'Calendar', path: '/validation/calendar', icon: <Calendar size={20} /> },
      { label: 'Global Search', path: '/validation/search', icon: <Search size={20} /> },
      { label: 'Continuous Validation', path: '/validation/continuous-validation', icon: <RefreshCw size={20} /> },
      { label: 'Deviations & CAPA', path: '/validation/deviations', icon: <AlertTriangle size={20} /> },
      { label: 'Reports & Analytics', path: '/validation/reports', icon: <BarChart3 size={20} /> },
      { label: 'Inspector Mode', path: '/validation/inspector', icon: <Shield size={20} /> },
      { label: 'Audit Pack Generator', path: '/validation/audit-pack', icon: <Package size={20} /> },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Settings', path: '/validation/settings', icon: <Settings size={20} /> },
      { label: 'Security', path: '/validation/security', icon: <Lock size={20} /> },
      { label: 'Help & Training', path: '/validation/help', icon: <HelpCircle size={20} /> },
    ],
  },
];

export const AppSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useValidation();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border"
    >
      {/* Module Name Header */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <p className="text-sm font-semibold text-sidebar-foreground tracking-wide">
            Validation Management Module
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigationSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-4">
            {section.title && !sidebarCollapsed && (
              <p className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150',
                        'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                        isActive && 'bg-sidebar-accent text-sidebar-foreground font-medium',
                        sidebarCollapsed && 'justify-center px-2'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className={cn(isActive && 'text-brand-green')}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Version Name & Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border flex flex-col items-center gap-2">
        {!sidebarCollapsed && (
          <span className="text-xs text-sidebar-foreground/50">v1.0.0</span>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'p-2 rounded-md transition-colors',
            'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
          )}
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
};
