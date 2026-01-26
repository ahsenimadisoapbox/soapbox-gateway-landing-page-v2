import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Users, Plus, Eye, Pencil } from 'lucide-react';
import { toast } from 'sonner';

export default function Auditors() {
  const { users } = useAudit();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAuditor, setSelectedAuditor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Auditor',
    qualifications: '',
  });

  // Filter only auditor-related users
  const auditors = users.filter(u => 
    u.role.includes('Auditor') || u.role.includes('Compliance')
  );

  const handleAddAuditor = () => {
    toast.success('Auditor added successfully');
    setIsAddOpen(false);
    setFormData({ name: '', email: '', role: 'Auditor', qualifications: '' });
  };

  const handleView = (auditor: any) => {
    setSelectedAuditor(auditor);
    setIsViewOpen(true);
  };

  const handleEdit = (auditor: any) => {
    setSelectedAuditor(auditor);
    setFormData({
      name: auditor.name,
      email: auditor.email,
      role: auditor.role,
      qualifications: 'ISO 9001, ISO 14001',
    });
    setIsEditOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Auditors</h1>
            <p className="text-muted-foreground mt-2">
              Manage auditor profiles and qualifications
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Auditor
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Auditor Directory</CardTitle>
          </CardHeader>
          <CardContent>
            {auditors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No auditors found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Qualifications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditors.map(auditor => (
                    <TableRow key={auditor.id}>
                      <TableCell className="font-medium">{auditor.name}</TableCell>
                      <TableCell>{auditor.email}</TableCell>
                      <TableCell>{auditor.role}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          ISO 9001, ISO 14001
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={auditor.status === 'Active' ? 'default' : 'secondary'}>
                          {auditor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(auditor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(auditor)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Auditor Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Auditor</DialogTitle>
            <DialogDescription>Create a new auditor profile</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter auditor name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="auditor@example.com"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead Auditor">Lead Auditor</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Qualifications</Label>
              <Input
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="e.g., ISO 9001, ISO 14001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAuditor}>Add Auditor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Auditor Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auditor Details</DialogTitle>
            <DialogDescription>View auditor profile information</DialogDescription>
          </DialogHeader>
          {selectedAuditor && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm mt-1">{selectedAuditor.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm mt-1">{selectedAuditor.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-sm mt-1">{selectedAuditor.role}</p>
              </div>
              <div>
                <Label>Qualifications</Label>
                <p className="text-sm mt-1">ISO 9001, ISO 14001</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={selectedAuditor.status === 'Active' ? 'default' : 'secondary'}>
                  {selectedAuditor.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Auditor Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Auditor</DialogTitle>
            <DialogDescription>Update auditor profile information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead Auditor">Lead Auditor</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Qualifications</Label>
              <Input
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Auditor updated successfully');
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
