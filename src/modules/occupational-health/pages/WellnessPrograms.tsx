import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
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
import { Progress } from '../components/ui/progress';
import { 
  Heart, 
  Search, 
  Plus, 
  Download,
  Users,
  Calendar,
  Target,
  Activity,
  Award,
  TrendingUp,
} from 'lucide-react';

interface WellnessProgram {
  id: string;
  name: string;
  category: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  enrolled: number;
  capacity: number;
  coordinator: string;
  objectives: string;
}

const mockPrograms: WellnessProgram[] = [
  { id: '1', name: 'Heart Health Challenge', category: 'Cardiovascular', description: 'A 12-week program focused on improving cardiovascular health through exercise and nutrition.', startDate: '2025-01-01', endDate: '2025-03-31', status: 'active', enrolled: 45, capacity: 50, coordinator: 'Dr. Sarah Chen', objectives: 'Reduce average resting heart rate by 5%, increase daily step count to 10,000' },
  { id: '2', name: 'Stress Management Workshop', category: 'Mental Health', description: 'Weekly sessions on stress reduction techniques including meditation and mindfulness.', startDate: '2025-01-15', endDate: '2025-02-28', status: 'active', enrolled: 28, capacity: 30, coordinator: 'Wellness Team', objectives: 'Teach practical stress management techniques, reduce reported stress levels' },
  { id: '3', name: 'Ergonomics Training', category: 'Musculoskeletal', description: 'Comprehensive training on proper workplace ergonomics and posture.', startDate: '2025-02-01', endDate: '2025-02-15', status: 'upcoming', enrolled: 12, capacity: 40, coordinator: 'Safety Team', objectives: 'Reduce ergonomic-related complaints by 30%' },
  { id: '4', name: 'Smoking Cessation Program', category: 'Lifestyle', description: 'Support program for employees looking to quit smoking.', startDate: '2024-10-01', endDate: '2024-12-31', status: 'completed', enrolled: 15, capacity: 20, coordinator: 'HR Wellness', objectives: '50% of participants successfully quit smoking' },
  { id: '5', name: 'Nutrition & Weight Management', category: 'Nutrition', description: 'Educational program on healthy eating habits and weight management.', startDate: '2025-01-10', endDate: '2025-04-10', status: 'active', enrolled: 35, capacity: 40, coordinator: 'Nutrition Team', objectives: 'Improve dietary habits, achieve healthy BMI targets' },
];

export default function WellnessPrograms() {
  const [programs, setPrograms] = useState<WellnessProgram[]>(mockPrograms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<WellnessProgram | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');

  const [formData, setFormData] = useState<Partial<WellnessProgram>>({
    name: '',
    category: 'Cardiovascular',
    description: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    enrolled: 0,
    capacity: 30,
    coordinator: '',
    objectives: '',
  });

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleView = (p: WellnessProgram) => { setSelectedProgram(p); setViewModalOpen(true); };
  const handleEdit = (p: WellnessProgram) => { setSelectedProgram(p); setFormData(p); setEditModalOpen(true); };
  const handleDelete = (p: WellnessProgram) => { setSelectedProgram(p); setDeleteDialogOpen(true); };
  const handleAdd = () => {
    setFormData({ name: '', category: 'Cardiovascular', description: '', startDate: '', endDate: '', status: 'upcoming', enrolled: 0, capacity: 30, coordinator: '', objectives: '' });
    setAddModalOpen(true);
  };

  const handleSaveNew = () => {
    const newProgram: WellnessProgram = {
      id: Date.now().toString(),
      name: formData.name || '',
      category: formData.category || 'Cardiovascular',
      description: formData.description || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      status: formData.status as WellnessProgram['status'],
      enrolled: formData.enrolled || 0,
      capacity: formData.capacity || 30,
      coordinator: formData.coordinator || '',
      objectives: formData.objectives || '',
    };
    setPrograms([newProgram, ...programs]);
    setAddModalOpen(false);
    toast({ title: 'Program Created', description: `${newProgram.name} has been created.` });
  };

  const handleSaveEdit = () => {
    if (!selectedProgram) return;
    setPrograms(programs.map(p => p.id === selectedProgram.id ? { ...p, ...formData } as WellnessProgram : p));
    setEditModalOpen(false);
    toast({ title: 'Program Updated', description: 'Program has been updated.' });
  };

  const handleConfirmDelete = () => {
    if (!selectedProgram) return;
    setPrograms(programs.filter(p => p.id !== selectedProgram.id));
    setDeleteDialogOpen(false);
    toast({ title: 'Program Deleted', description: 'Program has been removed.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: `Exporting programs to ${exportFormat.toUpperCase()}...` });
    setExportModalOpen(false);
    setTimeout(() => { toast({ title: 'Export Complete', description: 'Programs exported successfully.' }); }, 1500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'upcoming': return 'info';
      case 'completed': return 'muted';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const categories = ['Cardiovascular', 'Mental Health', 'Musculoskeletal', 'Lifestyle', 'Nutrition'];
  
  const totalEnrolled = programs.filter(p => p.status === 'active').reduce((sum, p) => sum + p.enrolled, 0);
  const stats = [
    { label: 'Active Programs', value: programs.filter(p => p.status === 'active').length, color: 'text-success', icon: Activity },
    { label: 'Total Enrolled', value: totalEnrolled, color: 'text-primary', icon: Users },
    { label: 'Upcoming', value: programs.filter(p => p.status === 'upcoming').length, color: 'text-info', icon: Calendar },
    { label: 'Completed', value: programs.filter(p => p.status === 'completed').length, color: 'text-muted-foreground', icon: Award },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Heart className="h-7 w-7 text-primary" />Wellness Programs</h1>
          <p className="page-subtitle">Manage employee wellness and preventive health programs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />New Program</Button>
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

      {/* Active Programs Highlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-success" />Active Programs</CardTitle>
          <CardDescription>Currently running wellness initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {programs.filter(p => p.status === 'active').slice(0, 3).map(p => (
              <div key={p.id} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{p.name}</h4>
                  <StatusBadge variant="success">Active</StatusBadge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{p.category}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment</span>
                    <span>{p.enrolled}/{p.capacity}</span>
                  </div>
                  <Progress value={(p.enrolled / p.capacity) * 100} className="h-2" />
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => handleView(p)}>View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search programs..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
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
              <TableHead>Program Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Enrollment</TableHead>
              <TableHead>Coordinator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrograms.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Heart className="h-5 w-5 text-primary" /></div>
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p></div>
                  </div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(p.startDate).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">to {new Date(p.endDate).toLocaleDateString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span className="text-sm">{p.enrolled}/{p.capacity}</span>
                    <Progress value={(p.enrolled / p.capacity) * 100} className="h-1.5 w-16" />
                  </div>
                </TableCell>
                <TableCell>{p.coordinator}</TableCell>
                <TableCell><StatusBadge variant={getStatusVariant(p.status)}>{p.status}</StatusBadge></TableCell>
                <TableCell className="text-right"><ActionButtons onView={() => handleView(p)} onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p)} /></TableCell>
              </TableRow>
            ))}
            {filteredPrograms.length === 0 && (
              <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No programs found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Program Details" description={selectedProgram?.category} size="lg">
        {selectedProgram && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title"><Heart className="h-4 w-4" /> Program Information</div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium ml-2">{selectedProgram.name}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="font-medium ml-2">{selectedProgram.category}</span></div>
                <div><span className="text-muted-foreground">Description:</span> <span className="font-medium ml-2">{selectedProgram.description}</span></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Calendar className="h-4 w-4" /> Schedule & Enrollment</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Start Date:</span> <span className="font-medium ml-2">{new Date(selectedProgram.startDate).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">End Date:</span> <span className="font-medium ml-2">{new Date(selectedProgram.endDate).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">Enrolled:</span> <span className="font-medium ml-2">{selectedProgram.enrolled}/{selectedProgram.capacity}</span></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <StatusBadge variant={getStatusVariant(selectedProgram.status)}>{selectedProgram.status}</StatusBadge></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Target className="h-4 w-4" /> Objectives</div>
              <p className="text-sm">{selectedProgram.objectives}</p>
            </div>
          </div>
        )}
      </FormModal>

      {/* Add/Edit Modal */}
      <FormModal
        open={addModalOpen || editModalOpen}
        onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }}
        title={addModalOpen ? 'Create Program' : 'Edit Program'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Create Program' : 'Save Changes'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Program Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter program name" /></div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Program description..." rows={2} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Enrolled</Label><Input type="number" value={formData.enrolled} onChange={(e) => setFormData({ ...formData, enrolled: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Coordinator</Label><Input value={formData.coordinator} onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })} placeholder="Coordinator name" /></div>
          </div>
          <div className="space-y-2"><Label>Objectives</Label><Textarea value={formData.objectives} onChange={(e) => setFormData({ ...formData, objectives: e.target.value })} placeholder="Program objectives..." rows={2} /></div>
        </div>
      </FormModal>

      {/* Export Modal */}
      <FormModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} title="Export Programs" onSubmit={handleExport} submitLabel="Export">
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
          <p className="text-sm text-muted-foreground">{filteredPrograms.length} programs will be exported.</p>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} title="Delete Program" description={`Delete "${selectedProgram?.name}"? This cannot be undone.`} onConfirm={handleConfirmDelete} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
