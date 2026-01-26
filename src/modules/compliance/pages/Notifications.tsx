import { Eye, Mail, MessageSquare, Bell, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { FilterSearch } from "../components/FilterSearch";

const Notifications = () => {
  const notifications = [
    { id: "NOT-001", subject: "Task TSK-002 is overdue", channel: "email", recipient: "sarah.johnson@company.com", status: "delivered", priority: "high", sentAt: "2024-12-05 09:00", retries: 0 },
    { id: "NOT-002", subject: "Assessment AR-002 requires attention", channel: "in_app", recipient: "mike.rodriguez@company.com", status: "delivered", priority: "medium", sentAt: "2024-12-05 10:30", retries: 0 },
    { id: "NOT-003", subject: "Escalation: TSK-002 Level 2", channel: "sms", recipient: "+1234567890", status: "failed", priority: "critical", sentAt: "2024-12-05 11:00", retries: 3 },
    { id: "NOT-004", subject: "Weekly compliance summary", channel: "email", recipient: "team@company.com", status: "pending", priority: "low", sentAt: "2024-12-05 14:00", retries: 0 },
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return <Mail className="w-4 h-4 text-blue-500" />;
      case "sms": return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "in_app": return <Bell className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": return <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /><Badge className="bg-green-100 text-green-800">Delivered</Badge></div>;
      case "failed": return <div className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-600" /><Badge className="bg-red-100 text-red-800">Failed</Badge></div>;
      case "pending": return <div className="flex items-center gap-1"><RefreshCw className="w-3 h-3 text-yellow-600" /><Badge className="bg-yellow-100 text-yellow-800">Pending</Badge></div>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    { label: "Channel", options: [{ label: "Email", value: "email", checked: false }, { label: "SMS", value: "sms", checked: false }, { label: "In-App", value: "in_app", checked: false }] },
    { label: "Status", options: [{ label: "Delivered", value: "delivered", checked: false }, { label: "Failed", value: "failed", checked: false }, { label: "Pending", value: "pending", checked: false }] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Notification delivery logs and audit trail</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{notifications.length}</div><p className="text-xs text-muted-foreground">Total Sent</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.status === "delivered").length}</div><p className="text-xs text-muted-foreground">Delivered</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{notifications.filter(n => n.status === "failed").length}</div><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{notifications.filter(n => n.status === "pending").length}</div><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{notifications.filter(n => n.retries > 0).length}</div><p className="text-xs text-muted-foreground">Retried</p></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search notifications..." filterGroups={filterGroups} /></CardContent></Card>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Retries</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.id}</TableCell>
                <TableCell><div className="flex items-center gap-2">{getChannelIcon(n.channel)}<span className="capitalize">{n.channel.replace("_", "-")}</span></div></TableCell>
                <TableCell className="max-w-[200px] truncate">{n.subject}</TableCell>
                <TableCell className="text-sm">{n.recipient}</TableCell>
                <TableCell><Badge className={getPriorityColor(n.priority)}>{n.priority}</Badge></TableCell>
                <TableCell>{getStatusBadge(n.status)}</TableCell>
                <TableCell>{n.sentAt}</TableCell>
                <TableCell>{n.retries}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Notifications;
