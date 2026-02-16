import React from "react";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.png";
import {
  PanelLeftClose,
  PanelLeft,
  Bell,
  Users,
  User,
  Settings,
  LogOut,
  Check,
  Home, // added for homepage link
} from "lucide-react";
import { Link } from "react-router-dom"; // added for navigation to dashboard
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

/* ============================================================
   TYPES
============================================================ */

export interface ModuleUser {
  id: string;
  name: string;
  email?: string;
  role?: string;
  initials?: string;
}

export interface ModuleNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date | string;
  type?: "alert" | "warning" | "success" | "info";
  read?: boolean;
}

interface ModuleHeaderProps {
  className?: string;

  // User
  currentUser?: ModuleUser;
  users?: ModuleUser[];
  onSwitchUser?: (id: string) => void;

  // Notifications
  notifications?: ModuleNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;

  // Sidebar
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

/* ============================================================
   COMPONENT
============================================================ */

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  className,
  currentUser,
  users = [],
  notifications = [],
  onSwitchUser,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case "alert":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      case "success":
        return "bg-success";
      default:
        return "bg-info";
    }
  };

  const formatTimestamp = (value: Date | string) => {
    const date = new Date(value);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <header
      className={cn(
        "h-14 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50",
        className
      )}
    >
      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="SoapBox.Cloud" className="h-9" />
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-2">

        {/* BACK TO HOMEPAGE */}
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        

        {/* ================= NOTIFICATIONS ================= */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />

              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h4 className="font-semibold">Notifications</h4>

              {unreadCount > 0 && onMarkAllNotificationsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllNotificationsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>

            <ScrollArea className="h-80">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    onMarkNotificationRead?.(notification.id)
                  }
                  className={cn(
                    "p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-accent/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        getNotificationColor(notification.type)
                      )}
                    />

                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* ================= PROFILE ================= */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-sm">
                JD
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2">
              <p className="font-semibold">John Doe</p>

              <p className="text-sm text-muted-foreground">
                john.doe@soapbox.in
              </p>

              <p className="text-sm text-accent mt-0.5">
                Manager
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-3 cursor-pointer">
              <Settings className="h-4 w-4" />
              Account Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-3 cursor-pointer text-destructive">
              <Link to="/logout" className="flex items-center gap-3 w-full">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ModuleHeader;
