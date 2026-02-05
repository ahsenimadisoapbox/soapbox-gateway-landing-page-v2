import React, { useState } from 'react';
import { ClipboardCheck, Plus } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable, Column } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { DeleteConfirmDialog } from '../components/shared/DeleteConfirmDialog';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
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
import { inspections as initialInspections, Inspection } from '../data/mockData';
import { toast } from 'sonner';

export default function Inspections() {
  const [data, setData] = useState<Inspection[]>(initialInspections);
  const [viewItem, setViewItem] = useState<Inspection | null>(null);
  const [editItem, setEditItem] = useState<Inspection | null>(null);
  const [deleteItem, setDeleteItem] = useState<Inspection | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Inspection>>({});

  const columns: Column<Inspection>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'title', header: 'Title', className: 'font-medium' },
    { key: 'type', header: 'Type' },
    { key: 'location', header: 'Location' },
    { key: 'assignedTo', header: 'Assigned To' },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'priority',
      header: 'Priority',
      render: (item) => <StatusBadge status={item.priority} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const handleAdd = () => {
    const newInspection: Inspection = {
      id: `INS-${String(data.length + 1).padStart(3, '0')}`,
      title: formData.title || '',
      type: formData.type || '',
      location: formData.location || '',
      assignedTo: formData.assignedTo || '',
      dueDate: formData.dueDate || '',
      status: (formData.status as Inspection['status']) || 'pending',
      priority: (formData.priority as Inspection['priority']) || 'medium',
      description: formData.description || '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setData([...data, newInspection]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Inspection created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Inspection updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Inspection deleted successfully');
  };

  const openEdit = (item: Inspection) => {
    setFormData(item);
    setEditItem(item);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Inspections"
        description="Manage and track all safety inspections"
        icon={ClipboardCheck}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Inspection
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        keyField="id"
        onView={setViewItem}
        onEdit={openEdit}
        onDelete={setDeleteItem}
      />

      {/* View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inspection Details</DialogTitle>
            <DialogDescription>View inspection information</DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-mono">{viewItem.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={viewItem.status} />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{viewItem.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p>{viewItem.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p>{viewItem.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p>{viewItem.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{viewItem.dueDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Priority</Label>
                <div className="mt-1">
                  <StatusBadge status={viewItem.priority} />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{viewItem.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Inspection' : 'Add New Inspection'}</DialogTitle>
            <DialogDescription>
              {editItem ? 'Update inspection details' : 'Create a new inspection record'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter inspection title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                    <SelectItem value="Hazmat">Hazmat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo || ''}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority || ''}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as Inspection['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Inspection['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter inspection description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
              Cancel
            </Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>
              {editItem ? 'Save Changes' : 'Create Inspection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Inspection"
        description={`Are you sure you want to delete inspection "${deleteItem?.id}"? This action cannot be undone.`}
      />
    </div>
  );
}
