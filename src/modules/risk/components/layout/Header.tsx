import { Bell, Settings, User, LogOut } from 'lucide-react';
import soapboxLogo from '../../assets/soapbox-logo.png';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { SidebarTrigger } from '../ui/sidebar';
import { User as UserType } from '../../types/risk';
import { getRoleDisplayName, mockUsers } from '../../lib/mockData';
import { setCurrentUser, logout, getNotifications } from '../../lib/storage';
import { toast } from '../../hooks/use-toast';

interface HeaderProps {
  currentUser: UserType;
  onUserChange: (user: UserType) => void;
}

export function Header({ currentUser, onUserChange }: HeaderProps) {
  const unreadNotifications = getNotifications(currentUser.id).filter(n => !n.read).length;

  const handleUserSwitch = (user: UserType) => {
    setCurrentUser(user);
    onUserChange(user);
    toast({
      title: "User Switched",
      description: `Now logged in as ${user.name} (${getRoleDisplayName(user.role)})`,
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-3">
          <img 
            src={soapboxLogo} 
            alt="Soapbox Cloud" 
            className="h-8 w-auto"
          />
          <div>
            <p className="text-xs text-muted-foreground">Risk Management Platform</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Demo User Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Switch User (Demo)
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Demo Users</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockUsers.map((user) => (
              <DropdownMenuItem 
                key={user.id}
                onClick={() => handleUserSwitch(user)}
                className={currentUser.id === user.id ? 'bg-muted' : ''}
              >
                <User className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {getRoleDisplayName(user.role)}
                  </div>
                </div>
                {currentUser.id === user.id && (
                  <Badge variant="secondary" className="ml-auto">Active</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getRoleDisplayName(currentUser.role)}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}