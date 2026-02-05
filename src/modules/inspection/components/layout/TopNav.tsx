import { Bell, Users, Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import logo from "../../assets/logo.png";
import { mockUsers } from "../../lib/mockData";

interface TopNavProps {
  onMenuToggle: () => void;
}

export const TopNav = ({ onMenuToggle }: TopNavProps) => {
  const currentUser = mockUsers[0]; // John Doe
  const switchableUsers = [mockUsers[5], mockUsers[6], mockUsers[7]]; // Other users

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <img src={logo} alt="Soapbox.Cloud" className="h-8" />
      </div>

      <div className="flex items-center gap-2">
        {/* Switch User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Users className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Switch User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {switchableUsers.map((user) => (
              <DropdownMenuItem key={user.id} className="cursor-pointer">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">({user.role})</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex-col items-start h-auto py-3">
              <div className="font-medium">Inspection INS-002 submitted for review</div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex-col items-start h-auto py-3">
              <div className="font-medium">Finding FND-003 escalated to HIGH severity</div>
              <div className="text-xs text-muted-foreground">5 hours ago</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer flex-col items-start h-auto py-3">
              <div className="font-medium">New inspection assigned: INS-004</div>
              <div className="text-xs text-muted-foreground">1 day ago</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">{currentUser.avatar}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{currentUser.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-bold">{currentUser.name}</span>
                <span className="text-sm text-muted-foreground font-normal">{currentUser.email}</span>
                <span className="text-sm text-muted-foreground font-normal">{currentUser.role}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
