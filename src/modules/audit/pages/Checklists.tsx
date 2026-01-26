import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ClipboardList, Plus, Eye, Pencil, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function Checklists() {
  const { checklists, addChecklist } = useAudit();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    auditType: 'Internal',
    standard: 'ISO 9001',
  });

  const handleCreate = () => {
    const newChecklist = {
      id: `CHK-${String(checklists.length + 1).padStart(3, '0')}`,
      name: formData.name,
      sections: [
        {
          id: 'sec-1',
          title: 'General Requirements',
          items: [
            { id: 'item-1', requirement: 'Sample requirement 1' },
            { id: 'item-2', requirement: 'Sample requirement 2' },
          ],
        },
      ],
    };
    addChecklist(newChecklist);
    toast.success('Checklist created successfully');
    setIsCreateOpen(false);
    setFormData({ name: '', auditType: 'Internal', standard: 'ISO 9001' });
  };

  const handleView = (checklist: any) => {
    setSelectedChecklist(checklist);
    setIsViewOpen(true);
  };

  const handleEdit = (checklist: any) => {
    setSelectedChecklist(checklist);
    setFormData({
      name: checklist.name,
      auditType: 'Internal',
      standard: 'ISO 9001',
    });
    setIsEditOpen(true);
  };

  const handleUseTemplate = (checklist: any) => {
    const newChecklist = {
      ...checklist,
      id: `CHK-${String(checklists.length + 1).padStart(3, '0')}`,
      name: `${checklist.name} (Copy)`,
    };
    addChecklist(newChecklist);
    toast.success('Template copied successfully');
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Checklists</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage audit checklist templates
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Checklist
          </Button>
        </div>

        {/* Checklist Table */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Audit Type</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checklists.map(checklist => {
                  const itemsCount = checklist.sections.reduce(
                    (acc, section) => acc + section.items.length,
                    0
                  );
                  return (
                    <TableRow key={checklist.id}>
                      <TableCell className="font-medium">{checklist.name}</TableCell>
                      <TableCell>ISO Audit</TableCell>
                      <TableCell>{itemsCount}</TableCell>
                      <TableCell>Admin User</TableCell>
                      <TableCell>2025-10-01</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(checklist)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(checklist)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUseTemplate(checklist)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Use Template
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Checklist Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Checklist</DialogTitle>
            <DialogDescription>
              Create a new audit checklist template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Checklist Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter checklist name"
              />
            </div>
            <div>
              <Label>Audit Type</Label>
              <Select
                value={formData.auditType}
                onValueChange={(value) => setFormData({ ...formData, auditType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                  <SelectItem value="ISO">ISO</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Applicable Standard</Label>
              <Select
                value={formData.standard}
                onValueChange={(value) => setFormData({ ...formData, standard: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISO 9001">ISO 9001</SelectItem>
                  <SelectItem value="ISO 14001">ISO 14001</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="FDA CFR Part 11">FDA CFR Part 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Checklist Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedChecklist?.name}</DialogTitle>
            <DialogDescription>Checklist Details (Read-only)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedChecklist?.sections.map((section: any) => (
              <div key={section.id} className="space-y-2">
                <h4 className="font-semibold">{section.title}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {section.items.map((item: any) => (
                    <li key={item.id}>{item.requirement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Checklist Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist</DialogTitle>
            <DialogDescription>Update checklist details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Checklist Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Audit Type</Label>
              <Select
                value={formData.auditType}
                onValueChange={(value) => setFormData({ ...formData, auditType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                  <SelectItem value="ISO">ISO</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Checklist updated successfully');
                setIsEditOpen(false);
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
