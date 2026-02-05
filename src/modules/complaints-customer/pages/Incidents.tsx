import { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
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

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  reportedBy: string;
  reportedAt: string;
  site: string;
  linkedComplaints: string[];
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-2025-0042',
    title: 'Device malfunction affecting multiple units',
    description: 'Multiple XR-500 units reported display failures during operation.',
    type: 'Product',
    severity: 'Critical',
    status: 'Investigating',
    reportedBy: 'Sarah Chen',
    reportedAt: '2025-01-03T11:00:00Z',
    site: 'Boston Manufacturing',
    linkedComplaints: ['CMP-2025-0001'],
  },
  {
    id: 'INC-2025-0038',
    title: 'Allergic reaction report - BioSense product line',
    description: 'Customer reported allergic reaction after contact with sensor pads.',
    type: 'Safety',
    severity: 'Critical',
    status: 'Investigating',
    reportedBy: 'Jennifer Walsh',
    reportedAt: '2025-01-02T09:00:00Z',
    site: 'Boston Manufacturing',
    linkedComplaints: ['CMP-2025-0006'],
  },
  {
    id: 'INC-2025-0035',
    title: 'Shipping damage trend identified',
    description: 'Increased reports of packaging damage from Chicago distribution center.',
    type: 'Logistics',
    severity: 'Medium',
    status: 'Open',
    reportedBy: 'Emily Carter',
    reportedAt: '2025-01-01T14:00:00Z',
    site: 'Chicago Distribution',
    linkedComplaints: [],
  },
  {
    id: 'INC-2025-0030',
    title: 'Environmental control system failure',
    description: 'HVAC system malfunction in storage area caused temperature excursion.',
    type: 'Environmental',
    severity: 'High',
    status: 'Resolved',
    reportedBy: 'Mike Rodriguez',
    reportedAt: '2024-12-28T08:00:00Z',
    site: 'San Diego Lab',
    linkedComplaints: [],
  },
  {
    id: 'INC-2025-0025',
    title: 'Data integrity issue in batch records',
    description: 'Discrepancies found in electronic batch records for production run.',
    type: 'Product',
    severity: 'High',
    status: 'Closed',
    reportedBy: 'David Kim',
    reportedAt: '2024-12-20T10:00:00Z',
    site: 'Boston Manufacturing',
    linkedComplaints: [],
  },
];

export default function Incidents() {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    type: 'Product',
    severity: 'Medium' as Incident['severity'],
    site: '',
  });

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    const newId = `INC-2025-${String(incidents.length + 50).padStart(4, '0')}`;
    const incident: Incident = {
      id: newId,
      ...newIncident,
      status: 'Open',
      reportedBy: 'John Doe',
      reportedAt: new Date().toISOString(),
      linkedComplaints: [],
    };
    setIncidents([incident, ...incidents]);
    setIsModalOpen(false);
    setNewIncident({ title: '', description: '', type: 'Product', severity: 'Medium', site: '' });
    toast({ title: 'Incident Created', description: `Incident ${newId} has been created.` });
  };

  const handleEdit = () => {
    if (!selectedIncident) return;
    setIncidents(incidents.map(i => i.id === selectedIncident.id ? selectedIncident : i));
    setIsEditModalOpen(false);
    toast({ title: 'Incident Updated', description: `Incident ${selectedIncident.id} has been updated.` });
  };

  const handleDelete = () => {
    if (!selectedIncident) return;
    setIncidents(incidents.filter(i => i.id !== selectedIncident.id));
    setIsDeleteModalOpen(false);
    setSelectedIncident(null);
    toast({ title: 'Incident Deleted', description: 'The incident has been deleted.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Incidents data is being exported to CSV.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Incidents
          </h1>
          <p className="page-subtitle">Track and manage safety and quality incidents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Incident
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
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
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id} className="data-table-row">
                  <TableCell className="font-medium text-accent">{incident.id}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="line-clamp-1">{incident.title}</p>
                  </TableCell>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      incident.severity === 'Critical' && 'severity-critical',
                      incident.severity === 'High' && 'severity-high',
                      incident.severity === 'Medium' && 'severity-medium',
                      incident.severity === 'Low' && 'severity-low'
                    )}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      incident.status === 'Open' && 'status-open',
                      incident.status === 'Investigating' && 'status-in-progress',
                      incident.status === 'Resolved' && 'status-closed',
                      incident.status === 'Closed' && 'status-closed'
                    )}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.site}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(incident.reportedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => { setSelectedIncident(incident); setIsViewModalOpen(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedIncident(incident); setIsEditModalOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedIncident(incident); setIsDeleteModalOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredIncidents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No incidents found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Incident</DialogTitle>
            <DialogDescription>Report a new incident</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newIncident.title}
                onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                placeholder="Incident title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                placeholder="Describe the incident"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newIncident.type} onValueChange={(v) => setNewIncident({ ...newIncident, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={newIncident.severity} onValueChange={(v) => setNewIncident({ ...newIncident, severity: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={newIncident.site} onValueChange={(v) => setNewIncident({ ...newIncident, site: v })}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boston Manufacturing">Boston Manufacturing</SelectItem>
                  <SelectItem value="Chicago Distribution">Chicago Distribution</SelectItem>
                  <SelectItem value="San Diego Lab">San Diego Lab</SelectItem>
                  <SelectItem value="Corporate HQ">Corporate HQ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newIncident.title || !newIncident.description}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedIncident?.id}</DialogTitle>
            <DialogDescription>Incident Details</DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedIncident.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedIncident.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p>{selectedIncident.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Severity</Label>
                  <Badge className={cn(
                    'mt-1',
                    selectedIncident.severity === 'Critical' && 'severity-critical',
                    selectedIncident.severity === 'High' && 'severity-high',
                    selectedIncident.severity === 'Medium' && 'severity-medium',
                    selectedIncident.severity === 'Low' && 'severity-low'
                  )}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className="mt-1">{selectedIncident.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Site</Label>
                  <p>{selectedIncident.site}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Reported By</Label>
                <p>{selectedIncident.reportedBy}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reported At</Label>
                <p>{new Date(selectedIncident.reportedAt).toLocaleString()}</p>
              </div>
              {selectedIncident.linkedComplaints.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Linked Complaints</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedIncident.linkedComplaints.map(c => (
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
            <DialogTitle>Edit Incident</DialogTitle>
            <DialogDescription>Update incident details</DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={selectedIncident.title}
                  onChange={(e) => setSelectedIncident({ ...selectedIncident, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={selectedIncident.description}
                  onChange={(e) => setSelectedIncident({ ...selectedIncident, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={selectedIncident.type} onValueChange={(v) => setSelectedIncident({ ...selectedIncident, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Environmental">Environmental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select value={selectedIncident.severity} onValueChange={(v) => setSelectedIncident({ ...selectedIncident, severity: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedIncident.status} onValueChange={(v) => setSelectedIncident({ ...selectedIncident, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Investigating">Investigating</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Site</Label>
                  <Select value={selectedIncident.site} onValueChange={(v) => setSelectedIncident({ ...selectedIncident, site: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boston Manufacturing">Boston Manufacturing</SelectItem>
                      <SelectItem value="Chicago Distribution">Chicago Distribution</SelectItem>
                      <SelectItem value="San Diego Lab">San Diego Lab</SelectItem>
                      <SelectItem value="Corporate HQ">Corporate HQ</SelectItem>
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
            <DialogTitle>Delete Incident</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedIncident?.id}? This action cannot be undone.
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
