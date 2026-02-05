import React from 'react';
import { ClipboardCheck, ShieldCheck, AlertTriangle, FileText, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { inspections, compliances, mitigations, audits } from '../data/mockData';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  className?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('card-elevated p-6 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              trend.positive ? 'text-success' : 'text-destructive'
            )}>
              <TrendingUp className={cn('h-4 w-4', !trend.positive && 'rotate-180')} />
              {trend.value}% from last month
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

interface RecentItemProps {
  id: string;
  title: string;
  status: string;
  date: string;
  statusColor: string;
}

function RecentItem({ id, title, status, date, statusColor }: RecentItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{id}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={cn('status-badge', statusColor)}>{status}</span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{date}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const pendingInspections = inspections.filter(i => i.status === 'pending').length;
  const overdueItems = inspections.filter(i => i.status === 'overdue').length + 
    mitigations.filter(m => m.status === 'overdue').length;
  const complianceRate = Math.round(
    (compliances.filter(c => c.status === 'compliant').length / compliances.length) * 100
  );
  const openAudits = audits.filter(a => a.status === 'in-progress' || a.status === 'planned').length;

  const recentInspections = inspections.slice(0, 5).map(i => ({
    id: i.id,
    title: i.title,
    status: i.status === 'pending' ? 'Pending' : i.status === 'in-progress' ? 'In Progress' : 
      i.status === 'completed' ? 'Completed' : 'Overdue',
    date: i.dueDate,
    statusColor: i.status === 'pending' ? 'bg-warning/15 text-warning' : 
      i.status === 'in-progress' ? 'bg-info/15 text-info' : 
      i.status === 'completed' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your safety inspection activities"
        icon={ClipboardCheck}
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Inspections"
          value={pendingInspections}
          subtitle="Awaiting completion"
          icon={Clock}
          trend={{ value: 12, positive: false }}
        />
        <StatCard
          title="Overdue Items"
          value={overdueItems}
          subtitle="Requires attention"
          icon={AlertTriangle}
          className={overdueItems > 0 ? 'border-destructive/50' : ''}
        />
        <StatCard
          title="Compliance Rate"
          value={`${complianceRate}%`}
          subtitle="Current period"
          icon={ShieldCheck}
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="Open Audits"
          value={openAudits}
          subtitle="In progress or planned"
          icon={FileText}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Inspections */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Inspections</h2>
            <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="space-y-1">
            {recentInspections.map((item) => (
              <RecentItem key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">New Inspection</p>
                <p className="text-xs text-muted-foreground">Create a new inspection</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Compliance Check</p>
                <p className="text-xs text-muted-foreground">Review compliance status</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Schedule Audit</p>
                <p className="text-xs text-muted-foreground">Plan a new audit</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Assign Tasks</p>
                <p className="text-xs text-muted-foreground">Delegate responsibilities</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">Compliance Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="font-medium text-success">Compliant</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {compliances.filter(c => c.status === 'compliant').length}
            </p>
            <p className="text-sm text-muted-foreground">requirements met</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <span className="font-medium text-warning">Pending Review</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {compliances.filter(c => c.status === 'pending-review').length}
            </p>
            <p className="text-sm text-muted-foreground">awaiting review</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">Non-Compliant</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {compliances.filter(c => c.status === 'non-compliant').length}
            </p>
            <p className="text-sm text-muted-foreground">requires action</p>
          </div>
        </div>
      </div>
    </div>
  );
}
