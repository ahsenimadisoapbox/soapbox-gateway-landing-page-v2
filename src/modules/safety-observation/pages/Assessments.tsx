import React, { useState } from 'react';
import { FileCheck, Plus } from 'lucide-react';
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
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { assessments as initialAssessments, Assessment } from '../data/mockData';
import { toast } from 'sonner';

export default function Assessments() {
  const [data, setData] = useState<Assessment[]>(initialAssessments);
  const [viewItem, setViewItem] = useState<Assessment | null>(null);
  const [editItem, setEditItem] = useState<Assessment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Assessment | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Assessment>>({});

  const columns: Column<Assessment>[] = [
    { key: 'id', header: 'ID', className: 'font-mono text-sm' },
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'type', header: 'Type' },
    {
      key: 'score',
      header: 'Score',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Progress value={(item.score / item.maxScore) * 100} className="w-16 h-2" />
          <span className="text-sm">{item.score}/{item.maxScore}</span>
        </div>
      ),
    },
    { key: 'assessor', header: 'Assessor' },
    { key: 'date', header: 'Date' },
    { key: 'findings', header: 'Findings' },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const handleAdd = () => {
    const newItem: Assessment = {
      id: `ASS-${String(data.length + 1).padStart(3, '0')}`,
      name: formData.name || '',
      type: formData.type || '',
      score: formData.score || 0,
      maxScore: formData.maxScore || 100,
      assessor: formData.assessor || '',
      date: formData.date || '',
      status: (formData.status as Assessment['status']) || 'draft',
      findings: formData.findings || 0,
    };
    setData([...data, newItem]);
    setIsAddOpen(false);
    setFormData({});
    toast.success('Assessment created successfully');
  };

  const handleEdit = () => {
    if (!editItem) return;
    setData(data.map((item) => (item.id === editItem.id ? { ...item, ...formData } : item)));
    setEditItem(null);
    setFormData({});
    toast.success('Assessment updated successfully');
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success('Assessment deleted successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Assessments"
        description="Manage safety and risk assessments"
        icon={FileCheck}
        actions={
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Assessment
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

      {/* View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">ID</Label><p className="font-mono">{viewItem.id}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1"><StatusBadge status={viewItem.status} /></div></div>
              </div>
              <div><Label className="text-muted-foreground">Name</Label><p className="font-medium">{viewItem.name}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Type</Label><p>{viewItem.type}</p></div>
                <div><Label className="text-muted-foreground">Assessor</Label><p>{viewItem.assessor}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label className="text-muted-foreground">Score</Label><p>{viewItem.score}/{viewItem.maxScore}</p></div>
                <div><Label className="text-muted-foreground">Date</Label><p>{viewItem.date}</p></div>
                <div><Label className="text-muted-foreground">Findings</Label><p>{viewItem.findings}</p></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewItem(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || !!editItem} onOpenChange={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Assessment' : 'Add Assessment'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Assessment name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={formData.type || ''} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Culture">Culture</SelectItem>
                    <SelectItem value="Hazard">Hazard</SelectItem>
                    <SelectItem value="Ergonomic">Ergonomic</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Assessor</Label>
                <Input value={formData.assessor || ''} onChange={(e) => setFormData({ ...formData, assessor: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Score</Label>
                <Input type="number" value={formData.score || 0} onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Max Score</Label>
                <Input type="number" value={formData.maxScore || 100} onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Findings</Label>
                <Input type="number" value={formData.findings || 0} onChange={(e) => setFormData({ ...formData, findings: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status || ''} onValueChange={(v) => setFormData({ ...formData, status: v as Assessment['status'] })}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsAddOpen(false); setEditItem(null); setFormData({}); }}>Cancel</Button>
            <Button onClick={editItem ? handleEdit : handleAdd}>{editItem ? 'Save Changes' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)} onConfirm={handleDelete} title="Delete Assessment" description={`Delete "${deleteItem?.name}"?`} />
    </div>
  );
}
