import { useAudit } from '../contexts/AuditContext';
import { KPICard } from '../components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FileCheck, AlertTriangle, Calendar, Clock, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { audits, findings, capas, notifications } = useAudit();

  const totalAudits = audits.length;
  const openAudits = audits.filter(a => a.status === 'In Progress' || a.status === 'Scheduled').length;
  const completedAudits = audits.filter(a => a.status === 'Completed').length;
  const overdueAudits = audits.filter(a => a.status === 'Overdue').length;

  const chartData = [
    { month: 'Aug', audits: 12 },
    { month: 'Sep', audits: 15 },
    { month: 'Oct', audits: 18 },
    { month: 'Nov', audits: 14 },
  ];

  const statusData = [
    { name: 'Scheduled', value: audits.filter(a => a.status === 'Scheduled').length },
    { name: 'In Progress', value: audits.filter(a => a.status === 'In Progress').length },
    { name: 'Completed', value: audits.filter(a => a.status === 'Completed').length },
    { name: 'Overdue', value: overdueAudits },
  ];

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of audit activities and performance metrics
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Audits"
          value={totalAudits}
          icon={FileCheck}
          trend="+2 from last month"
          trendUp
        />
        <KPICard
          title="Open Audits"
          value={openAudits}
          icon={Calendar}
        />
        <KPICard
          title="Completed"
          value={completedAudits}
          icon={FileCheck}
        />
        <KPICard
          title="Overdue"
          value={overdueAudits}
          icon={Clock}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Audit Status Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="audits" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Panel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive">{unreadNotifications.length}</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Mark All Read</Button>
            <Button variant="outline" size="sm">Archive All</Button>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No notifications at the moment</p>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      notification.type === 'alert' ? 'text-destructive' : 'text-warning'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                  </div>
                  {!notification.read && (
                    <Badge variant="secondary">New</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Findings</CardTitle>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No findings recorded yet</p>
          ) : (
            <div className="space-y-4">
              {findings.slice(0, 5).map(finding => (
                <div key={finding.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{finding.id}</span>
                      <Badge
                        variant={
                          finding.severity === 'Critical' ? 'destructive' :
                          finding.severity === 'Major' ? 'default' : 'secondary'
                        }
                      >
                        {finding.severity}
                      </Badge>
                      <Badge variant="outline">{finding.status}</Badge>
                    </div>
                    <p className="text-sm">{finding.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Assigned to: {finding.assignee} | Due: {finding.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
