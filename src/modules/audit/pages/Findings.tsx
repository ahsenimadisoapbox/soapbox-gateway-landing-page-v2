import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { AlertTriangle, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ExportAnimation } from '../components/ExportAnimation';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Findings() {
  const { findings, closeFinding, audits, addFinding } = useAudit();
  const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [capaStatusFilter, setCapaStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Major',
    auditId: '',
    assignee: '',
    riskId: '',
  });

  const filteredFindings = findings.filter(finding => {
    if (auditFilter !== 'all' && finding.auditId !== auditFilter) return false;
    if (severityFilter !== 'all' && finding.severity !== severityFilter) return false;
    if (capaStatusFilter !== 'all') {
      if (capaStatusFilter === 'no-capa' && finding.capaId) return false;
      if (capaStatusFilter !== 'no-capa' && !finding.capaId) return false;
    }
    return true;
  });

  // Data for visualizations
  const severityData = [
    { name: 'Critical', value: findings.filter(f => f.severity === 'Critical').length },
    { name: 'Major', value: findings.filter(f => f.severity === 'Major').length },
    { name: 'Minor', value: findings.filter(f => f.severity === 'Minor').length },
  ];

  const auditData = audits.map(audit => ({
    name: audit.title.substring(0, 20),
    findings: findings.filter(f => f.auditId === audit.id).length,
  }));

  const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--secondary))'];

  const handleSelectFinding = (id: string) => {
    setSelectedFindings(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleCloseFinding = (id: string) => {
    const success = closeFinding(id);
    if (success) {
      toast.success('Finding closed successfully');
    } else {
      toast.error('Cannot close finding: Associated CAPA must be completed first');
    }
  };

  const handleRecordFinding = () => {
    const newFinding = {
      id: `FND-${String(findings.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      severity: formData.severity as 'Critical' | 'Major' | 'Minor',
      auditId: formData.auditId,
      assignee: formData.assignee,
      riskId: formData.riskId,
      status: 'Open' as const,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    addFinding(newFinding);
    toast.success('Finding recorded successfully');
    setIsRecordOpen(false);
    setFormData({
      title: '',
      description: '',
      severity: 'Major',
      auditId: '',
      assignee: '',
      riskId: '',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'Major': return 'default';
      case 'Minor': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'destructive';
      case 'In Progress': return 'default';
      case 'Closed': return 'secondary';
      default: return 'outline';
    }
  };

  if (findings.length === 0) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No Findings Recorded"
        description="No audit findings recorded yet."
        action={{
          label: 'Record Finding',
          onClick: () => setIsRecordOpen(true),
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Findings & NCRs</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage audit findings and non-conformance reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsExporting(true)} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Findings
            </Button>
            <Button onClick={() => setIsRecordOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Finding
            </Button>
          </div>
        </div>

        {/* Data Visualizations */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Findings by Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Findings by Audit Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={auditData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="findings" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Audit Name</label>
                <Select value={auditFilter} onValueChange={setAuditFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Audits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Audits</SelectItem>
                    {audits.map(audit => (
                      <SelectItem key={audit.id} value={audit.id}>
                        {audit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">CAPA Status</label>
                <Select value={capaStatusFilter} onValueChange={setCapaStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="no-capa">No CAPA</SelectItem>
                    <SelectItem value="has-capa">Has CAPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Actions */}
        {selectedFindings.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedFindings.length} finding(s) selected
                </span>
                <Button variant="outline" size="sm">Escalate</Button>
                <Button variant="outline" size="sm">Assign CAPA</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Findings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Findings Register ({filteredFindings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Finding ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Risk ID</TableHead>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFindings.map(finding => (
                  <TableRow key={finding.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFindings.includes(finding.id)}
                        onCheckedChange={() => handleSelectFinding(finding.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{finding.id}</TableCell>
                    <TableCell>{finding.title}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(finding.severity)}>
                        {finding.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(finding.status)}>
                        {finding.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{finding.assignee}</TableCell>
                    <TableCell>
                      {finding.riskId && (
                        <span className="text-sm text-primary">{finding.riskId}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {finding.capaId && (
                        <span className="text-sm text-primary">{finding.capaId}</span>
                      )}
                    </TableCell>
                    <TableCell>{finding.dueDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloseFinding(finding.id)}
                        disabled={finding.status === 'Closed'}
                      >
                        Close
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Record Finding Modal */}
      <Dialog open={isRecordOpen} onOpenChange={setIsRecordOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Finding</DialogTitle>
            <DialogDescription>Record a new audit finding or non-conformance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Finding Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter finding title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the finding"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Audit</Label>
                <Select
                  value={formData.auditId}
                  onValueChange={(value) => setFormData({ ...formData, auditId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audit" />
                  </SelectTrigger>
                  <SelectContent>
                    {audits.map(audit => (
                      <SelectItem key={audit.id} value={audit.id}>
                        {audit.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assignee</Label>
                <Input
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  placeholder="Assignee name"
                />
              </div>
              <div>
                <Label>Risk ID (Optional)</Label>
                <Input
                  value={formData.riskId}
                  onChange={(e) => setFormData({ ...formData, riskId: e.target.value })}
                  placeholder="e.g., RISK-042"
                />
              </div>
            </div>
            <div>
              <Label>Evidence Upload (Simulation)</Label>
              <Input type="text" placeholder="evidence-file.pdf" disabled />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRecordFinding}>Record Finding</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExportAnimation isExporting={isExporting} onComplete={() => setIsExporting(false)} />
    </>
  );
}
