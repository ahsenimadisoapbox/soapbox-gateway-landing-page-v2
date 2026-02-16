import { useState, useEffect } from 'react';
import { useRisk } from "../context/RiskContext";
import { AlertTriangle, TrendingUp, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { getRisks, getNotifications, saveUsers, saveRisk } from '../lib/storage';
import { mockUsers, mockRisks } from '../lib/mockData';
import { Risk, User } from '../types/risk';

export default function Dashboard() {
  const { currentUser } = useRisk();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data if empty
    const initializeData = () => {
      const existingRisks = getRisks();
      if (existingRisks.length === 0) {
        mockRisks.forEach(risk => saveRisk(risk));
        saveUsers(mockUsers);
      }
      setRisks(getRisks());
      setLoading(false);
    };

    initializeData();
  }, []);

  const notifications = getNotifications(currentUser.id);
  const unreadNotifications = notifications.filter(n => !n.read);

  // Dashboard metrics
  const totalRisks = risks.length;
  const highRisks = risks.filter(r => r.severity === 'high' || r.severity === 'critical').length;
  const overdueRisks = risks.filter(r => r.dueDate && new Date(r.dueDate) < new Date()).length;
  const completedMitigations = risks.reduce((acc, risk) => 
    acc + risk.mitigationActions.filter(action => action.status === 'completed').length, 0);

  const recentRisks = risks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-risk-critical text-white',
      high: 'bg-risk-high text-white',
      medium: 'bg-risk-medium text-risk-medium-foreground',
      low: 'bg-risk-low text-white',
      negligible: 'bg-risk-negligible text-white'
    };
    return colors[severity as keyof typeof colors] || 'bg-muted';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      submitted: 'bg-primary text-primary-foreground',
      under_assessment: 'bg-warning text-warning-foreground',
      under_review: 'bg-accent text-accent-foreground',
      approved: 'bg-success text-success-foreground',
      rejected: 'bg-destructive text-destructive-foreground',
      mitigation_assigned: 'bg-primary text-primary-foreground',
      mitigation_in_progress: 'bg-warning text-warning-foreground',
      under_audit: 'bg-accent text-accent-foreground',
      closure_requested: 'bg-muted text-muted-foreground',
      closed: 'bg-success text-success-foreground',
      archived: 'bg-muted text-muted-foreground'
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Risk Management Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage risks across your organization
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRisks}</div>
            <p className="text-xs text-muted-foreground">
              Active risk items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highRisks}</div>
            <p className="text-xs text-muted-foreground">
              Critical & high severity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{overdueRisks}</div>
            <p className="text-xs text-muted-foreground">
              Past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Actions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedMitigations}</div>
            <p className="text-xs text-muted-foreground">
              Mitigation actions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Risks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Risk Activity</CardTitle>
            <CardDescription>
              Latest updates and newly reported risks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRisks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No risks found. Create your first risk report.
                </p>
              ) : (
                recentRisks.map((risk) => (
                  <div key={risk.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {risk.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {risk.category} • {new Date(risk.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getSeverityColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(risk.status)}>
                        {risk.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Severity Distribution</CardTitle>
            <CardDescription>
              Breakdown of risks by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['critical', 'high', 'medium', 'low', 'negligible'].map((severity) => {
                const count = risks.filter(r => r.severity === severity).length;
                const percentage = totalRisks > 0 ? (count / totalRisks) * 100 : 0;
                
                return (
                  <div key={severity} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(severity)}`} />
                        <span className="text-sm font-medium capitalize">{severity}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{count} risks</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Important updates and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unreadNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                  <Badge variant={notification.type === 'error' ? 'destructive' : 'secondary'}>
                    {notification.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}