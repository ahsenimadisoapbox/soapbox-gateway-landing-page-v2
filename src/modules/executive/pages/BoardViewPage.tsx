import React from 'react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  FileCheck, 
  TrendingUp,
  Lock,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';

const BoardViewPage = () => {
  const kpiCards = [
    { 
      label: 'Enterprise Health', 
      value: '78', 
      description: 'Composite governance score',
      icon: Shield,
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Material Risks', 
      value: '0', 
      description: 'Score ≥15',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    { 
      label: 'Governance Effectiveness', 
      value: '82%', 
      description: 'Control effectiveness index',
      icon: FileCheck,
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'CAPA Effectiveness', 
      value: '91%', 
      description: 'Verified closure rate',
      icon: TrendingUp,
      iconColor: 'text-emerald-600'
    },
  ];

  const effectivenessMetrics = [
    { label: 'CAPA Closure Effectiveness', value: 91, color: 'bg-emerald-500' },
    { label: 'Audit Finding Closure', value: 85, color: 'bg-emerald-500' },
    { label: 'Control Testing Pass Rate', value: 78, color: 'bg-amber-500' },
  ];

  const boardPackSections = [
    'Executive Summary',
    'Risk Dashboard',
    'Incident Summary',
    'Governance Effectiveness',
    'Regulatory Status',
  ];

  return (
    <>
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Board View</h1>
            <p className="text-muted-foreground mt-1">Governance summary for Q4 2024 • Period-locked view</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Period-Locked View Banner */}
        <Card className="p-4 bg-muted/30 border-border">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">Period-Locked View</p>
              <p className="text-sm text-muted-foreground">
                This board view shows data as of the Q4 2024 period close. For real-time operational data, please refer to the Executive Dashboard.
              </p>
            </div>
          </div>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted/50`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Risks - Board Escalation */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Material Risks - Board Escalation</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No material risks requiring board escalation</p>
            </div>
          </Card>

          {/* Governance Effectiveness Snapshot */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              <h3 className="font-semibold">Governance Effectiveness Snapshot</h3>
            </div>
            <div className="text-center mb-6">
              <p className="text-5xl font-bold">82%</p>
              <p className="text-muted-foreground mt-1">Overall Governance Effectiveness</p>
            </div>
            <div className="space-y-4">
              {effectivenessMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="flex-1 text-sm">{metric.label}</span>
                  <div className="w-32">
                    <Progress value={metric.value} className={`h-2 [&>div]:${metric.color}`} />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{metric.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Board Pack Status */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Board Pack Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium">Q4 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Locked</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Locked By</span>
                <span className="font-medium">Company Secretary</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lock Date</span>
                <span className="font-medium">5/1/2025</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Included Sections:</p>
              <div className="flex flex-wrap gap-2">
                {boardPackSections.map((section, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Board Escalations */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Board Escalations</h3>
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4 py-3 bg-muted/30 rounded-r-lg">
                <p className="font-medium">Supply Chain Risk Velocity Increase</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supply chain disruption risk is showing accelerating indicators requiring executive attention.
                </p>
                <Badge className="mt-2 bg-red-100 text-red-700 hover:bg-red-200">
                  Confidence: 92%
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoardViewPage;
