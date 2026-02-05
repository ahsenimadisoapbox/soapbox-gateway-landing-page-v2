import { useNCR } from '../context/NCRContext';
import { BarChart3, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function ReportsAnalytics() {
  const { ncrs, capas } = useNCR();

  const stats = {
    total: ncrs.length,
    open: ncrs.filter(n => n.status !== 'Closed').length,
    closed: ncrs.filter(n => n.status === 'Closed').length,
    critical: ncrs.filter(n => n.severity === 'Critical').length,
    overdue: ncrs.filter(n => n.dueDate && new Date(n.dueDate) < new Date() && n.status !== 'Closed').length,
  };

  const categoryData = ['Process Deviation', 'Equipment Failure', 'Documentation Error', 'Safety Hazard', 'Supplier Issue'].map(cat => ({
    name: cat,
    count: ncrs.filter(n => n.category === cat).length,
  }));

  const siteData = ['Plant A', 'Plant B'].map(site => ({
    name: site,
    count: ncrs.filter(n => n.site === site).length,
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">NCR trends and compliance metrics</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-5 mb-8">
        <div className="kpi-card"><div className="flex items-center gap-3"><BarChart3 className="h-8 w-8 text-info" /><div><p className="stat-value">{stats.total}</p><p className="stat-label">Total NCRs</p></div></div></div>
        <div className="kpi-card"><div className="flex items-center gap-3"><Clock className="h-8 w-8 text-warning" /><div><p className="stat-value">{stats.open}</p><p className="stat-label">Open NCRs</p></div></div></div>
        <div className="kpi-card"><div className="flex items-center gap-3"><CheckCircle className="h-8 w-8 text-success" /><div><p className="stat-value">{stats.closed}</p><p className="stat-label">Closed NCRs</p></div></div></div>
        <div className="kpi-card"><div className="flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-destructive" /><div><p className="stat-value">{stats.critical}</p><p className="stat-label">Critical</p></div></div></div>
        <div className="kpi-card"><div className="flex items-center gap-3"><TrendingUp className="h-8 w-8 text-primary" /><div><p className="stat-value">{Math.round((stats.closed / stats.total) * 100)}%</p><p className="stat-label">Closure Rate</p></div></div></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Category */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">NCRs by Category</h3>
          <div className="space-y-3">
            {categoryData.map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1"><span>{item.name}</span><span>{item.count}</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${(item.count / stats.total) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* By Site */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">NCRs by Site</h3>
          <div className="space-y-3">
            {siteData.map(item => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1"><span>{item.name}</span><span>{item.count}</span></div>
                <div className="h-2 bg-muted rounded-full"><div className="h-full bg-info rounded-full" style={{ width: `${(item.count / stats.total) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">SLA Compliance</h3>
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-success">{100 - Math.round((stats.overdue / stats.open) * 100)}%</p>
            <p className="text-muted-foreground mt-2">On-time resolution rate</p>
            <p className="text-sm text-destructive mt-4">{stats.overdue} overdue NCRs</p>
          </div>
        </div>

        {/* CAPA Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">CAPA Status Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-info/10 rounded-lg"><p className="text-2xl font-bold text-info">{capas.filter(c => c.status === 'Open').length}</p><p className="text-sm text-muted-foreground">Open</p></div>
            <div className="text-center p-4 bg-warning/10 rounded-lg"><p className="text-2xl font-bold text-warning">{capas.filter(c => c.status === 'In Progress').length}</p><p className="text-sm text-muted-foreground">In Progress</p></div>
            <div className="text-center p-4 bg-primary/10 rounded-lg"><p className="text-2xl font-bold text-primary">{capas.filter(c => c.status === 'Awaiting Verification').length}</p><p className="text-sm text-muted-foreground">Awaiting</p></div>
            <div className="text-center p-4 bg-success/10 rounded-lg"><p className="text-2xl font-bold text-success">{capas.filter(c => c.status === 'Closed').length}</p><p className="text-sm text-muted-foreground">Closed</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
