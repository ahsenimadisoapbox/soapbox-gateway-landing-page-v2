import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { mockCAPAs, CAPA } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function CAPAPage() {
  const [capas, setCAPAs] = useState<CAPA[]>(mockCAPAs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCAPA, setSelectedCAPA] = useState<CAPA | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'corrective',
    owner: '',
    dueDate: '',
    rootCause: '',
    sourceType: '',
    sourceId: '',
  });

  const filteredCAPAs = capas.filter((capa) => {
    const matchesSearch = capa.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || capa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'open': 'bg-warning/15 text-warning',
      'investigation': 'bg-info/15 text-info',
      'implementation': 'bg-primary/15 text-primary',
      'verification': 'bg-success/15 text-success',
      'closed': 'bg-muted text-muted-foreground',
    };
    return (
      <Badge variant="secondary" className={styles[status] || ''}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="secondary" className={type === 'corrective' ? 'bg-destructive/15 text-destructive' : 'bg-info/15 text-info'}>
        {type}
      </Badge>
    );
  };

  const getEffectivenessBadge = (effectiveness?: string) => {
    if (!effectiveness) return null;
    const styles: Record<string, string> = {
      'effective': 'bg-success/15 text-success',
      'ineffective': 'bg-destructive/15 text-destructive',
      'pending': 'bg-muted text-muted-foreground',
    };
    return (
      <Badge variant="secondary" className={styles[effectiveness] || ''}>
        {effectiveness}
      </Badge>
    );
  };

  const handleCreate = () => {
    const newCAPA: CAPA = {
      id: `CAPA-${String(capas.length + 16).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      type: formData.type as CAPA['type'],
      owner: formData.owner,
      dueDate: formData.dueDate,
      rootCause: formData.rootCause,
      sourceType: formData.sourceType,
      sourceId: formData.sourceId,
      status: 'open',
      effectiveness: 'pending',
    };
    setCAPAs([newCAPA, ...capas]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedCAPA) return;
    setCAPAs(capas.map(c =>
      c.id === selectedCAPA.id
        ? { ...c, ...formData, type: formData.type as CAPA['type'] }
        : c
    ));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedCAPA) return;
    setCAPAs(capas.filter(c => c.id !== selectedCAPA.id));
    setIsDeleteOpen(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'corrective', owner: '', dueDate: '', rootCause: '', sourceType: '', sourceId: '' });
  };

  const openView = (capa: CAPA) => {
    setSelectedCAPA(capa);
    setIsViewOpen(true);
  };

  const openEdit = (capa: CAPA) => {
    setSelectedCAPA(capa);
    setFormData({
      title: capa.title,
      description: capa.description,
      type: capa.type,
      owner: capa.owner,
      dueDate: capa.dueDate,
      rootCause: capa.rootCause || '',
      sourceType: capa.sourceType,
      sourceId: capa.sourceId,
    });
    setIsEditOpen(true);
  };

  const openDelete = (capa: CAPA) => {
    setSelectedCAPA(capa);
    setIsDeleteOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CAPA Management</h1>
            <p className="text-muted-foreground">Corrective and Preventive Actions</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New CAPA
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Open CAPAs</p>
                  <p className="kpi-value">{capas.filter(c => c.status !== 'closed').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Investigation</p>
                  <p className="kpi-value">{capas.filter(c => c.status === 'investigation').length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-info/20 flex items-center justify-center">
                  <span className="text-info text-sm font-bold">I</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Verification</p>
                  <p className="kpi-value">{capas.filter(c => c.status === 'verification').length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success text-sm font-bold">V</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Effective</p>
                  <p className="kpi-value">{capas.filter(c => c.effectiveness === 'effective').length}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-success text-sm font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search CAPAs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigation">Investigation</SelectItem>
                  <SelectItem value="implementation">Implementation</SelectItem>
                  <SelectItem value="verification">Verification</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* CAPA Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Effectiveness</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCAPAs.map((capa) => (
                  <TableRow key={capa.id}>
                    <TableCell className="font-mono text-sm">{capa.id}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{capa.title}</TableCell>
                    <TableCell>{getTypeBadge(capa.type)}</TableCell>
                    <TableCell>{capa.owner}</TableCell>
                    <TableCell>{capa.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(capa.status)}</TableCell>
                    <TableCell>{getEffectivenessBadge(capa.effectiveness)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(capa)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(capa)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(capa)}>
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

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New CAPA</DialogTitle>
              <DialogDescription>Create a corrective or preventive action</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="CAPA title" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="preventive">Preventive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Select value={formData.owner} onValueChange={(v) => setFormData({ ...formData, owner: v })}>
                    <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="Mike Rodriguez">Mike Rodriguez</SelectItem>
                      <SelectItem value="Jennifer Walsh">Jennifer Walsh</SelectItem>
                      <SelectItem value="David Kim">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Source Type</Label>
                  <Select value={formData.sourceType} onValueChange={(v) => setFormData({ ...formData, sourceType: v })}>
                    <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Audit">Audit</SelectItem>
                      <SelectItem value="Incident">Incident</SelectItem>
                      <SelectItem value="Complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Root Cause</Label>
                <Textarea value={formData.rootCause} onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })} placeholder="Root cause analysis" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create CAPA</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>CAPA Details</DialogTitle>
            </DialogHeader>
            {selectedCAPA && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">CAPA ID</Label><p className="font-mono">{selectedCAPA.id}</p></div>
                  <div><Label className="text-muted-foreground">Status</Label><div className="mt-1">{getStatusBadge(selectedCAPA.status)}</div></div>
                </div>
                <div><Label className="text-muted-foreground">Title</Label><p className="font-medium">{selectedCAPA.title}</p></div>
                <div><Label className="text-muted-foreground">Description</Label><p className="text-sm">{selectedCAPA.description}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">Type</Label><div className="mt-1">{getTypeBadge(selectedCAPA.type)}</div></div>
                  <div><Label className="text-muted-foreground">Owner</Label><p>{selectedCAPA.owner}</p></div>
                  <div><Label className="text-muted-foreground">Due Date</Label><p>{selectedCAPA.dueDate}</p></div>
                  <div><Label className="text-muted-foreground">Effectiveness</Label><div className="mt-1">{getEffectivenessBadge(selectedCAPA.effectiveness)}</div></div>
                </div>
                {selectedCAPA.rootCause && (
                  <div><Label className="text-muted-foreground">Root Cause</Label><p className="text-sm">{selectedCAPA.rootCause}</p></div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">Source Type</Label><p>{selectedCAPA.sourceType}</p></div>
                  <div><Label className="text-muted-foreground">Source ID</Label><p className="font-mono">{selectedCAPA.sourceId}</p></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit CAPA</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Type</Label><Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="corrective">Corrective</SelectItem><SelectItem value="preventive">Preventive</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Owner</Label><Select value={formData.owner} onValueChange={(v) => setFormData({ ...formData, owner: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="John Doe">John Doe</SelectItem><SelectItem value="Sarah Chen">Sarah Chen</SelectItem><SelectItem value="Mike Rodriguez">Mike Rodriguez</SelectItem><SelectItem value="Jennifer Walsh">Jennifer Walsh</SelectItem><SelectItem value="David Kim">David Kim</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} /></div>
              <div className="space-y-2"><Label>Root Cause</Label><Textarea value={formData.rootCause} onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleEdit}>Save Changes</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete CAPA</DialogTitle>
              <DialogDescription>Are you sure you want to delete "{selectedCAPA?.title}"? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
