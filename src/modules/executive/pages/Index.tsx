import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPIStrip } from '../components/dashboard/KPIStrip';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { RiskHeatmap } from '../components/dashboard/RiskHeatmap';
import { StatusBadge, ActionButtons, ProgressBar } from '../components/shared/StatusBadge';
import { FormModal, ViewModal, DeleteConfirmModal } from '../components/modals/FormModal';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Shield,
  ClipboardCheck,
  AlertTriangle,
  FileCheck,
  Leaf,
  Bell,
  TrendingDown,
  TrendingUp,
  Building2,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { riskData, complianceData, auditFindings, incidentData, capaData, executiveAlerts, highRiskSites } from '../data/mockData';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const incidentTrendData = [
  { month: 'Jan', incidents: 12 },
  { month: 'Feb', incidents: 15 },
  { month: 'Mar', incidents: 11 },
  { month: 'Apr', incidents: 14 },
  { month: 'May', incidents: 10 },
  { month: 'Jun', incidents: 8 },
  { month: 'Jul', incidents: 9 },
  { month: 'Aug', incidents: 7 },
  { month: 'Sep', incidents: 6 },
  { month: 'Oct', incidents: 8 },
  { month: 'Nov', incidents: 5 },
  { month: 'Dec', incidents: 4 },
];

const capaAgeData = [
  { range: '0-30', count: 15 },
  { range: '31-60', count: 11 },
  { range: '61-90', count: 7 },
  { range: '90+', count: 5 },
];

const Index = () => {
  const navigate = useNavigate();
  const [viewModal, setViewModal] = useState<{ open: boolean; type: string; data: any }>({
    open: false,
    type: '',
    data: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: string; id: string }>({
    open: false,
    type: '',
    id: '',
  });
  const [alertModal, setAlertModal] = useState<{ open: boolean; alert: any }>({
    open: false,
    alert: null,
  });

  const handleViewRisk = (risk: any) => {
    setViewModal({
      open: true,
      type: 'risk',
      data: {
        id: { label: 'Risk ID', value: risk.id },
        name: { label: 'Risk Name', value: risk.name },
        category: { label: 'Category', value: risk.category },
        severity: { label: 'Severity', value: <StatusBadge status={risk.severity} variant="severity" /> },
        likelihood: { label: 'Likelihood', value: risk.likelihood },
        impact: { label: 'Impact', value: risk.impact },
        owner: { label: 'Owner', value: risk.owner },
        status: { label: 'Status', value: <StatusBadge status={risk.status} /> },
      },
    });
  };

  const handleViewAlert = (alert: any) => {
    setAlertModal({ open: true, alert });
  };

  const topRisks = riskData.slice(0, 3);
  const openCAPAs = capaData.filter(c => c.status !== 'closed').length;
  const overdueCAPAs = capaData.filter(c => new Date(c.dueDate) < new Date() && c.status !== 'closed').length;
  const ineffectiveCAPAs = capaData.filter(c => c.status === 'ineffective').length;
  const unacknowledgedAlerts = executiveAlerts.filter(a => !a.acknowledged);

  return (
    <>
      {/* Context Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
            <p className="text-muted-foreground mt-1">Enterprise Assurance & Strategic Oversight</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span><strong>Tenant:</strong> ABC Corp</span>
            <span><strong>Scope:</strong> Global</span>
            <span><strong>Period:</strong> Last 90 Days</span>
          </div>
        </div>
      </div>

      <KPIStrip />

      <div className="p-6 space-y-6">
        {/* First Row - Risk and Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Landscape */}
          <ExecutivePanel
            title="Enterprise Risk Landscape"
            icon={<Shield className="h-5 w-5" />}
            action={{ label: 'View Risk Register', onClick: () => navigate('/risk') }}
          >
            <div className="grid grid-cols-2 gap-6">
              <RiskHeatmap />
              <div>
                <h4 className="text-sm font-medium mb-3">Top Enterprise Risks</h4>
                <div className="space-y-3">
                  {topRisks.map((risk) => (
                    <div
                      key={risk.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => handleViewRisk(risk)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{risk.name}</p>
                        <p className="text-xs text-muted-foreground">{risk.category}</p>
                      </div>
                      <StatusBadge status={risk.severity} variant="severity" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ExecutivePanel>

          {/* Compliance & Audit */}
          <ExecutivePanel
            title="Compliance & Audit Assurance"
            icon={<ClipboardCheck className="h-5 w-5" />}
            action={{ label: 'View Audits', onClick: () => navigate('/compliance') }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Compliance Coverage</h4>
                <div className="space-y-3">
                  {complianceData.map((item) => (
                    <ProgressBar
                      key={item.id}
                      label={item.standard}
                      value={item.coverage}
                      colorClass={item.coverage >= 90 ? 'bg-success' : item.coverage >= 80 ? 'bg-warning' : 'bg-destructive'}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Audit Snapshot</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Open Findings</span>
                    <span className="font-bold">{auditFindings.filter(f => f.status !== 'closed').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">High Severity</span>
                    <span className="font-bold text-destructive">{auditFindings.filter(f => f.severity === 'high').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Overdue Audits</span>
                    <span className="font-bold text-warning">2</span>
                  </div>
                </div>
              </div>
            </div>
          </ExecutivePanel>
        </div>

        {/* Second Row - Safety and CAPA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety & Incidents */}
          <ExecutivePanel
            title="Safety & Incident Intelligence"
            icon={<AlertTriangle className="h-5 w-5" />}
            action={{ label: 'View Analytics', onClick: () => navigate('/safety') }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Incident Trend (12 months)</h4>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incidentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <Tooltip />
                      <Line type="monotone" dataKey="incidents" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-success text-sm">
                    <TrendingDown className="h-4 w-4" />
                    <span>Frequency ↓ 18%</span>
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm">
                    <TrendingDown className="h-4 w-4" />
                    <span>Severity ↓ 25%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">High-Risk Sites</h4>
                <div className="space-y-2">
                  {highRiskSites.map((site, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{site.name}</span>
                      </div>
                      <span className="text-xs text-warning">{site.issue}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-success/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Fatality-Free Days</p>
                  <p className="text-2xl font-bold text-success">642</p>
                </div>
              </div>
            </div>
          </ExecutivePanel>

          {/* CAPA Effectiveness */}
          <ExecutivePanel
            title="CAPA & Corrective Effectiveness"
            icon={<FileCheck className="h-5 w-5" />}
            action={{ label: 'View CAPA Dashboard', onClick: () => navigate('/capa') }}
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">CAPA Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{openCAPAs}</p>
                    <p className="text-xs text-muted-foreground">Open</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-warning">{overdueCAPAs}</p>
                    <p className="text-xs text-muted-foreground">Overdue</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-destructive">{ineffectiveCAPAs}</p>
                    <p className="text-xs text-muted-foreground">Ineffective</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Aging Distribution</h4>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={capaAgeData}>
                        <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Root Cause Patterns</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Process Non-Adherence</span>
                        <span className="font-medium">38%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: '38%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Training Gaps</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-info rounded-full" style={{ width: '30%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Equipment Failure</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Average Closure Time</p>
                  <p className="text-xl font-bold">47 days</p>
                </div>
              </div>
            </div>
          </ExecutivePanel>
        </div>

        {/* Third Row - ESG and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ESG Overview */}
          <ExecutivePanel
            title="ESG & Sustainability"
            subtitle="Board-Ready"
            icon={<Leaf className="h-5 w-5" />}
            action={{ label: 'View ESG Reports', onClick: () => navigate('/esg') }}
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Environmental</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Emissions</span>
                    <span className="text-sm text-success flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" /> ↓ 12%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Waste Compliance</span>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Social</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Training</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">LTIR</span>
                    <span className="text-sm text-success flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" /> ↓
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Governance</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Policy Ack</span>
                    <span className="text-sm font-medium text-success">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Ethics Training</span>
                    <span className="text-sm font-medium">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </ExecutivePanel>

          {/* Executive Alerts */}
          <ExecutivePanel
            title="Executive Alerts & Decisions Queue"
            icon={<Bell className="h-5 w-5" />}
            action={{ label: 'View All Alerts', onClick: () => navigate('/alerts') }}
          >
            <div className="space-y-3">
              {unacknowledgedAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleViewAlert(alert)}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                >
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'critical' ? 'text-destructive' :
                    alert.severity === 'high' ? 'text-warning' : 'text-info'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <StatusBadge status={alert.severity} variant="severity" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Source: {alert.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExecutivePanel>
        </div>

        {/* Board Pack Generator */}
        <ExecutivePanel
          title="Strategic Trends & Board Pack Generator"
          icon={<FileText className="h-5 w-5" />}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Incident Severity</span>
                <span className="text-success flex items-center gap-1 text-sm font-medium">
                  <TrendingDown className="h-4 w-4" /> Decreasing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Compliance</span>
                <span className="text-success flex items-center gap-1 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" /> Stable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Risk Concentration</span>
                <span className="text-warning flex items-center gap-1 text-sm font-medium">
                  <TrendingUp className="h-4 w-4" /> ↑ in APAC
                </span>
              </div>
            </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting PDF...')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('Exporting PPT...')}>
                <Download className="h-4 w-4 mr-2" />
                Export PPT
              </Button>
              <Button className="bg-accent hover:bg-accent/90" size="sm" onClick={() => navigate('/board-packs')}>
                Generate Board Pack
              </Button>
            </div>
          </div>
        </ExecutivePanel>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <Button variant="outline" onClick={() => toast.success('All risks acknowledged')}>Acknowledge Risks</Button>
        <Button variant="outline" onClick={() => toast.success('Risk owner assignment initiated')}>Assign Owners</Button>
        <Button className="bg-accent hover:bg-accent/90" onClick={() => navigate('/board-packs')}>
          <Download className="h-4 w-4 mr-2" />
          Export Board Pack
        </Button>
      </div>

      {/* View Modal */}
      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title={viewModal.type === 'risk' ? 'Risk Details' : 'Details'}
        data={viewModal.data || {}}
      />

      {/* Alert Modal */}
      {alertModal.alert && (
        <ViewModal
          open={alertModal.open}
          onOpenChange={(open) => setAlertModal({ ...alertModal, open })}
          title="Alert Details"
          data={{
            title: { label: 'Title', value: alertModal.alert.title },
            severity: { label: 'Severity', value: <StatusBadge status={alertModal.alert.severity} variant="severity" /> },
            description: { label: 'Description', value: alertModal.alert.description },
            source: { label: 'Source', value: alertModal.alert.source },
            timestamp: { label: 'Timestamp', value: alertModal.alert.timestamp.toLocaleString() },
            acknowledged: { label: 'Acknowledged', value: alertModal.alert.acknowledged ? 'Yes' : 'No' },
          }}
        />
      )}
    </>
  );
};

export default Index;
