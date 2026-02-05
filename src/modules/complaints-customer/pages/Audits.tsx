import { useState } from 'react';
import {
  FileSearch,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
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

interface Audit {
  id: string;
  title: string;
  description: string;
  type: 'Internal' | 'External' | 'Supplier' | 'Regulatory';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  auditee: string;
  auditor: string;
  scheduledDate: string;
  completedDate?: string;
  site: string;
  findings: number;
  linkedComplaints: string[];
}

const mockAudits: Audit[] = [
  {
    id: 'AUD-2025-0015',
    title: 'ISO 13485 Annual Surveillance Audit',
    description: 'Annual surveillance audit for ISO 13485 certification maintenance.',
    type: 'External',
    status: 'Scheduled',
    auditee: 'Boston Manufacturing',
    auditor: 'TÜV SÜD',
    scheduledDate: '2025-02-15',
    site: 'Boston Manufacturing',
    findings: 0,
    linkedComplaints: [],
  },
  {
    id: 'AUD-2025-0012',
    title: 'Supplier Quality Audit - Component Vendor',
    description: 'Quality system audit of primary component supplier.',
    type: 'Supplier',
    status: 'In Progress',
    auditee: 'TechParts Inc.',
    auditor: 'Sarah Chen',
    scheduledDate: '2025-01-10',
    site: 'Supplier Site',
    findings: 2,
    linkedComplaints: [],
  },
  {
    id: 'AUD-2025-0010',
    title: 'Internal Process Audit - Production',
    description: 'Quarterly internal audit of production processes.',
    type: 'Internal',
    status: 'Completed',
    auditee: 'Production Department',
    auditor: 'David Kim',
    scheduledDate: '2025-01-05',
    completedDate: '2025-01-06',
    site: 'Boston Manufacturing',
    findings: 3,
    linkedComplaints: ['CMP-2025-0001'],
  },
  {
    id: 'AUD-2024-0095',
    title: 'FDA 21 CFR Part 820 Inspection Prep',
    description: 'Pre-inspection readiness assessment for FDA audit.',
    type: 'Regulatory',
    status: 'Completed',
    auditee: 'Quality Assurance',
    auditor: 'External Consultant',
    scheduledDate: '2024-12-15',
    completedDate: '2024-12-18',
    site: 'Corporate HQ',
    findings: 5,
    linkedComplaints: [],
  },
  {
    id: 'AUD-2024-0090',
    title: 'Distribution Center Process Audit',
    description: 'Internal audit of distribution and logistics processes.',
    type: 'Internal',
    status: 'Completed',
    auditee: 'Chicago Distribution',
    auditor: 'Mike Rodriguez',
    scheduledDate: '2024-12-10',
    completedDate: '2024-12-11',
    site: 'Chicago Distribution',
    findings: 1,
    linkedComplaints: ['CMP-2025-0002'],
  },
];

export default function Audits() {
  const { toast } = useToast();
  const [audits, setAudits] = useState<Audit[]>(mockAudits);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [newAudit, setNewAudit] = useState({
    title: '',
    description: '',
    type: 'Internal' as Audit['type'],
    auditee: '',
    auditor: '',
    scheduledDate: '',
    site: '',
  });

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesType = typeFilter === 'all' || audit.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const scheduledCount = audits.filter(a => a.status === 'Scheduled').length;
  const inProgressCount = audits.filter(a => a.status === 'In Progress').length;
  const completedCount = audits.filter(a => a.status === 'Completed').length;
  const totalFindings = audits.reduce((sum, a) => sum + a.findings, 0);

  const handleCreate = () => {
    const newId = `AUD-2025-${String(audits.length + 20).padStart(4, '0')}`;
    const audit: Audit = {
      id: newId,
      ...newAudit,
      status: 'Scheduled',
      findings: 0,
      linkedComplaints: [],
    };
    setAudits([audit, ...audits]);
    setIsModalOpen(false);
    setNewAudit({ title: '', description: '', type: 'Internal', auditee: '', auditor: '', scheduledDate: '', site: '' });
    toast({ title: 'Audit Created', description: `Audit ${newId} has been scheduled.` });
  };

  const handleEdit = () => {
    if (!selectedAudit) return;
    setAudits(audits.map(a => a.id === selectedAudit.id ? selectedAudit : a));
    setIsEditModalOpen(false);
    toast({ title: 'Audit Updated', description: `Audit ${selectedAudit.id} has been updated.` });
  };

  const handleDelete = () => {
    if (!selectedAudit) return;
    setAudits(audits.filter(a => a.id !== selectedAudit.id));
    setIsDeleteModalOpen(false);
    setSelectedAudit(null);
    toast({ title: 'Audit Deleted', description: 'The audit has been deleted.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Audit data is being exported to CSV.' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-info" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileSearch className="h-6 w-6" />
            Audits
          </h1>
          <p className="page-subtitle">Manage audit schedules and findings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Audit
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-warning" />
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
            <p className="text-2xl font-bold mt-1">{scheduledCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-info" />
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
            <p className="text-2xl font-bold mt-1">{inProgressCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <p className="text-2xl font-bold mt-1">{completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Total Findings</p>
            </div>
            <p className="text-2xl font-bold mt-1">{totalFindings}</p>
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
                placeholder="Search audits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="External">External</SelectItem>
                <SelectItem value="Supplier">Supplier</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead className="text-center">Findings</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAudits.map((audit) => (
                <TableRow key={audit.id} className="data-table-row">
                  <TableCell className="font-medium text-accent">{audit.id}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="line-clamp-1">{audit.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{audit.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(audit.status)}
                      <Badge variant="outline" className={cn(
                        audit.status === 'Scheduled' && 'bg-warning/10 text-warning border-warning',
                        audit.status === 'In Progress' && 'bg-info/10 text-info border-info',
                        audit.status === 'Completed' && 'bg-success/10 text-success border-success'
                      )}>
                        {audit.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(audit.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={audit.findings > 0 ? "destructive" : "outline"}>
                      {audit.findings}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedAudit(audit); setIsViewModalOpen(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedAudit(audit); setIsEditModalOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedAudit(audit); setIsDeleteModalOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredAudits.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileSearch className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No audits found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Audit</DialogTitle>
            <DialogDescription>Schedule a new audit</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newAudit.title}
                onChange={(e) => setNewAudit({ ...newAudit, title: e.target.value })}
                placeholder="Audit title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newAudit.description}
                onChange={(e) => setNewAudit({ ...newAudit, description: e.target.value })}
                placeholder="Describe the audit scope"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newAudit.type} onValueChange={(v) => setNewAudit({ ...newAudit, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={newAudit.scheduledDate}
                  onChange={(e) => setNewAudit({ ...newAudit, scheduledDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Auditee</Label>
                <Input
                  value={newAudit.auditee}
                  onChange={(e) => setNewAudit({ ...newAudit, auditee: e.target.value })}
                  placeholder="Department or entity"
                />
              </div>
              <div className="space-y-2">
                <Label>Auditor</Label>
                <Input
                  value={newAudit.auditor}
                  onChange={(e) => setNewAudit({ ...newAudit, auditor: e.target.value })}
                  placeholder="Auditor name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={newAudit.site} onValueChange={(v) => setNewAudit({ ...newAudit, site: v })}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boston Manufacturing">Boston Manufacturing</SelectItem>
                  <SelectItem value="Chicago Distribution">Chicago Distribution</SelectItem>
                  <SelectItem value="San Diego Lab">San Diego Lab</SelectItem>
                  <SelectItem value="Corporate HQ">Corporate HQ</SelectItem>
                  <SelectItem value="Supplier Site">Supplier Site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newAudit.title}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedAudit?.id}</DialogTitle>
            <DialogDescription>Audit Details</DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedAudit.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedAudit.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedAudit.type}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedAudit.status)}
                    <span>{selectedAudit.status}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Auditee</Label>
                  <p>{selectedAudit.auditee}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Auditor</Label>
                  <p>{selectedAudit.auditor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Scheduled Date</Label>
                  <p>{new Date(selectedAudit.scheduledDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Site</Label>
                  <p>{selectedAudit.site}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Findings</Label>
                <Badge variant={selectedAudit.findings > 0 ? "destructive" : "outline"} className="mt-1">
                  {selectedAudit.findings} finding(s)
                </Badge>
              </div>
              {selectedAudit.linkedComplaints.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Linked Complaints</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedAudit.linkedComplaints.map(c => (
                      <Badge key={c} variant="outline">{c}</Badge>
                    ))}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Audit</DialogTitle>
            <DialogDescription>Update audit details</DialogDescription>
          </DialogHeader>
          {selectedAudit && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={selectedAudit.title}
                  onChange={(e) => setSelectedAudit({ ...selectedAudit, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedAudit.description}
                  onChange={(e) => setSelectedAudit({ ...selectedAudit, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={selectedAudit.type} onValueChange={(v) => setSelectedAudit({ ...selectedAudit, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                      <SelectItem value="Supplier">Supplier</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedAudit.status} onValueChange={(v) => setSelectedAudit({ ...selectedAudit, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Auditee</Label>
                  <Input
                    value={selectedAudit.auditee}
                    onChange={(e) => setSelectedAudit({ ...selectedAudit, auditee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auditor</Label>
                  <Input
                    value={selectedAudit.auditor}
                    onChange={(e) => setSelectedAudit({ ...selectedAudit, auditor: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={selectedAudit.scheduledDate}
                    onChange={(e) => setSelectedAudit({ ...selectedAudit, scheduledDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Findings Count</Label>
                  <Input
                    type="number"
                    min="0"
                    value={selectedAudit.findings}
                    onChange={(e) => setSelectedAudit({ ...selectedAudit, findings: parseInt(e.target.value) || 0 })}
                  />
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
            <DialogTitle>Delete Audit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAudit?.id}? This action cannot be undone.
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
