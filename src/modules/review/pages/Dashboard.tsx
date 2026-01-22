import { useState } from 'react';
import {
  ClipboardCheck,
  ListTodo,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { dashboardStats, mockReviews, mockActions, mockCAPAs } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const complianceTrend = [
  { month: 'Jul', score: 88 },
  { month: 'Aug', score: 90 },
  { month: 'Sep', score: 87 },
  { month: 'Oct', score: 91 },
  { month: 'Nov', score: 93 },
  { month: 'Dec', score: 94 },
];

const actionStatusData = [
  { name: 'Completed', value: 12, color: 'hsl(142, 72%, 42%)' },
  { name: 'In Progress', value: 8, color: 'hsl(199, 89%, 48%)' },
  { name: 'Open', value: 5, color: 'hsl(38, 92%, 50%)' },
  { name: 'Overdue', value: 3, color: 'hsl(0, 72%, 51%)' },
];

export function Dashboard() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'planned': 'bg-muted text-muted-foreground',
      'in-progress': 'bg-info/15 text-info',
      'completed': 'bg-success/15 text-success',
      'closed': 'bg-muted text-muted-foreground',
      'open': 'bg-warning/15 text-warning',
      'overdue': 'bg-destructive/15 text-destructive',
    };
    return (
      <Badge variant="secondary" className={styles[status] || ''}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Management Review governance overview</p>
          </div>
          <Button onClick={() => navigate('/reviews')} className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            New Review
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Total Reviews</p>
                  <p className="kpi-value">{dashboardStats.totalReviews}</p>
                  <p className="text-xs text-success mt-1">
                    {dashboardStats.reviewsCompleted} completed
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Active Actions</p>
                  <p className="kpi-value">{dashboardStats.activeActions}</p>
                  <p className="text-xs text-destructive mt-1">
                    {dashboardStats.overdueActions} overdue
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <ListTodo className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Open CAPAs</p>
                  <p className="kpi-value">{dashboardStats.openCAPAs}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.pendingDecisions} pending decisions
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Compliance Score</p>
                  <p className="kpi-value">{dashboardStats.complianceScore}%</p>
                  <Progress value={dashboardStats.complianceScore} className="h-1.5 mt-2" />
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Compliance Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Action Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                Action Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={actionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {actionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {actionStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Review & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Next Review */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{mockReviews[0].title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Scheduled: {mockReviews[0].scheduledDate}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {dashboardStats.daysUntilNextReview} days remaining
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{mockReviews[0].progress}%</div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <Button size="sm" className="mt-2 gap-1" onClick={() => navigate('/reviews')}>
                    Continue <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Actions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ListTodo className="h-4 w-4" />
                  Recent Actions
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/actions')}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActions.slice(0, 4).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {action.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : action.status === 'overdue' ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {action.dueDate}</p>
                    </div>
                  </div>
                  {getStatusBadge(action.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Maturity Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Governance Maturity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full border-8 border-primary/20 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold leading-none">{dashboardStats.maturityLevel}</span>
                  <span className="text-xs text-muted-foreground mt-1">/5.0</span>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {['Leadership', 'Process', 'Documentation', 'Monitoring', 'Improvement'].map((area, i) => (
                    <div key={area} className="text-center">
                      <Progress value={75 + i * 5} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{area}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Your organization demonstrates strong governance practices with opportunities for improvement in process automation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
