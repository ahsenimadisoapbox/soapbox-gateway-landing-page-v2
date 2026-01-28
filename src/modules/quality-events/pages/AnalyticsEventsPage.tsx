import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useQualityEvents } from '../contexts/QualityEventsContext';
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
} from 'recharts';

export default function AnalyticsEventsPage() {
  const { qualityEvents } = useQualityEvents();

  const statusData = [
    { name: 'Draft', value: qualityEvents.filter(e => e.status === 'draft').length, color: '#94a3b8' },
    { name: 'Submitted', value: qualityEvents.filter(e => e.status === 'submitted').length, color: '#3b82f6' },
    { name: 'Triage', value: qualityEvents.filter(e => e.status === 'triage').length, color: '#f59e0b' },
    { name: 'Validated', value: qualityEvents.filter(e => e.status === 'validated').length, color: '#8b5cf6' },
    { name: 'Escalated', value: qualityEvents.filter(e => e.status === 'escalated').length, color: '#ef4444' },
    { name: 'Closed', value: qualityEvents.filter(e => e.status === 'closed').length, color: '#22c55e' },
  ];

  const priorityData = [
    { name: 'Low', value: qualityEvents.filter(e => e.priority === 'low').length, color: '#22c55e' },
    { name: 'Medium', value: qualityEvents.filter(e => e.priority === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: qualityEvents.filter(e => e.priority === 'high').length, color: '#ef4444' },
    { name: 'Critical', value: qualityEvents.filter(e => e.priority === 'critical').length, color: '#dc2626' },
  ];

  const categoryData = [
    { category: 'Environmental', count: qualityEvents.filter(e => e.category.includes('Environmental')).length },
    { category: 'Documentation', count: qualityEvents.filter(e => e.category.includes('Documentation')).length },
    { category: 'Supplier', count: qualityEvents.filter(e => e.category.includes('Supplier')).length },
    { category: 'Customer', count: qualityEvents.filter(e => e.category.includes('Customer')).length },
    { category: 'Equipment', count: qualityEvents.filter(e => e.category.includes('Equipment')).length },
    { category: 'Process', count: qualityEvents.filter(e => e.category.includes('Process')).length },
  ];

  const trendData = [
    { month: 'Aug', events: 8 },
    { month: 'Sep', events: 12 },
    { month: 'Oct', events: 10 },
    { month: 'Nov', events: 15 },
    { month: 'Dec', events: 11 },
    { month: 'Jan', events: qualityEvents.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Events Dashboard</h1>
          <p className="text-muted-foreground">Quality events analytics and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{qualityEvents.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{qualityEvents.filter(e => e.status !== 'closed').length}</p>
                <p className="text-sm text-muted-foreground">Open Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{qualityEvents.filter(e => e.priority === 'critical').length}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{qualityEvents.filter(e => e.status === 'closed').length}</p>
                <p className="text-sm text-muted-foreground">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Events by Status</CardTitle>
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
            <CardTitle>Events by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
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
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="events" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
