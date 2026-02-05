import { useState } from 'react';
import { useOccupationalHealth } from '../contexts/OccupationalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { StatusBadge, getExamStatusVariant, getTriageVariant, getIllnessStatusVariant } from '../components/common/StatusBadge';
import { 
  Users, 
  Stethoscope, 
  AlertTriangle, 
  Activity,
  Building2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { employees, exams, clinicVisits, illnessCases, currentUser } = useOccupationalHealth();

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const scheduledExams = exams.filter(e => e.status === 'scheduled').length;
  const openIllnessCases = illnessCases.filter(c => c.status !== 'closed').length;
  const todayVisits = clinicVisits.length;
  const waitingPatients = clinicVisits.filter(v => v.status === 'waiting').length;

  const metrics = [
    {
      title: 'Active Employees',
      value: activeEmployees,
      trend: '+12%',
      trendUp: true,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Scheduled Exams',
      value: scheduledExams,
      trend: '+5%',
      trendUp: true,
      icon: Stethoscope,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Open Illness Cases',
      value: openIllnessCases,
      trend: '-8%',
      trendUp: false,
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Today\'s Clinic Visits',
      value: todayVisits,
      trend: '+3%',
      trendUp: true,
      icon: Building2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Activity className="h-7 w-7 text-primary" />
            OH Dashboard
          </h1>
          <p className="page-subtitle">
            Welcome back, {currentUser.name}. Here's your occupational health overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/reports">
              <Calendar className="h-4 w-4 mr-2" />
              View Reports
            </Link>
          </Button>
          <Button asChild>
            <Link to="/exams">
              Schedule Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div className={`metric-trend ${metric.trendUp ? 'metric-trend-up' : 'metric-trend-down'}`}>
                  {metric.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {metric.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Upcoming Exams</CardTitle>
              <CardDescription>Scheduled medical examinations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/exams" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exams.filter(e => e.status === 'scheduled').slice(0, 5).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{exam.employeeName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{exam.type.replace('-', ' ')} Exam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge variant={getExamStatusVariant(exam.status)}>
                      {exam.status}
                    </StatusBadge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(exam.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {exams.filter(e => e.status === 'scheduled').length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No upcoming exams scheduled
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clinic Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Clinic Queue</CardTitle>
              <CardDescription>{waitingPatients} patients waiting</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/clinic" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clinicVisits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      visit.triageLevel === 'red' ? 'bg-destructive/20' :
                      visit.triageLevel === 'amber' ? 'bg-warning/20' : 'bg-success/20'
                    }`}>
                      <Clock className={`h-5 w-5 ${
                        visit.triageLevel === 'red' ? 'text-destructive' :
                        visit.triageLevel === 'amber' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{visit.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{visit.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge variant={getTriageVariant(visit.triageLevel)}>
                      {visit.triageLevel.toUpperCase()}
                    </StatusBadge>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {visit.status.replace('-', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Illness Cases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Open Illness Cases</CardTitle>
              <CardDescription>Active occupational illness investigations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/illness" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {illnessCases.filter(c => c.status !== 'closed').slice(0, 5).map((illness) => (
                <div key={illness.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{illness.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{illness.diagnosis}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge variant={getIllnessStatusVariant(illness.status)}>
                      {illness.status}
                    </StatusBadge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {illness.caseNumber}
                    </p>
                  </div>
                </div>
              ))}
              {illnessCases.filter(c => c.status !== 'closed').length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No open illness cases
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Overview</CardTitle>
            <CardDescription>PME compliance status by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: 'Manufacturing', compliant: 45, total: 50, percentage: 90 },
                { dept: 'Warehouse', compliant: 28, total: 35, percentage: 80 },
                { dept: 'Quality Control', compliant: 18, total: 20, percentage: 90 },
                { dept: 'Maintenance', compliant: 12, total: 15, percentage: 80 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.compliant}/{item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        item.percentage >= 90 ? 'bg-success' : 
                        item.percentage >= 70 ? 'bg-warning' : 'bg-destructive'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
