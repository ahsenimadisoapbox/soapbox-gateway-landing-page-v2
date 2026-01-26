import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export default function Reports() {
  const { findings, audits } = useAudit();
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [reportParams, setReportParams] = useState({
    auditType: 'all',
    dateFrom: '',
    dateTo: '',
    site: 'all',
  });

  const findingsByMonth = [
    { month: 'Aug', findings: 5 },
    { month: 'Sep', findings: 8 },
    { month: 'Oct', findings: 6 },
    { month: 'Nov', findings: 4 },
  ];

  const auditClosureData = [
    { name: 'Completed', value: audits.filter(a => a.status === 'Completed').length },
    { name: 'In Progress', value: audits.filter(a => a.status === 'In Progress').length },
    { name: 'Scheduled', value: audits.filter(a => a.status === 'Scheduled').length },
    { name: 'Overdue', value: audits.filter(a => a.status === 'Overdue').length },
  ];

  const ncrClosureData = [
    { name: 'Closed', value: findings.filter(f => f.status === 'Closed').length },
    { name: 'Open', value: findings.filter(f => f.status === 'Open').length },
    { name: 'In Progress', value: findings.filter(f => f.status === 'In Progress').length },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  const recentReports = [
    { id: 'REP-001', name: 'Q4 2025 Audit Summary', type: 'Quarterly', generated: '2025-10-01', generatedBy: 'Admin User' },
    { id: 'REP-002', name: 'ISO 9001 Compliance Report', type: 'Compliance', generated: '2025-09-28', generatedBy: 'John Smith' },
    { id: 'REP-003', name: 'CAPA Effectiveness Report', type: 'CAPA', generated: '2025-09-15', generatedBy: 'Sarah Johnson' },
  ];

  const handleGenerateReport = () => {
    toast.success('Report Generated Successfully', {
      description: 'Your audit report has been generated and is ready to download.',
    });
    setIsGenerateOpen(false);
    setReportParams({
      auditType: 'all',
      dateFrom: '',
      dateTo: '',
      site: 'all',
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Audit Reports</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analytics and audit summaries
            </p>
          </div>
          <Button onClick={() => setIsGenerateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Audit Findings Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={findingsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="findings" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Closure Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={auditClosureData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {auditClosureData.map((entry, index) => (
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
              <CardTitle>NCR Closure Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ncrClosureData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ncrClosureData.map((entry, index) => (
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
              <CardTitle>Key Metrics Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Audits Conducted</p>
                    <p className="text-2xl font-bold">{audits.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Completion Time</p>
                    <p className="text-2xl font-bold">14 days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Findings Identified</p>
                    <p className="text-2xl font-bold">{findings.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolution Rate</p>
                    <p className="text-2xl font-bold">
                      {findings.length > 0
                        ? Math.round((findings.filter(f => f.status === 'Closed').length / findings.length) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Generated Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report ID</TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map(report => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.generated}</TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Opening report preview')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success('Downloading report')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Audit Summary Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed Audit Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Documentation compliance improved by 15% in Q4</li>
                <li>Average finding closure time reduced to 12 days</li>
                <li>Critical findings decreased by 20% compared to Q3</li>
                <li>All ISO 9001 requirements met with minor observations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Report Modal */}
      <Dialog open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Audit Report</DialogTitle>
            <DialogDescription>
              Select parameters for your custom audit report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Audit Type</Label>
              <Select
                value={reportParams.auditType}
                onValueChange={(value) => setReportParams({ ...reportParams, auditType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                  <SelectItem value="ISO">ISO</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={reportParams.dateFrom}
                  onChange={(e) => setReportParams({ ...reportParams, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={reportParams.dateTo}
                  onChange={(e) => setReportParams({ ...reportParams, dateTo: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Site</Label>
              <Select
                value={reportParams.site}
                onValueChange={(value) => setReportParams({ ...reportParams, site: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sites</SelectItem>
                  <SelectItem value="site1">Main Facility</SelectItem>
                  <SelectItem value="site2">Branch Office</SelectItem>
                  <SelectItem value="site3">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
