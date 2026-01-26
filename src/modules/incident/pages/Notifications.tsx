import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, UserPlus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: "assignment" | "sla_breach" | "closure" | "general";
  title: string;
  message: string;
  timestamp: string;
  incidentId?: string;
  read: boolean;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "assignment",
      title: "New Incident Assigned",
      message: "You have been assigned to INC-2024-001: Server Room Temperature Anomaly",
      timestamp: "2024-01-15T09:00:00",
      incidentId: "INC-2024-001",
      read: false,
    },
    {
      id: "n2",
      type: "sla_breach",
      title: "SLA Breach Alert",
      message: "INC-2024-002 is at risk of breaching SLA - only 1 hour remaining",
      timestamp: "2024-01-14T13:22:00",
      incidentId: "INC-2024-002",
      read: false,
    },
    {
      id: "n3",
      type: "closure",
      title: "Incident Closed",
      message: "INC-2024-003: Chemical Spill in Lab 4 has been closed",
      timestamp: "2024-01-13T15:00:00",
      incidentId: "INC-2024-003",
      read: true,
    },
    {
      id: "n4",
      type: "general",
      title: "System Update",
      message: "New features have been added to the incident management system",
      timestamp: "2024-01-12T10:00:00",
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <UserPlus className="h-5 w-5 text-info" />;
      case "sla_breach":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "closure":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with incident activities
          </p>
        </div>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-white">{unreadCount}</Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "assignment" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("assignment")}
              >
                Assignments
              </Button>
              <Button
                variant={filter === "sla_breach" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("sla_breach")}
              >
                SLA Breach
              </Button>
              <Button
                variant={filter === "closure" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("closure")}
              >
                Closures
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No notifications found
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                    !notification.read ? "border-l-4 border-l-primary bg-accent/20" : ""
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.incidentId) {
                      navigate(`/incidents/${notification.incidentId}`);
                    }
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
