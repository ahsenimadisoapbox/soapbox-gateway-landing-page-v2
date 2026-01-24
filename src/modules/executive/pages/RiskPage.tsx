import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { StatusBadge, ActionButtons } from '../components/shared/StatusBadge';
import { FormModal, ViewModal, DeleteConfirmModal } from '../components/modals/FormModal';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Shield, AlertTriangle, TrendingUp, Minus } from 'lucide-react';
import { riskData } from '../data/mockData';
import { toast } from 'sonner';

const riskFormFields = [
  { name: 'name', label: 'Risk Name', type: 'text' as const, required: true },
  { name: 'category', label: 'Category', type: 'select' as const, required: true, options: [
    { value: 'Compliance', label: 'Compliance' },
    { value: 'Safety', label: 'Safety' },
    { value: 'Quality', label: 'Quality' },
    { value: 'Environmental', label: 'Environmental' },
    { value: 'IT Security', label: 'IT Security' },
    { value: 'Operational', label: 'Operational' },
    { value: 'Technology', label: 'Technology' },
  ]},
  { name: 'severity', label: 'Severity', type: 'select' as const, required: true, options: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'likelihood', label: 'Likelihood (1-5)', type: 'number' as const, required: true },
  { name: 'impact', label: 'Impact (1-5)', type: 'number' as const, required: true },
  { name: 'owner', label: 'Owner', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'mitigation', label: 'Mitigation Plan', type: 'textarea' as const },
];

// Mock risk data for the heatmap with velocity
const riskRegisterData = [
  { id: 'RSK-2024-001', name: 'Supply Chain Disruption', category: 'Operational', likelihood: 4, impact: 5, residual: 12, velocity: 'increasing', owner: 'COO' },
  { id: 'RSK-2024-003', name: 'Regulatory Compliance Gap', category: 'Compliance', likelihood: 3, impact: 5, residual: 9, velocity: 'stable', owner: 'CRO' },
  { id: 'RSK-2024-005', name: 'Cybersecurity Threat', category: 'Technology', likelihood: 3, impact: 4, residual: 6, velocity: 'stable', owner: 'CIO' },
];

const RiskPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const handleCreate = (data: any) => {
    toast.success('Risk created successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('Risk updated successfully');
  };

  const handleDelete = () => {
    toast.success('Risk deleted successfully');
  };

  const handleView = (risk: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Risk ID', value: risk.id },
        name: { label: 'Risk Name', value: risk.name },
        category: { label: 'Category', value: risk.category },
        likelihood: { label: 'Likelihood', value: `${risk.likelihood}` },
        impact: { label: 'Impact', value: `${risk.impact}` },
        residual: { label: 'Residual Score', value: risk.residual },
        velocity: { label: 'Velocity', value: risk.velocity },
        owner: { label: 'Owner', value: risk.owner },
      },
    });
  };

  // Generate heatmap cells
  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score <= 4) return 'bg-green-200';
    if (score <= 6) return 'bg-green-300';
    if (score <= 9) return 'bg-yellow-300';
    if (score <= 12) return 'bg-orange-400';
    if (score <= 16) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Count risks at each position
  const getRiskCount = (likelihood: number, impact: number) => {
    return riskRegisterData.filter(r => r.likelihood === likelihood && r.impact === impact).length;
  };

  const kpiCards = [
    { 
      label: 'Active Risks', 
      value: '3', 
      description: 'Under management',
      icon: Shield,
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Material Risks', 
      value: '0', 
      description: 'Score ≥15',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    { 
      label: 'Increasing Velocity', 
      value: '1', 
      description: 'Trending upward',
      icon: TrendingUp,
      iconColor: 'text-amber-500'
    },
    { 
      label: 'Avg Residual Score', 
      value: '8.3', 
      description: 'Portfolio average',
      icon: Shield,
      iconColor: 'text-muted-foreground'
    },
  ];

  const getVelocityDisplay = (velocity: string) => {
    if (velocity === 'increasing') {
      return (
        <span className="flex items-center gap-1 text-red-500">
          <TrendingUp className="h-4 w-4" />
          Increasing
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-4 w-4" />
        Stable
      </span>
    );
  };

  const getResidualBadge = (score: number) => {
    let bgColor = 'bg-emerald-500';
    if (score >= 12) bgColor = 'bg-red-500';
    else if (score >= 9) bgColor = 'bg-orange-500';
    else if (score >= 6) bgColor = 'bg-amber-500';
    
    return (
      <Badge className={`${bgColor} text-white hover:${bgColor} rounded-full h-7 w-7 flex items-center justify-center p-0`}>
        {score}
      </Badge>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Risk & Exposure Governance</h1>
            <p className="text-muted-foreground mt-1">Enterprise risk heatmap, velocity indicators, and exposure analysis</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                </div>
                <div className={`p-2 rounded-lg bg-muted/50`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Risk Heatmap */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Risk Heatmap (Likelihood × Impact)</h3>
          <div className="flex">
            <div className="flex flex-col items-center mr-2">
              <span className="text-sm text-muted-foreground mb-2">Impact</span>
              <div className="flex flex-col justify-between h-[320px] py-2">
                {[5, 4, 3, 2, 1].map((num) => (
                  <span key={num} className="text-sm text-muted-foreground h-12 flex items-center">{num}</span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1 max-w-md">
                {/* Row 5 (Impact 5) */}
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const count = getRiskCount(likelihood, 5);
                  return (
                    <div
                      key={`5-${likelihood}`}
                      className={`h-12 rounded flex items-center justify-center ${getCellColor(likelihood, 5)}`}
                    >
                      {count > 0 && <span className="font-bold text-white">{count}</span>}
                    </div>
                  );
                })}
                {/* Row 4 (Impact 4) */}
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const count = getRiskCount(likelihood, 4);
                  return (
                    <div
                      key={`4-${likelihood}`}
                      className={`h-12 rounded flex items-center justify-center ${getCellColor(likelihood, 4)}`}
                    >
                      {count > 0 && <span className="font-bold text-white">{count}</span>}
                    </div>
                  );
                })}
                {/* Row 3 (Impact 3) */}
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const count = getRiskCount(likelihood, 3);
                  return (
                    <div
                      key={`3-${likelihood}`}
                      className={`h-12 rounded flex items-center justify-center ${getCellColor(likelihood, 3)}`}
                    >
                      {count > 0 && <span className="font-bold text-white">{count}</span>}
                    </div>
                  );
                })}
                {/* Row 2 (Impact 2) */}
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const count = getRiskCount(likelihood, 2);
                  return (
                    <div
                      key={`2-${likelihood}`}
                      className={`h-12 rounded flex items-center justify-center ${getCellColor(likelihood, 2)}`}
                    >
                      {count > 0 && <span className="font-bold text-white">{count}</span>}
                    </div>
                  );
                })}
                {/* Row 1 (Impact 1) */}
                {[1, 2, 3, 4, 5].map((likelihood) => {
                  const count = getRiskCount(likelihood, 1);
                  return (
                    <div
                      key={`1-${likelihood}`}
                      className={`h-12 rounded flex items-center justify-center ${getCellColor(likelihood, 1)}`}
                    >
                      {count > 0 && <span className="font-bold text-white">{count}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between max-w-md mt-2 px-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span key={num} className="text-sm text-muted-foreground">{num}</span>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2 max-w-md">Likelihood</p>
            </div>
          </div>
        </Card>

        {/* Risk Register */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Risk Register</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>L × I</TableHead>
                  <TableHead>Residual</TableHead>
                  <TableHead>Velocity</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskRegisterData.map((risk) => (
                  <TableRow key={risk.id} className="data-table-row">
                    <TableCell className="font-mono text-sm">{risk.id}</TableCell>
                    <TableCell className="font-medium">{risk.name}</TableCell>
                    <TableCell>{risk.category}</TableCell>
                    <TableCell>{risk.likelihood} × {risk.impact}</TableCell>
                    <TableCell>{getResidualBadge(risk.residual)}</TableCell>
                    <TableCell>{getVelocityDisplay(risk.velocity)}</TableCell>
                    <TableCell>{risk.owner}</TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        onView={() => handleView(risk)}
                        onEdit={() => setEditModal({ open: true, data: risk })}
                        onDelete={() => setDeleteModal({ open: true, id: risk.id })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Add New Risk"
        description="Create a new risk entry in the register"
        fields={riskFormFields}
        onSubmit={handleCreate}
        submitLabel="Create Risk"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit Risk"
        description="Update risk details"
        fields={riskFormFields.map(f => ({
          ...f,
          defaultValue: editModal.data?.[f.name],
        }))}
        onSubmit={handleEdit}
        submitLabel="Update Risk"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Risk Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Risk"
        description="Are you sure you want to delete this risk? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default RiskPage;
