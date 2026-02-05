import { useState } from 'react';
import { useOccupationalHealth, Exam } from '../contexts/OccupationalContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge, getExamStatusVariant, getExamResultVariant } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Download,
  Calendar,
  User,
  FileText,
  CheckCircle,
} from 'lucide-react';

export default function PMEExams() {
  const { exams, setExams, employees } = useOccupationalHealth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Exam>>({
    employeeId: '',
    employeeName: '',
    type: 'periodic',
    status: 'scheduled',
    scheduledDate: '',
    provider: '',
    notes: '',
  });

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: `Exporting ${filteredExams.length} exams to ${exportFormat.toUpperCase()} format...`,
    });
    setExportModalOpen(false);
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${filteredExams.length} exams exported successfully.`,
      });
    }, 1500);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesType = typeFilter === 'all' || exam.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (exam: Exam) => {
    setSelectedExam(exam);
    setViewModalOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setFormData(exam);
    setEditModalOpen(true);
  };

  const handleDelete = (exam: Exam) => {
    setSelectedExam(exam);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      type: 'periodic',
      status: 'scheduled',
      scheduledDate: '',
      provider: 'Dr. Sarah Chen',
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
      });
    }
  };

  const handleSaveNew = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      employeeId: formData.employeeId || '',
      employeeName: formData.employeeName || '',
      type: formData.type as Exam['type'],
      status: formData.status as Exam['status'],
      scheduledDate: formData.scheduledDate || '',
      provider: formData.provider || '',
      notes: formData.notes,
    };
    setExams([...exams, newExam]);
    setAddModalOpen(false);
    toast({
      title: 'Exam Scheduled',
      description: `${newExam.type} exam scheduled for ${newExam.employeeName}.`,
    });
  };

  const handleSaveEdit = () => {
    if (!selectedExam) return;
    setExams(exams.map(exam => 
      exam.id === selectedExam.id 
        ? { ...exam, ...formData } as Exam
        : exam
    ));
    setEditModalOpen(false);
    toast({
      title: 'Exam Updated',
      description: 'Exam details have been updated successfully.',
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedExam) return;
    setExams(exams.filter(exam => exam.id !== selectedExam.id));
    toast({
      title: 'Exam Deleted',
      description: 'The exam has been removed from the schedule.',
      variant: 'destructive',
    });
  };

  const getExamTypeLabel = (type: string) => {
    return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Stethoscope className="h-7 w-7 text-primary" />
            PME & Examinations
          </h1>
          <p className="page-subtitle">
            Schedule and manage periodic medical examinations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Exam
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Scheduled', value: exams.filter(e => e.status === 'scheduled').length, color: 'text-info' },
          { label: 'In Progress', value: exams.filter(e => e.status === 'in-progress').length, color: 'text-warning' },
          { label: 'Completed', value: exams.filter(e => e.status === 'completed').length, color: 'text-success' },
          { label: 'Cancelled', value: exams.filter(e => e.status === 'cancelled').length, color: 'text-muted-foreground' },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                placeholder="Search by employee name..." 
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Exam Type" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pre-employment">Pre-Employment</SelectItem>
                <SelectItem value="periodic">Periodic</SelectItem>
                <SelectItem value="return-to-work">Return to Work</SelectItem>
                <SelectItem value="exit">Exit</SelectItem>
                <SelectItem value="special">Special</SelectItem>
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
              <TableHead>Employee</TableHead>
              <TableHead>Exam Type</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{exam.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{getExamTypeLabel(exam.type)}</span>
                </TableCell>
                <TableCell>
                  {new Date(exam.scheduledDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{exam.provider}</TableCell>
                <TableCell>
                  <StatusBadge variant={getExamStatusVariant(exam.status)}>
                    {exam.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  {exam.result ? (
                    <StatusBadge variant={getExamResultVariant(exam.result)}>
                      {exam.result.replace('-', ' ')}
                    </StatusBadge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons
                    onView={() => handleView(exam)}
                    onEdit={() => handleEdit(exam)}
                    onDelete={() => handleDelete(exam)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredExams.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No exams found matching your criteria
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
        title="Exam Details"
        description={selectedExam ? `${getExamTypeLabel(selectedExam.type)} Examination` : ''}
        size="md"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title">
                <User className="h-4 w-4" /> Employee Information
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee</span>
                  <span className="font-medium">{selectedExam.employeeName}</span>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-section-title">
                <Calendar className="h-4 w-4" /> Schedule
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled Date</span>
                  <span>{new Date(selectedExam.scheduledDate).toLocaleDateString()}</span>
                </div>
                {selectedExam.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Date</span>
                    <span>{new Date(selectedExam.completedDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span>{selectedExam.provider}</span>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <div className="form-section-title">
                <CheckCircle className="h-4 w-4" /> Status & Result
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge variant={getExamStatusVariant(selectedExam.status)}>
                    {selectedExam.status}
                  </StatusBadge>
                </div>
                {selectedExam.result && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Result</span>
                    <StatusBadge variant={getExamResultVariant(selectedExam.result)}>
                      {selectedExam.result.replace('-', ' ')}
                    </StatusBadge>
                  </div>
                )}
              </div>
            </div>
            
            {selectedExam.notes && (
              <div className="form-section">
                <div className="form-section-title">
                  <FileText className="h-4 w-4" /> Notes
                </div>
                <p className="text-sm">{selectedExam.notes}</p>
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
        title={addModalOpen ? 'Schedule New Exam' : 'Edit Exam'}
        description={addModalOpen ? 'Schedule a medical examination' : 'Update exam details'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Schedule Exam' : 'Save Changes'}
        size="md"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Exam Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="pre-employment">Pre-Employment</SelectItem>
                  <SelectItem value="periodic">Periodic</SelectItem>
                  <SelectItem value="return-to-work">Return to Work</SelectItem>
                  <SelectItem value="exit">Exit</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={formData.provider} onValueChange={(v) => setFormData({ ...formData, provider: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen</SelectItem>
                  <SelectItem value="Nurse Mike Rodriguez">Nurse Mike Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {editModalOpen && (
            <div className="space-y-2">
              <Label>Result</Label>
              <Select value={formData.result || ''} onValueChange={(v) => setFormData({ ...formData, result: v as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select result (if completed)" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="fit">Fit</SelectItem>
                  <SelectItem value="fit-with-restrictions">Fit with Restrictions</SelectItem>
                  <SelectItem value="unfit">Unfit</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Export Modal */}
      <FormModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Exams"
        description="Export exam data to file"
        onSubmit={handleExport}
        submitLabel="Export"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data to Export</Label>
            <p className="text-sm text-muted-foreground">
              {filteredExams.length} exams matching current filters will be exported.
            </p>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Exam"
        description={`Are you sure you want to delete this ${selectedExam?.type} exam for ${selectedExam?.employeeName}?`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
