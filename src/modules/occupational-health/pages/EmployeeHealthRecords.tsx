import { useState } from 'react';
import { useOccupationalHealth, Employee } from '../contexts/OccupationalContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge, getEmployeeStatusVariant, getRiskLevelVariant } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  Download,
  UserCircle,
  Briefcase,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';

export default function EmployeeHealthRecords() {
  const { employees, setEmployees, currentUser } = useOccupationalHealth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    site: '',
    status: 'active',
    riskLevel: 'low',
    hazardExposures: [],
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || emp.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData(employee);
    setEditModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      jobTitle: '',
      site: '',
      status: 'active',
      riskLevel: 'low',
      hazardExposures: [],
    });
    setAddModalOpen(true);
  };

  const handleSaveNew = () => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      employeeId: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      department: formData.department || '',
      jobTitle: formData.jobTitle || '',
      site: formData.site || '',
      hireDate: new Date().toISOString().split('T')[0],
      status: formData.status as 'active' | 'inactive' | 'on-leave',
      riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
      hazardExposures: formData.hazardExposures || [],
    };
    setEmployees([...employees, newEmployee]);
    setAddModalOpen(false);
    toast({
      title: 'Employee Added',
      description: `${newEmployee.firstName} ${newEmployee.lastName} has been added successfully.`,
    });
  };

  const handleSaveEdit = () => {
    if (!selectedEmployee) return;
    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id 
        ? { ...emp, ...formData } as Employee
        : emp
    ));
    setEditModalOpen(false);
    toast({
      title: 'Employee Updated',
      description: `${formData.firstName} ${formData.lastName} has been updated successfully.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;
    setEmployees(employees.filter(emp => emp.id !== selectedEmployee.id));
    toast({
      title: 'Employee Deleted',
      description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been removed.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users className="h-7 w-7 text-primary" />
            Employee Health Records
          </h1>
          <p className="page-subtitle">
            Manage employee health profiles, medical history, and compliance status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, ID, or email..." 
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
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
              <TableHead>Department</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Last Exam</TableHead>
              <TableHead>Next Exam</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                      <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.site}</TableCell>
                <TableCell>
                  <StatusBadge variant={getEmployeeStatusVariant(employee.status)}>
                    {employee.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge variant={getRiskLevelVariant(employee.riskLevel)}>
                    {employee.riskLevel}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.lastExamDate ? new Date(employee.lastExamDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {employee.nextExamDate ? new Date(employee.nextExamDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <ActionButtons
                    onView={() => handleView(employee)}
                    onEdit={() => handleEdit(employee)}
                    onDelete={() => handleDelete(employee)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredEmployees.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No employees found matching your criteria
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
        title="Employee Health Profile"
        description={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} - ${selectedEmployee.employeeId}` : ''}
        size="lg"
      >
        {selectedEmployee && (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="exposures">Exposures</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-section">
                  <div className="form-section-title">
                    <UserCircle className="h-4 w-4" /> Personal Information
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Full Name</span>
                      <span className="font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <div className="form-section-title">
                    <Briefcase className="h-4 w-4" /> Employment
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span>{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Title</span>
                      <span>{selectedEmployee.jobTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hire Date</span>
                      <span>{new Date(selectedEmployee.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="space-y-4">
              <div className="form-section">
                <div className="form-section-title">
                  <AlertTriangle className="h-4 w-4" /> Risk Assessment
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Risk Level</span>
                    <StatusBadge variant={getRiskLevelVariant(selectedEmployee.riskLevel)}>
                      {selectedEmployee.riskLevel}
                    </StatusBadge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Employment Status</span>
                    <StatusBadge variant={getEmployeeStatusVariant(selectedEmployee.status)}>
                      {selectedEmployee.status}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exposures" className="space-y-4">
              <div className="form-section">
                <div className="form-section-title">Hazard Exposures</div>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.hazardExposures.length > 0 ? (
                    selectedEmployee.hazardExposures.map((exposure, idx) => (
                      <StatusBadge key={idx} variant="warning">{exposure}</StatusBadge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No recorded hazard exposures</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exams" className="space-y-4">
              <div className="form-section">
                <div className="form-section-title">
                  <Calendar className="h-4 w-4" /> Examination Schedule
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Exam Date</span>
                    <span>{selectedEmployee.lastExamDate ? new Date(selectedEmployee.lastExamDate).toLocaleDateString() : 'Not recorded'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Exam Due</span>
                    <span>{selectedEmployee.nextExamDate ? new Date(selectedEmployee.nextExamDate).toLocaleDateString() : 'Not scheduled'}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </FormModal>

      {/* Add/Edit Modal */}
      <FormModal
        open={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
        }}
        title={addModalOpen ? 'Add New Employee' : 'Edit Employee'}
        description={addModalOpen ? 'Enter the employee details below' : 'Update the employee information'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Add Employee' : 'Save Changes'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Quality Control">Quality Control</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select value={formData.site} onValueChange={(v) => setFormData({ ...formData, site: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="Plant A">Plant A</SelectItem>
                <SelectItem value="Plant B">Plant B</SelectItem>
                <SelectItem value="Warehouse 1">Warehouse 1</SelectItem>
                <SelectItem value="HQ">HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select value={formData.riskLevel} onValueChange={(v) => setFormData({ ...formData, riskLevel: v as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
