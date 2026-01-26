import { Bell, Users, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

export const Header = () => {
  return (
    <div className="flex items-center gap-2">
      {/* Switch User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Users className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="font-semibold">Switch User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 py-3">
            <User className="h-4 w-4" />
            <div>
              <div className="font-medium">John Smith</div>
              <div className="text-xs text-muted-foreground">(Compliance Manager)</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 py-3">
            <User className="h-4 w-4" />
            <div>
              <div className="font-medium">Sarah Johnson</div>
              <div className="text-xs text-muted-foreground">(EHS Officer)</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 py-3">
            <User className="h-4 w-4" />
            <div>
              <div className="font-medium">Mike Williams</div>
              <div className="text-xs text-muted-foreground">(Auditor)</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="py-3">
            <div>
              <div className="font-medium">Obligation Due Soon</div>
              <div className="text-xs text-muted-foreground">Annual GDPR Assessment due in 3 days</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3">
            <div>
              <div className="font-medium">Evidence Uploaded</div>
              <div className="text-xs text-muted-foreground">New evidence added for OBL-2024-002</div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3">
            <div>
              <div className="font-medium">Assessment Completed</div>
              <div className="text-xs text-muted-foreground">ISO 27001 assessment has been completed</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2">
            <div className="font-semibold">John Doe</div>
            <div className="text-sm text-muted-foreground">john.doe@company.com</div>
            <div className="text-sm text-muted-foreground">Compliance Manager</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive flex items-center gap-2">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
