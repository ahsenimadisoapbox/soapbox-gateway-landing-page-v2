import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Bell, AlertTriangle, Download, Archive } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ExportAnimation } from '../components/ExportAnimation';

export default function NotificationsEscalations() {
  const { notifications, capas, findings, markNotificationRead, archiveAllNotifications } = useAudit();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isExportingNotifications, setIsExportingNotifications] = useState(false);
  const [isExportingEscalations, setIsExportingEscalations] = useState(false);

  // Generate escalations from overdue CAPAs
  const escalations = capas
    .filter(capa => {
      const dueDate = new Date(capa.dueDate);
      const today = new Date();
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysOverdue >= 7;
    })
    .map(capa => {
      const finding = findings.find(f => f.id === capa.findingId);
      const dueDate = new Date(capa.dueDate);
      const today = new Date();
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: `ESC-${capa.id}`,
        capaId: capa.id,
        findingId: capa.findingId,
        title: `Overdue CAPA: ${capa.title}`,
        severity: finding?.severity || 'Major',
        daysOverdue,
        owner: capa.owner,
        status: 'Open',
      };
    });

  // Apply filters
  const filteredNotifications = notifications.filter(notification => {
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  const filteredEscalations = escalations.filter(escalation => {
    if (severityFilter !== 'all' && escalation.severity !== severityFilter) return false;
    return true;
  });

  // Data for charts
  const notificationsByType = [
    { name: 'Info', value: notifications.filter(n => n.type === 'info').length },
    { name: 'Warning', value: notifications.filter(n => n.type === 'warning').length },
    { name: 'Alert', value: notifications.filter(n => n.type === 'alert').length },
  ];

  const escalationTrend = [
    { month: 'Aug', escalations: 2 },
    { month: 'Sep', escalations: 4 },
    { month: 'Oct', escalations: escalations.length },
  ];

  const COLORS = ['hsl(var(--info))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'Major': return 'default';
      case 'Minor': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Audit Notifications & Escalations</h1>
            <p className="text-muted-foreground mt-2">
              Monitor audit activities and manage escalated issues
            </p>
          </div>
        </div>

        {/* Data Visualizations */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notifications by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={notificationsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {notificationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Escalation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={escalationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="escalations" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications ({filteredNotifications.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={archiveAllNotifications}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive All
                </Button>
                <Button size="sm" onClick={() => setIsExportingNotifications(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Notifications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map(notification => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <Badge
                        variant={
                          notification.type === 'alert'
                            ? 'destructive'
                            : notification.type === 'warning'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {notification.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={notification.read ? 'text-muted-foreground' : 'font-medium'}>
                      {notification.message}
                    </TableCell>
                    <TableCell>{notification.date}</TableCell>
                    <TableCell>
                      <Badge variant={notification.read ? 'secondary' : 'default'}>
                        {notification.read ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Escalations Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Escalations ({filteredEscalations.length})
              </CardTitle>
              <Button size="sm" onClick={() => setIsExportingEscalations(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export Escalations
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escalation ID</TableHead>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Finding ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEscalations.map(escalation => (
                  <TableRow key={escalation.id}>
                    <TableCell className="font-medium">{escalation.id}</TableCell>
                    <TableCell>
                      <span className="text-sm text-primary">{escalation.capaId}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-primary">{escalation.findingId}</span>
                    </TableCell>
                    <TableCell>{escalation.title}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(escalation.severity)}>
                        {escalation.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{escalation.daysOverdue} days</Badge>
                    </TableCell>
                    <TableCell>{escalation.owner}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{escalation.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ExportAnimation
        isExporting={isExportingNotifications}
        onComplete={() => setIsExportingNotifications(false)}
      />
      <ExportAnimation
        isExporting={isExportingEscalations}
        onComplete={() => setIsExportingEscalations(false)}
      />
    </>
  );
}
