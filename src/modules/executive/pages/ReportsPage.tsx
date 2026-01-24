import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { 
  FileText, 
  Download, 
  Calendar, 
  Printer, 
  Share2, 
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const reportTemplates = [
  { id: 'board-pack', name: 'Board Pack', description: 'Comprehensive executive summary for board meetings', format: 'PDF/PPT' },
  { id: 'risk-report', name: 'Risk Report', description: 'Enterprise risk landscape and exposure analysis', format: 'PDF' },
  { id: 'compliance-report', name: 'Compliance Report', description: 'Regulatory compliance status and audit findings', format: 'PDF' },
  { id: 'safety-report', name: 'Safety Report', description: 'Incident statistics and safety performance', format: 'PDF' },
  { id: 'capa-report', name: 'CAPA Report', description: 'Corrective action effectiveness and trends', format: 'PDF' },
  { id: 'esg-report', name: 'ESG Report', description: 'Environmental, social, and governance metrics', format: 'PDF' },
];

const recentReports = [
  { id: '1', name: 'Q4 2024 Board Pack', generatedAt: new Date(Date.now() - 86400000), status: 'ready', format: 'PDF' },
  { id: '2', name: 'December Safety Report', generatedAt: new Date(Date.now() - 172800000), status: 'ready', format: 'PDF' },
  { id: '3', name: 'Annual ESG Summary', generatedAt: new Date(Date.now() - 259200000), status: 'ready', format: 'PDF' },
  { id: '4', name: 'Risk Assessment Q4', generatedAt: new Date(Date.now() - 345600000), status: 'ready', format: 'PDF' },
];

const initialCapaItems = [
  { id: '1', title: 'Equipment Calibration CAPA', status: 'open', priority: 'high', dueDate: new Date(Date.now() + 604800000), owner: 'John Smith', effectiveness: null },
  { id: '2', title: 'Documentation Control CAPA', status: 'in-progress', priority: 'medium', dueDate: new Date(Date.now() + 1209600000), owner: 'Sarah Johnson', effectiveness: null },
  { id: '3', title: 'Supplier Quality CAPA', status: 'closed', priority: 'high', dueDate: new Date(Date.now() - 604800000), owner: 'Mike Williams', effectiveness: 'effective' },
  { id: '4', title: 'Process Deviation CAPA', status: 'closed', priority: 'low', dueDate: new Date(Date.now() - 1209600000), owner: 'Emily Brown', effectiveness: 'effective' },
  { id: '5', title: 'Training Gap CAPA', status: 'open', priority: 'medium', dueDate: new Date(Date.now() + 259200000), owner: 'David Lee', effectiveness: null },
];

const analyticsData = [
  { label: 'Reports Generated', value: '156', change: '+12%', period: 'This Month' },
  { label: 'Avg Generation Time', value: '2.3s', change: '-15%', period: 'This Month' },
  { label: 'Most Popular', value: 'Risk Report', subtext: '45 downloads' },
  { label: 'Scheduled Reports', value: '8', subtext: 'Active schedules' },
];

const ReportsPage = () => {
  const [capaItems, setCapaItems] = useState(initialCapaItems);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTemplate, setScheduleTemplate] = useState<string | null>(null);
  
  // CAPA modal states
  const [capaModalOpen, setCapaModalOpen] = useState(false);
  const [capaViewModal, setCapaViewModal] = useState<{ open: boolean; capa: any }>({ open: false, capa: null });
  const [capaEditModal, setCapaEditModal] = useState<{ open: boolean; capa: any }>({ open: false, capa: null });
  const [capaDeleteModal, setCapaDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  
  // Form states
  const [capaForm, setCapaForm] = useState({ title: '', priority: '', owner: '', description: '' });
  const [editCapaForm, setEditCapaForm] = useState({ title: '', priority: '', owner: '', description: '' });

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    setGenerateModalOpen(true);
  };

  const confirmGenerateReport = () => {
    toast.success(`Generating ${reportTemplates.find(t => t.id === selectedTemplate)?.name}...`);
    setGenerateModalOpen(false);
    setTimeout(() => {
      toast.success('Report generated successfully!');
    }, 2000);
  };

  const handleScheduleReport = (templateId: string) => {
    setScheduleTemplate(templateId);
    setScheduleModalOpen(true);
  };

  const confirmScheduleReport = () => {
    toast.success(`Report scheduled successfully!`);
    setScheduleModalOpen(false);
  };

  const handleDownload = (reportId: string, reportName: string) => {
    toast.success(`Downloading ${reportName}...`);
  };

  const handlePrint = (reportName: string) => {
    toast.success(`Preparing ${reportName} for print...`);
  };

  const handleShare = (reportName: string) => {
    toast.success(`Share link for ${reportName} copied to clipboard`);
  };

  // CAPA handlers
  const handleCreateCapa = () => {
    if (!capaForm.title || !capaForm.priority || !capaForm.owner) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newCapa = {
      id: String(Date.now()),
      title: capaForm.title,
      status: 'open',
      priority: capaForm.priority,
      dueDate: new Date(Date.now() + 604800000),
      owner: capaForm.owner,
      effectiveness: null,
    };
    setCapaItems([newCapa, ...capaItems]);
    toast.success('CAPA created successfully');
    setCapaModalOpen(false);
    setCapaForm({ title: '', priority: '', owner: '', description: '' });
  };

  const handleViewCapa = (capa: any) => {
    setCapaViewModal({ open: true, capa });
  };

  const handleEditCapa = (capa: any) => {
    setEditCapaForm({ title: capa.title, priority: capa.priority, owner: capa.owner, description: '' });
    setCapaEditModal({ open: true, capa });
  };

  const confirmEditCapa = () => {
    if (!editCapaForm.title || !editCapaForm.priority || !editCapaForm.owner) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCapaItems(capaItems.map(c => 
      c.id === capaEditModal.capa.id 
        ? { ...c, title: editCapaForm.title, priority: editCapaForm.priority, owner: editCapaForm.owner }
        : c
    ));
    toast.success('CAPA updated successfully');
    setCapaEditModal({ open: false, capa: null });
  };

  const handleDeleteCapa = (id: string) => {
    setCapaDeleteModal({ open: true, id });
  };

  const confirmDeleteCapa = () => {
    setCapaItems(capaItems.filter(c => c.id !== capaDeleteModal.id));
    toast.success('CAPA deleted successfully');
    setCapaDeleteModal({ open: false, id: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'closed':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <FileText className="h-6 w-6 text-accent" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Generate executive reports, manage CAPA, and view analytics</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setGenerateModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="capa">CAPA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <div className="space-y-6">
              <ExecutivePanel title="Available Report Templates">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="p-4 bg-muted/50 rounded-lg border border-border hover:border-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Format: {template.format}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-accent hover:bg-accent/90"
                          onClick={() => handleGenerateReport(template.id)}
                        >
                          Generate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleReport(template.id)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ExecutivePanel>

              <ExecutivePanel title="Recently Generated Reports">
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Generated {report.generatedAt.toLocaleDateString()} • {report.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare(report.name)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrint(report.name)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => handleDownload(report.id, report.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="capa">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button className="bg-accent hover:bg-accent/90" onClick={() => setCapaModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New CAPA
                </Button>
              </div>
              <ExecutivePanel title="CAPA Management">
                <div className="space-y-3">
                  {capaItems.map((capa) => (
                    <div key={capa.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{capa.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Owner: {capa.owner} • Due: {capa.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(capa.priority)}
                        {getStatusBadge(capa.status)}
                        {capa.effectiveness && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Effective
                          </Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCapa(capa)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditCapa(capa)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCapa(capa.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.map((item, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="text-2xl font-bold mt-1">{item.value}</p>
                          {item.change && (
                            <p className="text-xs text-green-500 mt-1">{item.change} {item.period}</p>
                          )}
                          {item.subtext && (
                            <p className="text-xs text-muted-foreground mt-1">{item.subtext}</p>
                          )}
                        </div>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ExecutivePanel title="Report Generation Trends">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>Analytics charts will be displayed here</p>
                  </div>
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Generate Report Modal */}
      <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              {selectedTemplate 
                ? `Generate ${reportTemplates.find(t => t.id === selectedTemplate)?.name}`
                : 'Select a report template to generate'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report Template</Label>
              <Select value={selectedTemplate || ''} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateModalOpen(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={confirmGenerateReport} disabled={!selectedTemplate}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up recurring generation for {reportTemplates.find(t => t.id === scheduleTemplate)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={confirmScheduleReport}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New CAPA Modal */}
      <Dialog open={capaModalOpen} onOpenChange={setCapaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New CAPA</DialogTitle>
            <DialogDescription>Create a new corrective and preventive action</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input 
                value={capaForm.title} 
                onChange={(e) => setCapaForm({ ...capaForm, title: e.target.value })}
                placeholder="Enter CAPA title"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={capaForm.priority} onValueChange={(v) => setCapaForm({ ...capaForm, priority: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Owner *</Label>
              <Input 
                value={capaForm.owner} 
                onChange={(e) => setCapaForm({ ...capaForm, owner: e.target.value })}
                placeholder="Enter owner name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={capaForm.description} 
                onChange={(e) => setCapaForm({ ...capaForm, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCapaModalOpen(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleCreateCapa}>Create CAPA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View CAPA Modal */}
      <Dialog open={capaViewModal.open} onOpenChange={(open) => setCapaViewModal({ ...capaViewModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CAPA Details</DialogTitle>
          </DialogHeader>
          {capaViewModal.capa && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{capaViewModal.capa.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(capaViewModal.capa.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(capaViewModal.capa.priority)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p className="font-medium">{capaViewModal.capa.owner}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p className="font-medium">{capaViewModal.capa.dueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Effectiveness</Label>
                  <p className="font-medium">{capaViewModal.capa.effectiveness || 'Pending'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCapaViewModal({ open: false, capa: null })}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit CAPA Modal */}
      <Dialog open={capaEditModal.open} onOpenChange={(open) => setCapaEditModal({ ...capaEditModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit CAPA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input 
                value={editCapaForm.title} 
                onChange={(e) => setEditCapaForm({ ...editCapaForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={editCapaForm.priority} onValueChange={(v) => setEditCapaForm({ ...editCapaForm, priority: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Owner *</Label>
              <Input 
                value={editCapaForm.owner} 
                onChange={(e) => setEditCapaForm({ ...editCapaForm, owner: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCapaEditModal({ open: false, capa: null })}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={confirmEditCapa}>Update CAPA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete CAPA Modal */}
      <Dialog open={capaDeleteModal.open} onOpenChange={(open) => setCapaDeleteModal({ ...capaDeleteModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CAPA</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CAPA? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCapaDeleteModal({ open: false, id: '' })}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCapa}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsPage;
