import { useNavigate } from 'react-router-dom';
import { useNCR } from '../context/NCRContext';
import { StatusBadge, SeverityBadge } from '../components/shared/StatusBadge';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { ncrs, draftNCRs } = useNCR();

  const openNCRs = ncrs.filter(n => n.status !== 'Closed').length;
  const overdueNCRs = ncrs.filter(n => {
    if (!n.dueDate || n.status === 'Closed') return false;
    return new Date(n.dueDate) < new Date();
  }).length;
  const closedThisMonth = ncrs.filter(n => n.status === 'Closed').length;
  const criticalNCRs = ncrs.filter(n => n.severity === 'Critical' && n.status !== 'Closed').length;

  const recentNCRs = [...ncrs].sort((a, b) => 
    new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
  ).slice(0, 5);

  const severityDistribution = {
    Critical: ncrs.filter(n => n.severity === 'Critical').length,
    Major: ncrs.filter(n => n.severity === 'Major').length,
    Minor: ncrs.filter(n => n.severity === 'Minor').length,
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Non-Compliance Reporting Overview</p>
        </div>
        <button
          onClick={() => navigate('/create-ncr')}
          className="action-button action-button-primary"
        >
          <Plus className="h-4 w-4" />
          Create New NCR
        </button>
      </div>

      {/* KPI Cards */}
      <div className="card-grid">
        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">Open NCRs</p>
              <p className="stat-value">{openNCRs}</p>
            </div>
            <div className="kpi-icon bg-info/10">
              <FileText className="h-5 w-5 text-info" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {draftNCRs.length} drafts pending
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">Overdue NCRs</p>
              <p className="stat-value text-destructive">{overdueNCRs}</p>
            </div>
            <div className="kpi-icon bg-destructive/10">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Requires immediate attention
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">Critical Issues</p>
              <p className="stat-value text-warning">{criticalNCRs}</p>
            </div>
            <div className="kpi-icon bg-warning/10">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            High severity active NCRs
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label">Closed This Month</p>
              <p className="stat-value text-success">{closedThisMonth}</p>
            </div>
            <div className="kpi-icon bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +15% from last month
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate('/create-ncr')}
            className="quick-action-card"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Create New NCR</p>
              <p className="text-sm text-muted-foreground">Report a new non-compliance</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/drafts')}
            className="quick-action-card"
          >
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">My Drafts</p>
              <p className="text-sm text-muted-foreground">{draftNCRs.length} drafts pending</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => navigate('/register')}
            className="quick-action-card"
          >
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Global Register</p>
              <p className="text-sm text-muted-foreground">View all NCRs</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent NCRs */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent NCRs</h2>
            <button
              onClick={() => navigate('/register')}
              className="text-sm text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentNCRs.map(ncr => (
              <button
                key={ncr.id}
                onClick={() => navigate(`/ncr-detail/${ncr.id}`)}
                className="w-full p-4 hover:bg-accent text-left flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{ncr.id}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {ncr.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={ncr.severity} />
                  <StatusBadge status={ncr.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Severity Distribution</h2>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Critical</span>
                <span className="text-sm text-muted-foreground">{severityDistribution.Critical}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive"
                  style={{ width: `${(severityDistribution.Critical / ncrs.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Major</span>
                <span className="text-sm text-muted-foreground">{severityDistribution.Major}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning"
                  style={{ width: `${(severityDistribution.Major / ncrs.length) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Minor</span>
                <span className="text-sm text-muted-foreground">{severityDistribution.Minor}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-info"
                  style={{ width: `${(severityDistribution.Minor / ncrs.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
        soapbox.cloud 2025 - NCR Module v1.0
      </div>
    </div>
  );
}
