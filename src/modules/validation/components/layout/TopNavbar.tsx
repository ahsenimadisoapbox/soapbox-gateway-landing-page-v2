import React, { useState } from 'react';
import { Bell, Users, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useValidation } from '../../context/ValidationContext';
import { cn } from '../../lib/utils';
import { NotificationsPanel } from './NotificationsPanel';
import soapboxLogo from '../../assets/soapbox-logo.png';

export const TopNavbar: React.FC = () => {
  const { currentUser, users, setCurrentUser, unreadNotificationsCount } = useValidation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <img src={soapboxLogo} alt="Soapbox" style={{ height: '116px' }} className="w-auto" />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Switch User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md hover:bg-muted transition-colors relative" title="Switch User">
              <Users size={20} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
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
                <User size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">({user.role})</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md hover:bg-muted transition-colors relative" title="Notifications">
              <Bell size={20} className="text-muted-foreground" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-status-required text-status-required-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pr-2 rounded-md hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-semibold text-sm">
                  {currentUser.initials}
                </span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-3">
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-accent mt-1">{currentUser.role}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User size={16} className="mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings size={16} className="mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut size={16} className="mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
