import { useState } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAudit } from '../../contexts/AuditContext';
import { Badge } from '../ui/badge';
import soapboxLogo from '../../assets/soapbox-logo.png';

export const Header = () => {
  const { notifications, markNotificationRead, users, currentUser, setCurrentUser } = useAudit();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={soapboxLogo} alt="Soapbox Cloud" className="h-10" />
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start p-3 cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Badge
                        variant={
                          notification.type === 'alert'
                            ? 'destructive'
                            : notification.type === 'warning'
                            ? 'default'
                            : 'secondary'
                        }
                        className="shrink-0"
                      >
                        {notification.type}
                      </Badge>
                      <div className="flex-1">
                        <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Switch User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Switch User
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {users.map(user => (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => setCurrentUser(user.id)}
                  className={`cursor-pointer ${currentUser?.id === user.id ? 'bg-accent' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium">{currentUser?.name}</div>
              <div className="px-2 py-1 text-xs text-muted-foreground">{currentUser?.email}</div>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};
