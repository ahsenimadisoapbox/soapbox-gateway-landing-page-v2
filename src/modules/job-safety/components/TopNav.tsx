import { Bell, User, Users, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import logo from "../assets/logo.png";

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  const notifications = [
    { id: 1, message: "New JSA pending L1 review", time: "5 min ago" },
    { id: 2, message: "JSA-2024-001 approved", time: "1 hour ago" },
    { id: 3, message: "Risk assessment due tomorrow", time: "2 hours ago" },
  ];

  const users = [
    { id: 1, name: "John Smith", role: "Compliance Manager" },
    { id: 2, name: "Sarah Johnson", role: "EHS Officer" },
    { id: 3, name: "Mike Williams", role: "Auditor" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <img src={logo} alt="Soapbox Cloud" className="h-8" />
          </div>
          
          <div className="ml-auto flex items-center gap-2">
            {/* Switch User */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowSwitchUser(true)}
            >
              <Users className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    JD
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@company.com</p>
                    <p className="text-xs text-muted-foreground">Compliance Manager</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-muted-foreground">{notif.time}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Switch User Dialog */}
      <Dialog open={showSwitchUser} onOpenChange={setShowSwitchUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch User</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={() => setShowSwitchUser(false)}
              >
                <User className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">({user.role})</span>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
