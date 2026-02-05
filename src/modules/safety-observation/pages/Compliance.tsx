import React, { useState } from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
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
import { compliances as initialCompliances, Compliance } from '../data/mockData';
import { toast } from 'sonner';

export default function CompliancePage() {
  const [data, setData] = useState<Compliance[]>(initialCompliances);
  const [viewItem, setViewItem] = useState<Compliance | null>(null);
  const [editItem, setEditItem] = useState<Compliance | null>(null);
  const [deleteItem, setDeleteItem] = useState<Compliance | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Compliance>>({});

  const columns: Column<Compliance>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'requirement', header: 'Requirement', className: 'font-medium max-w-xs truncate' },
    { key: 'regulation', header: 'Regulation' },
    { key: 'owner', header: 'Owner' },
    { key: 'lastReview', header: 'Last Review' },
    { key: 'nextReview', header: 'Next Review' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const handleAdd = () => {
    const newItem: Compliance = {
      id: `CMP-${String(data.length + 1).padStart(3, '0')}`,
      requirement: formData.requirement || '',
      regulation: formData.regulation || '',
      status: (formData.status as Compliance['status']) || 'pending-review',
      lastReview: formData.lastReview || '',
      nextReview: formData.nextReview || '',
      owner: formData.owner || '',
      notes: formData.notes || '',
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Compliance record created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Compliance record updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Compliance record deleted successfully');
  };

  const openEdit = (item: Compliance) => {
    setFormData(item);
    setEditItem(item);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Compliance"
        description="Track regulatory compliance requirements"
        icon={ShieldCheck}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Compliance
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
            <DialogTitle>Compliance Details</DialogTitle>
            <DialogDescription>View compliance information</DialogDescription>
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
                <Label className="text-muted-foreground">Requirement</Label>
                <p className="font-medium">{viewItem.requirement}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Regulation</Label>
                <p>{viewItem.regulation}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p>{viewItem.owner}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Review</Label>
                  <p>{viewItem.lastReview}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Next Review</Label>
                  <p>{viewItem.nextReview}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Notes</Label>
                <p className="text-sm">{viewItem.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Compliance' : 'Add Compliance Record'}</DialogTitle>
            <DialogDescription>{editItem ? 'Update compliance details' : 'Create a new compliance record'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="requirement">Requirement</Label>
              <Input
                id="requirement"
                value={formData.requirement || ''}
                onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                placeholder="Enter requirement"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="regulation">Regulation</Label>
              <Input
                id="regulation"
                value={formData.regulation || ''}
                onChange={(e) => setFormData({ ...formData, regulation: e.target.value })}
                placeholder="e.g., OSHA 29 CFR 1910.155"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={formData.owner || ''}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Enter owner name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || ''}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Compliance['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lastReview">Last Review</Label>
                <Input
                  id="lastReview"
                  type="date"
                  value={formData.lastReview || ''}
                  onChange={(e) => setFormData({ ...formData, lastReview: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextReview">Next Review</Label>
                <Input
                  id="nextReview"
                  type="date"
                  value={formData.nextReview || ''}
                  onChange={(e) => setFormData({ ...formData, nextReview: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter notes"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>
              {editItem ? 'Save Changes' : 'Create Record'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Delete Compliance Record"
        description={`Are you sure you want to delete "${deleteItem?.requirement}"?`}
      />
    </div>
  );
}
