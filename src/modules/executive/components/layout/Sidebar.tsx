import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useExecutive } from '../../store/ExecutiveContext';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  LayoutDashboard,
  Shield,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  Package,
  Leaf,
  Bell,
  FileText,
  Settings,
  Lock,
  HelpCircle,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'Executive Overview',
    items: [
      { title: 'Executive Dashboard', href: '/executive/', icon: LayoutDashboard },
      { title: 'Board View', href: '/executive/board-view', icon: FileText },
    ],
  },
  {
    title: 'Risk & Compliance',
    items: [
      { title: 'Risk & Exposure', href: '/executive/risk', icon: Shield },
      { title: 'Compliance & Audits', href: '/executive/compliance', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Incident & Quality',
    items: [
      { title: 'Incident Intelligence', href: '/executive/incident-intelligence', icon: AlertTriangle },
      { title: 'CAPA Effectiveness', href: '/executive/capa', icon: FileCheck },
      { title: 'Quality & Suppliers', href: '/executive/quality', icon: Package },
      { title: 'ESG & Sustainability', href: '/executive/esg', icon: Leaf },
    ],
  },
  {
    title: 'Reports & Alerts',
    items: [
      { title: 'Alerts Centre', href: '/executive/alerts-centre', icon: Bell },
      { title: 'Reports', href: '/executive/reports', icon: FileText },
      { title: 'Board Packs', href: '/executive/board-packs', icon: FileText },
    ],
  },
  {
    title: 'System',
    items: [
      { title: 'System & Administration', href: '/executive/administration', icon: Settings },
      { title: 'Security', href: '/executive/security', icon: Lock },
      { title: 'Help & Training', href: '/executive/help', icon: HelpCircle },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { sidebarCollapsed, toggleSidebar } = useExecutive();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out sticky top-0 z-40",
        sidebarCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Module Title */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">Executive Console</h2>
        </div>
      )}

      <ScrollArea className="flex-1 custom-scrollbar">
        <nav className="p-2">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
              {!sidebarCollapsed && (
                <h3 className="nav-section-title text-sidebar-muted mb-1">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "nav-item group",
                          isActive && "nav-item-active bg-sidebar-accent",
                          sidebarCollapsed && "justify-center px-2"
                        )}
                        title={sidebarCollapsed ? item.title : undefined}
                      >
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isActive ? "text-sidebar-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground"
                        )} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.title}</span>
                            {isActive && (
                              <ChevronRight className="h-4 w-4 text-sidebar-primary" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        {!sidebarCollapsed && (
          <>
            <p className="text-xs text-sidebar-muted text-center">
              © soapbox.cloud 2025
            </p>
            <p className="text-xs text-sidebar-muted text-center mt-0.5">
              Version 1.0.0
            </p>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "w-full mt-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
          )}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
