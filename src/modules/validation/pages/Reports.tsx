import React, { useState } from 'react';
import { BarChart3, FileText, Download, Filter, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useValidation } from '../context/ValidationContext';
import { cn } from '../lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Validation' | 'Compliance' | 'Audit' | 'Analytics';
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'validation-summary',
    name: 'Validation Summary Report (VSR)',
    description: 'Complete validation summary with RTM, test results, and deviations',
    icon: <FileText size={20} />,
    category: 'Validation',
  },
  {
    id: 'rtm-report',
    name: 'Requirements Traceability Matrix',
    description: 'Full RTM showing requirements to test case mapping',
    icon: <TrendingUp size={20} />,
    category: 'Validation',
  },
  {
    id: 'deviation-report',
    name: 'Deviation & CAPA Report',
    description: 'Summary of all deviations, investigations, and CAPAs',
    icon: <BarChart3 size={20} />,
    category: 'Compliance',
  },
  {
    id: 'audit-pack',
    name: 'Audit Pack',
    description: 'Inspector-ready package with all validation evidence',
    icon: <FileText size={20} />,
    category: 'Audit',
  },
  {
    id: 'periodic-review',
    name: 'Periodic Review Report',
    description: 'Continuous validation review summary',
    icon: <Calendar size={20} />,
    category: 'Compliance',
  },
  {
    id: 'status-dashboard',
    name: 'Status Dashboard Export',
    description: 'Current validation status across all projects',
    icon: <PieChart size={20} />,
    category: 'Analytics',
  },
];

export const Reports: React.FC = () => {
  const { projects, deviations } = useValidation();
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);

  const handleGenerateReport = (report: ReportTemplate) => {
    setSelectedReport(report);
    setGenerateDialogOpen(true);
  };

  const validatedCount = projects.filter(p => p.status === 'validated').length;
  const conditionalCount = projects.filter(p => p.status === 'conditional').length;
  const requiredCount = projects.filter(p => p.status === 'required').length;
  const openDeviationsCount = deviations.filter(d => d.status !== 'Closed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate compliance reports and view analytics
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-step-current/10">
                <BarChart3 size={20} className="text-step-current" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Validated</p>
                <p className="text-2xl font-bold text-status-validated">{validatedCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-status-validated/10 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-status-conditional">{conditionalCount + requiredCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-status-conditional/10 flex items-center justify-center">
                <span className="text-lg">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Deviations</p>
                <p className="text-2xl font-bold text-status-required">{openDeviationsCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-status-required/10 flex items-center justify-center">
                <span className="text-lg">⚠</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((report) => (
            <Card key={report.id} className="enterprise-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-secondary">
                    {report.icon}
                  </div>
                  <span className={cn(
                    'status-badge',
                    report.category === 'Validation' && 'status-badge-active',
                    report.category === 'Compliance' && 'status-badge-pending',
                    report.category === 'Audit' && 'status-badge-draft',
                    report.category === 'Analytics' && 'bg-step-current/15 text-step-current'
                  )}>
                    {report.category}
                  </span>
                </div>
                <CardTitle className="text-base mt-3">{report.name}</CardTitle>
                <CardDescription className="text-sm">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleGenerateReport(report)}
                >
                  <FileText size={16} className="mr-2" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <Card className="enterprise-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'VSR - Document Control System', date: '2024-12-20', type: 'Validation Summary' },
              { name: 'RTM - MES System v3.2', date: '2025-01-10', type: 'Traceability Matrix' },
              { name: 'Audit Pack - Q4 2024', date: '2024-12-31', type: 'Audit Pack' },
            ].map((report, idx) => (
              <div
                key={idx}
                className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <FileText size={16} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.type} • {report.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background">
                    {selectedReport.icon}
                  </div>
                  <div>
                    <p className="font-medium">{selectedReport.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-project">Select Project</Label>
                <select 
                  id="report-project"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">All Projects</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-from">From Date</Label>
                  <Input id="date-from" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to">To Date</Label>
                  <Input id="date-to" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-format">Output Format</Label>
                <select 
                  id="report-format"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="docx">Word Document (.docx)</option>
                  <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="watermark" className="rounded border-input" defaultChecked />
                <Label htmlFor="watermark" className="text-sm font-normal">Include watermark with generation timestamp</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setGenerateDialogOpen(false)}>
              <Download size={16} className="mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
