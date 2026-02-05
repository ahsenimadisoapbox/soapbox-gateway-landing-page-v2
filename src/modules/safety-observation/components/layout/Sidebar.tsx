import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldCheck,
  FileCheck,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lock,
  Users,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const inspectionModuleItems: NavItem[] = [
  { label: 'Dashboard', path: '/safety-observation', icon: LayoutDashboard },
  { label: 'Inspections', path: '/safety-observation/inspections', icon: ClipboardCheck },
  { label: 'Compliance', path: '/safety-observation/compliance', icon: ShieldCheck },
  { label: 'Assessments', path: '/safety-observation/assessments', icon: FileCheck },
  { label: 'Controls', path: '/safety-observation/controls', icon: Settings2 },
  { label: 'Mitigations', path: '/safety-observation/mitigations', icon: AlertTriangle },
  { label: 'Audits', path: '/safety-observation/audits', icon: FileText },
  { label: 'Closures', path: '/safety-observation/closures', icon: CheckCircle2 },
  { label: 'Notifications', path: '/safety-observation/notifications', icon: Bell },
];

const administrationItems: NavItem[] = [
  { label: 'Settings', path: '/safety-observation/settings', icon: Settings2 },
  { label: 'Security', path: '/safety-observation/security', icon: Lock },
  { label: 'Help & Training', path: '/safety-observation/help', icon: HelpCircle },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar-bg transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <img
          src={logo}
          alt="Soapbox.Cloud"
          className={cn('h-8 transition-all duration-300', collapsed ? 'w-8 object-contain object-left' : 'w-auto')}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
        {/* Inspection Module Section */}
        <div className="mb-6">
          {!collapsed && (
            <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">
              Safety Observation Reporting Module
            </h3>
          )}
          <ul className="space-y-1">
            {inspectionModuleItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'sidebar-link',
                    isActive(item.path) && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Administration Section */}
        <div>
          {!collapsed && (
            <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-sidebar-foreground/60">
              Administration
            </h3>
          )}
          <ul className="space-y-1">
            {administrationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'sidebar-link',
                    isActive(item.path) && 'active',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-muted transition-colors"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
