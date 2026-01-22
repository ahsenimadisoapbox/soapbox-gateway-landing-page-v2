import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { mockAttendance, Attendance } from '../data/mockData';
import { cn } from '../lib/utils';
import { toast } from '../hooks/use-toast';

export function Attendance() {
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [formData, setFormData] = useState({
    status: 'present',
    justification: '',
  });

  const filteredAttendance = attendance.filter((att) => {
    const matchesSearch = att.participantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || att.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      'present': { class: 'bg-success/15 text-success', icon: <CheckCircle2 className="h-3 w-3" /> },
      'absent': { class: 'bg-destructive/15 text-destructive', icon: <XCircle className="h-3 w-3" /> },
      'excused': { class: 'bg-warning/15 text-warning', icon: <AlertCircle className="h-3 w-3" /> },
    };
    const style = styles[status] || styles['present'];
    return (
      <Badge variant="secondary" className={cn('gap-1', style.class)}>
        {style.icon}
        {status}
      </Badge>
    );
  };

  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const excusedCount = attendance.filter(a => a.status === 'excused').length;
  const mandatoryPresent = attendance.filter(a => a.mandatory && a.status === 'present').length;
  const mandatoryTotal = attendance.filter(a => a.mandatory).length;

  const openView = (att: Attendance) => {
    setSelectedAttendance(att);
    setIsViewOpen(true);
  };

  const openEdit = (att: Attendance) => {
    setSelectedAttendance(att);
    setFormData({ status: att.status, justification: att.justification || '' });
    setIsEditOpen(true);
  };

  const openDelete = (att: Attendance) => {
    setSelectedAttendance(att);
    setIsDeleteOpen(true);
  };

  const handleEdit = () => {
    if (!selectedAttendance) return;
    setAttendance(attendance.map(a =>
      a.id === selectedAttendance.id
        ? { ...a, status: formData.status as Attendance['status'], justification: formData.justification }
        : a
    ));
    setIsEditOpen(false);
    toast({
      title: "Attendance Updated",
      description: `${selectedAttendance.participantName}'s attendance has been updated`,
    });
  };

  const handleDelete = () => {
    if (!selectedAttendance) return;
    setAttendance(attendance.filter(a => a.id !== selectedAttendance.id));
    setIsDeleteOpen(false);
    toast({
      title: "Attendance Removed",
      description: `${selectedAttendance.participantName} has been removed from the attendance list`,
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
            <p className="text-muted-foreground">Track leadership participation in reviews</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Present</p>
                  <p className="kpi-value">{presentCount}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Absent</p>
                  <p className="kpi-value">{absentCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Excused</p>
                  <p className="kpi-value">{excusedCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Mandatory Attendance</p>
                  <p className="kpi-value">{mandatoryPresent}/{mandatoryTotal}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Mandatory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Justification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-medium">{att.participantName}</TableCell>
                    <TableCell>{att.role}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={att.mandatory ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}>
                        {att.mandatory ? 'Required' : 'Optional'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(att.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {att.justification || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(att)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(att)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(att)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attendance Details</DialogTitle>
            </DialogHeader>
            {selectedAttendance && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Participant</Label>
                    <p className="font-medium">{selectedAttendance.participantName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <p>{selectedAttendance.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Attendance Type</Label>
                    <Badge variant="secondary" className={selectedAttendance.mandatory ? 'bg-primary/15 text-primary mt-1' : 'bg-muted text-muted-foreground mt-1'}>
                      {selectedAttendance.mandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedAttendance.status)}</div>
                  </div>
                </div>
                {selectedAttendance.justification && (
                  <div>
                    <Label className="text-muted-foreground">Justification</Label>
                    <p className="text-sm mt-1">{selectedAttendance.justification}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Attendance</DialogTitle>
              <DialogDescription>Update attendance status for {selectedAttendance?.participantName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status !== 'present' && (
                <div className="space-y-2">
                  <Label>Justification {formData.status === 'excused' && '*'}</Label>
                  <Textarea
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                    placeholder="Provide reason for absence"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Attendance Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedAttendance?.participantName} from the attendance list? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
