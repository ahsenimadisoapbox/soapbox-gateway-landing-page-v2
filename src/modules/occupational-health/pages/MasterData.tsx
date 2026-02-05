import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { Database, Plus, Search, Stethoscope, AlertTriangle, Building, UserCog, Pill, Package } from 'lucide-react';

interface ExamType {
  id: string;
  name: string;
  code: string;
  category: string;
  frequency: string;
  status: 'active' | 'inactive';
}

interface Hazard {
  id: string;
  name: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiredExams: string;
  status: 'active' | 'inactive';
}

interface Clinic {
  id: string;
  name: string;
  location: string;
  type: string;
  capacity: number;
  status: 'active' | 'inactive';
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  license: string;
  clinic: string;
  status: 'active' | 'inactive';
}

interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  status: 'active' | 'inactive';
}

const mockExamTypes: ExamType[] = [
  { id: '1', name: 'Pre-Employment Medical', code: 'PME-PRE', category: 'Mandatory', frequency: 'Once', status: 'active' },
  { id: '2', name: 'Periodic Medical Exam', code: 'PME-PER', category: 'Mandatory', frequency: 'Annual', status: 'active' },
  { id: '3', name: 'Return to Work Exam', code: 'PME-RTW', category: 'Conditional', frequency: 'As needed', status: 'active' },
  { id: '4', name: 'Exit Medical Exam', code: 'PME-EXIT', category: 'Mandatory', frequency: 'Once', status: 'active' },
];

const mockHazards: Hazard[] = [
  { id: '1', name: 'Noise Exposure', category: 'Physical', riskLevel: 'high', requiredExams: 'Audiometry', status: 'active' },
  { id: '2', name: 'Chemical Vapors', category: 'Chemical', riskLevel: 'critical', requiredExams: 'Spirometry, Blood Test', status: 'active' },
  { id: '3', name: 'Ergonomic Strain', category: 'Ergonomic', riskLevel: 'medium', requiredExams: 'Musculoskeletal Assessment', status: 'active' },
  { id: '4', name: 'Heat Stress', category: 'Environmental', riskLevel: 'high', requiredExams: 'Cardiac Evaluation', status: 'active' },
];

const mockClinics: Clinic[] = [
  { id: '1', name: 'Main Campus Clinic', location: 'Building A, Ground Floor', type: 'On-site', capacity: 50, status: 'active' },
  { id: '2', name: 'Plant B Medical Center', location: 'Plant B, Block 2', type: 'On-site', capacity: 30, status: 'active' },
  { id: '3', name: 'City Medical Partners', location: '123 Healthcare Blvd', type: 'External', capacity: 100, status: 'active' },
];

const mockProviders: Provider[] = [
  { id: '1', name: 'Dr. Sarah Chen', specialty: 'Occupational Medicine', license: 'MD-12345', clinic: 'Main Campus Clinic', status: 'active' },
  { id: '2', name: 'Dr. Michael Rodriguez', specialty: 'Internal Medicine', license: 'MD-67890', clinic: 'Plant B Medical Center', status: 'active' },
  { id: '3', name: 'Nurse Jennifer Walsh', specialty: 'Occupational Health Nursing', license: 'RN-11111', clinic: 'Main Campus Clinic', status: 'active' },
];

const mockMedications: Medication[] = [
  { id: '1', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', dosageForm: 'Tablet', status: 'active' },
  { id: '2', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID', dosageForm: 'Tablet', status: 'active' },
  { id: '3', name: 'Cetirizine 10mg', genericName: 'Cetirizine HCl', category: 'Antihistamine', dosageForm: 'Tablet', status: 'active' },
  { id: '4', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Antacid', dosageForm: 'Capsule', status: 'active' },
];

type DataType = 'examType' | 'hazard' | 'clinic' | 'provider' | 'medication';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('examTypes');
  const [searchTerm, setSearchTerm] = useState('');
  const [examTypes, setExamTypes] = useState(mockExamTypes);
  const [hazards, setHazards] = useState(mockHazards);
  const [clinics, setClinics] = useState(mockClinics);
  const [providers, setProviders] = useState(mockProviders);
  const [medications, setMedications] = useState(mockMedications);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [dataType, setDataType] = useState<DataType>('examType');

  const [examTypeForm, setExamTypeForm] = useState({ name: '', code: '', category: '', frequency: '' });
  const [hazardForm, setHazardForm] = useState({ name: '', category: '', riskLevel: 'medium', requiredExams: '' });
  const [clinicForm, setClinicForm] = useState({ name: '', location: '', type: 'On-site', capacity: '' });
  const [providerForm, setProviderForm] = useState({ name: '', specialty: '', license: '', clinic: '' });
  const [medicationForm, setMedicationForm] = useState({ name: '', genericName: '', category: '', dosageForm: '' });

  const handleAdd = (type: DataType) => {
    setDataType(type);
    if (type === 'examType') setExamTypeForm({ name: '', code: '', category: '', frequency: '' });
    else if (type === 'hazard') setHazardForm({ name: '', category: '', riskLevel: 'medium', requiredExams: '' });
    else if (type === 'clinic') setClinicForm({ name: '', location: '', type: 'On-site', capacity: '' });
    else if (type === 'provider') setProviderForm({ name: '', specialty: '', license: '', clinic: '' });
    else if (type === 'medication') setMedicationForm({ name: '', genericName: '', category: '', dosageForm: '' });
    setAddModalOpen(true);
  };

  const handleView = (item: any, type: DataType) => {
    setSelectedItem(item);
    setDataType(type);
    setViewModalOpen(true);
  };

  const handleEdit = (item: any, type: DataType) => {
    setSelectedItem(item);
    setDataType(type);
    if (type === 'examType') setExamTypeForm({ name: item.name, code: item.code, category: item.category, frequency: item.frequency });
    else if (type === 'hazard') setHazardForm({ name: item.name, category: item.category, riskLevel: item.riskLevel, requiredExams: item.requiredExams });
    else if (type === 'clinic') setClinicForm({ name: item.name, location: item.location, type: item.type, capacity: item.capacity.toString() });
    else if (type === 'provider') setProviderForm({ name: item.name, specialty: item.specialty, license: item.license, clinic: item.clinic });
    else if (type === 'medication') setMedicationForm({ name: item.name, genericName: item.genericName, category: item.category, dosageForm: item.dosageForm });
    setEditModalOpen(true);
  };

  const handleDelete = (item: any, type: DataType) => {
    setSelectedItem(item);
    setDataType(type);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    const isEdit = editModalOpen;
    if (dataType === 'examType') {
      if (isEdit) {
        setExamTypes(examTypes.map(e => e.id === selectedItem.id ? { ...e, ...examTypeForm } as ExamType : e));
      } else {
        setExamTypes([...examTypes, { id: Date.now().toString(), ...examTypeForm, status: 'active' } as ExamType]);
      }
      toast({ title: isEdit ? 'Exam Type Updated' : 'Exam Type Added', description: `${examTypeForm.name} has been ${isEdit ? 'updated' : 'added'}.` });
    } else if (dataType === 'hazard') {
      if (isEdit) {
        setHazards(hazards.map(h => h.id === selectedItem.id ? { ...h, ...hazardForm } as Hazard : h));
      } else {
        setHazards([...hazards, { id: Date.now().toString(), ...hazardForm, status: 'active' } as Hazard]);
      }
      toast({ title: isEdit ? 'Hazard Updated' : 'Hazard Added', description: `${hazardForm.name} has been ${isEdit ? 'updated' : 'added'}.` });
    } else if (dataType === 'clinic') {
      if (isEdit) {
        setClinics(clinics.map(c => c.id === selectedItem.id ? { ...c, ...clinicForm, capacity: parseInt(clinicForm.capacity) } as Clinic : c));
      } else {
        setClinics([...clinics, { id: Date.now().toString(), ...clinicForm, capacity: parseInt(clinicForm.capacity) || 0, status: 'active' } as Clinic]);
      }
      toast({ title: isEdit ? 'Clinic Updated' : 'Clinic Added', description: `${clinicForm.name} has been ${isEdit ? 'updated' : 'added'}.` });
    } else if (dataType === 'provider') {
      if (isEdit) {
        setProviders(providers.map(p => p.id === selectedItem.id ? { ...p, ...providerForm } as Provider : p));
      } else {
        setProviders([...providers, { id: Date.now().toString(), ...providerForm, status: 'active' } as Provider]);
      }
      toast({ title: isEdit ? 'Provider Updated' : 'Provider Added', description: `${providerForm.name} has been ${isEdit ? 'updated' : 'added'}.` });
    } else if (dataType === 'medication') {
      if (isEdit) {
        setMedications(medications.map(m => m.id === selectedItem.id ? { ...m, ...medicationForm } as Medication : m));
      } else {
        setMedications([...medications, { id: Date.now().toString(), ...medicationForm, status: 'active' } as Medication]);
      }
      toast({ title: isEdit ? 'Medication Updated' : 'Medication Added', description: `${medicationForm.name} has been ${isEdit ? 'updated' : 'added'}.` });
    }
    setAddModalOpen(false);
    setEditModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (dataType === 'examType') setExamTypes(examTypes.filter(e => e.id !== selectedItem.id));
    else if (dataType === 'hazard') setHazards(hazards.filter(h => h.id !== selectedItem.id));
    else if (dataType === 'clinic') setClinics(clinics.filter(c => c.id !== selectedItem.id));
    else if (dataType === 'provider') setProviders(providers.filter(p => p.id !== selectedItem.id));
    else if (dataType === 'medication') setMedications(medications.filter(m => m.id !== selectedItem.id));
    toast({ title: 'Item Deleted', description: 'The item has been removed.', variant: 'destructive' });
  };

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'examType': return 'Exam Type';
      case 'hazard': return 'Hazard';
      case 'clinic': return 'Clinic';
      case 'provider': return 'Provider';
      case 'medication': return 'Medication';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Database className="h-7 w-7 text-primary" />Master Data</h1>
          <p className="page-subtitle">Configure system reference data and lookup values</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: 'Exam Types', value: examTypes.length, icon: Stethoscope },
          { label: 'Hazards', value: hazards.length, icon: AlertTriangle },
          { label: 'Clinics', value: clinics.length, icon: Building },
          { label: 'Providers', value: providers.length, icon: UserCog },
          { label: 'Medications', value: medications.length, icon: Pill },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="examTypes">Exam Types</TabsTrigger>
          <TabsTrigger value="hazards">Hazards</TabsTrigger>
          <TabsTrigger value="clinics">Clinics</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        {/* Exam Types Tab */}
        <TabsContent value="examTypes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exam Types</CardTitle>
              <Button onClick={() => handleAdd('examType')}><Plus className="h-4 w-4 mr-2" />Add Exam Type</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Category</TableHead><TableHead>Frequency</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {examTypes.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{item.code}</code></TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.frequency}</TableCell>
                      <TableCell><StatusBadge variant={item.status === 'active' ? 'success' : 'muted'}>{item.status}</StatusBadge></TableCell>
                      <TableCell className="text-right"><ActionButtons onView={() => handleView(item, 'examType')} onEdit={() => handleEdit(item, 'examType')} onDelete={() => handleDelete(item, 'examType')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hazards Tab */}
        <TabsContent value="hazards">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Hazards</CardTitle>
              <Button onClick={() => handleAdd('hazard')}><Plus className="h-4 w-4 mr-2" />Add Hazard</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Risk Level</TableHead><TableHead>Required Exams</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {hazards.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell><StatusBadge variant={item.riskLevel === 'critical' ? 'error' : item.riskLevel === 'high' ? 'warning' : item.riskLevel === 'medium' ? 'info' : 'success'}>{item.riskLevel}</StatusBadge></TableCell>
                      <TableCell>{item.requiredExams}</TableCell>
                      <TableCell><StatusBadge variant={item.status === 'active' ? 'success' : 'muted'}>{item.status}</StatusBadge></TableCell>
                      <TableCell className="text-right"><ActionButtons onView={() => handleView(item, 'hazard')} onEdit={() => handleEdit(item, 'hazard')} onDelete={() => handleDelete(item, 'hazard')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinics Tab */}
        <TabsContent value="clinics">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clinics</CardTitle>
              <Button onClick={() => handleAdd('clinic')}><Plus className="h-4 w-4 mr-2" />Add Clinic</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>Type</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {clinics.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.capacity}</TableCell>
                      <TableCell><StatusBadge variant={item.status === 'active' ? 'success' : 'muted'}>{item.status}</StatusBadge></TableCell>
                      <TableCell className="text-right"><ActionButtons onView={() => handleView(item, 'clinic')} onEdit={() => handleEdit(item, 'clinic')} onDelete={() => handleDelete(item, 'clinic')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Providers</CardTitle>
              <Button onClick={() => handleAdd('provider')}><Plus className="h-4 w-4 mr-2" />Add Provider</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Specialty</TableHead><TableHead>License</TableHead><TableHead>Clinic</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {providers.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.specialty}</TableCell>
                      <TableCell><code className="bg-muted px-2 py-1 rounded text-xs">{item.license}</code></TableCell>
                      <TableCell>{item.clinic}</TableCell>
                      <TableCell><StatusBadge variant={item.status === 'active' ? 'success' : 'muted'}>{item.status}</StatusBadge></TableCell>
                      <TableCell className="text-right"><ActionButtons onView={() => handleView(item, 'provider')} onEdit={() => handleEdit(item, 'provider')} onDelete={() => handleDelete(item, 'provider')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medications</CardTitle>
              <Button onClick={() => handleAdd('medication')}><Plus className="h-4 w-4 mr-2" />Add Medication</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Generic Name</TableHead><TableHead>Category</TableHead><TableHead>Dosage Form</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {medications.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.genericName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.dosageForm}</TableCell>
                      <TableCell><StatusBadge variant={item.status === 'active' ? 'success' : 'muted'}>{item.status}</StatusBadge></TableCell>
                      <TableCell className="text-right"><ActionButtons onView={() => handleView(item, 'medication')} onEdit={() => handleEdit(item, 'medication')} onDelete={() => handleDelete(item, 'medication')} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`${getDataTypeLabel()} Details`} size="md">
        {selectedItem && (
          <div className="space-y-3">
            {Object.entries(selectedItem).filter(([k]) => k !== 'id').map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-medium">{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </FormModal>

      {/* Add/Edit Exam Type Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && dataType === 'examType'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Exam Type' : 'Add Exam Type'} onSubmit={handleSave} submitLabel={editModalOpen ? 'Save Changes' : 'Add Exam Type'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={examTypeForm.name} onChange={(e) => setExamTypeForm({ ...examTypeForm, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Code</Label><Input value={examTypeForm.code} onChange={(e) => setExamTypeForm({ ...examTypeForm, code: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={examTypeForm.category} onChange={(e) => setExamTypeForm({ ...examTypeForm, category: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Frequency</Label><Input value={examTypeForm.frequency} onChange={(e) => setExamTypeForm({ ...examTypeForm, frequency: e.target.value })} /></div>
        </div>
      </FormModal>

      {/* Add/Edit Hazard Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && dataType === 'hazard'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Hazard' : 'Add Hazard'} onSubmit={handleSave} submitLabel={editModalOpen ? 'Save Changes' : 'Add Hazard'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={hazardForm.name} onChange={(e) => setHazardForm({ ...hazardForm, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category</Label><Input value={hazardForm.category} onChange={(e) => setHazardForm({ ...hazardForm, category: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select value={hazardForm.riskLevel} onValueChange={(v) => setHazardForm({ ...hazardForm, riskLevel: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50"><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Required Exams</Label><Input value={hazardForm.requiredExams} onChange={(e) => setHazardForm({ ...hazardForm, requiredExams: e.target.value })} /></div>
        </div>
      </FormModal>

      {/* Add/Edit Clinic Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && dataType === 'clinic'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Clinic' : 'Add Clinic'} onSubmit={handleSave} submitLabel={editModalOpen ? 'Save Changes' : 'Add Clinic'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={clinicForm.name} onChange={(e) => setClinicForm({ ...clinicForm, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Location</Label><Input value={clinicForm.location} onChange={(e) => setClinicForm({ ...clinicForm, location: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={clinicForm.type} onValueChange={(v) => setClinicForm({ ...clinicForm, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50"><SelectItem value="On-site">On-site</SelectItem><SelectItem value="External">External</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={clinicForm.capacity} onChange={(e) => setClinicForm({ ...clinicForm, capacity: e.target.value })} /></div>
          </div>
        </div>
      </FormModal>

      {/* Add/Edit Provider Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && dataType === 'provider'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Provider' : 'Add Provider'} onSubmit={handleSave} submitLabel={editModalOpen ? 'Save Changes' : 'Add Provider'} size="md">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={providerForm.name} onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Specialty</Label><Input value={providerForm.specialty} onChange={(e) => setProviderForm({ ...providerForm, specialty: e.target.value })} /></div>
            <div className="space-y-2"><Label>License</Label><Input value={providerForm.license} onChange={(e) => setProviderForm({ ...providerForm, license: e.target.value })} /></div>
          </div>
          <div className="space-y-2">
            <Label>Clinic</Label>
            <Select value={providerForm.clinic} onValueChange={(v) => setProviderForm({ ...providerForm, clinic: v })}>
              <SelectTrigger><SelectValue placeholder="Select clinic" /></SelectTrigger>
              <SelectContent className="bg-card z-50">{clinics.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      {/* Add/Edit Medication Modal */}
      <FormModal open={(addModalOpen || editModalOpen) && dataType === 'medication'} onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }} title={editModalOpen ? 'Edit Medication' : 'Add Medication'} onSubmit={handleSave} submitLabel={editModalOpen ? 'Save Changes' : 'Add Medication'} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Brand Name</Label><Input value={medicationForm.name} onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Generic Name</Label><Input value={medicationForm.genericName} onChange={(e) => setMedicationForm({ ...medicationForm, genericName: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category</Label><Input value={medicationForm.category} onChange={(e) => setMedicationForm({ ...medicationForm, category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Dosage Form</Label><Input value={medicationForm.dosageForm} onChange={(e) => setMedicationForm({ ...medicationForm, dosageForm: e.target.value })} /></div>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} title={`Delete ${getDataTypeLabel()}`} description={`Are you sure you want to delete this ${getDataTypeLabel().toLowerCase()}? This action cannot be undone.`} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
