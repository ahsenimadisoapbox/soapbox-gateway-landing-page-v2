import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

const dummyNotifications = [
  { id: 1, message: 'New high-risk item requires approval', time: '5 min ago', unread: true },
  { id: 2, message: 'Risk assessment completed for Site A', time: '1 hour ago', unread: true },
  { id: 3, message: 'Mitigation plan updated by John Doe', time: '2 hours ago', unread: false },
  { id: 4, message: 'Audit scheduled for next week', time: '1 day ago', unread: false },
  { id: 5, message: 'New compliance report available', time: '2 days ago', unread: false },
];

export function NotificationsDropdown() {
  const [notifications] = useState(dummyNotifications);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
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
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="font-semibold">Notifications</h3>
          <Badge variant="secondary">{unreadCount} new</Badge>
        </div>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
            <div className="flex items-start gap-2 w-full">
              {notification.unread && (
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${notification.unread ? 'font-medium' : ''}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary cursor-pointer">
          Show More Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
