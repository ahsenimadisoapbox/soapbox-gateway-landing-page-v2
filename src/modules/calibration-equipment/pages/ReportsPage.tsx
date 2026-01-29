import { useState } from 'react';
import { FileText, Download, BarChart3, TrendingUp, ClipboardList } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { ActionButtons } from '../components/ActionButtons';
import { StatusBadge } from '../components/StatusBadge';
import { toast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

interface Report {
  id: string;
  name: string;
  type: 'compliance' | 'calibration' | 'trend';
  description: string;
  lastGenerated: string;
  frequency: string;
  status: 'available' | 'generating' | 'scheduled';
}

const mockReports: Report[] = [
  { id: 'RPT-001', name: 'Quarterly Compliance Report', type: 'compliance', description: 'Comprehensive compliance status for all equipment', lastGenerated: '2025-01-05', frequency: 'Quarterly', status: 'available' },
  { id: 'RPT-002', name: 'Calibration Summary - January 2025', type: 'calibration', description: 'Monthly summary of calibration activities', lastGenerated: '2025-01-01', frequency: 'Monthly', status: 'available' },
  { id: 'RPT-003', name: 'OOT Trend Analysis', type: 'trend', description: 'Out-of-tolerance trend analysis for the past year', lastGenerated: '2025-01-03', frequency: 'Monthly', status: 'available' },
  { id: 'RPT-004', name: 'Equipment Risk Report', type: 'compliance', description: 'Risk assessment summary for all equipment', lastGenerated: '2025-01-02', frequency: 'Weekly', status: 'available' },
  { id: 'RPT-005', name: 'PM Completion Report', type: 'calibration', description: 'Preventive maintenance completion rates', lastGenerated: '2025-01-04', frequency: 'Weekly', status: 'available' },
  { id: 'RPT-006', name: 'Calibration Drift Analysis', type: 'trend', description: 'Equipment drift patterns over time', lastGenerated: '2024-12-28', frequency: 'Quarterly', status: 'scheduled' },
];

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>();
  const [showViewModal, setShowViewModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance': return ClipboardList;
      case 'calibration': return BarChart3;
      case 'trend': return TrendingUp;
      default: return FileText;
    }
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleEdit = (report: Report) => {
    setSelectedReport(report);
    setShowViewModal(true);
    toast({ title: 'Edit Mode', description: 'Report settings opened for editing.' });
  };

  const handleDelete = (report: Report) => {
    setReports(prev => prev.filter(r => r.id !== report.id));
    toast({ title: 'Report Deleted', description: `Report ${report.id} has been deleted.` });
  };

  const handleDownload = (report: Report) => {
    toast({ title: 'Download Started', description: `Downloading ${report.name}...` });
  };

  const handleGenerateAll = () => {
    toast({ title: 'Generation Started', description: 'Generating all scheduled reports...' });
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Compliance reports, calibration summaries, and trend analysis"
        icon={FileText}
        actions={
          <Button onClick={handleGenerateAll}>
            <FileText className="h-4 w-4 mr-2" />
            Generate All
          </Button>
        }
      />

      {/* Reports by Type */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Compliance Reports</h3>
          </div>
          <p className="text-sm text-muted-foreground">{reports.filter(r => r.type === 'compliance').length} reports available</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Calibration Summaries</h3>
          </div>
          <p className="text-sm text-muted-foreground">{reports.filter(r => r.type === 'calibration').length} reports available</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Trend Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground">{reports.filter(r => r.type === 'trend').length} reports available</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Last Generated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                return (
                  <tr key={report.id}>
                    <td className="font-medium">{report.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        {report.name}
                      </div>
                    </td>
                    <td className="capitalize">{report.type}</td>
                    <td>{report.frequency}</td>
                    <td>
                      <StatusBadge status={report.status === 'available' ? 'active' : report.status === 'generating' ? 'in_progress' : 'pending'} />
                    </td>
                    <td>{report.lastGenerated}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {report.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-accent hover:text-accent"
                            onClick={() => handleDownload(report)}
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <ActionButtons
                          onView={() => handleView(report)}
                          onEdit={() => handleEdit(report)}
                          onDelete={() => handleDelete(report)}
                          showEdit={true}
                          showDelete={true}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>{selectedReport?.name}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Report ID</Label>
                  <p className="font-medium">{selectedReport.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedReport.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Frequency</Label>
                  <p className="font-medium">{selectedReport.frequency}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <StatusBadge status={selectedReport.status === 'available' ? 'active' : selectedReport.status === 'generating' ? 'in_progress' : 'pending'} />
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Generated</Label>
                  <p className="font-medium">{selectedReport.lastGenerated}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedReport.description}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast({ title: 'Regenerating...', description: 'Report is being regenerated.' })}>
                  Regenerate
                </Button>
                <Button onClick={() => handleDownload(selectedReport)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;