import { useState } from 'react';
import { Bell, Users, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useNCR } from '../../context/NCRContext';
import { mockUsers } from '../../data/mockData';
import logo from '../../assets/logo.png';
import { cn } from '../../lib/utils';

interface AppHeaderProps {
  sidebarCollapsed: boolean;
}

export function AppHeader({ sidebarCollapsed }: AppHeaderProps) {
  const { notifications, currentUser, setCurrentUser, markNotificationRead } = useNCR();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSwitchUser = (user: typeof mockUsers[0]) => {
    setCurrentUser(user);
    setShowSwitchUser(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-header border-b border-header-border flex items-center justify-between px-4 z-30 transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Soapbox.Cloud" className="w-[116px] h-auto" />
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Switch User */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSwitchUser(!showSwitchUser);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="icon-button text-muted-foreground hover:text-foreground"
            title="Switch User"
          >
            <Users className="h-5 w-5" />
          </button>

          {showSwitchUser && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 animate-slide-up">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-semibold text-foreground">Switch User</p>
              </div>
              {mockUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left',
                    currentUser.id === user.id && 'bg-accent'
                  )}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
              setShowSwitchUser(false);
            }}
            className="icon-button text-muted-foreground hover:text-foreground relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg py-2 animate-slide-up max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-border">
                <p className="font-semibold text-foreground">Notifications</p>
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">No notifications</p>
              ) : (
                notifications.map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-accent border-b border-border last:border-0',
                      !notification.read && 'bg-accent/50'
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
              setShowSwitchUser(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <span className="text-sm font-medium">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 animate-slide-up">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                <p className="text-sm text-primary mt-1">{currentUser.role}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Profile Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left">
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Account Settings</span>
              </button>
              <div className="border-t border-border mt-2 pt-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showNotifications || showUserMenu || showSwitchUser) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
            setShowSwitchUser(false);
          }}
        />
      )}
    </header>
  );
}
