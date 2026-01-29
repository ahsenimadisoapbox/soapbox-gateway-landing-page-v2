import { useState } from 'react';
import { Bell, User, Users, ChevronDown, Settings, LogOut, Check } from 'lucide-react';
import { useCalibrationEquipment } from '../../context/CalibrationEquipmentContext';
import { mockUsers } from '../../data/mockData';
import logo from '../../assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { Menu } from 'lucide-react';

export function Header() {
  const { currentUser, setCurrentUser, notifications, markNotificationRead, unreadCount, sidebarCollapsed, setSidebarCollapsed } = useCalibrationEquipment();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error': return 'text-status-overdue';
      case 'warning': return 'text-status-due';
      case 'success': return 'text-status-active';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <img src={logo} alt="SoapBox.Cloud" className="h-8" />
      </div>

      <div className="flex items-center gap-2">
        {/* Switch User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Users className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockUsers.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="flex items-center gap-3 py-2"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                {currentUser.id === user.id && (
                  <Check className="h-4 w-4 text-accent" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-status-overdue text-[10px] font-medium text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-3 border-b border-border">
              <h4 className="font-semibold">Notifications</h4>
            </div>
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markNotificationRead(notification.id)}
                      className={cn(
                        "w-full text-left p-3 hover:bg-muted/50 transition-colors",
                        !notification.read && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className={cn("mt-0.5 h-2 w-2 rounded-full", 
                          notification.type === 'error' ? 'bg-status-overdue' :
                          notification.type === 'warning' ? 'bg-status-due' :
                          notification.type === 'success' ? 'bg-status-active' : 'bg-muted-foreground'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{notification.message}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-medium">
                {currentUser.initials}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <p className="text-xs text-accent">{currentUser.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-status-overdue">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
