import React from 'react';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { SeverityBadge, StatusBadge } from '../components/ui/status-badge';

export default function IncidentsDashboardPage() {
  const { incidents } = useQualityEvents();
  const navigate = useNavigate();

  // Statistics
  const openIncidents = incidents.filter(i => i.status !== 'closed');
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed');
  const overdueIncidents = incidents.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'closed');
  const closedThisMonth = incidents.filter(i => i.status === 'closed');

  // Chart data
  const statusData = [
    { name: 'Open', value: incidents.filter(i => i.status === 'open').length, color: '#3b82f6' },
    { name: 'Containment', value: incidents.filter(i => i.status === 'containment').length, color: '#f59e0b' },
    { name: 'Investigation', value: incidents.filter(i => i.status === 'investigation').length, color: '#8b5cf6' },
    { name: 'Corrective Actions', value: incidents.filter(i => i.status === 'corrective-action').length, color: '#ec4899' },
    { name: 'Closed', value: incidents.filter(i => i.status === 'closed').length, color: '#22c55e' },
  ];

  const severityData = [
    { severity: 'Critical', count: incidents.filter(i => i.severity === 'critical').length, color: '#dc2626' },
    { severity: 'Major', count: incidents.filter(i => i.severity === 'major').length, color: '#f97316' },
    { severity: 'Minor', count: incidents.filter(i => i.severity === 'minor').length, color: '#eab308' },
  ];

  const trendData = [
    { month: 'Aug', opened: 4, closed: 3 },
    { month: 'Sep', opened: 6, closed: 5 },
    { month: 'Oct', opened: 3, closed: 4 },
    { month: 'Nov', opened: 7, closed: 6 },
    { month: 'Dec', opened: 5, closed: 7 },
    { month: 'Jan', opened: incidents.length, closed: closedThisMonth.length },
  ];

  const resolutionTimeData = [
    { category: 'Critical', avgDays: 3 },
    { category: 'High', avgDays: 7 },
    { category: 'Medium', avgDays: 14 },
    { category: 'Low', avgDays: 21 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-warning" />
          <div>
            <h1 className="text-2xl font-bold">Incidents Dashboard</h1>
            <p className="text-muted-foreground">Overview of quality incidents and performance metrics</p>
          </div>
        </div>
        <Button onClick={() => navigate('/incidents')}>View All Incidents</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Incidents</p>
                <p className="text-3xl font-bold">{openIncidents.length}</p>
              </div>
              <div className="flex flex-col items-end">
                <AlertTriangle className="h-8 w-8 text-warning" />
                <div className="flex items-center text-xs text-green-500 mt-2">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  12% vs last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Severity</p>
                <p className="text-3xl font-bold">{criticalIncidents.length}</p>
              </div>
              <div className="flex flex-col items-end">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Minus className="h-3 w-3 mr-1" />
                  No change
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold">{overdueIncidents.length}</p>
              </div>
              <div className="flex flex-col items-end">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="flex items-center text-xs text-destructive mt-2">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8% vs last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed This Month</p>
                <p className="text-3xl font-bold">{closedThisMonth.length}</p>
              </div>
              <div className="flex flex-col items-end">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="flex items-center text-xs text-green-500 mt-2">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  25% vs last month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="severity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))">
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="opened" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="closed" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm">Opened</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Resolution Time (Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Critical Incidents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Critical Incidents Requiring Attention</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/incidents')}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {criticalIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No critical incidents at this time
              </div>
            ) : (
              criticalIncidents.slice(0, 5).map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                        <SeverityBadge severity={incident.severity as any} />
                        <StatusBadge variant={incident.status as any} />
                      </div>
                      <p className="font-medium">{incident.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Due {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                    </p>
                    <p className="text-sm">{incident.owner.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
