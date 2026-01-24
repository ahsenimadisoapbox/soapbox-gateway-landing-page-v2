import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { StatusBadge, ActionButtons } from '../components/shared/StatusBadge';
import { ViewModal } from '../components/modals/FormModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Bell, Search, Filter, AlertCircle, Check, User } from 'lucide-react';
import { executiveAlerts } from '../data/mockData';
import { toast } from 'sonner';

const AlertsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [alerts, setAlerts] = useState(executiveAlerts);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    toast.success('Alert acknowledged');
  };

  const handleAssign = (alertId: string) => {
    toast.success('Owner assigned to alert');
  };

  const handleView = (alert: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Alert ID', value: alert.id },
        title: { label: 'Title', value: alert.title },
        severity: { label: 'Severity', value: <StatusBadge status={alert.severity} variant="severity" /> },
        description: { label: 'Description', value: alert.description },
        source: { label: 'Source', value: alert.source },
        timestamp: { label: 'Timestamp', value: alert.timestamp.toLocaleString() },
        acknowledged: { label: 'Acknowledged', value: alert.acknowledged ? 'Yes' : 'No' },
        assignee: { label: 'Assignee', value: alert.assignee || 'Unassigned' },
      },
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-destructive';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-info';
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Bell className="h-6 w-6 text-accent" />
              Executive Alerts & Decisions Queue
            </h1>
            <p className="text-muted-foreground mt-1">Critical alerts requiring executive attention and action</p>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-3xl font-bold text-destructive">
              {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length}
            </p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <p className="text-sm text-muted-foreground">High Priority</p>
            <p className="text-3xl font-bold text-warning">
              {alerts.filter(a => a.severity === 'high' && !a.acknowledged).length}
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Pending Action</p>
            <p className="text-3xl font-bold">{unacknowledgedAlerts.length}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-muted-foreground">Acknowledged</p>
            <p className="text-3xl font-bold text-success">{acknowledgedAlerts.length}</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending ({unacknowledgedAlerts.length})</TabsTrigger>
            <TabsTrigger value="acknowledged">Acknowledged ({acknowledgedAlerts.length})</TabsTrigger>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <ExecutivePanel title="Pending Alerts - Requires Action">
              <div className="space-y-4">
                {unacknowledgedAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending alerts. All caught up!
                  </div>
                ) : (
                  unacknowledgedAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 bg-muted/50 rounded-lg border-l-4"
                      style={{
                        borderLeftColor: alert.severity === 'critical' ? 'hsl(var(--destructive))' :
                          alert.severity === 'high' ? 'hsl(var(--warning))' : 'hsl(var(--info))'
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <AlertCircle className={`h-5 w-5 mt-0.5 ${getSeverityIcon(alert.severity)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <StatusBadge status={alert.severity} variant="severity" />
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Source: {alert.source}</span>
                              <span>{alert.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(alert)}>
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleAssign(alert.id)}>
                            <User className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-accent hover:bg-accent/90"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="acknowledged">
            <ExecutivePanel title="Acknowledged Alerts">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acknowledgedAlerts.map((alert) => (
                      <TableRow key={alert.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell><StatusBadge status={alert.severity} variant="severity" /></TableCell>
                        <TableCell>{alert.source}</TableCell>
                        <TableCell>{alert.timestamp.toLocaleString()}</TableCell>
                        <TableCell>{alert.assignee || 'Unassigned'}</TableCell>
                        <TableCell className="text-right">
                          <ActionButtons onView={() => handleView(alert)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="all">
            <ExecutivePanel title="All Alerts">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{alert.id}</TableCell>
                        <TableCell className="font-medium">{alert.title}</TableCell>
                        <TableCell><StatusBadge status={alert.severity} variant="severity" /></TableCell>
                        <TableCell>{alert.source}</TableCell>
                        <TableCell>{alert.timestamp.toLocaleString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={alert.acknowledged ? 'closed' : 'open'} />
                        </TableCell>
                        <TableCell className="text-right">
                          <ActionButtons onView={() => handleView(alert)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Alert Details"
        data={viewModal.data || {}}
      />
    </>
  );
};

export default AlertsPage;
