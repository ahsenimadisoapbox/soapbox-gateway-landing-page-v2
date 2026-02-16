import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface ModuleSidebarProps {
  moduleName: string;
  navigation: NavSection[];
  className?: string;
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  moduleName,
  navigation,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col transition-all duration-300 sticky top-0 z-40",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Module Title */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-lg font-bold text-sidebar-foreground">
            {moduleName}
          </h2>
        </div>
      )}

      <ScrollArea className="flex-1 custom-scrollbar">
        <nav className="p-2">
          {navigation.map((section, index) => (
            <div key={index} className={index > 0 ? "mt-6" : ""}>
              {!collapsed && section.title && (
                <h3 className="nav-section-title text-sidebar-muted mb-1">
                  {section.title}
                </h3>
              )}

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");

                  const Icon = item.icon;

                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={cn(
                          "nav-item group",
                          isActive && "nav-item-active bg-sidebar-accent",
                          collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {Icon && (
                          <Icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive
                                ? "text-sidebar-primary"
                                : "text-sidebar-muted group-hover:text-sidebar-foreground"
                            )}
                          />
                        )}

                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">
                              {item.label}
                            </span>
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
        {!collapsed && (
          <>
            <p className="text-xs text-sidebar-muted text-center">
              © soapbox.cloud 2026
            </p>
            <p className="text-xs text-sidebar-muted text-center mt-0.5">
              Version 1.0.0
            </p>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-2 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
};

export default ModuleSidebar;
