import { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface CAPA {
  id: string;
  title: string;
  description: string;
  type: 'Corrective' | 'Preventive' | 'Both';
  status: 'Open' | 'In Progress' | 'Pending Verification' | 'Closed' | 'Cancelled';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  source: 'Complaint' | 'Audit' | 'Incident' | 'NCR' | 'Risk Assessment' | 'Internal';
  rootCause: string;
  owner: string;
  dueDate: string;
  completedDate?: string;
  linkedComplaint?: string;
  linkedAudit?: string;
  effectiveness?: 'Effective' | 'Partially Effective' | 'Not Effective' | 'Pending';
}

const mockCAPAs: CAPA[] = [
  {
    id: 'CAPA-2025-0012',
    title: 'Calibration Procedure Enhancement',
    description: 'Implement enhanced calibration verification procedures for LabPro-3000 analyzers.',
    type: 'Corrective',
    status: 'In Progress',
    priority: 'High',
    source: 'Complaint',
    rootCause: 'Inadequate calibration frequency for high-precision measurements.',
    owner: 'Sarah Chen',
    dueDate: '2025-01-20',
    linkedComplaint: 'CMP-2025-0003',
    effectiveness: 'Pending',
  },
  {
    id: 'CAPA-2025-0010',
    title: 'Packaging Material Upgrade',
    description: 'Upgrade packaging materials and add shock indicators for shipment monitoring.',
    type: 'Preventive',
    status: 'Open',
    priority: 'Medium',
    source: 'Complaint',
    rootCause: 'Current packaging materials insufficient for rough handling during transit.',
    owner: 'Emily Carter',
    dueDate: '2025-02-01',
    linkedComplaint: 'CMP-2025-0002',
    effectiveness: 'Pending',
  },
  {
    id: 'CAPA-2025-0008',
    title: 'Supplier Quality Improvement Program',
    description: 'Implement enhanced supplier monitoring and quality gates for critical components.',
    type: 'Both',
    status: 'Pending Verification',
    priority: 'High',
    source: 'Audit',
    rootCause: 'Lack of robust supplier quality monitoring system.',
    owner: 'Mike Rodriguez',
    dueDate: '2025-01-15',
    linkedAudit: 'AUD-2025-0012',
    effectiveness: 'Pending',
  },
  {
    id: 'CAPA-2025-0005',
    title: 'Software Update Testing Protocol',
    description: 'Establish mandatory regression testing for all software updates before release.',
    type: 'Preventive',
    status: 'Closed',
    priority: 'High',
    source: 'Complaint',
    rootCause: 'Insufficient testing coverage for software updates.',
    owner: 'David Kim',
    dueDate: '2025-01-05',
    completedDate: '2025-01-04',
    linkedComplaint: 'CMP-2025-0004',
    effectiveness: 'Effective',
  },
  {
    id: 'CAPA-2024-0095',
    title: 'Documentation Review Process',
    description: 'Implement periodic review cycle for all IFU documents.',
    type: 'Corrective',
    status: 'Closed',
    priority: 'Low',
    source: 'Complaint',
    rootCause: 'No scheduled review process for IFU documents.',
    owner: 'Robert Johnson',
    dueDate: '2024-12-30',
    completedDate: '2024-12-28',
    linkedComplaint: 'CMP-2025-0005',
    effectiveness: 'Effective',
  },
  {
    id: 'CAPA-2024-0090',
    title: 'Material Composition Review',
    description: 'Review and update material specifications for skin contact components.',
    type: 'Both',
    status: 'In Progress',
    priority: 'Critical',
    source: 'Incident',
    rootCause: 'Material composition not fully assessed for allergenic properties.',
    owner: 'Jennifer Walsh',
    dueDate: '2025-01-25',
    linkedComplaint: 'CMP-2025-0006',
    effectiveness: 'Pending',
  },
];

export default function CAPA() {
  const { toast } = useToast();
  const [capas, setCAPAs] = useState<CAPA[]>(mockCAPAs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [newCAPA, setNewCAPA] = useState({
    title: '',
    description: '',
    type: 'Corrective' as CAPA['type'],
    priority: 'Medium' as CAPA['priority'],
    source: 'Complaint' as CAPA['source'],
    rootCause: '',
    owner: '',
    dueDate: '',
    linkedComplaint: '',
  });

  const filteredCAPAs = capas.filter(capa => {
    const matchesSearch = capa.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capa.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || capa.status === statusFilter;
    const matchesType = typeFilter === 'all' || capa.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openCount = capas.filter(c => c.status === 'Open').length;
  const inProgressCount = capas.filter(c => c.status === 'In Progress').length;
  const pendingVerificationCount = capas.filter(c => c.status === 'Pending Verification').length;
  const closedCount = capas.filter(c => c.status === 'Closed').length;

  const handleCreate = () => {
    const newId = `CAPA-2025-${String(capas.length + 15).padStart(4, '0')}`;
    const capa: CAPA = {
      id: newId,
      ...newCAPA,
      status: 'Open',
      effectiveness: 'Pending',
    };
    setCAPAs([capa, ...capas]);
    setIsModalOpen(false);
    setNewCAPA({ title: '', description: '', type: 'Corrective', priority: 'Medium', source: 'Complaint', rootCause: '', owner: '', dueDate: '', linkedComplaint: '' });
    toast({ title: 'CAPA Created', description: `CAPA ${newId} has been created.` });
  };

  const handleEdit = () => {
    if (!selectedCAPA) return;
    setCAPAs(capas.map(c => c.id === selectedCAPA.id ? selectedCAPA : c));
    setIsEditModalOpen(false);
    toast({ title: 'CAPA Updated', description: `CAPA ${selectedCAPA.id} has been updated.` });
  };

  const handleDelete = () => {
    if (!selectedCAPA) return;
    setCAPAs(capas.filter(c => c.id !== selectedCAPA.id));
    setIsDeleteModalOpen(false);
    setSelectedCAPA(null);
    toast({ title: 'CAPA Deleted', description: 'The CAPA has been deleted.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'CAPA data is being exported to CSV.' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Closed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-info" />;
      case 'Pending Verification':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="h-6 w-6" />
            CAPA
          </h1>
          <p className="page-subtitle">Corrective and Preventive Actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New CAPA
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cn(openCount > 0 && 'border-muted-foreground/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-2xl font-bold">{openCount}</p>
          </CardContent>
        </Card>
        <Card className={cn(inProgressCount > 0 && 'border-info/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{inProgressCount}</p>
          </CardContent>
        </Card>
        <Card className={cn(pendingVerificationCount > 0 && 'border-warning/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Verification</p>
            <p className="text-2xl font-bold">{pendingVerificationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="text-2xl font-bold text-success">{closedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search CAPAs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Preventive">Preventive</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCAPAs.map((capa) => (
                <TableRow key={capa.id} className="data-table-row">
                  <TableCell className="font-medium text-accent">{capa.id}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="line-clamp-1">{capa.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{capa.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      capa.priority === 'Critical' && 'severity-critical',
                      capa.priority === 'High' && 'severity-high',
                      capa.priority === 'Medium' && 'severity-medium',
                      capa.priority === 'Low' && 'severity-low'
                    )}>
                      {capa.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(capa.status)}
                      <Badge variant="outline" className={cn(
                        capa.status === 'Open' && 'status-open',
                        capa.status === 'In Progress' && 'status-in-progress',
                        capa.status === 'Closed' && 'status-closed'
                      )}>
                        {capa.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{capa.owner}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(capa.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      capa.effectiveness === 'Effective' && 'bg-success/10 text-success border-success',
                      capa.effectiveness === 'Not Effective' && 'bg-destructive/10 text-destructive border-destructive',
                      capa.effectiveness === 'Partially Effective' && 'bg-warning/10 text-warning border-warning'
                    )}>
                      {capa.effectiveness}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedCAPA(capa); setIsViewModalOpen(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedCAPA(capa); setIsEditModalOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedCAPA(capa); setIsDeleteModalOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredCAPAs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No CAPAs found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New CAPA</DialogTitle>
            <DialogDescription>Create a new Corrective/Preventive Action</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newCAPA.title}
                onChange={(e) => setNewCAPA({ ...newCAPA, title: e.target.value })}
                placeholder="CAPA title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={newCAPA.description}
                onChange={(e) => setNewCAPA({ ...newCAPA, description: e.target.value })}
                placeholder="Describe the corrective/preventive action"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newCAPA.type} onValueChange={(v) => setNewCAPA({ ...newCAPA, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newCAPA.priority} onValueChange={(v) => setNewCAPA({ ...newCAPA, priority: v as any })}>
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
                <Label>Source</Label>
                <Select value={newCAPA.source} onValueChange={(v) => setNewCAPA({ ...newCAPA, source: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Complaint">Complaint</SelectItem>
                    <SelectItem value="Audit">Audit</SelectItem>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="NCR">NCR</SelectItem>
                    <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Root Cause *</Label>
              <Textarea
                value={newCAPA.rootCause}
                onChange={(e) => setNewCAPA({ ...newCAPA, rootCause: e.target.value })}
                placeholder="Describe the identified root cause"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Owner</Label>
                <Input
                  value={newCAPA.owner}
                  onChange={(e) => setNewCAPA({ ...newCAPA, owner: e.target.value })}
                  placeholder="CAPA owner"
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newCAPA.dueDate}
                  onChange={(e) => setNewCAPA({ ...newCAPA, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Linked Complaint</Label>
                <Input
                  value={newCAPA.linkedComplaint}
                  onChange={(e) => setNewCAPA({ ...newCAPA, linkedComplaint: e.target.value })}
                  placeholder="CMP-2025-XXXX"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newCAPA.title || !newCAPA.description || !newCAPA.rootCause}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCAPA?.id}</DialogTitle>
            <DialogDescription>CAPA Details</DialogDescription>
          </DialogHeader>
          {selectedCAPA && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedCAPA.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedCAPA.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Root Cause</Label>
                <p className="text-sm">{selectedCAPA.rootCause}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedCAPA.type}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <Badge className={cn(
                    'mt-1',
                    selectedCAPA.priority === 'Critical' && 'severity-critical',
                    selectedCAPA.priority === 'High' && 'severity-high',
                    selectedCAPA.priority === 'Medium' && 'severity-medium',
                    selectedCAPA.priority === 'Low' && 'severity-low'
                  )}>
                    {selectedCAPA.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Source</Label>
                  <Badge variant="outline" className="mt-1">{selectedCAPA.source}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedCAPA.status)}
                    <span>{selectedCAPA.status}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p>{selectedCAPA.owner}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{new Date(selectedCAPA.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Effectiveness</Label>
                  <Badge variant="outline" className={cn(
                    'mt-1',
                    selectedCAPA.effectiveness === 'Effective' && 'bg-success/10 text-success border-success',
                    selectedCAPA.effectiveness === 'Not Effective' && 'bg-destructive/10 text-destructive border-destructive'
                  )}>
                    {selectedCAPA.effectiveness}
                  </Badge>
                </div>
                {selectedCAPA.completedDate && (
                  <div>
                    <Label className="text-muted-foreground">Completed Date</Label>
                    <p>{new Date(selectedCAPA.completedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {(selectedCAPA.linkedComplaint || selectedCAPA.linkedAudit) && (
                <div>
                  <Label className="text-muted-foreground">Linked Records</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedCAPA.linkedComplaint && <Badge variant="outline">{selectedCAPA.linkedComplaint}</Badge>}
                    {selectedCAPA.linkedAudit && <Badge variant="outline">{selectedCAPA.linkedAudit}</Badge>}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit CAPA</DialogTitle>
            <DialogDescription>Update CAPA details</DialogDescription>
          </DialogHeader>
          {selectedCAPA && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={selectedCAPA.title}
                  onChange={(e) => setSelectedCAPA({ ...selectedCAPA, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={selectedCAPA.description}
                  onChange={(e) => setSelectedCAPA({ ...selectedCAPA, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Root Cause *</Label>
                <Textarea
                  value={selectedCAPA.rootCause}
                  onChange={(e) => setSelectedCAPA({ ...selectedCAPA, rootCause: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={selectedCAPA.type} onValueChange={(v) => setSelectedCAPA({ ...selectedCAPA, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={selectedCAPA.priority} onValueChange={(v) => setSelectedCAPA({ ...selectedCAPA, priority: v as any })}>
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
                  <Label>Status</Label>
                  <Select value={selectedCAPA.status} onValueChange={(v) => setSelectedCAPA({ ...selectedCAPA, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Input
                    value={selectedCAPA.owner}
                    onChange={(e) => setSelectedCAPA({ ...selectedCAPA, owner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedCAPA.dueDate}
                    onChange={(e) => setSelectedCAPA({ ...selectedCAPA, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Effectiveness</Label>
                  <Select value={selectedCAPA.effectiveness} onValueChange={(v) => setSelectedCAPA({ ...selectedCAPA, effectiveness: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Effective">Effective</SelectItem>
                      <SelectItem value="Partially Effective">Partially Effective</SelectItem>
                      <SelectItem value="Not Effective">Not Effective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete CAPA</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCAPA?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
