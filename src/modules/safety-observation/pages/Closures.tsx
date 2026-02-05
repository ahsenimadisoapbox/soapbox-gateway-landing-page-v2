import React, { useState } from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable, Column } from '../components/shared/DataTable';
import { DeleteConfirmDialog } from '../components/shared/DeleteConfirmDialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { closures as initialClosures, Closure } from '../data/mockData';
import { toast } from 'sonner';

export default function Closures() {
  const [data, setData] = useState<Closure[]>(initialClosures);
  const [viewItem, setViewItem] = useState<Closure | null>(null);
  const [editItem, setEditItem] = useState<Closure | null>(null);
  const [deleteItem, setDeleteItem] = useState<Closure | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Closure>>({});

  const columns: Column<Closure>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'itemType', header: 'Item Type' },
    { key: 'itemId', header: 'Item ID', className: 'font-mono text-sm' },
    { key: 'closedBy', header: 'Closed By' },
    { key: 'closedDate', header: 'Closed Date' },
    { key: 'reason', header: 'Reason', className: 'max-w-xs truncate' },
    {
      key: 'verified',
      header: 'Verified',
      render: (item) => (
        <Badge variant={item.verified ? 'default' : 'secondary'} className={item.verified ? 'bg-success text-success-foreground' : ''}>
          {item.verified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    const newItem: Closure = {
      id: `CLO-${String(data.length + 1).padStart(3, '0')}`,
      itemType: formData.itemType || '',
      itemId: formData.itemId || '',
      closedBy: formData.closedBy || '',
      closedDate: formData.closedDate || '',
      reason: formData.reason || '',
      evidence: formData.evidence || '',
      verified: formData.verified || false,
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Closure created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Closure updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Closure deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Closures"
        description="Track item closures and verifications"
        icon={CheckCircle2}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Closure
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
          <DialogHeader><DialogTitle>Closure Details</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ID</Label><p className="font-mono">{viewItem.id}</p></div>
                <div><Label className="text-muted-foreground">Verified</Label><Badge variant={viewItem.verified ? 'default' : 'secondary'} className={viewItem.verified ? 'bg-success text-success-foreground mt-1' : 'mt-1'}>{viewItem.verified ? 'Yes' : 'No'}</Badge></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Item Type</Label><p>{viewItem.itemType}</p></div>
                <div><Label className="text-muted-foreground">Item ID</Label><p className="font-mono">{viewItem.itemId}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Closed By</Label><p>{viewItem.closedBy}</p></div>
                <div><Label className="text-muted-foreground">Closed Date</Label><p>{viewItem.closedDate}</p></div>
              </div>
              <div><Label className="text-muted-foreground">Reason</Label><p className="text-sm">{viewItem.reason}</p></div>
              <div><Label className="text-muted-foreground">Evidence</Label><p className="text-sm">{viewItem.evidence}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Edit Closure' : 'Add Closure'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Item Type</Label>
                <Select value={formData.itemType || ''} onValueChange={(v) => setFormData({ ...formData, itemType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="Inspection">Inspection</SelectItem><SelectItem value="Mitigation">Mitigation</SelectItem><SelectItem value="Audit">Audit</SelectItem><SelectItem value="Assessment">Assessment</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Item ID</Label><Input value={formData.itemId || ''} onChange={(e) => setFormData({ ...formData, itemId: e.target.value })} placeholder="e.g., INS-001" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Closed By</Label><Input value={formData.closedBy || ''} onChange={(e) => setFormData({ ...formData, closedBy: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Closed Date</Label><Input type="date" value={formData.closedDate || ''} onChange={(e) => setFormData({ ...formData, closedDate: e.target.value })} /></div>
            </div>
            <div className="grid gap-2"><Label>Reason</Label><Textarea value={formData.reason || ''} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} rows={2} /></div>
            <div className="grid gap-2"><Label>Evidence</Label><Textarea value={formData.evidence || ''} onChange={(e) => setFormData({ ...formData, evidence: e.target.value })} rows={2} /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="verified" checked={formData.verified || false} onCheckedChange={(checked) => setFormData({ ...formData, verified: !!checked })} />
              <Label htmlFor="verified">Verified</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>{editItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Closure" description={`Delete closure "${deleteItem?.id}"?`} />
    </div>
  );
}
