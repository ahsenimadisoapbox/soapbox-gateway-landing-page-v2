import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaintsCustomer } from '../context/ComplaintsCustomerContext';
import { 
  mockAuditLog, 
  mockCommunications, 
  mockAttachments,
  mockUsers,
  categories,
  subCategories,
  rcaMethods,
  regulations,
} from '../data/mockData';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Package,
  Calendar,
  Flag,
  FileText,
  MessageSquare,
  Paperclip,
  History,
  Link2,
  Shield,
  Eye,
  Edit,
  Trash2,
  Send,
  Upload,
  Plus,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complaints, updateComplaint } = useComplaintsCustomer();
  const { toast } = useToast();

  const complaint = complaints.find((c) => c.id === id);

  const [activeTab, setActiveTab] = useState('overview');
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRcaModalOpen, setIsRcaModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isLinkRecordModalOpen, setIsLinkRecordModalOpen] = useState(false);

  // Form states
  const [triageForm, setTriageForm] = useState({
    severity: complaint?.severity || 'Medium',
    priority: complaint?.priority || 'P3',
    category: complaint?.category || '',
    subCategory: complaint?.subCategory || '',
    regulatorySignificance: complaint?.regulatoryFlag || false,
    decision: 'accept',
    assignee: '',
    reason: '',
  });

  const [rcaForm, setRcaForm] = useState({
    method: '5whys',
    rootCause: '',
    category: '',
    systemic: false,
    capaRequired: false,
    notes: '',
  });

  const [resolutionForm, setResolutionForm] = useState({
    type: 'explanation',
    customerMessage: '',
    internalNotes: '',
  });

  const [communicationForm, setCommunicationForm] = useState({
    type: 'Email',
    recipient: complaint?.customerEmail || '',
    subject: '',
    content: '',
  });

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Complaint Not Found</h2>
          <p className="text-muted-foreground mb-4">The complaint you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/complaints')}>Back to Complaints</Button>
        </div>
      </div>
    );
  }

  const getSlaIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'breached':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const handleTriage = () => {
    updateComplaint(complaint.id, {
      severity: triageForm.severity as any,
      priority: triageForm.priority as any,
      category: triageForm.category,
      subCategory: triageForm.subCategory,
      regulatoryFlag: triageForm.regulatorySignificance,
      status: triageForm.decision === 'accept' ? 'Triaged' : triageForm.decision === 'reject' ? 'Rejected' : 'New',
      assignee: triageForm.assignee || undefined,
    });
    setIsTriageModalOpen(false);
    toast({ title: 'Triage Complete', description: 'Complaint has been triaged successfully.' });
  };

  const handleAssign = () => {
    updateComplaint(complaint.id, {
      assignee: triageForm.assignee,
      status: 'Investigating',
      investigationStartedAt: new Date().toISOString(),
    });
    setIsAssignModalOpen(false);
    toast({ title: 'Assigned', description: `Complaint assigned to ${triageForm.assignee}` });
  };

  const handleRcaSubmit = () => {
    updateComplaint(complaint.id, {
      status: 'Pending Resolution',
    });
    setIsRcaModalOpen(false);
    toast({ title: 'RCA Submitted', description: 'Root cause analysis submitted for approval.' });
  };

  const handleResolutionSubmit = () => {
    updateComplaint(complaint.id, {
      status: 'Resolved',
      resolvedAt: new Date().toISOString(),
    });
    setIsResolutionModalOpen(false);
    toast({ title: 'Resolution Submitted', description: 'Resolution has been submitted for approval.' });
  };

  const handleSendCommunication = () => {
    setIsCommunicationModalOpen(false);
    setCommunicationForm({ type: 'Email', recipient: complaint.customerEmail, subject: '', content: '' });
    toast({ title: 'Message Sent', description: 'Communication has been sent to the customer.' });
  };

  const timelineSteps = [
    { label: 'Received', date: complaint.createdAt, completed: true },
    { label: 'Acknowledged', date: complaint.acknowledgedAt, completed: !!complaint.acknowledgedAt },
    { label: 'Investigating', date: complaint.investigationStartedAt, completed: !!complaint.investigationStartedAt },
    { label: 'Resolved', date: complaint.resolvedAt, completed: !!complaint.resolvedAt },
    { label: 'Closed', date: complaint.closedAt, completed: !!complaint.closedAt },
  ];

  const currentStepIndex = timelineSteps.findIndex(s => !s.completed);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sticky Header */}
      <Card className="sticky top-20 z-20 bg-card/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/complaints')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">{complaint.id}</h1>
                  <Badge variant="outline" className={cn(
                    complaint.status === 'New' && 'status-open',
                    complaint.status === 'Investigating' && 'status-in-progress',
                    complaint.status === 'Resolved' && 'status-closed',
                    complaint.status === 'Closed' && 'status-closed',
                    complaint.status === 'Rejected' && 'status-rejected'
                  )}>
                    {complaint.status}
                  </Badge>
                  <Badge className={cn(
                    complaint.severity === 'Critical' && 'severity-critical',
                    complaint.severity === 'High' && 'severity-high',
                    complaint.severity === 'Medium' && 'severity-medium',
                    complaint.severity === 'Low' && 'severity-low'
                  )}>
                    {complaint.severity}
                  </Badge>
                  {complaint.regulatoryFlag && (
                    <Badge variant="outline" className="border-warning text-warning">
                      <Flag className="h-3 w-3 mr-1" />
                      Regulatory
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{complaint.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* SLA */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                {getSlaIcon(complaint.slaStatus)}
                <div className="text-sm">
                  <span className="text-muted-foreground">SLA: </span>
                  <span className="font-medium">{new Date(complaint.slaDueDate).toLocaleDateString()}</span>
                </div>
              </div>
              {/* Owner */}
              {complaint.owner && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{complaint.owner}</span>
                </div>
              )}
              {/* Site */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{complaint.site}</span>
              </div>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="mt-4 flex items-center gap-2">
            {timelineSteps.map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'h-3 w-3 rounded-full',
                    step.completed ? 'bg-success' : index === currentStepIndex ? 'bg-accent ring-4 ring-accent/20' : 'bg-muted-foreground/30'
                  )} />
                  <span className={cn(
                    'text-xs mt-1',
                    step.completed ? 'text-success' : 'text-muted-foreground'
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < timelineSteps.length - 1 && (
                  <div className={cn(
                    'h-0.5 w-12 mx-1',
                    step.completed ? 'bg-success' : 'bg-muted-foreground/30'
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="triage">Triage</TabsTrigger>
          <TabsTrigger value="investigation">Investigation</TabsTrigger>
          <TabsTrigger value="rca">RCA</TabsTrigger>
          <TabsTrigger value="resolution">Resolution</TabsTrigger>
          <TabsTrigger value="linked">Linked</TabsTrigger>
          <TabsTrigger value="communications">Comms</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          {complaint.regulatoryFlag && <TabsTrigger value="regulatory">Regulatory</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{complaint.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{complaint.customerEmail}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Customer ID</Label>
                    <p className="font-medium">{complaint.customerId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Source</Label>
                    <p className="font-medium">{complaint.source}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Product</Label>
                    <p className="font-medium">{complaint.productName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Product Code</Label>
                    <p className="font-medium">{complaint.productCode || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Batch Number</Label>
                    <p className="font-medium">{complaint.batchNumber || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Site</Label>
                    <p className="font-medium">{complaint.site}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Subject</Label>
                  <p className="font-medium">{complaint.subject}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm leading-relaxed">{complaint.description}</p>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="font-medium">{complaint.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sub-Category</Label>
                    <p className="font-medium">{complaint.subCategory || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <Badge variant="outline">{complaint.priority}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {complaint.status === 'New' && (
                  <Button onClick={() => setIsTriageModalOpen(true)}>
                    Triage Complaint
                  </Button>
                )}
                {complaint.status === 'Triaged' && (
                  <Button onClick={() => setIsAssignModalOpen(true)}>
                    Assign Investigator
                  </Button>
                )}
                {complaint.status === 'Investigating' && (
                  <Button onClick={() => { setActiveTab('rca'); }}>
                    Start RCA
                  </Button>
                )}
                {complaint.status === 'Pending RCA' && (
                  <Button onClick={() => setIsRcaModalOpen(true)}>
                    Complete RCA
                  </Button>
                )}
                {complaint.status === 'Pending Resolution' && (
                  <Button onClick={() => setIsResolutionModalOpen(true)}>
                    Submit Resolution
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsCommunicationModalOpen(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Update
                </Button>
                <Button variant="outline" onClick={() => setIsAttachmentModalOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button variant="outline" onClick={() => setIsLinkRecordModalOpen(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Link Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Triage Tab */}
        <TabsContent value="triage" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Triage Information</CardTitle>
                <CardDescription>Classification and initial assessment</CardDescription>
              </div>
              <Button onClick={() => setIsTriageModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Triage
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-muted-foreground">Severity</Label>
                  <Badge className={cn(
                    'mt-1',
                    complaint.severity === 'Critical' && 'severity-critical',
                    complaint.severity === 'High' && 'severity-high',
                    complaint.severity === 'Medium' && 'severity-medium',
                    complaint.severity === 'Low' && 'severity-low'
                  )}>
                    {complaint.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <Badge variant="outline" className="mt-1">{complaint.priority}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium mt-1">{complaint.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sub-Category</Label>
                  <p className="font-medium mt-1">{complaint.subCategory || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Regulatory Significance</Label>
                  <p className="font-medium mt-1">{complaint.regulatoryFlag ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p className="font-medium mt-1">{complaint.owner || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assignee</Label>
                  <p className="font-medium mt-1">{complaint.assignee || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Acknowledged</Label>
                  <p className="font-medium mt-1">
                    {complaint.acknowledgedAt ? new Date(complaint.acknowledgedAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investigation Tab */}
        <TabsContent value="investigation" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Investigation Notes</CardTitle>
                <CardDescription>Document investigation findings and evidence</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter investigation notes here..."
                rows={8}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button>Save Notes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investigation Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Collect device logs</span>
                  </div>
                  <Badge variant="outline" className="status-closed">Completed</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <span>Interview operator</span>
                  </div>
                  <Badge variant="outline" className="status-in-progress">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    <span>Review batch records</span>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RCA Tab */}
        <TabsContent value="rca" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Root Cause Analysis</CardTitle>
                <CardDescription>Identify and document the root cause</CardDescription>
              </div>
              <Button onClick={() => setIsRcaModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit RCA
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>RCA Method</Label>
                  <Select defaultValue="5whys">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rcaMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Root Cause Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="human">Human Error</SelectItem>
                      <SelectItem value="process">Process Failure</SelectItem>
                      <SelectItem value="equipment">Equipment Failure</SelectItem>
                      <SelectItem value="material">Material Issue</SelectItem>
                      <SelectItem value="design">Design Flaw</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Root Cause Statement</Label>
                <Textarea
                  placeholder="Describe the root cause identified..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="systemic" className="rounded" />
                  <Label htmlFor="systemic">Systemic Issue</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="capaRequired" className="rounded" />
                  <Label htmlFor="capaRequired">CAPA Required</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Save Draft</Button>
                <Button>Submit for Approval</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolution Tab */}
        <TabsContent value="resolution" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resolution</CardTitle>
                <CardDescription>Define the resolution and customer response</CardDescription>
              </div>
              <Button onClick={() => setIsResolutionModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Resolution
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Resolution Type</Label>
                <Select defaultValue="explanation">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="explanation">Explanation</SelectItem>
                    <SelectItem value="corrective">Corrective Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer Message</Label>
                <Textarea
                  placeholder="Compose a customer-friendly resolution message..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label>Internal Notes</Label>
                <Textarea
                  placeholder="Internal notes and preventive actions..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Preview</Button>
                <Button>Submit for Approval</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Linked Records Tab */}
        <TabsContent value="linked" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Linked Records</CardTitle>
                <CardDescription>Related CAPA, Incidents, NCR, and Risk records</CardDescription>
              </div>
              <Button onClick={() => setIsLinkRecordModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Link Record
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complaint.linkedCapa && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">{complaint.linkedCapa}</p>
                        <p className="text-xs text-muted-foreground">CAPA</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {complaint.linkedIncident && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <div>
                        <p className="font-medium">{complaint.linkedIncident}</p>
                        <p className="text-xs text-muted-foreground">Incident</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {complaint.linkedNcr && (
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">{complaint.linkedNcr}</p>
                        <p className="text-xs text-muted-foreground">NCR</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {!complaint.linkedCapa && !complaint.linkedIncident && !complaint.linkedNcr && (
                  <p className="text-center text-muted-foreground py-8">No linked records</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Communication Log</CardTitle>
                <CardDescription>All communications with customer and internal team</CardDescription>
              </div>
              <Button onClick={() => setIsCommunicationModalOpen(true)}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommunications.filter(c => c.complaintId === complaint.id).map((comm) => (
                  <div key={comm.id} className={cn(
                    'p-4 rounded-lg border',
                    comm.direction === 'Outbound' ? 'bg-accent/5 ml-8' : 'mr-8'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{comm.type}</Badge>
                        <span className="text-xs text-muted-foreground">{comm.direction}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comm.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{comm.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1">{comm.content}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {comm.direction === 'Outbound' ? `To: ${comm.recipient}` : `From: ${comm.sender}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Documents and evidence files</CardDescription>
              </div>
              <Button onClick={() => setIsAttachmentModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttachments.filter(a => a.complaintId === complaint.id).map((attachment) => (
                    <TableRow key={attachment.id}>
                      <TableCell className="font-medium">{attachment.fileName}</TableCell>
                      <TableCell>{attachment.category}</TableCell>
                      <TableCell>{attachment.fileSize}</TableCell>
                      <TableCell>{attachment.uploadedBy}</TableCell>
                      <TableCell>{new Date(attachment.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {attachment.isCustomerVisible ? 'Customer' : 'Internal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete history of all changes</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditLog.filter(a => a.complaintId === complaint.id).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-sm">{new Date(entry.performedAt).toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{entry.action}</TableCell>
                      <TableCell>{entry.field || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.oldValue || '-'}</TableCell>
                      <TableCell>{entry.newValue || '-'}</TableCell>
                      <TableCell>{entry.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regulatory Tab */}
        {complaint.regulatoryFlag && (
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Regulatory Reporting
                </CardTitle>
                <CardDescription>Manage regulatory requirements and submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Applicable Regulations</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">FDA MDR</Badge>
                      <Badge variant="outline">EU MDR</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reporting Deadline</Label>
                    <p className="font-medium text-warning">
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Regulatory Actions</h4>
                  <div className="flex gap-2">
                    <Button>Generate MDR Report</Button>
                    <Button variant="outline">View Regulatory History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Triage Modal */}
      <Dialog open={isTriageModalOpen} onOpenChange={setIsTriageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Triage Complaint</DialogTitle>
            <DialogDescription>Classify and make initial assessment decision</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select
                  value={triageForm.severity}
                  onValueChange={(v) => setTriageForm({ ...triageForm, severity: v as 'Critical' | 'High' | 'Medium' | 'Low' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={triageForm.priority}
                  onValueChange={(v) => setTriageForm({ ...triageForm, priority: v as 'P1' | 'P2' | 'P3' | 'P4' })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={triageForm.category}
                  onValueChange={(v) => setTriageForm({ ...triageForm, category: v, subCategory: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sub-Category</Label>
                <Select
                  value={triageForm.subCategory}
                  onValueChange={(v) => setTriageForm({ ...triageForm, subCategory: v })}
                  disabled={!triageForm.category}
                >
                  <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                  <SelectContent>
                    {(subCategories[triageForm.category] || []).map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="regulatory"
                checked={triageForm.regulatorySignificance}
                onChange={(e) => setTriageForm({ ...triageForm, regulatorySignificance: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="regulatory">Regulatory Significance</Label>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Decision</Label>
              <Select
                value={triageForm.decision}
                onValueChange={(v) => setTriageForm({ ...triageForm, decision: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept & Assign</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="info">Need More Information</SelectItem>
                  <SelectItem value="escalate">Escalate to Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {triageForm.decision === 'accept' && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select
                  value={triageForm.assignee}
                  onValueChange={(v) => setTriageForm({ ...triageForm, assignee: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select investigator" /></SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.name}>{user.name} ({user.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {triageForm.decision === 'reject' && (
              <div className="space-y-2">
                <Label>Rejection Reason *</Label>
                <Textarea
                  value={triageForm.reason}
                  onChange={(e) => setTriageForm({ ...triageForm, reason: e.target.value })}
                  placeholder="Provide reason for rejection..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTriageModalOpen(false)}>Cancel</Button>
            <Button onClick={handleTriage}>Complete Triage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Investigator</DialogTitle>
            <DialogDescription>Select a team member to investigate this complaint</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select
                value={triageForm.assignee}
                onValueChange={(v) => setTriageForm({ ...triageForm, assignee: v })}
              >
                <SelectTrigger><SelectValue placeholder="Select investigator" /></SelectTrigger>
                <SelectContent>
                  {mockUsers.filter(u => ['Investigator', 'QA Manager', 'EHS Officer'].includes(u.role)).map((user) => (
                    <SelectItem key={user.id} value={user.name}>{user.name} ({user.role})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!triageForm.assignee}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RCA Modal */}
      <Dialog open={isRcaModalOpen} onOpenChange={setIsRcaModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Root Cause Analysis</DialogTitle>
            <DialogDescription>Document the root cause findings</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>RCA Method</Label>
                <Select
                  value={rcaForm.method}
                  onValueChange={(v) => setRcaForm({ ...rcaForm, method: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {rcaMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>{method.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Root Cause Category</Label>
                <Select
                  value={rcaForm.category}
                  onValueChange={(v) => setRcaForm({ ...rcaForm, category: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">Human Error</SelectItem>
                    <SelectItem value="process">Process Failure</SelectItem>
                    <SelectItem value="equipment">Equipment Failure</SelectItem>
                    <SelectItem value="material">Material Issue</SelectItem>
                    <SelectItem value="design">Design Flaw</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Root Cause Statement *</Label>
              <Textarea
                value={rcaForm.rootCause}
                onChange={(e) => setRcaForm({ ...rcaForm, rootCause: e.target.value })}
                placeholder="Describe the identified root cause..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="systemic"
                  checked={rcaForm.systemic}
                  onChange={(e) => setRcaForm({ ...rcaForm, systemic: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="systemic">Systemic Issue</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="capaReq"
                  checked={rcaForm.capaRequired}
                  onChange={(e) => setRcaForm({ ...rcaForm, capaRequired: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="capaReq">CAPA Required</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRcaModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRcaSubmit} disabled={!rcaForm.rootCause}>Submit for Approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolution Modal */}
      <Dialog open={isResolutionModalOpen} onOpenChange={setIsResolutionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Resolution</DialogTitle>
            <DialogDescription>Define the resolution and customer response</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Resolution Type</Label>
              <Select
                value={resolutionForm.type}
                onValueChange={(v) => setResolutionForm({ ...resolutionForm, type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="replacement">Replacement</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="explanation">Explanation</SelectItem>
                  <SelectItem value="corrective">Corrective Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Customer Message *</Label>
              <Textarea
                value={resolutionForm.customerMessage}
                onChange={(e) => setResolutionForm({ ...resolutionForm, customerMessage: e.target.value })}
                placeholder="Compose a customer-friendly message..."
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea
                value={resolutionForm.internalNotes}
                onChange={(e) => setResolutionForm({ ...resolutionForm, internalNotes: e.target.value })}
                placeholder="Internal notes and preventive measures..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolutionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleResolutionSubmit} disabled={!resolutionForm.customerMessage}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Communication Modal */}
      <Dialog open={isCommunicationModalOpen} onOpenChange={setIsCommunicationModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Communication</DialogTitle>
            <DialogDescription>Send a message to the customer or team</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={communicationForm.type}
                  onValueChange={(v) => setCommunicationForm({ ...communicationForm, type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Portal">Portal Message</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="Internal">Internal Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recipient</Label>
                <Input
                  value={communicationForm.recipient}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, recipient: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={communicationForm.subject}
                onChange={(e) => setCommunicationForm({ ...communicationForm, subject: e.target.value })}
                placeholder="Message subject..."
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={communicationForm.content}
                onChange={(e) => setCommunicationForm({ ...communicationForm, content: e.target.value })}
                placeholder="Compose your message..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommunicationModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSendCommunication} disabled={!communicationForm.content}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Modal */}
      <Dialog open={isAttachmentModalOpen} onOpenChange={setIsAttachmentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
            <DialogDescription>Add documents or evidence files</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or click to browse
              </p>
              <Button variant="outline" className="mt-3">
                Select Files
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Evidence">Evidence</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Resolution">Resolution</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select visibility" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Only</SelectItem>
                    <SelectItem value="customer">Customer Visible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttachmentModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsAttachmentModalOpen(false);
              toast({ title: 'File Uploaded', description: 'Attachment has been uploaded successfully.' });
            }}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Record Modal */}
      <Dialog open={isLinkRecordModalOpen} onOpenChange={setIsLinkRecordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Record</DialogTitle>
            <DialogDescription>Link related CAPA, Incident, NCR, or Risk records</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Record Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="capa">CAPA</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="ncr">NCR / Deviation</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                  <SelectItem value="supplier">Supplier Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Record ID</Label>
              <Input placeholder="Enter record ID or search..." />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkRecordModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsLinkRecordModalOpen(false);
              toast({ title: 'Record Linked', description: 'Record has been linked successfully.' });
            }}>Link Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
