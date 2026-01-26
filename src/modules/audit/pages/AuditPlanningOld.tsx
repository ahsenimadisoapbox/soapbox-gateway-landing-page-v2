import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Plus, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ExportAnimation } from '../components/ExportAnimation';
import type { Audit } from '../contexts/AppContext';

export default function AuditPlanning() {
  const { audits, addAudit, updateAudit } = useAudit();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Internal' as Audit['type'],
    startDate: '',
    endDate: '',
    auditors: '',
    checklist: '',
  });

  const filteredAudits = audits.filter(audit => {
    if (typeFilter !== 'all' && audit.type !== typeFilter) return false;
    if (statusFilter !== 'all' && audit.status !== statusFilter) return false;
    return true;
  });

  const handleCreateClick = () => {
    setEditMode(false);
    setFormData({ title: '', type: 'Internal', startDate: '', endDate: '', auditors: '', checklist: '' });
    setShowCreateModal(true);
  };

  const handleEditClick = (audit: Audit) => {
    setEditMode(true);
    setSelectedAudit(audit);
    setFormData({
      title: audit.title,
      type: audit.type,
      startDate: audit.startDate,
      endDate: audit.endDate,
      auditors: audit.auditors.join(', '),
      checklist: audit.checklist || '',
    });
    setShowCreateModal(true);
  };

  const handleSubmit = () => {
    if (editMode && selectedAudit) {
      updateAudit(selectedAudit.id, {
        title: formData.title,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        auditors: formData.auditors.split(',').map(a => a.trim()),
        checklist: formData.checklist,
      });
      toast.success('Audit updated successfully');
    } else {
      const newAudit: Audit = {
        id: `AUD-${String(audits.length + 1).padStart(3, '0')}`,
        title: formData.title,
        type: formData.type,
        status: 'Scheduled',
        startDate: formData.startDate,
        endDate: formData.endDate,
        auditors: formData.auditors.split(',').map(a => a.trim()),
        checklist: formData.checklist,
      };
      addAudit(newAudit);
      toast.success('Audit created successfully');
    }
    setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'default';
      case 'Scheduled': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Audit Planning</h1>
            <p className="text-muted-foreground mt-2">Schedule and manage audit activities</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsExporting(true)} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Schedule
            </Button>
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Audit
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Audit Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="ISO">ISO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader><CardTitle>Audit Schedule ({filteredAudits.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.map(audit => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.id}</TableCell>
                        <TableCell>{audit.title}</TableCell>
                        <TableCell><Badge variant="outline">{audit.type}</Badge></TableCell>
                        <TableCell><Badge variant={getStatusColor(audit.status)}>{audit.status}</Badge></TableCell>
                        <TableCell>{audit.startDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedAudit(audit); setShowViewModal(true); }}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(audit)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedAudit(audit); setShowDeleteModal(true); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader><CardTitle>Calendar View</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Calendar view - Showing {filteredAudits.length} audits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{editMode ? 'Edit Audit' : 'Add New Audit'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Audit Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Audit Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Audit['type'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="ISO">ISO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Checklist</Label>
                <Input value={formData.checklist} onChange={(e) => setFormData({ ...formData, checklist: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Auditors (comma-separated)</Label>
              <Input value={formData.auditors} onChange={(e) => setFormData({ ...formData, auditors: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editMode ? 'Update' : 'Create'} Audit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Audit Details</DialogTitle></DialogHeader>
          {selectedAudit && (
            <div className="space-y-4">
              <div><Label>Audit ID</Label><p className="text-sm">{selectedAudit.id}</p></div>
              <div><Label>Title</Label><p className="text-sm">{selectedAudit.title}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Type</Label><p className="text-sm">{selectedAudit.type}</p></div>
                <div><Label>Status</Label><p className="text-sm">{selectedAudit.status}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this audit?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { toast.success('Audit deleted'); setShowDeleteModal(false); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ExportAnimation isExporting={isExporting} onComplete={() => setIsExporting(false)} />
    </>
  );
}
