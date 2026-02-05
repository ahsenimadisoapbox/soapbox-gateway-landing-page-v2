import { useState } from 'react';
import { useOccupationalHealth } from '../contexts/OccupationalContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge, getIllnessStatusVariant } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { 
  AlertTriangle, 
  Search, 
  Plus, 
  Download,
  User,
  FileText,
  Calendar,
  Activity,
  Clipboard,
} from 'lucide-react';

interface IllnessCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  diagnosis: string;
  suspectedCause: string;
  exposureType: string;
  reportedDate: string;
  status: 'open' | 'investigating' | 'treatment' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  investigator: string;
  notes: string;
}

const mockIllnessCases: IllnessCase[] = [
  {
    id: '1',
    caseNumber: 'OI-2025-001',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    department: 'Manufacturing',
    diagnosis: 'Noise-Induced Hearing Loss',
    suspectedCause: 'Prolonged noise exposure',
    exposureType: 'Noise',
    reportedDate: '2025-01-02',
    status: 'investigating',
    severity: 'medium',
    investigator: 'Dr. Sarah Chen',
    notes: 'Initial audiometry shows bilateral high-frequency hearing loss',
  },
  {
    id: '2',
    caseNumber: 'OI-2025-002',
    employeeId: 'EMP002',
    employeeName: 'Jane Doe',
    department: 'Quality Control',
    diagnosis: 'Contact Dermatitis',
    suspectedCause: 'Chemical exposure',
    exposureType: 'Chemical',
    reportedDate: '2025-01-03',
    status: 'treatment',
    severity: 'low',
    investigator: 'Dr. Sarah Chen',
    notes: 'Skin patch testing scheduled',
  },
  {
    id: '3',
    caseNumber: 'OI-2024-089',
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    department: 'Warehouse',
    diagnosis: 'Lower Back Pain',
    suspectedCause: 'Repetitive lifting',
    exposureType: 'Ergonomic',
    reportedDate: '2024-12-15',
    status: 'closed',
    severity: 'medium',
    investigator: 'Nurse Mike Rodriguez',
    notes: 'RTW completed successfully',
  },
];

export default function OccupationalIllness() {
  const { employees } = useOccupationalHealth();
  const [cases, setCases] = useState<IllnessCase[]>(mockIllnessCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<IllnessCase | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');

  const [formData, setFormData] = useState<Partial<IllnessCase>>({
    employeeId: '',
    employeeName: '',
    department: '',
    diagnosis: '',
    suspectedCause: '',
    exposureType: 'Chemical',
    status: 'open',
    severity: 'low',
    investigator: '',
    notes: '',
  });

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || c.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleView = (c: IllnessCase) => {
    setSelectedCase(c);
    setViewModalOpen(true);
  };

  const handleEdit = (c: IllnessCase) => {
    setSelectedCase(c);
    setFormData(c);
    setEditModalOpen(true);
  };

  const handleDelete = (c: IllnessCase) => {
    setSelectedCase(c);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      diagnosis: '',
      suspectedCause: '',
      exposureType: 'Chemical',
      status: 'open',
      severity: 'low',
      investigator: 'Dr. Sarah Chen',
      notes: '',
    });
    setAddModalOpen(true);
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    if (employee) {
      setFormData({
        ...formData,
        employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
      });
    }
  };

  const handleSaveNew = () => {
    const newCase: IllnessCase = {
      id: Date.now().toString(),
      caseNumber: `OI-2025-${String(cases.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      department: formData.department || '',
      diagnosis: formData.diagnosis || '',
      suspectedCause: formData.suspectedCause || '',
      exposureType: formData.exposureType || 'Chemical',
      reportedDate: new Date().toISOString().split('T')[0],
      status: formData.status as IllnessCase['status'],
      severity: formData.severity as IllnessCase['severity'],
      investigator: formData.investigator || '',
      notes: formData.notes || '',
    };
    setCases([newCase, ...cases]);
    setAddModalOpen(false);
    toast({ title: 'Case Created', description: `Case ${newCase.caseNumber} has been created.` });
  };

  const handleSaveEdit = () => {
    if (!selectedCase) return;
    setCases(cases.map(c => c.id === selectedCase.id ? { ...c, ...formData } as IllnessCase : c));
    setEditModalOpen(false);
    toast({ title: 'Case Updated', description: 'Case details have been updated.' });
  };

  const handleConfirmDelete = () => {
    if (!selectedCase) return;
    setCases(cases.filter(c => c.id !== selectedCase.id));
    setDeleteDialogOpen(false);
    toast({ title: 'Case Deleted', description: 'The case has been removed.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: `Exporting ${filteredCases.length} cases to ${exportFormat.toUpperCase()}...` });
    setExportModalOpen(false);
    setTimeout(() => {
      toast({ title: 'Export Complete', description: 'Cases exported successfully.' });
    }, 1500);
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const stats = [
    { label: 'Open Cases', value: cases.filter(c => c.status === 'open').length, color: 'text-info' },
    { label: 'Investigating', value: cases.filter(c => c.status === 'investigating').length, color: 'text-warning' },
    { label: 'In Treatment', value: cases.filter(c => c.status === 'treatment').length, color: 'text-primary' },
    { label: 'Closed', value: cases.filter(c => c.status === 'closed').length, color: 'text-success' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <AlertTriangle className="h-7 w-7 text-primary" />
            Occupational Illness
          </h1>
          <p className="page-subtitle">Manage and investigate occupational illness cases</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
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
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="treatment">Treatment</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
              <TableHead>Diagnosis</TableHead>
              <TableHead>Exposure Type</TableHead>
              <TableHead>Reported Date</TableHead>
              <TableHead>Severity</TableHead>
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
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{c.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{c.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{c.diagnosis}</TableCell>
                <TableCell>{c.exposureType}</TableCell>
                <TableCell>{new Date(c.reportedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge variant={getSeverityVariant(c.severity)}>{c.severity}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge variant={getIllnessStatusVariant(c.status)}>{c.status}</StatusBadge>
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons onView={() => handleView(c)} onEdit={() => handleEdit(c)} onDelete={() => handleDelete(c)} />
                </TableCell>
              </TableRow>
            ))}
            {filteredCases.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No cases found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Case Details" description={selectedCase?.caseNumber} size="lg">
        {selectedCase && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title"><User className="h-4 w-4" /> Employee Information</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Employee:</span> <span className="font-medium ml-2">{selectedCase.employeeName}</span></div>
                <div><span className="text-muted-foreground">Department:</span> <span className="font-medium ml-2">{selectedCase.department}</span></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Activity className="h-4 w-4" /> Diagnosis Details</div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Diagnosis:</span> <span className="font-medium ml-2">{selectedCase.diagnosis}</span></div>
                <div><span className="text-muted-foreground">Suspected Cause:</span> <span className="font-medium ml-2">{selectedCase.suspectedCause}</span></div>
                <div><span className="text-muted-foreground">Exposure Type:</span> <span className="font-medium ml-2">{selectedCase.exposureType}</span></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Clipboard className="h-4 w-4" /> Case Status</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <StatusBadge variant={getIllnessStatusVariant(selectedCase.status)}>{selectedCase.status}</StatusBadge></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Severity:</span> <StatusBadge variant={getSeverityVariant(selectedCase.severity)}>{selectedCase.severity}</StatusBadge></div>
                <div><span className="text-muted-foreground">Investigator:</span> <span className="font-medium ml-2">{selectedCase.investigator}</span></div>
                <div><span className="text-muted-foreground">Reported:</span> <span className="font-medium ml-2">{new Date(selectedCase.reportedDate).toLocaleDateString()}</span></div>
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
        title={addModalOpen ? 'Create New Case' : 'Edit Case'}
        description={addModalOpen ? 'Report a new occupational illness case' : 'Update case details'}
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
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Input value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="Enter diagnosis" />
            </div>
            <div className="space-y-2">
              <Label>Exposure Type</Label>
              <Select value={formData.exposureType} onValueChange={(v) => setFormData({ ...formData, exposureType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="Chemical">Chemical</SelectItem>
                  <SelectItem value="Noise">Noise</SelectItem>
                  <SelectItem value="Ergonomic">Ergonomic</SelectItem>
                  <SelectItem value="Biological">Biological</SelectItem>
                  <SelectItem value="Radiation">Radiation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Suspected Cause</Label>
            <Input value={formData.suspectedCause} onChange={(e) => setFormData({ ...formData, suspectedCause: e.target.value })} placeholder="Describe suspected cause" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={formData.severity} onValueChange={(v) => setFormData({ ...formData, severity: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Investigator</Label>
              <Select value={formData.investigator} onValueChange={(v) => setFormData({ ...formData, investigator: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen</SelectItem>
                  <SelectItem value="Nurse Mike Rodriguez">Nurse Mike Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes..." rows={3} />
          </div>
        </div>
      </FormModal>

      {/* Export Modal */}
      <FormModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} title="Export Cases" description="Export illness cases data" onSubmit={handleExport} submitLabel="Export">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">{filteredCases.length} cases will be exported based on current filters.</p>
        </div>
      </FormModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Case"
        description={`Are you sure you want to delete case ${selectedCase?.caseNumber}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
