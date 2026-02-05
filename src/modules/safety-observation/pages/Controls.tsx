import React, { useState } from 'react';
import { Settings2, Plus } from 'lucide-react';
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
import { controls as initialControls, Control } from '../data/mockData';
import { toast } from 'sonner';

export default function Controls() {
  const [data, setData] = useState<Control[]>(initialControls);
  const [viewItem, setViewItem] = useState<Control | null>(null);
  const [editItem, setEditItem] = useState<Control | null>(null);
  const [deleteItem, setDeleteItem] = useState<Control | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Control>>({});

  const columns: Column<Control>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'category', header: 'Category' },
    { key: 'owner', header: 'Owner' },
    { key: 'lastTested', header: 'Last Tested' },
    { key: 'nextTest', header: 'Next Test' },
    {
      key: 'effectiveness',
      header: 'Effectiveness',
      render: (item) => <StatusBadge status={item.effectiveness} />,
    },
  ];

  const handleAdd = () => {
    const newItem: Control = {
      id: `CTL-${String(data.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      category: formData.category || '',
      effectiveness: (formData.effectiveness as Control['effectiveness']) || 'effective',
      owner: formData.owner || '',
      lastTested: formData.lastTested || '',
      nextTest: formData.nextTest || '',
      description: formData.description || '',
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Control created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Control updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Control deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Controls"
        description="Manage safety controls and measures"
        icon={Settings2}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Control
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
          <DialogHeader><DialogTitle>Control Details</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ID</Label><p className="font-mono">{viewItem.id}</p></div>
                <div><Label className="text-muted-foreground">Effectiveness</Label><div className="mt-1"><StatusBadge status={viewItem.effectiveness} /></div></div>
              </div>
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{viewItem.name}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Category</Label><p>{viewItem.category}</p></div>
                <div><Label className="text-muted-foreground">Owner</Label><p>{viewItem.owner}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Last Tested</Label><p>{viewItem.lastTested}</p></div>
                <div><Label className="text-muted-foreground">Next Test</Label><p>{viewItem.nextTest}</p></div>
              </div>
              <div><Label className="text-muted-foreground">Description</Label><p className="text-sm">{viewItem.description}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Edit Control' : 'Add Control'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={formData.category || ''} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                    <SelectItem value="Hazmat">Hazmat</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Owner</Label><Input value={formData.owner || ''} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Last Tested</Label><Input type="date" value={formData.lastTested || ''} onChange={(e) => setFormData({ ...formData, lastTested: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Next Test</Label><Input type="date" value={formData.nextTest || ''} onChange={(e) => setFormData({ ...formData, nextTest: e.target.value })} /></div>
            </div>
            <div className="grid gap-2">
              <Label>Effectiveness</Label>
              <Select value={formData.effectiveness || ''} onValueChange={(v) => setFormData({ ...formData, effectiveness: v as Control['effectiveness'] })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="effective">Effective</SelectItem>
                  <SelectItem value="partially-effective">Partially Effective</SelectItem>
                  <SelectItem value="ineffective">Ineffective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>{editItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Control" description={`Delete "${deleteItem?.name}"?`} />
    </div>
  );
}
