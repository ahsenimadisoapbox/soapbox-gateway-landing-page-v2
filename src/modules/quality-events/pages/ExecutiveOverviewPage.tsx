import React from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, 
  Clock, Target, Shield, Award, ArrowUpRight, ArrowDownRight, Minus 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';

export default function ExecutiveOverviewPage() {
  const { qualityEvents, incidents } = useQualityEvents();
  const navigate = useNavigate();

  // Calculate KPIs
  const totalEvents = qualityEvents.length;
  const totalIncidents = incidents.length;
  const openEvents = qualityEvents.filter(e => e.status !== 'closed').length;
  const openIncidents = incidents.filter(i => i.status !== 'closed').length;
  const criticalItems = incidents.filter(i => i.severity === 'critical').length + 
                        qualityEvents.filter(e => e.priority === 'critical').length;
  const closureRate = Math.round(((totalEvents - openEvents + totalIncidents - openIncidents) / 
                                  (totalEvents + totalIncidents)) * 100) || 0;
  const avgRiskScore = Math.round(qualityEvents.reduce((sum, e) => sum + e.riskScore, 0) / totalEvents) || 0;
  
  // Trend data
  const monthlyTrend = [
    { month: 'Aug', events: 12, incidents: 3, resolved: 10 },
    { month: 'Sep', events: 18, incidents: 5, resolved: 15 },
    { month: 'Oct', events: 15, incidents: 4, resolved: 14 },
    { month: 'Nov', events: 22, incidents: 6, resolved: 20 },
    { month: 'Dec', events: 19, incidents: 4, resolved: 18 },
    { month: 'Jan', events: totalEvents, incidents: totalIncidents, resolved: totalEvents - openEvents + totalIncidents - openIncidents },
  ];

  // Category breakdown
  const categoryData = [
    { name: 'Process', value: qualityEvents.filter(e => e.category.includes('Process')).length, color: '#3b82f6' },
    { name: 'Equipment', value: qualityEvents.filter(e => e.category.includes('Equipment')).length, color: '#8b5cf6' },
    { name: 'Documentation', value: qualityEvents.filter(e => e.category.includes('Documentation')).length, color: '#f59e0b' },
    { name: 'Supplier', value: qualityEvents.filter(e => e.category.includes('Supplier')).length, color: '#ef4444' },
    { name: 'Environmental', value: qualityEvents.filter(e => e.category.includes('Environmental')).length, color: '#22c55e' },
  ].filter(c => c.value > 0);

  // Department performance
  const departmentData = [
    { department: 'Manufacturing', events: 8, resolved: 7, score: 87 },
    { department: 'Quality', events: 5, resolved: 5, score: 100 },
    { department: 'R&D', events: 3, resolved: 2, score: 67 },
    { department: 'Supply Chain', events: 6, resolved: 4, score: 67 },
    { department: 'Facilities', events: 2, resolved: 2, score: 100 },
  ];

  // Compliance metrics
  const complianceMetrics = [
    { name: 'On-Time Resolution', value: 78, target: 85, trend: 'up' },
    { name: 'First-Pass Quality', value: 92, target: 95, trend: 'stable' },
    { name: 'CAPA Effectiveness', value: 85, target: 90, trend: 'up' },
    { name: 'Risk Mitigation', value: 70, target: 80, trend: 'down' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Executive Overview</h1>
            <p className="text-muted-foreground">Quality management performance at a glance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/analytics/events')}>
            Events Analytics
          </Button>
          <Button variant="outline" onClick={() => navigate('/analytics/incidents')}>
            Incidents Dashboard
          </Button>
        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Events</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <p className="text-3xl font-bold">{totalEvents}</p>
            <div className="flex items-center text-xs mt-2 text-green-500">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              15% vs last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Incidents</span>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <p className="text-3xl font-bold">{totalIncidents}</p>
            <div className="flex items-center text-xs mt-2 text-green-500">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              8% vs last quarter
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Critical Items</span>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-destructive">{criticalItems}</p>
            <p className="text-xs text-muted-foreground mt-2">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Closure Rate</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">{closureRate}%</p>
            <div className="flex items-center text-xs mt-2 text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              5% improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg Risk Score</span>
              <Shield className="h-4 w-4 text-info" />
            </div>
            <p className="text-3xl font-bold">{avgRiskScore}</p>
            <Progress value={avgRiskScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Events, incidents, and resolution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="events" name="Events" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="incidents" name="Incidents" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#22c55e" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
            <CardDescription>Distribution of quality events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Progress towards quality targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {complianceMetrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{metric.value}%</span>
                      <span className="text-xs text-muted-foreground">/ {metric.target}%</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={metric.value} className="h-3" />
                    <div 
                      className="absolute top-0 h-3 w-0.5 bg-foreground/50"
                      style={{ left: `${metric.target}%` }}
                    />
                  </div>
                  {metric.value < metric.target && (
                    <p className="text-xs text-muted-foreground">
                      {metric.target - metric.value}% below target
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Resolution rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="department" type="category" width={100} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'score' ? `${value}%` : value,
                      name === 'score' ? 'Resolution Rate' : name
                    ]}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/events/create')}>Create New Event</Button>
            <Button variant="outline" onClick={() => navigate('/incidents')}>Manage Incidents</Button>
            <Button variant="outline" onClick={() => navigate('/analytics/risk-heatmap')}>View Risk Heatmap</Button>
            <Button variant="outline" onClick={() => navigate('/audit/trail')}>Audit Trail</Button>
            <Button variant="outline" onClick={() => navigate('/lessons-learned')}>Lessons Learned</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
