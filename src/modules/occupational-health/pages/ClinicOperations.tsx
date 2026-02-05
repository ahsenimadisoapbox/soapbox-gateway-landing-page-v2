import { useState } from 'react';
import { useOccupationalHealth, ClinicVisit } from '../contexts/OccupationalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge, getTriageVariant } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { 
  Building2, 
  Search, 
  Plus, 
  Clock,
  AlertCircle,
  User,
  Stethoscope,
  Pill,
} from 'lucide-react';

export default function ClinicOperations() {
  const { clinicVisits, setClinicVisits, employees } = useOccupationalHealth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [triageFilter, setTriageFilter] = useState<string>('all');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<ClinicVisit | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<ClinicVisit>>({
    employeeId: '',
    employeeName: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '',
    type: 'walk-in',
    chiefComplaint: '',
    triageLevel: 'green',
    status: 'waiting',
    provider: '',
    diagnosis: '',
    treatment: '',
  });

  const filteredVisits = clinicVisits.filter(visit => {
    const matchesSearch = visit.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
    const matchesTriage = triageFilter === 'all' || visit.triageLevel === triageFilter;
    return matchesSearch && matchesStatus && matchesTriage;
  });

  const handleView = (visit: ClinicVisit) => {
    setSelectedVisit(visit);
    setViewModalOpen(true);
  };

  const handleEdit = (visit: ClinicVisit) => {
    setSelectedVisit(visit);
    setFormData(visit);
    setEditModalOpen(true);
  };

  const handleDelete = (visit: ClinicVisit) => {
    setSelectedVisit(visit);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toTimeString().slice(0, 5),
      type: 'walk-in',
      chiefComplaint: '',
      triageLevel: 'green',
      status: 'waiting',
      provider: '',
      diagnosis: '',
      treatment: '',
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
      });
    }
  };

  const handleSaveNew = () => {
    const newVisit: ClinicVisit = {
      id: Date.now().toString(),
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      visitDate: formData.visitDate || '',
      visitTime: formData.visitTime || '',
      type: formData.type as ClinicVisit['type'],
      chiefComplaint: formData.chiefComplaint || '',
      triageLevel: formData.triageLevel as ClinicVisit['triageLevel'],
      status: formData.status as ClinicVisit['status'],
      provider: formData.provider,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
    };
    setClinicVisits([...clinicVisits, newVisit]);
    setAddModalOpen(false);
    toast({
      title: 'Visit Registered',
      description: `Clinic visit registered for ${newVisit.employeeName}.`,
    });
  };

  const handleSaveEdit = () => {
    if (!selectedVisit) return;
    setClinicVisits(clinicVisits.map(visit => 
      visit.id === selectedVisit.id 
        ? { ...visit, ...formData } as ClinicVisit
        : visit
    ));
    setEditModalOpen(false);
    toast({
      title: 'Visit Updated',
      description: 'Clinic visit details have been updated.',
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedVisit) return;
    setClinicVisits(clinicVisits.filter(visit => visit.id !== selectedVisit.id));
    toast({
      title: 'Visit Deleted',
      description: 'The clinic visit has been removed.',
      variant: 'destructive',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'info';
      case 'in-treatment': return 'warning';
      case 'completed': return 'success';
      case 'referred': return 'muted';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 className="h-7 w-7 text-primary" />
            Clinic Operations
          </h1>
          <p className="page-subtitle">
            Manage walk-in visits, triage, and patient treatment
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Register Visit
          </Button>
        </div>
      </div>

      {/* Queue Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Waiting', value: clinicVisits.filter(v => v.status === 'waiting').length, color: 'bg-info/20 text-info', icon: Clock },
          { label: 'In Treatment', value: clinicVisits.filter(v => v.status === 'in-treatment').length, color: 'bg-warning/20 text-warning', icon: Stethoscope },
          { label: 'Critical (Red)', value: clinicVisits.filter(v => v.triageLevel === 'red').length, color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
          { label: 'Completed Today', value: clinicVisits.filter(v => v.status === 'completed').length, color: 'bg-success/20 text-success', icon: User },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by patient name..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-treatment">In Treatment</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="referred">Referred</SelectItem>
              </SelectContent>
            </Select>
            <Select value={triageFilter} onValueChange={setTriageFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Triage" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Triage</SelectItem>
                <SelectItem value="red">Red (Critical)</SelectItem>
                <SelectItem value="amber">Amber (Urgent)</SelectItem>
                <SelectItem value="green">Green (Routine)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Chief Complaint</TableHead>
              <TableHead>Triage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisits.map((visit) => (
              <TableRow key={visit.id} className={visit.triageLevel === 'red' ? 'bg-destructive/5' : ''}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      visit.triageLevel === 'red' ? 'bg-destructive/20' :
                      visit.triageLevel === 'amber' ? 'bg-warning/20' : 'bg-success/20'
                    }`}>
                      <User className={`h-5 w-5 ${
                        visit.triageLevel === 'red' ? 'text-destructive' :
                        visit.triageLevel === 'amber' ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <span className="font-medium">{visit.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell>{visit.visitTime}</TableCell>
                <TableCell className="capitalize">{visit.type}</TableCell>
                <TableCell className="max-w-[200px] truncate">{visit.chiefComplaint}</TableCell>
                <TableCell>
                  <StatusBadge variant={getTriageVariant(visit.triageLevel)}>
                    {visit.triageLevel.toUpperCase()}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge variant={getStatusColor(visit.status) as any}>
                    {visit.status.replace('-', ' ')}
                  </StatusBadge>
                </TableCell>
                <TableCell>{visit.provider || '-'}</TableCell>
                <TableCell className="text-right">
                  <ActionButtons
                    onView={() => handleView(visit)}
                    onEdit={() => handleEdit(visit)}
                    onDelete={() => handleDelete(visit)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredVisits.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No clinic visits found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      <FormModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Visit Details"
        description={selectedVisit ? `${selectedVisit.employeeName} - ${selectedVisit.visitDate}` : ''}
        size="md"
      >
        {selectedVisit && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title">
                <User className="h-4 w-4" /> Patient Information
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient</span>
                  <span className="font-medium">{selectedVisit.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visit Type</span>
                  <span className="capitalize">{selectedVisit.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Triage Level</span>
                  <StatusBadge variant={getTriageVariant(selectedVisit.triageLevel)}>
                    {selectedVisit.triageLevel.toUpperCase()}
                  </StatusBadge>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-section-title">
                <AlertCircle className="h-4 w-4" /> Chief Complaint
              </div>
              <p className="text-sm">{selectedVisit.chiefComplaint}</p>
            </div>
            
            {selectedVisit.diagnosis && (
              <div className="form-section">
                <div className="form-section-title">
                  <Stethoscope className="h-4 w-4" /> Diagnosis
                </div>
                <p className="text-sm">{selectedVisit.diagnosis}</p>
              </div>
            )}
            
            {selectedVisit.treatment && (
              <div className="form-section">
                <div className="form-section-title">
                  <Pill className="h-4 w-4" /> Treatment
                </div>
                <p className="text-sm">{selectedVisit.treatment}</p>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Add/Edit Modal */}
      <FormModal
        open={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
        }}
        title={addModalOpen ? 'Register New Visit' : 'Update Visit'}
        description={addModalOpen ? 'Register a walk-in or scheduled visit' : 'Update visit details'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Register Visit' : 'Save Changes'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Patient</Label>
            <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Visit Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Chief Complaint</Label>
            <Textarea
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              placeholder="Describe the primary reason for visit..."
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Triage Level</Label>
              <Select value={formData.triageLevel} onValueChange={(v) => setFormData({ ...formData, triageLevel: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="red">Red (Critical)</SelectItem>
                  <SelectItem value="amber">Amber (Urgent)</SelectItem>
                  <SelectItem value="green">Green (Routine)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="in-treatment">In Treatment</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="referred">Referred</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={formData.provider || ''} onValueChange={(v) => setFormData({ ...formData, provider: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign provider" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen</SelectItem>
                  <SelectItem value="Nurse Mike Rodriguez">Nurse Mike Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {editModalOpen && (
            <>
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Textarea
                  value={formData.diagnosis || ''}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Enter diagnosis..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Treatment</Label>
                <Textarea
                  value={formData.treatment || ''}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="Enter treatment provided..."
                  rows={2}
                />
              </div>
            </>
          )}
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Visit"
        description={`Are you sure you want to delete this clinic visit for ${selectedVisit?.employeeName}?`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
