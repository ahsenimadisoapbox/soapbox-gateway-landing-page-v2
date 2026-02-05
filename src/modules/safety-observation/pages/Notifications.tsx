import React from 'react';
import { Bell, Check } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { useNotifications } from '../contexts/NotificationContext';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const typeColors = {
    info: 'border-l-info',
    warning: 'border-l-warning',
    success: 'border-l-success',
    error: 'border-l-destructive',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description="View all system notifications"
        icon={Bell}
        actions={<Button variant="outline" onClick={markAllAsRead}>Mark All Read</Button>}
      />
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={cn('card-elevated p-4 border-l-4 flex items-start justify-between', typeColors[n.type], !n.read && 'bg-accent/30')}>
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{n.timestamp.toLocaleString()}</p>
            </div>
            {!n.read && <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}><Check className="h-4 w-4" /></Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
