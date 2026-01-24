import React from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const kpiData = [
  { label: 'Total Active Alerts', value: '4', subtext: 'Across all categories', icon: Bell },
  { label: 'Material Alerts', value: '1', subtext: 'Requiring executive attention', icon: AlertTriangle, highlight: true },
  { label: 'Unacknowledged', value: '3', subtext: 'Pending review', icon: Clock, highlight: true },
  { label: 'Avg Confidence', value: '94%', subtext: 'Alert accuracy score', icon: TrendingUp },
];

const materialAlerts = [
  {
    id: '1',
    title: 'Supply Chain Risk Velocity Increase',
    description: 'Supply chain disruption risk is showing accelerating indicators requiring executive attention.',
    source: 'Risk Intelligence',
    time: '1h ago',
    confidence: 92,
    type: 'material',
  },
];

const attentionAlerts = [
  {
    id: '2',
    title: 'CAPA Overdue - High Priority',
    description: 'High priority corrective action has exceeded its target closure date.',
    source: 'CAPA Management',
    time: '2h ago',
    confidence: 100,
    type: 'attention',
  },
  {
    id: '3',
    title: 'Repeat Audit Finding Pattern',
    description: 'Document control finding has recurred, suggesting root cause was not fully addressed.',
    source: 'Governance Analytics',
    time: '6h ago',
    confidence: 88,
    type: 'attention',
    reviewed: false,
  },
  {
    id: '4',
    title: 'Regulatory Inspection Preparation',
    description: 'Upcoming regulatory inspection with outstanding findings requiring closure.',
    source: 'Compliance Calendar',
    time: '1d ago',
    confidence: 95,
    type: 'attention',
    reviewed: true,
  },
];

const timelineAlerts = [
  { time: '1h ago', type: 'material', title: 'Supply Chain Risk Velocity Increase', source: 'Risk Intelligence' },
  { time: '2h ago', type: 'attention', title: 'CAPA Overdue - High Priority', source: 'CAPA Management' },
  { time: '6h ago', type: 'attention', title: 'Repeat Audit Finding Pattern', source: 'Governance Analytics' },
  { time: '1d ago', type: 'attention', title: 'Regulatory Inspection Preparation', source: 'Compliance Calendar' },
];

const AlertsCentrePage = () => {
  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Escalations Center</h1>
          <p className="text-muted-foreground mt-1">Severity-ranked executive alerts with explainability and confidence scores</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.subtext}</p>
                    </div>
                    <Icon className={cn(
                      "h-5 w-5",
                      kpi.highlight ? "text-amber-500" : "text-muted-foreground"
                    )} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Material Alerts */}
          <ExecutivePanel title="Material Alerts">
            <div className="space-y-3">
              {materialAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 rounded-r-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">{alert.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.source} · {alert.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{alert.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ExecutivePanel>

          {/* Attention Required */}
          <ExecutivePanel title="Attention Required">
            <div className="space-y-3">
              {attentionAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {alert.id === '2' ? (
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        )}
                        <h4 className="font-semibold">{alert.title}</h4>
                        {alert.reviewed && (
                          <Badge variant="outline" className="text-xs">Reviewed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.source} · {alert.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{alert.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ExecutivePanel>
        </div>

        {/* Alert Timeline */}
        <ExecutivePanel title="Alert Timeline">
          <div className="space-y-4">
            {timelineAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={cn(
                  "w-3 h-3 rounded-full mt-1.5",
                  alert.type === 'material' ? "bg-red-500" : "bg-amber-500"
                )} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                    <Badge className={cn(
                      "text-xs",
                      alert.type === 'material' 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-amber-500 hover:bg-amber-600"
                    )}>
                      {alert.type}
                    </Badge>
                  </div>
                  <h4 className="font-medium mt-1">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.source}</p>
                </div>
              </div>
            ))}
          </div>
        </ExecutivePanel>
      </div>
    </>
  );
};

export default AlertsCentrePage;
