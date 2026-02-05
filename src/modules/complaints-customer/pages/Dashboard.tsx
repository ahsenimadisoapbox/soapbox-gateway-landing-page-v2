import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintsCustomer } from '../context/ComplaintsCustomerContext';
import { dashboardKPIs } from '../data/mockData';
import {
  MessageSquareWarning,
  AlertTriangle,
  Clock,
  XCircle,
  TrendingUp,
  Star,
  ThumbsUp,
  ClipboardCheck,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

interface KPITileProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  onClick?: () => void;
}

function KPITile({ title, value, icon: Icon, trend, variant = 'default', onClick }: KPITileProps) {
  return (
    <Card 
      className={cn(
        'kpi-tile cursor-pointer',
        variant === 'danger' && 'border-destructive/50 bg-destructive/5',
        variant === 'warning' && 'border-warning/50 bg-warning/5',
        variant === 'success' && 'border-success/50 bg-success/5'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn(
              'text-3xl font-bold mt-1',
              variant === 'danger' && 'text-destructive',
              variant === 'warning' && 'text-warning',
              variant === 'success' && 'text-success'
            )}>
              {value}
            </p>
            {trend && (
              <p className={cn(
                'text-xs mt-1 flex items-center gap-1',
                trend.positive ? 'text-success' : 'text-destructive'
              )}>
                <TrendingUp className={cn('h-3 w-3', !trend.positive && 'rotate-180')} />
                {trend.value}% vs last month
              </p>
            )}
          </div>
          <div className={cn(
            'p-2 rounded-lg',
            variant === 'default' && 'bg-primary/10 text-primary',
            variant === 'danger' && 'bg-destructive/10 text-destructive',
            variant === 'warning' && 'bg-warning/10 text-warning',
            variant === 'success' && 'bg-success/10 text-success'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { complaints, currentUser } = useComplaintsCustomer();

  const openComplaints = complaints.filter(c => !['Closed', 'Rejected'].includes(c.status));
  const highCritical = complaints.filter(c => ['Critical', 'High'].includes(c.severity) && !['Closed', 'Rejected'].includes(c.status));
  const slaAtRisk = complaints.filter(c => c.slaStatus === 'warning');
  const slaBreached = complaints.filter(c => c.slaStatus === 'breached');

  const myActionItems = complaints.filter(c => 
    c.assignee === currentUser.name || c.owner === currentUser.name
  ).filter(c => !['Closed', 'Rejected'].includes(c.status));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints Dashboard</h1>
          <p className="page-subtitle">Overview of complaints and customer feedback</p>
        </div>
        <Button onClick={() => navigate('/complaints-customer/complaints')} className="gap-2">
          View All Complaints
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPITile
          title="Open Complaints"
          value={openComplaints.length}
          icon={MessageSquareWarning}
          onClick={() => navigate('/complaints-customer/complaints?status=open')}
        />
        <KPITile
          title="High / Critical"
          value={highCritical.length}
          icon={AlertTriangle}
          variant="danger"
          onClick={() => navigate('/complaints-customer/complaints?severity=high,critical')}
        />
        <KPITile
          title="SLA At Risk"
          value={slaAtRisk.length}
          icon={Clock}
          variant="warning"
          onClick={() => navigate('/complaints-customer/complaints?sla=warning')}
        />
        <KPITile
          title="SLA Breached"
          value={slaBreached.length}
          icon={XCircle}
          variant="danger"
          onClick={() => navigate('/complaints-customer/complaints?sla=breached')}
        />
        <KPITile
          title="Avg Resolution"
          value={`${dashboardKPIs.avgResolutionDays}d`}
          icon={TrendingUp}
          trend={{ value: 12, positive: true }}
        />
        <KPITile
          title="CSAT Score"
          value={dashboardKPIs.csatScore}
          icon={Star}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Action Items */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                My Action Items
              </CardTitle>
              <CardDescription>Complaints requiring your attention</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/complaints-customer/action-items')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {myActionItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ThumbsUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No pending action items</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myActionItems.slice(0, 5).map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          complaint.slaStatus === 'ok' && 'border-success text-success',
                          complaint.slaStatus === 'warning' && 'border-warning text-warning',
                          complaint.slaStatus === 'breached' && 'border-destructive text-destructive'
                        )}
                      >
                        {complaint.slaStatus === 'ok' ? '✓' : complaint.slaStatus === 'warning' ? '⚠' : '✗'}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{complaint.id}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{complaint.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn(
                        'text-xs',
                        complaint.severity === 'Critical' && 'severity-critical',
                        complaint.severity === 'High' && 'severity-high',
                        complaint.severity === 'Medium' && 'severity-medium',
                        complaint.severity === 'Low' && 'severity-low'
                      )}>
                        {complaint.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{complaint.status}</span>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>January 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Total Received</span>
              <span className="font-semibold">{dashboardKPIs.totalThisMonth}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <span className="font-semibold text-success">{dashboardKPIs.resolvedThisMonth}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Pending Investigation</span>
              <span className="font-semibold">{complaints.filter(c => c.status === 'Investigating').length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Regulatory Flagged</span>
              <span className="font-semibold text-warning">{complaints.filter(c => c.regulatoryFlag).length}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">NPS Score</span>
              <span className="font-semibold text-success">+{dashboardKPIs.npsScore}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
            <CardDescription>Complaint distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Product Quality', 'Safety', 'Logistics', 'Software', 'Documentation'].map((category) => {
                const count = complaints.filter(c => c.category === category).length;
                const percentage = complaints.length > 0 ? Math.round((count / complaints.length) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <span className="text-muted-foreground">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Severity</CardTitle>
            <CardDescription>Current open complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['Critical', 'High', 'Medium', 'Low'] as const).map((severity) => {
                const count = openComplaints.filter(c => c.severity === severity).length;
                const percentage = openComplaints.length > 0 ? Math.round((count / openComplaints.length) * 100) : 0;
                return (
                  <div key={severity} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={cn(
                          'text-xs',
                          severity === 'Critical' && 'severity-critical',
                          severity === 'High' && 'severity-high',
                          severity === 'Medium' && 'severity-medium',
                          severity === 'Low' && 'severity-low'
                        )}>
                          {severity}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all',
                          severity === 'Critical' && 'bg-destructive',
                          severity === 'High' && 'bg-orange-500',
                          severity === 'Medium' && 'bg-warning',
                          severity === 'Low' && 'bg-info'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
