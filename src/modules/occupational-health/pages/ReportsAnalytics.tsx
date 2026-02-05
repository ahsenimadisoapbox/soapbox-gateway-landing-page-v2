import { useState } from 'react';
import { useOccupationalHealth } from '../contexts/OccupationalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
import { ActionButtons } from '../components/common/ActionButtons';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  FileBarChart,
  PieChart,
  TrendingUp,
  Activity,
  Users,
  Stethoscope,
  AlertTriangle,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

interface Report {
  id: string;
  name: string;
  category: string;
  type: 'standard' | 'custom';
  lastRun: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'draft';
  createdBy: string;
  description: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Monthly PME Compliance Report',
    category: 'Compliance',
    type: 'standard',
    lastRun: '2025-01-01',
    frequency: 'monthly',
    status: 'active',
    createdBy: 'System',
    description: 'Comprehensive PME compliance status across all departments'
  },
  {
    id: 'RPT-002',
    name: 'Weekly Clinic Utilization',
    category: 'Clinic Operations',
    type: 'standard',
    lastRun: '2025-01-05',
    frequency: 'weekly',
    status: 'active',
    createdBy: 'System',
    description: 'Weekly summary of clinic visits, treatments, and resource utilization'
  },
  {
    id: 'RPT-003',
    name: 'Occupational Illness Trend Analysis',
    category: 'Illness',
    type: 'custom',
    lastRun: '2024-12-28',
    frequency: 'monthly',
    status: 'active',
    createdBy: 'Dr. Sarah Chen',
    description: 'Trend analysis of occupational illness cases with root cause breakdown'
  },
  {
    id: 'RPT-004',
    name: 'Exposure Monitoring Summary',
    category: 'Exposure',
    type: 'standard',
    lastRun: '2025-01-02',
    frequency: 'daily',
    status: 'active',
    createdBy: 'System',
    description: 'Daily exposure levels and threshold violations'
  },
  {
    id: 'RPT-005',
    name: 'Return to Work Analytics',
    category: 'RTW',
    type: 'custom',
    lastRun: '2024-12-20',
    frequency: 'weekly',
    status: 'paused',
    createdBy: 'HR Partner',
    description: 'RTW case durations, success rates, and accommodation analysis'
  },
  {
    id: 'RPT-006',
    name: 'Wellness Program Participation',
    category: 'Wellness',
    type: 'standard',
    lastRun: '2025-01-03',
    frequency: 'monthly',
    status: 'active',
    createdBy: 'System',
    description: 'Enrollment and participation metrics for wellness programs'
  },
];

const reportCategories = [
  'All Categories',
  'Compliance',
  'Clinic Operations',
  'Illness',
  'Exposure',
  'RTW',
  'Wellness',
  'PME',
];

export default function ReportsAnalytics() {
  const { currentUser } = useOccupationalHealth();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    frequency: 'once',
    description: '',
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || report.category === categoryFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCreate = () => {
    const newReport: Report = {
      id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
      name: formData.name,
      category: formData.category,
      type: 'custom',
      lastRun: '-',
      frequency: formData.frequency as Report['frequency'],
      status: 'draft',
      createdBy: currentUser.name,
      description: formData.description,
    };
    setReports([...reports, newReport]);
    setIsCreateModalOpen(false);
    setFormData({ name: '', category: '', frequency: 'once', description: '' });
    toast({ title: 'Report Created', description: `${newReport.name} has been created successfully.` });
  };

  const handleEdit = () => {
    if (!selectedReport) return;
    setReports(reports.map(r => 
      r.id === selectedReport.id 
        ? { ...r, name: formData.name, category: formData.category, frequency: formData.frequency as Report['frequency'], description: formData.description }
        : r
    ));
    setIsEditModalOpen(false);
    setSelectedReport(null);
    toast({ title: 'Report Updated', description: 'Report has been updated successfully.' });
  };

  const handleDelete = () => {
    if (!selectedReport) return;
    setReports(reports.filter(r => r.id !== selectedReport.id));
    setIsDeleteDialogOpen(false);
    setSelectedReport(null);
    toast({ title: 'Report Deleted', description: 'Report has been deleted successfully.' });
  };

  const handleRunReport = (report: Report) => {
    setReports(reports.map(r => 
      r.id === report.id 
        ? { ...r, lastRun: new Date().toISOString().split('T')[0], status: 'active' }
        : r
    ));
    toast({ title: 'Report Running', description: `${report.name} is being generated...` });
  };

  const handleToggleStatus = (report: Report) => {
    setReports(reports.map(r => 
      r.id === report.id 
        ? { ...r, status: r.status === 'active' ? 'paused' : 'active' }
        : r
    ));
    toast({ 
      title: report.status === 'active' ? 'Report Paused' : 'Report Activated',
      description: `${report.name} has been ${report.status === 'active' ? 'paused' : 'activated'}.`
    });
  };

  const openViewModal = (report: Report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const openEditModal = (report: Report) => {
    setSelectedReport(report);
    setFormData({
      name: report.name,
      category: report.category,
      frequency: report.frequency,
      description: report.description,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (report: Report) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'muted';
      default: return 'default';
    }
  };

  const metrics = [
    { title: 'Total Reports', value: reports.length, icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Active Schedules', value: reports.filter(r => r.status === 'active').length, icon: Clock, color: 'text-success', bgColor: 'bg-success/10' },
    { title: 'Custom Reports', value: reports.filter(r => r.type === 'custom').length, icon: FileBarChart, color: 'text-info', bgColor: 'bg-info/10' },
    { title: 'Run Today', value: reports.filter(r => r.lastRun === new Date().toISOString().split('T')[0]).length, icon: Play, color: 'text-warning', bgColor: 'bg-warning/10' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 className="h-7 w-7 text-primary" />
            Reports & Analytics
          </h1>
          <p className="page-subtitle">
            Generate, schedule, and manage occupational health reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Center
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <p className="metric-value">{metric.value}</p>
              </div>
              <p className="metric-label mt-2">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="exports">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">{report.id}</TableCell>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.category}</TableCell>
                      <TableCell className="capitalize">{report.type}</TableCell>
                      <TableCell className="capitalize">{report.frequency}</TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>
                        <StatusBadge variant={getStatusVariant(report.status)}>
                          {report.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRunReport(report)}
                            title="Run Report"
                          >
                            <Play className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(report)}
                            title={report.status === 'active' ? 'Pause' : 'Activate'}
                          >
                            {report.status === 'active' ? (
                              <Pause className="h-4 w-4 text-warning" />
                            ) : (
                              <Play className="h-4 w-4 text-info" />
                            )}
                          </Button>
                          <ActionButtons
                            onView={() => openViewModal(report)}
                            onEdit={() => openEditModal(report)}
                            onDelete={() => openDeleteDialog(report)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No reports found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Reports configured to run automatically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.frequency !== 'once' && r.status === 'active').map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Runs {report.frequency} • Last run: {report.lastRun}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge variant="success">Active</StatusBadge>
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(report)}>
                        Pause
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Recent report exports and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Monthly PME Compliance Report', format: 'PDF', date: '2025-01-01', size: '2.4 MB' },
                  { name: 'Weekly Clinic Utilization', format: 'Excel', date: '2025-01-05', size: '1.1 MB' },
                  { name: 'Exposure Monitoring Summary', format: 'CSV', date: '2025-01-02', size: '456 KB' },
                ].map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-info/10">
                        <Download className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="font-medium">{exp.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.format} • {exp.size} • Exported {exp.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Modal */}
      <FormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Report"
        description="Configure a new custom report"
        onSubmit={handleCreate}
        submitLabel="Create Report"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter report name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.filter(c => c !== 'All Categories').map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Schedule Frequency</Label>
            <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Run Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this report contains"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Report Details"
        description={selectedReport?.id}
        onSubmit={() => setIsViewModalOpen(false)}
        submitLabel="Close"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Report Name</Label>
                <p className="font-medium">{selectedReport.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{selectedReport.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p className="font-medium capitalize">{selectedReport.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Frequency</Label>
                <p className="font-medium capitalize">{selectedReport.frequency}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Run</Label>
                <p className="font-medium">{selectedReport.lastRun}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <StatusBadge variant={getStatusVariant(selectedReport.status)}>
                  {selectedReport.status}
                </StatusBadge>
              </div>
              <div>
                <Label className="text-muted-foreground">Created By</Label>
                <p className="font-medium">{selectedReport.createdBy}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="font-medium">{selectedReport.description}</p>
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Report"
        description={selectedReport?.id}
        onSubmit={handleEdit}
        submitLabel="Save Changes"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Report Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.filter(c => c !== 'All Categories').map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-frequency">Schedule Frequency</Label>
            <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Run Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Report"
        description={`Are you sure you want to delete "${selectedReport?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
