import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable, Column } from '../components/shared/DataTable';
import { StatusBadge } from '../components/shared/StatusBadge';
import { DeleteConfirmDialog } from '../components/shared/DeleteConfirmDialog';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { mitigations as initialMitigations, Mitigation } from '../data/mockData';
import { toast } from 'sonner';

export default function Mitigations() {
  const [data, setData] = useState<Mitigation[]>(initialMitigations);
  const [viewItem, setViewItem] = useState<Mitigation | null>(null);
  const [editItem, setEditItem] = useState<Mitigation | null>(null);
  const [deleteItem, setDeleteItem] = useState<Mitigation | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Mitigation>>({});

  const columns: Column<Mitigation>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'risk', header: 'Risk', className: 'font-medium' },
    { key: 'action', header: 'Action', className: 'max-w-xs truncate' },
    { key: 'owner', header: 'Owner' },
    { key: 'dueDate', header: 'Due Date' },
    {
      key: 'progress',
      header: 'Progress',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Progress value={item.progress} className="w-16 h-2" />
          <span className="text-sm">{item.progress}%</span>
        </div>
      ),
    },
    { key: 'priority', header: 'Priority', render: (item) => <StatusBadge status={item.priority} /> },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  ];

  const handleAdd = () => {
    const newItem: Mitigation = {
      id: `MIT-${String(data.length + 1).padStart(3, '0')}`,
      risk: formData.risk || '',
      action: formData.action || '',
      owner: formData.owner || '',
      dueDate: formData.dueDate || '',
      status: (formData.status as Mitigation['status']) || 'open',
      priority: (formData.priority as Mitigation['priority']) || 'medium',
      progress: formData.progress || 0,
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Mitigation created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Mitigation updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Mitigation deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Mitigations"
        description="Track risk mitigation actions"
        icon={AlertTriangle}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mitigation
          </Button>
        }
      />

      <DataTable
        data={data}
        columns={columns}
        keyField="id"
        onView={setViewItem}
        onEdit={(item) => { setFormData(item); setEditItem(item); }}
        onDelete={setDeleteItem}
      />

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Mitigation Details</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ID</Label><p className="font-mono">{viewItem.id}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1"><StatusBadge status={viewItem.status} /></div></div>
              </div>
              <div><Label className="text-muted-foreground">Risk</Label><p className="font-medium">{viewItem.risk}</p></div>
              <div><Label className="text-muted-foreground">Action</Label><p>{viewItem.action}</p></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label className="text-muted-foreground">Owner</Label><p>{viewItem.owner}</p></div>
                <div><Label className="text-muted-foreground">Due Date</Label><p>{viewItem.dueDate}</p></div>
                <div><Label className="text-muted-foreground">Priority</Label><div className="mt-1"><StatusBadge status={viewItem.priority} /></div></div>
              </div>
              <div><Label className="text-muted-foreground">Progress</Label><div className="flex items-center gap-2 mt-1"><Progress value={viewItem.progress} className="flex-1 h-2" /><span>{viewItem.progress}%</span></div></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Edit Mitigation' : 'Add Mitigation'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Risk</Label><Input value={formData.risk || ''} onChange={(e) => setFormData({ ...formData, risk: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Action</Label><Input value={formData.action || ''} onChange={(e) => setFormData({ ...formData, action: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Owner</Label><Input value={formData.owner || ''} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Due Date</Label><Input type="date" value={formData.dueDate || ''} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Priority</Label>
                <Select value={formData.priority || ''} onValueChange={(v) => setFormData({ ...formData, priority: v as Mitigation['priority'] })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status || ''} onValueChange={(v) => setFormData({ ...formData, status: v as Mitigation['status'] })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="overdue">Overdue</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Progress (%)</Label><Input type="number" min="0" max="100" value={formData.progress || 0} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>{editItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Mitigation" description={`Delete mitigation for "${deleteItem?.risk}"?`} />
    </div>
  );
}
