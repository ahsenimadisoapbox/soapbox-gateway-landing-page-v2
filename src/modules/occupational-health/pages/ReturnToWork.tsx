import { useState } from 'react';
import { useOccupationalHealth } from '../contexts/OccupationalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Download,
  User,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface RTWCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reason: string;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  supervisor: string;
  restrictions: string;
  accommodations: string;
  notes: string;
}

const mockRTWCases: RTWCase[] = [
  { id: '1', caseNumber: 'RTW-2025-001', employeeId: 'EMP001', employeeName: 'John Smith', department: 'Manufacturing', reason: 'Lower Back Injury', startDate: '2024-12-15', expectedReturnDate: '2025-01-15', status: 'in-progress', supervisor: 'Tom Wilson', restrictions: 'No lifting over 10kg', accommodations: 'Modified duties, ergonomic chair', notes: 'Weekly physiotherapy sessions' },
  { id: '2', caseNumber: 'RTW-2025-002', employeeId: 'EMP002', employeeName: 'Jane Doe', department: 'Quality Control', reason: 'Post-Surgery Recovery', startDate: '2024-12-20', expectedReturnDate: '2025-01-20', status: 'pending', supervisor: 'Mary Johnson', restrictions: 'Limited standing, no heavy lifting', accommodations: 'Sit-stand desk, flexible breaks', notes: 'Awaiting surgeon clearance' },
  { id: '3', caseNumber: 'RTW-2024-089', employeeId: 'EMP003', employeeName: 'Robert Johnson', department: 'Warehouse', reason: 'Occupational Illness', startDate: '2024-11-01', expectedReturnDate: '2024-12-15', actualReturnDate: '2024-12-18', status: 'completed', supervisor: 'Steve Brown', restrictions: 'None', accommodations: 'None required', notes: 'Full recovery confirmed' },
];

export default function ReturnToWork() {
  const { employees } = useOccupationalHealth();
  const [cases, setCases] = useState<RTWCase[]>(mockRTWCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<RTWCase | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');

  const [formData, setFormData] = useState<Partial<RTWCase>>({
    employeeId: '',
    employeeName: '',
    department: '',
    reason: '',
    startDate: '',
    expectedReturnDate: '',
    status: 'pending',
    supervisor: '',
    restrictions: '',
    accommodations: '',
    notes: '',
  });

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (c: RTWCase) => { setSelectedCase(c); setViewModalOpen(true); };
  const handleEdit = (c: RTWCase) => { setSelectedCase(c); setFormData(c); setEditModalOpen(true); };
  const handleDelete = (c: RTWCase) => { setSelectedCase(c); setDeleteDialogOpen(true); };
  const handleAdd = () => {
    setFormData({ employeeId: '', employeeName: '', department: '', reason: '', startDate: '', expectedReturnDate: '', status: 'pending', supervisor: '', restrictions: '', accommodations: '', notes: '' });
    setAddModalOpen(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setFormData({ ...formData, employeeId, employeeName: `${employee.firstName} ${employee.lastName}`, department: employee.department });
    }
  };

  const handleSaveNew = () => {
    const newCase: RTWCase = {
      id: Date.now().toString(),
      caseNumber: `RTW-2025-${String(cases.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      department: formData.department || '',
      reason: formData.reason || '',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      expectedReturnDate: formData.expectedReturnDate || '',
      status: formData.status as RTWCase['status'],
      supervisor: formData.supervisor || '',
      restrictions: formData.restrictions || '',
      accommodations: formData.accommodations || '',
      notes: formData.notes || '',
    };
    setCases([newCase, ...cases]);
    setAddModalOpen(false);
    toast({ title: 'RTW Case Created', description: `Case ${newCase.caseNumber} has been created.` });
  };

  const handleSaveEdit = () => {
    if (!selectedCase) return;
    setCases(cases.map(c => c.id === selectedCase.id ? { ...c, ...formData } as RTWCase : c));
    setEditModalOpen(false);
    toast({ title: 'Case Updated', description: 'RTW case has been updated.' });
  };

  const handleConfirmDelete = () => {
    if (!selectedCase) return;
    setCases(cases.filter(c => c.id !== selectedCase.id));
    setDeleteDialogOpen(false);
    toast({ title: 'Case Deleted', description: 'RTW case has been removed.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: `Exporting RTW data to ${exportFormat.toUpperCase()}...` });
    setExportModalOpen(false);
    setTimeout(() => { toast({ title: 'Export Complete', description: 'RTW data exported successfully.' }); }, 1500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'approved': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'muted';
      default: return 'default';
    }
  };

  const stats = [
    { label: 'Pending', value: cases.filter(c => c.status === 'pending').length, color: 'text-warning', icon: Clock },
    { label: 'In Progress', value: cases.filter(c => c.status === 'in-progress').length, color: 'text-info', icon: AlertCircle },
    { label: 'Completed', value: cases.filter(c => c.status === 'completed').length, color: 'text-success', icon: CheckCircle },
    { label: 'Total Active', value: cases.filter(c => c.status !== 'completed' && c.status !== 'cancelled').length, color: 'text-primary', icon: UserCheck },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><UserCheck className="h-7 w-7 text-primary" />Return to Work</h1>
          <p className="page-subtitle">Manage employee return to work programs and accommodations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />New RTW Case</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-muted"><stat.icon className={`h-5 w-5 ${stat.color}`} /></div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cases..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case #</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Expected Return</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono">{c.caseNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
                    <div><p className="font-medium">{c.employeeName}</p><p className="text-xs text-muted-foreground">{c.department}</p></div>
                  </div>
                </TableCell>
                <TableCell>{c.reason}</TableCell>
                <TableCell>{new Date(c.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(c.expectedReturnDate).toLocaleDateString()}</TableCell>
                <TableCell><StatusBadge variant={getStatusVariant(c.status)}>{c.status}</StatusBadge></TableCell>
                <TableCell className="text-right"><ActionButtons onView={() => handleView(c)} onEdit={() => handleEdit(c)} onDelete={() => handleDelete(c)} /></TableCell>
              </TableRow>
            ))}
            {filteredCases.length === 0 && (
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No cases found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="RTW Case Details" description={selectedCase?.caseNumber} size="lg">
        {selectedCase && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title"><User className="h-4 w-4" /> Employee Information</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Employee:</span> <span className="font-medium ml-2">{selectedCase.employeeName}</span></div>
                <div><span className="text-muted-foreground">Department:</span> <span className="font-medium ml-2">{selectedCase.department}</span></div>
                <div><span className="text-muted-foreground">Supervisor:</span> <span className="font-medium ml-2">{selectedCase.supervisor}</span></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Calendar className="h-4 w-4" /> Timeline</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Reason:</span> <span className="font-medium ml-2">{selectedCase.reason}</span></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <StatusBadge variant={getStatusVariant(selectedCase.status)}>{selectedCase.status}</StatusBadge></div>
                <div><span className="text-muted-foreground">Start Date:</span> <span className="font-medium ml-2">{new Date(selectedCase.startDate).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">Expected Return:</span> <span className="font-medium ml-2">{new Date(selectedCase.expectedReturnDate).toLocaleDateString()}</span></div>
                {selectedCase.actualReturnDate && <div><span className="text-muted-foreground">Actual Return:</span> <span className="font-medium ml-2">{new Date(selectedCase.actualReturnDate).toLocaleDateString()}</span></div>}
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><FileText className="h-4 w-4" /> Accommodations</div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Restrictions:</span> <span className="font-medium ml-2">{selectedCase.restrictions || 'None'}</span></div>
                <div><span className="text-muted-foreground">Accommodations:</span> <span className="font-medium ml-2">{selectedCase.accommodations || 'None'}</span></div>
              </div>
            </div>
            {selectedCase.notes && (
              <div className="form-section">
                <div className="form-section-title"><FileText className="h-4 w-4" /> Notes</div>
                <p className="text-sm">{selectedCase.notes}</p>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Add/Edit Modal */}
      <FormModal
        open={addModalOpen || editModalOpen}
        onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }}
        title={addModalOpen ? 'Create RTW Case' : 'Edit RTW Case'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Create Case' : 'Save Changes'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Reason</Label><Input value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Reason for RTW" /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Expected Return</Label><Input type="date" value={formData.expectedReturnDate} onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Supervisor</Label><Input value={formData.supervisor} onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })} placeholder="Supervisor name" /></div>
          </div>
          <div className="space-y-2"><Label>Restrictions</Label><Textarea value={formData.restrictions} onChange={(e) => setFormData({ ...formData, restrictions: e.target.value })} placeholder="Work restrictions..." rows={2} /></div>
          <div className="space-y-2"><Label>Accommodations</Label><Textarea value={formData.accommodations} onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })} placeholder="Required accommodations..." rows={2} /></div>
          <div className="space-y-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes..." rows={2} /></div>
        </div>
      </FormModal>

      {/* Export Modal */}
      <FormModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} title="Export RTW Data" onSubmit={handleExport} submitLabel="Export">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">{filteredCases.length} cases will be exported.</p>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} title="Delete Case" description={`Delete case ${selectedCase?.caseNumber}? This cannot be undone.`} onConfirm={handleConfirmDelete} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
