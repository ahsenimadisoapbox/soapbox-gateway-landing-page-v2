import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  Inbox,
  Search,
  Bell,
  FileStack,
  Clock,
  TrendingUp,
  Database,
  Workflow,
  FileSearch,
  Archive,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  badge?: number;
}

interface NavGroupProps {
  title: string;
  items: NavItemProps[];
  collapsed: boolean;
  defaultOpen?: boolean;
}

function NavItem({ to, icon: Icon, label, collapsed, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
          'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent',
          isActive && 'bg-sidebar-accent text-sidebar-foreground font-medium',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function NavGroup({ title, items, collapsed, defaultOpen = true }: NavGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const location = useLocation();

  if (collapsed) {
    return (
      <div className="space-y-1">
        {items.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-sidebar-foreground uppercase tracking-wider hover:bg-sidebar-accent/50 rounded-md">
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 mt-1 ml-2">
        {items.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50 bg-sidebar flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Module Title Header */}
      <div className={cn(
        'h-14 flex items-center border-b border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'justify-start'
      )}>
        {!collapsed ? (
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground leading-tight">Quality Events &</h1>
            <p className="text-sm font-bold text-sidebar-foreground">Incident Management</p>
          </div>
        ) : (
          <span className="text-sidebar-foreground font-bold text-lg">QE</span>
        )}
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-4">
          {/* Global & Navigation */}
          <NavGroup
            title="Overview"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/', icon: LayoutDashboard, label: 'Dashboard', collapsed },
              { to: '/quality-events/my-work', icon: Inbox, label: 'My Work Queue', collapsed, badge: 5 },
              { to: '/quality-events/notifications', icon: Bell, label: 'Notifications', collapsed, badge: 3 },
              { to: '/quality-events/search', icon: Search, label: 'Global Search', collapsed },
            ]}
          />

          {/* Quality Events */}
          <NavGroup
            title="Quality Events"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/events', icon: FileText, label: 'All Events', collapsed },
              { to: '/quality-events/events/create', icon: FileText, label: 'Create Event', collapsed },
              { to: '/quality-events/events/drafts', icon: FileStack, label: 'Drafts', collapsed },
            ]}
          />

          {/* Triage & Assessment */}
          <NavGroup
            title="Triage & Assessment"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/triage', icon: ClipboardCheck, label: 'Triage Queue', collapsed, badge: 2 },
              { to: '/quality-events/risk-assessment', icon: AlertTriangle, label: 'Risk Assessment', collapsed },
              { to: '/quality-events/classification', icon: FileSearch, label: 'QA Classification', collapsed },
            ]}
          />

          {/* Incidents */}
          <NavGroup
            title="Incidents"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/incidents', icon: AlertTriangle, label: 'All Incidents', collapsed },
              { to: '/quality-events/incidents/containment', icon: Shield, label: 'Containment', collapsed },
              { to: '/quality-events/incidents/investigation', icon: FileSearch, label: 'Investigation', collapsed },
              { to: '/quality-events/incidents/corrective-actions', icon: Workflow, label: 'Corrective Actions', collapsed },
            ]}
          />

          {/* Closure & Learning */}
          <NavGroup
            title="Closure & Learning"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/qa-review', icon: ClipboardCheck, label: 'QA Review', collapsed },
              { to: '/quality-events/effectiveness', icon: TrendingUp, label: 'Effectiveness', collapsed },
              { to: '/quality-events/lessons-learned', icon: BookOpen, label: 'Lessons Learned', collapsed },
            ]}
          />

          {/* Analytics */}
          <NavGroup
            title="Analytics"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/analytics/events', icon: BarChart3, label: 'Events Dashboard', collapsed },
              { to: '/quality-events/analytics/incidents', icon: BarChart3, label: 'Incidents Dashboard', collapsed },
              { to: '/quality-events/analytics/risk-heatmap', icon: TrendingUp, label: 'Risk Heatmap', collapsed },
              { to: '/quality-events/analytics/executive', icon: BarChart3, label: 'Executive Overview', collapsed },
            ]}
          />

          {/* Audit & Records */}
          <NavGroup
            title="Audit & Records"
            collapsed={collapsed}
            items={[
              { to: '/quality-events/audit/events', icon: Archive, label: 'Event Register', collapsed },
              { to: '/quality-events/audit/incidents', icon: Archive, label: 'Incident Register', collapsed },
              { to: '/quality-events/audit/trail', icon: Clock, label: 'Audit Trail', collapsed },
              { to: '/quality-events/audit/evidence', icon: Database, label: 'Evidence Repository', collapsed },
            ]}
          />

          {/* Administration */}
          <NavGroup
            title="System"
            collapsed={collapsed}
            defaultOpen={false}
            items={[
              { to: '/quality-events/administration', icon: Settings, label: 'Settings & Administration', collapsed },
              { to: '/quality-events/security', icon: Shield, label: 'Security', collapsed },
              { to: '/quality-events/help', icon: HelpCircle, label: 'Help & Training', collapsed },
            ]}
          />
        </div>
      </ScrollArea>

      {/* Footer - Version & Toggle */}
      <div className="border-t border-sidebar-border p-3 flex flex-col items-center gap-2">
        <div className="text-xs text-sidebar-foreground/60 text-center">
          {!collapsed && <p>© soapbox.cloud 2025</p>}
          <p className={collapsed ? 'text-[10px]' : ''}>
            {collapsed ? 'v1.0.0' : 'Version 1.0.0'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
