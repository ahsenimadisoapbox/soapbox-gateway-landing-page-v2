import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle size={18} className="text-status-validated" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-status-conditional" />;
      case 'action':
        return <AlertCircle size={18} className="text-step-current" />;
      default:
        return <Info size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="max-h-96 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <button className="text-xs text-accent hover:underline">
          Mark all read
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={cn(
                  'px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors',
                  !notification.read && 'bg-secondary/50'
                )}
                onClick={() => {
                  markNotificationRead(notification.id);
                  onClose();
                }}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm', !notification.read && 'font-medium')}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="px-4 py-2 border-t border-border">
        <button
          onClick={onClose}
          className="w-full text-center text-xs text-accent hover:underline py-1"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};
