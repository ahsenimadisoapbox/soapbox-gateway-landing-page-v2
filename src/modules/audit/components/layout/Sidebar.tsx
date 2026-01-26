import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  FileText,
  Bell,
  AlertCircle,
  Users,
  Shield,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Audit Dashboard', href: '/audit/dashboard', icon: LayoutDashboard },
  { name: 'Audit Planning', href: '/audit/planning', icon: Calendar },
  { name: 'Audit Checklists', href: '/audit/checklists', icon: ClipboardList },
  { name: 'Findings & NCRs', href: '/audit/findings', icon: AlertTriangle },
  { name: 'CAPA Actions', href: '/audit/capa', icon: FileCheck },
  { name: 'Audit Reports', href: '/audit/reports', icon: FileText },
  { name: 'Audit Notifications', href: '/audit/notifications', icon: Bell },
  { name: 'Audit Escalations', href: '/audit/escalations', icon: AlertCircle },
  { name: 'Auditors', href: '/audit/auditors', icon: Users },
  { name: 'User & Administration', href: '/audit/admin', icon: Shield },
  { name: 'Settings', href: '/audit/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-lg font-bold text-sidebar-foreground tracking-wide">
          AUDIT MANAGEMENT
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          © 2025 Soapbox Cloud
        </p>
      </div>
    </aside>
  );
};
