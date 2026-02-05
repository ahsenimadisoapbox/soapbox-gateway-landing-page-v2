import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionButtons } from '../components/common/ActionButtons';
import { toast } from '../hooks/use-toast';
import { Progress } from '../components/ui/progress';
import { 
  Radio, 
  Search, 
  Plus, 
  Download,
  AlertTriangle,
  Activity,
  Thermometer,
  Volume2,
  Wind,
  Zap,
} from 'lucide-react';

interface ExposureRecord {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  exposureType: string;
  currentLevel: number;
  threshold: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  lastReading: string;
  employeesAffected: number;
}

const mockExposures: ExposureRecord[] = [
  { id: '1', deviceId: 'DEV-001', deviceName: 'Noise Monitor A1', location: 'Manufacturing Floor', exposureType: 'Noise', currentLevel: 78, threshold: 85, unit: 'dB', status: 'normal', lastReading: '2025-01-05T10:30:00', employeesAffected: 45 },
  { id: '2', deviceId: 'DEV-002', deviceName: 'Air Quality Sensor B2', location: 'Paint Shop', exposureType: 'Chemical', currentLevel: 42, threshold: 50, unit: 'ppm', status: 'warning', lastReading: '2025-01-05T10:28:00', employeesAffected: 12 },
  { id: '3', deviceId: 'DEV-003', deviceName: 'Dust Monitor C3', location: 'Warehouse', exposureType: 'Particulate', currentLevel: 8, threshold: 10, unit: 'mg/m³', status: 'normal', lastReading: '2025-01-05T10:25:00', employeesAffected: 28 },
  { id: '4', deviceId: 'DEV-004', deviceName: 'Radiation Detector D1', location: 'Quality Lab', exposureType: 'Radiation', currentLevel: 0.3, threshold: 0.5, unit: 'mSv', status: 'normal', lastReading: '2025-01-05T10:20:00', employeesAffected: 8 },
  { id: '5', deviceId: 'DEV-005', deviceName: 'Noise Monitor A2', location: 'Assembly Line', exposureType: 'Noise', currentLevel: 92, threshold: 85, unit: 'dB', status: 'critical', lastReading: '2025-01-05T10:32:00', employeesAffected: 32 },
];

export default function ExposureMonitoring() {
  const [exposures, setExposures] = useState<ExposureRecord[]>(mockExposures);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedExposure, setSelectedExposure] = useState<ExposureRecord | null>(null);
  const [exportFormat, setExportFormat] = useState('csv');

  const [formData, setFormData] = useState<Partial<ExposureRecord>>({
    deviceId: '',
    deviceName: '',
    location: '',
    exposureType: 'Noise',
    currentLevel: 0,
    threshold: 85,
    unit: 'dB',
    status: 'normal',
    employeesAffected: 0,
  });

  const filteredExposures = exposures.filter(e => {
    const matchesSearch = e.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         e.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || e.exposureType === typeFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (e: ExposureRecord) => { setSelectedExposure(e); setViewModalOpen(true); };
  const handleEdit = (e: ExposureRecord) => { setSelectedExposure(e); setFormData(e); setEditModalOpen(true); };
  const handleDelete = (e: ExposureRecord) => { setSelectedExposure(e); setDeleteDialogOpen(true); };
  const handleAdd = () => {
    setFormData({ deviceId: '', deviceName: '', location: '', exposureType: 'Noise', currentLevel: 0, threshold: 85, unit: 'dB', status: 'normal', employeesAffected: 0 });
    setAddModalOpen(true);
  };

  const handleSaveNew = () => {
    const newExposure: ExposureRecord = {
      id: Date.now().toString(),
      deviceId: `DEV-${String(exposures.length + 1).padStart(3, '0')}`,
      deviceName: formData.deviceName || '',
      location: formData.location || '',
      exposureType: formData.exposureType || 'Noise',
      currentLevel: formData.currentLevel || 0,
      threshold: formData.threshold || 85,
      unit: formData.unit || 'dB',
      status: formData.status as ExposureRecord['status'],
      lastReading: new Date().toISOString(),
      employeesAffected: formData.employeesAffected || 0,
    };
    setExposures([newExposure, ...exposures]);
    setAddModalOpen(false);
    toast({ title: 'Device Added', description: `${newExposure.deviceName} has been added.` });
  };

  const handleSaveEdit = () => {
    if (!selectedExposure) return;
    setExposures(exposures.map(e => e.id === selectedExposure.id ? { ...e, ...formData } as ExposureRecord : e));
    setEditModalOpen(false);
    toast({ title: 'Device Updated', description: 'Device settings have been updated.' });
  };

  const handleConfirmDelete = () => {
    if (!selectedExposure) return;
    setExposures(exposures.filter(e => e.id !== selectedExposure.id));
    setDeleteDialogOpen(false);
    toast({ title: 'Device Removed', description: 'The monitoring device has been removed.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: `Exporting exposure data to ${exportFormat.toUpperCase()}...` });
    setExportModalOpen(false);
    setTimeout(() => { toast({ title: 'Export Complete', description: 'Exposure data exported successfully.' }); }, 1500);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'normal': return 'success';
      default: return 'default';
    }
  };

  const getExposureIcon = (type: string) => {
    switch (type) {
      case 'Noise': return Volume2;
      case 'Chemical': return Wind;
      case 'Radiation': return Zap;
      case 'Particulate': return Wind;
      default: return Thermometer;
    }
  };

  const stats = [
    { label: 'Active Monitors', value: exposures.length, color: 'text-info', icon: Radio },
    { label: 'Normal', value: exposures.filter(e => e.status === 'normal').length, color: 'text-success', icon: Activity },
    { label: 'Warnings', value: exposures.filter(e => e.status === 'warning').length, color: 'text-warning', icon: AlertTriangle },
    { label: 'Critical', value: exposures.filter(e => e.status === 'critical').length, color: 'text-destructive', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Radio className="h-7 w-7 text-primary" />Exposure Monitoring</h1>
          <p className="page-subtitle">Real-time monitoring of occupational exposure levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportModalOpen(true)}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Device</Button>
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

      {/* Critical Alerts */}
      {exposures.filter(e => e.status === 'critical').length > 0 && (
        <Card className="border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exposures.filter(e => e.status === 'critical').map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium">{e.deviceName} - {e.location}</p>
                      <p className="text-sm text-muted-foreground">Level: {e.currentLevel}{e.unit} (Threshold: {e.threshold}{e.unit})</p>
                    </div>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleView(e)}>Investigate</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search devices..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Noise">Noise</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
                <SelectItem value="Particulate">Particulate</SelectItem>
                <SelectItem value="Radiation">Radiation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="data-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Current Level</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Affected</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExposures.map((e) => {
              const Icon = getExposureIcon(e.exposureType);
              const percentage = (e.currentLevel / e.threshold) * 100;
              return (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
                      <div><p className="font-medium">{e.deviceName}</p><p className="text-xs text-muted-foreground">{e.deviceId}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>{e.location}</TableCell>
                  <TableCell>{e.exposureType}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span className="font-medium">{e.currentLevel} {e.unit}</span>
                      <Progress value={Math.min(percentage, 100)} className={`h-2 ${percentage > 100 ? 'bg-destructive/20' : percentage > 80 ? 'bg-warning/20' : 'bg-success/20'}`} />
                    </div>
                  </TableCell>
                  <TableCell>{e.threshold} {e.unit}</TableCell>
                  <TableCell><StatusBadge variant={getStatusVariant(e.status)}>{e.status}</StatusBadge></TableCell>
                  <TableCell>{e.employeesAffected} employees</TableCell>
                  <TableCell className="text-right"><ActionButtons onView={() => handleView(e)} onEdit={() => handleEdit(e)} onDelete={() => handleDelete(e)} /></TableCell>
                </TableRow>
              );
            })}
            {filteredExposures.length === 0 && (
              <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No devices found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Modal */}
      <FormModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Device Details" description={selectedExposure?.deviceId} size="lg">
        {selectedExposure && (
          <div className="space-y-4">
            <div className="form-section">
              <div className="form-section-title"><Radio className="h-4 w-4" /> Device Information</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Device Name:</span> <span className="font-medium ml-2">{selectedExposure.deviceName}</span></div>
                <div><span className="text-muted-foreground">Device ID:</span> <span className="font-medium ml-2">{selectedExposure.deviceId}</span></div>
                <div><span className="text-muted-foreground">Location:</span> <span className="font-medium ml-2">{selectedExposure.location}</span></div>
                <div><span className="text-muted-foreground">Exposure Type:</span> <span className="font-medium ml-2">{selectedExposure.exposureType}</span></div>
              </div>
            </div>
            <div className="form-section">
              <div className="form-section-title"><Activity className="h-4 w-4" /> Current Readings</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Current Level:</span> <span className="font-medium ml-2">{selectedExposure.currentLevel} {selectedExposure.unit}</span></div>
                <div><span className="text-muted-foreground">Threshold:</span> <span className="font-medium ml-2">{selectedExposure.threshold} {selectedExposure.unit}</span></div>
                <div className="flex items-center gap-2"><span className="text-muted-foreground">Status:</span> <StatusBadge variant={getStatusVariant(selectedExposure.status)}>{selectedExposure.status}</StatusBadge></div>
                <div><span className="text-muted-foreground">Employees Affected:</span> <span className="font-medium ml-2">{selectedExposure.employeesAffected}</span></div>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Add/Edit Modal */}
      <FormModal
        open={addModalOpen || editModalOpen}
        onClose={() => { setAddModalOpen(false); setEditModalOpen(false); }}
        title={addModalOpen ? 'Add Monitoring Device' : 'Edit Device'}
        onSubmit={addModalOpen ? handleSaveNew : handleSaveEdit}
        submitLabel={addModalOpen ? 'Add Device' : 'Save Changes'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Device Name</Label><Input value={formData.deviceName} onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })} placeholder="Enter device name" /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter location" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Exposure Type</Label>
              <Select value={formData.exposureType} onValueChange={(v) => setFormData({ ...formData, exposureType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="Noise">Noise</SelectItem>
                  <SelectItem value="Chemical">Chemical</SelectItem>
                  <SelectItem value="Particulate">Particulate</SelectItem>
                  <SelectItem value="Radiation">Radiation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Threshold</Label><Input type="number" value={formData.threshold} onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Unit</Label><Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="dB, ppm, etc." /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Current Level</Label><Input type="number" value={formData.currentLevel} onChange={(e) => setFormData({ ...formData, currentLevel: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Employees Affected</Label><Input type="number" value={formData.employeesAffected} onChange={(e) => setFormData({ ...formData, employeesAffected: Number(e.target.value) })} /></div>
          </div>
        </div>
      </FormModal>

      {/* Export Modal */}
      <FormModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} title="Export Data" onSubmit={handleExport} submitLabel="Export">
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
          <p className="text-sm text-muted-foreground">{filteredExposures.length} records will be exported.</p>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} title="Remove Device" description={`Remove ${selectedExposure?.deviceName}? This action cannot be undone.`} onConfirm={handleConfirmDelete} confirmLabel="Remove" variant="destructive" />
    </div>
  );
}
