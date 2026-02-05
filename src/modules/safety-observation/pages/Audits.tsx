import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
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
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { audits as initialAudits, Audit } from '../data/mockData';
import { toast } from 'sonner';

export default function Audits() {
  const [data, setData] = useState<Audit[]>(initialAudits);
  const [viewItem, setViewItem] = useState<Audit | null>(null);
  const [editItem, setEditItem] = useState<Audit | null>(null);
  const [deleteItem, setDeleteItem] = useState<Audit | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Audit>>({});

  const columns: Column<Audit>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'type', header: 'Type', render: (item) => <StatusBadge status={item.type} /> },
    { key: 'auditor', header: 'Auditor' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'findings', header: 'Findings' },
    { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  ];

  const handleAdd = () => {
    const newItem: Audit = {
      id: `AUD-${String(data.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      type: (formData.type as Audit['type']) || 'internal',
      auditor: formData.auditor || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      status: (formData.status as Audit['status']) || 'planned',
      findings: formData.findings || 0,
      scope: formData.scope || '',
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Audit created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Audit updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Audit deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Audits"
        description="Manage internal and external audits"
        icon={FileText}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Audit
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
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Audit Details</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ID</Label><p className="font-mono">{viewItem.id}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1"><StatusBadge status={viewItem.status} /></div></div>
              </div>
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{viewItem.name}</p></div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label className="text-muted-foreground">Type</Label><div className="mt-1"><StatusBadge status={viewItem.type} /></div></div>
                <div><Label className="text-muted-foreground">Auditor</Label><p>{viewItem.auditor}</p></div>
                <div><Label className="text-muted-foreground">Findings</Label><p>{viewItem.findings}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Start Date</Label><p>{viewItem.startDate}</p></div>
                <div><Label className="text-muted-foreground">End Date</Label><p>{viewItem.endDate}</p></div>
              </div>
              <div><Label className="text-muted-foreground">Scope</Label><p className="text-sm">{viewItem.scope}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Edit Audit' : 'Add Audit'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={formData.type || ''} onValueChange={(v) => setFormData({ ...formData, type: v as Audit['type'] })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="internal">Internal</SelectItem><SelectItem value="external">External</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Auditor</Label><Input value={formData.auditor || ''} onChange={(e) => setFormData({ ...formData, auditor: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Start Date</Label><Input type="date" value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} /></div>
              <div className="grid gap-2"><Label>End Date</Label><Input type="date" value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status || ''} onValueChange={(v) => setFormData({ ...formData, status: v as Audit['status'] })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="planned">Planned</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Findings</Label><Input type="number" value={formData.findings || 0} onChange={(e) => setFormData({ ...formData, findings: Number(e.target.value) })} /></div>
            </div>
            <div className="grid gap-2"><Label>Scope</Label><Textarea value={formData.scope || ''} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>{editItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Audit" description={`Delete "${deleteItem?.name}"?`} />
    </div>
  );
}
