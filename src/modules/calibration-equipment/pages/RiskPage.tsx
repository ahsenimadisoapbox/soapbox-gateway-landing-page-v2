import { useState } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { KPICard } from '../components/KPICard';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { mockEquipment } from '../data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';

interface RiskAssessment {
  id: string;
  equipmentName: string;
  assetId: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  calibrationInterval: string;
  lastAssessment: string;
  factors: string[];
}

const mockRiskAssessments: RiskAssessment[] = [
  { id: 'RISK-001', equipmentName: 'Digital Multimeter', assetId: 'EQ-001', riskLevel: 'critical', riskScore: 92, calibrationInterval: '30 days', lastAssessment: '2025-01-02', factors: ['High usage frequency', 'Critical measurement function', 'OOT history'] },
  { id: 'RISK-002', equipmentName: 'Pressure Gauge', assetId: 'EQ-002', riskLevel: 'high', riskScore: 75, calibrationInterval: '60 days', lastAssessment: '2025-01-01', factors: ['Safety-critical', 'Environmental exposure'] },
  { id: 'RISK-003', equipmentName: 'Temperature Sensor', assetId: 'EQ-003', riskLevel: 'medium', riskScore: 55, calibrationInterval: '90 days', lastAssessment: '2024-12-28', factors: ['Moderate drift potential', 'Process-critical'] },
  { id: 'RISK-004', equipmentName: 'pH Meter', assetId: 'EQ-004', riskLevel: 'low', riskScore: 25, calibrationInterval: '180 days', lastAssessment: '2024-12-15', factors: ['Low usage', 'Non-critical application'] },
  { id: 'RISK-005', equipmentName: 'Flow Meter', assetId: 'EQ-005', riskLevel: 'high', riskScore: 78, calibrationInterval: '45 days', lastAssessment: '2025-01-03', factors: ['Continuous operation', 'High accuracy requirement'] },
];

const RiskPage = () => {
  const [assessments, setAssessments] = useState<RiskAssessment[]>(mockRiskAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<RiskAssessment | undefined>();
  const [showViewModal, setShowViewModal] = useState(false);

  const criticalCount = mockEquipment.filter(e => e.criticality === 'critical').length;
  const highCount = mockEquipment.filter(e => e.criticality === 'high').length;
  const mediumCount = mockEquipment.filter(e => e.criticality === 'medium').length;
  const lowCount = mockEquipment.filter(e => e.criticality === 'low').length;

  const handleView = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleEdit = (assessment: RiskAssessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
    toast({ title: 'Edit Mode', description: 'Risk assessment opened for editing.' });
  };

  const handleDelete = (assessment: RiskAssessment) => {
    setAssessments(prev => prev.filter(a => a.id !== assessment.id));
    toast({ title: 'Assessment Deleted', description: `Risk assessment ${assessment.id} has been deleted.` });
  };

  return (
    <div>
      <PageHeader
        title="Risk Assessment"
        description="Dynamic risk scoring and risk-driven interval management"
        icon={ShieldAlert}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KPICard title="Critical Risk" value={criticalCount} variant="danger" icon={AlertTriangle} />
        <KPICard title="High Risk" value={highCount} variant="warning" icon={TrendingUp} />
        <KPICard title="Medium Risk" value={mediumCount} variant="default" icon={Activity} />
        <KPICard title="Low Risk" value={lowCount} variant="success" icon={ShieldAlert} />
      </div>

      {/* Risk Assessments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Dynamic Risk Scoring & Risk-Driven Intervals</h3>
          <p className="text-sm text-muted-foreground">Risk assessments automatically adjust calibration intervals based on equipment criticality and historical data.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Risk ID</th>
                <th>Asset ID</th>
                <th>Equipment</th>
                <th>Risk Level</th>
                <th>Risk Score</th>
                <th>Cal. Interval</th>
                <th>Last Assessment</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="font-medium">{assessment.id}</td>
                  <td>{assessment.assetId}</td>
                  <td>{assessment.equipmentName}</td>
                  <td>
                    <StatusBadge status={assessment.riskLevel as StatusType} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            assessment.riskScore >= 80 ? 'bg-status-overdue' : 
                            assessment.riskScore >= 60 ? 'bg-status-due' : 
                            assessment.riskScore >= 40 ? 'bg-accent' : 'bg-status-active'
                          }`}
                          style={{ width: `${assessment.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{assessment.riskScore}</span>
                    </div>
                  </td>
                  <td>{assessment.calibrationInterval}</td>
                  <td>{assessment.lastAssessment}</td>
                  <td className="text-right">
                    <ActionButtons
                      onView={() => handleView(assessment)}
                      onEdit={() => handleEdit(assessment)}
                      onDelete={() => handleDelete(assessment)}
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
            <DialogTitle>Risk Assessment Details</DialogTitle>
            <DialogDescription>View risk assessment information for {selectedAssessment?.equipmentName}</DialogDescription>
          </DialogHeader>
          {selectedAssessment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Risk ID</Label>
                  <p className="font-medium">{selectedAssessment.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Asset ID</Label>
                  <p className="font-medium">{selectedAssessment.assetId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Equipment</Label>
                  <p className="font-medium">{selectedAssessment.equipmentName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Risk Level</Label>
                  <StatusBadge status={selectedAssessment.riskLevel as StatusType} />
                </div>
                <div>
                  <Label className="text-muted-foreground">Risk Score</Label>
                  <p className="font-medium">{selectedAssessment.riskScore}/100</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Calibration Interval</Label>
                  <p className="font-medium">{selectedAssessment.calibrationInterval}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Risk Factors</Label>
                <ul className="list-disc list-inside mt-1 text-sm">
                  {selectedAssessment.factors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RiskPage;