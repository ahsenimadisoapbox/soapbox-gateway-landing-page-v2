import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Gauge,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  ClipboardCheck,
  FileText,
  Settings,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCalibrationEquipment } from '../../context/CalibrationEquipmentContext';
import { useState } from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Operations',
    items: [
      { title: 'Dashboard', href: '/calibration-equipment/', icon: LayoutDashboard },
      { title: 'Equipment', href: '/calibration-equipment/equipment', icon: Package },
      { title: 'Calibration', href: '/calibration-equipment/calibration', icon: Gauge },
      { title: 'OOT Management', href: '/calibration-equipment/oot', icon: AlertTriangle },
      { title: 'Preventive Maintenance', href: '/calibration-equipment/pm', icon: Wrench },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { title: 'Risk Assessment', href: '/calibration-equipment/risk', icon: ShieldAlert },
      { title: 'Audit & Evidence', href: '/calibration-equipment/audit', icon: ClipboardCheck },
      { title: 'Reports', href: '/calibration-equipment/reports', icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'Administration', href: '/calibration-equipment/settings', icon: Settings },
      { title: 'Security', href: '/calibration-equipment/security', icon: Shield },
      { title: 'Help & Training', href: '/calibration-equipment/help', icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const { sidebarCollapsed } = useCalibrationEquipment();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(navigation.map(g => g.title));

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title) ? prev.filter(g => g !== title) : [...prev, title]
    );
  };

  if (sidebarCollapsed) {
    return (
      <aside className="w-14 bg-sidebar border-r border-sidebar-border flex flex-col h-[calc(100vh-3.5rem)] sticky top-14">
        <nav className="flex-1 py-4">
          {navigation.flatMap(group =>
            group.items.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-center h-10 w-full transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                  title={item.title}
                >
                  <Icon className="h-5 w-5" />
                </NavLink>
              );
            })
          )}
        </nav>
        <div className="p-2 border-t border-sidebar-border text-center">
          <span className="text-[10px] text-sidebar-muted">v1.0</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="px-4 py-4 border-b border-sidebar-border">
        <h2 className="text-sm font-bold text-sidebar-foreground leading-tight">
          Calibration & Equipment
        </h2>
        <p className="text-xs text-sidebar-muted mt-0.5">Management Module</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {navigation.map((group) => {
          const isExpanded = expandedGroups.includes(group.title);
          return (
            <div key={group.title}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-4 py-2 mt-2 first:mt-0"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                  {group.title}
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-sidebar-muted" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-sidebar-muted" />
                )}
              </button>
              {isExpanded && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm transition-colors mx-2 rounded-md",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-center">
          <p className="text-[10px] text-sidebar-muted">© soapbox.cloud 2025</p>
          <p className="text-[10px] text-sidebar-muted">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
