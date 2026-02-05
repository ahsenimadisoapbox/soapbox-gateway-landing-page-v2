import { useState } from 'react';
import { useOccupationalHealth } from '../../contexts/OccupationalContext';
import { Bell, User, Users, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import soapboxLogo from '../../assets/soapbox-logo.png';

export function TopNav() {
  const { currentUser, setCurrentUser, users, notifications, markNotificationRead, sidebarCollapsed } = useOccupationalHealth();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'OH_DOCTOR': 'OH Doctor',
      'OH_NURSE': 'OH Nurse',
      'CLINIC_ADMIN': 'Clinic Admin',
      'FIRST_AID_OFFICER': 'First Aid Officer',
      'HSE_MANAGER': 'HSE Manager',
      'HR_PARTNER': 'HR Partner',
      'SUPERVISOR': 'Supervisor',
      'EMPLOYEE_SELF': 'Employee',
      'WELLNESS_COORD': 'Wellness Coordinator',
      'OH_ADMIN': 'OH Admin',
      'TENANT_ADMIN': 'Tenant Admin',
      'AUDITOR': 'Auditor',
    };
    return roleMap[role] || role;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header 
      className={cn(
        'fixed top-0 right-0 z-30 h-14 bg-card border-b flex items-center justify-between px-4 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <img src={soapboxLogo} alt="Soapbox" className="w-[116px] h-auto" />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Switch User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
              <Users className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-card z-50">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={cn(
                  'flex items-center gap-3 cursor-pointer',
                  currentUser.id === user.id && 'bg-muted'
                )}
              >
                <UserCircle className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground"
                >
                  {unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card z-50">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={cn(
                    'flex flex-col items-start gap-1 p-3 cursor-pointer',
                    !notification.read && 'bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className={cn(
                      'h-2 w-2 rounded-full',
                      notification.type === 'error' && 'bg-destructive',
                      notification.type === 'warning' && 'bg-warning',
                      notification.type === 'success' && 'bg-success',
                      notification.type === 'info' && 'bg-info'
                    )} />
                    <span className="font-medium text-sm">{notification.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground pl-4">
                    {notification.message}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                {getInitials(currentUser.name)}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card z-50">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground">{currentUser.email}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {getRoleDisplay(currentUser.role)}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
