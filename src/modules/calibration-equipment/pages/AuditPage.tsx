import { useState } from 'react';
import { ClipboardCheck, Download, Package, Calendar, FileText } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { ActionButtons } from '../components/ActionButtons';
import { StatusBadge } from '../components/StatusBadge';
import { toast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockEquipment } from '../data/mockData';

interface AuditPackage {
  id: string;
  equipmentName: string;
  assetId: string;
  period: string;
  status: 'pending' | 'generated' | 'exported';
  generatedAt: string;
  documents: string[];
}

const mockAuditPackages: AuditPackage[] = [
  { id: 'AUD-001', equipmentName: 'Digital Multimeter', assetId: 'EQ-001', period: '2024 Q4', status: 'generated', generatedAt: '2025-01-05', documents: ['Calibration Records', 'OOT Investigations', 'PM Records'] },
  { id: 'AUD-002', equipmentName: 'Pressure Gauge', assetId: 'EQ-002', period: '2024 Q4', status: 'exported', generatedAt: '2025-01-04', documents: ['Calibration Records', 'Risk Assessments'] },
  { id: 'AUD-003', equipmentName: 'Temperature Sensor', assetId: 'EQ-003', period: '2024 Q3', status: 'pending', generatedAt: '-', documents: [] },
  { id: 'AUD-004', equipmentName: 'pH Meter', assetId: 'EQ-004', period: '2024 Annual', status: 'generated', generatedAt: '2025-01-02', documents: ['Full Lifecycle Records', 'Qualification Documents'] },
  { id: 'AUD-005', equipmentName: 'Flow Meter', assetId: 'EQ-005', period: '2024 Q4', status: 'pending', generatedAt: '-', documents: [] },
];

const AuditPage = () => {
  const [packages, setPackages] = useState<AuditPackage[]>(mockAuditPackages);
  const [selectedPackage, setSelectedPackage] = useState<AuditPackage | undefined>();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Generating audit evidence package...' });
  };

  const handleView = (pkg: AuditPackage) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
  };

  const handleEdit = (pkg: AuditPackage) => {
    setSelectedPackage(pkg);
    setShowViewModal(true);
    toast({ title: 'Edit Mode', description: 'Audit package opened for editing.' });
  };

  const handleDelete = (pkg: AuditPackage) => {
    setPackages(prev => prev.filter(p => p.id !== pkg.id));
    toast({ title: 'Package Deleted', description: `Audit package ${pkg.id} has been deleted.` });
  };

  const handleGenerate = () => {
    if (selectedEquipment && selectedPeriod) {
      const equipment = mockEquipment.find(e => e.id === selectedEquipment);
      const newPackage: AuditPackage = {
        id: `AUD-${String(packages.length + 1).padStart(3, '0')}`,
        equipmentName: equipment?.name || 'Unknown',
        assetId: selectedEquipment,
        period: selectedPeriod,
        status: 'generated',
        generatedAt: new Date().toISOString().split('T')[0],
        documents: ['Calibration Records', 'PM Records', 'Risk Assessments'],
      };
      setPackages(prev => [...prev, newPackage]);
      setShowGenerateModal(false);
      setSelectedEquipment('');
      setSelectedPeriod('');
      toast({ title: 'Package Generated', description: 'Audit evidence package has been generated.' });
    }
  };

  return (
    <div>
      <PageHeader
        title="Audit & Evidence"
        description="Select equipment, period, and generate comprehensive audit packages"
        icon={ClipboardCheck}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
              <Package className="h-4 w-4 mr-2" />
              Generate Package
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        }
      />

      {/* Audit Packages Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Audit Evidence Packages</h3>
          <p className="text-sm text-muted-foreground">Select equipment and period to generate comprehensive audit packages for regulatory compliance.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Package ID</th>
                <th>Asset ID</th>
                <th>Equipment</th>
                <th>Period</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Documents</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="font-medium">{pkg.id}</td>
                  <td>{pkg.assetId}</td>
                  <td>{pkg.equipmentName}</td>
                  <td>{pkg.period}</td>
                  <td>
                    <StatusBadge status={pkg.status === 'exported' ? 'completed' : pkg.status === 'generated' ? 'active' : 'pending'} />
                  </td>
                  <td>{pkg.generatedAt}</td>
                  <td className="text-muted-foreground">{pkg.documents.length > 0 ? `${pkg.documents.length} documents` : '-'}</td>
                  <td className="text-right">
                    <ActionButtons
                      onView={() => handleView(pkg)}
                      onEdit={() => handleEdit(pkg)}
                      onDelete={() => handleDelete(pkg)}
                      showEdit={true}
                      showDelete={true}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Package Details</DialogTitle>
            <DialogDescription>View audit package information for {selectedPackage?.equipmentName}</DialogDescription>
          </DialogHeader>
          {selectedPackage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Package ID</Label>
                  <p className="font-medium">{selectedPackage.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Asset ID</Label>
                  <p className="font-medium">{selectedPackage.assetId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Equipment</Label>
                  <p className="font-medium">{selectedPackage.equipmentName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Period</Label>
                  <p className="font-medium">{selectedPackage.period}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <StatusBadge status={selectedPackage.status === 'exported' ? 'completed' : selectedPackage.status === 'generated' ? 'active' : 'pending'} />
                </div>
                <div>
                  <Label className="text-muted-foreground">Generated At</Label>
                  <p className="font-medium">{selectedPackage.generatedAt}</p>
                </div>
              </div>
              {selectedPackage.documents.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Included Documents</Label>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    {selectedPackage.documents.map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => { toast({ title: 'Export Started', description: 'Downloading audit package...' }); }}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Package
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Package Modal */}
      <Dialog open={showGenerateModal} onOpenChange={setShowGenerateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Audit Package</DialogTitle>
            <DialogDescription>Select equipment and period to generate a comprehensive audit evidence package.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Equipment</Label>
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {mockEquipment.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name} ({e.id})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025 Q1">2025 Q1</SelectItem>
                  <SelectItem value="2024 Q4">2024 Q4</SelectItem>
                  <SelectItem value="2024 Q3">2024 Q3</SelectItem>
                  <SelectItem value="2024 Annual">2024 Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
              <Button onClick={handleGenerate} disabled={!selectedEquipment || !selectedPeriod}>
                <FileText className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditPage;