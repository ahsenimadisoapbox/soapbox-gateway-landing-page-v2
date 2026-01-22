import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 header-gradient shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SOAPBOX.CLOUD" className="h-9" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:text-foreground hover:bg-foreground/10 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-3">Notifications</h3>
                  <div className="space-y-2">
                    <DropdownMenuItem className="flex flex-col items-start p-2 cursor-pointer">
                      <p className="font-medium text-sm">New incident reported</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start p-2 cursor-pointer">
                      <p className="font-medium text-sm">Audit scheduled</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </DropdownMenuItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:text-foreground hover:bg-foreground/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/logout" className="w-full">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
