import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, Plus, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ExportAnimation } from '../components/ExportAnimation';
import type { Audit } from '../contexts/AppContext';

export default function AuditPlanningEnhanced() {
  const { audits, addAudit, updateAudit, checklists, users } = useAudit();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Internal' as Audit['type'],
    status: 'Scheduled' as Audit['status'],
    startDate: '',
    endDate: '',
    auditors: [] as string[],
    checklist: '',
    recurrence: '',
  });

  // Apply filters
  const filteredAudits = audits.filter(audit => {
    if (typeFilter !== 'all' && audit.type !== typeFilter) return false;
    if (statusFilter !== 'all' && audit.status !== statusFilter) return false;
    if (startDateFilter && audit.startDate < startDateFilter) return false;
    if (endDateFilter && audit.endDate > endDateFilter) return false;
    return true;
  });

  const handleCreateClick = () => {
    setFormData({
      title: '',
      type: 'Internal',
      status: 'Scheduled',
      startDate: '',
      endDate: '',
      auditors: [],
      checklist: '',
      recurrence: '',
    });
    setShowCreateModal(true);
  };

  const handleViewClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setShowViewModal(true);
  };

  const handleEditClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setFormData({
      title: audit.title,
      type: audit.type,
      status: audit.status,
      startDate: audit.startDate,
      endDate: audit.endDate,
      auditors: audit.auditors,
      checklist: audit.checklist || '',
      recurrence: audit.recurrence || '',
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (audit: Audit) => {
    setSelectedAudit(audit);
    setShowDeleteModal(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newAudit: Audit = {
      id: `AUD-${String(audits.length + 1).padStart(3, '0')}`,
      ...formData,
    };

    addAudit(newAudit);
    toast.success('Audit created successfully');
    setShowCreateModal(false);
  };

  const handleUpdate = () => {
    if (!selectedAudit) return;
    updateAudit(selectedAudit.id, formData);
    toast.success('Audit updated successfully');
    setShowEditModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'secondary';
      case 'In Progress': return 'default';
      case 'Scheduled': return 'outline';
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
            <p className="text-muted-foreground mt-2">
              Schedule and manage audit activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsExporting(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Audit
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Audit Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="ISO">ISO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date (From)</Label>
                <Input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
              </div>
              <div>
                <Label>End Date (To)</Label>
                <Input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button variant={view === 'list' ? 'default' : 'outline'} onClick={() => setView('list')}>
            List View
          </Button>
          <Button variant={view === 'calendar' ? 'default' : 'outline'} onClick={() => setView('calendar')}>
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
        </div>

        {/* Audit List */}
        {view === 'list' && (
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Audits ({filteredAudits.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Audit ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Auditors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits.map(audit => (
                    <TableRow key={audit.id}>
                      <TableCell className="font-medium">{audit.id}</TableCell>
                      <TableCell>{audit.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{audit.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(audit.status)}>
                          {audit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{audit.startDate}</TableCell>
                      <TableCell>{audit.endDate}</TableCell>
                      <TableCell>{audit.auditors.join(', ')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewClick(audit)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(audit)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(audit)}>
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
        )}

        {/* Calendar View (simplified) */}
        {view === 'calendar' && (
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {filteredAudits.map(audit => (
                  <div
                    key={audit.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleViewClick(audit)}
                  >
                    <div className="font-medium text-sm">{audit.title}</div>
                    <div className="text-xs text-muted-foreground">{audit.startDate}</div>
                    <Badge variant={getStatusColor(audit.status)} className="mt-1 text-xs">
                      {audit.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={() => {
        setShowCreateModal(false);
        setShowEditModal(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{showEditModal ? 'Edit Audit' : 'Create New Audit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title*</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type*</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="ISO">ISO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status*</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date*</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>End Date*</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Checklist Template</Label>
              <Select value={formData.checklist} onValueChange={(value) => setFormData({ ...formData, checklist: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a checklist" />
                </SelectTrigger>
                <SelectContent>
                  {checklists.map(checklist => (
                    <SelectItem key={checklist.id} value={checklist.id}>
                      {checklist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
              }}>
                Cancel
              </Button>
              <Button onClick={showEditModal ? handleUpdate : handleSubmit}>
                {showEditModal ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Details</DialogTitle>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-3">
              <div><strong>ID:</strong> {selectedAudit.id}</div>
              <div><strong>Title:</strong> {selectedAudit.title}</div>
              <div><strong>Type:</strong> {selectedAudit.type}</div>
              <div><strong>Status:</strong> {selectedAudit.status}</div>
              <div><strong>Start Date:</strong> {selectedAudit.startDate}</div>
              <div><strong>End Date:</strong> {selectedAudit.endDate}</div>
              <div><strong>Auditors:</strong> {selectedAudit.auditors.join(', ')}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this audit?</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              toast.success('Audit deleted');
              setShowDeleteModal(false);
            }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ExportAnimation isExporting={isExporting} onComplete={() => setIsExporting(false)} />
    </>
  );
}
