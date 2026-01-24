import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { StatusBadge, ActionButtons } from '../components/shared/StatusBadge';
import { FormModal, ViewModal, DeleteConfirmModal } from '../components/modals/FormModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Package, Plus, Search, Filter, TrendingDown, TrendingUp } from 'lucide-react';
import { qualityMetrics, supplierRisks } from '../data/mockData';
import { toast } from 'sonner';

const ncrData = [
  { id: 'NCR001', title: 'Material specification deviation', category: 'Material', severity: 'high', source: 'Incoming Inspection', status: 'open', date: new Date() },
  { id: 'NCR002', title: 'Dimension out of tolerance', category: 'Process', severity: 'medium', source: 'In-Process QC', status: 'in-progress', date: new Date(Date.now() - 86400000) },
  { id: 'NCR003', title: 'Documentation incomplete', category: 'Documentation', severity: 'low', source: 'Final Inspection', status: 'closed', date: new Date(Date.now() - 172800000) },
];

const ncrFormFields = [
  { name: 'title', label: 'NCR Title', type: 'text' as const, required: true },
  { name: 'category', label: 'Category', type: 'select' as const, required: true, options: [
    { value: 'Material', label: 'Material' },
    { value: 'Process', label: 'Process' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Equipment', label: 'Equipment' },
  ]},
  { name: 'severity', label: 'Severity', type: 'select' as const, required: true, options: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'source', label: 'Detection Source', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'disposition', label: 'Disposition', type: 'textarea' as const },
];

const supplierFormFields = [
  { name: 'name', label: 'Supplier Name', type: 'text' as const, required: true },
  { name: 'riskLevel', label: 'Risk Level', type: 'select' as const, required: true, options: [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'status', label: 'Status', type: 'select' as const, required: true, options: [
    { value: 'approved', label: 'Approved' },
    { value: 'conditional', label: 'Conditional' },
    { value: 'suspended', label: 'Suspended' },
  ]},
  { name: 'category', label: 'Category', type: 'text' as const },
  { name: 'contact', label: 'Primary Contact', type: 'text' as const },
  { name: 'email', label: 'Contact Email', type: 'email' as const },
];

const QualityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createSupplierModalOpen, setCreateSupplierModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const handleCreate = (data: any) => {
    toast.success('NCR created successfully');
  };

  const handleCreateSupplier = (data: any) => {
    toast.success('Supplier added successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('Record updated successfully');
  };

  const handleDelete = () => {
    toast.success('Record deleted successfully');
  };

  const handleViewNCR = (ncr: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'NCR ID', value: ncr.id },
        title: { label: 'Title', value: ncr.title },
        category: { label: 'Category', value: ncr.category },
        severity: { label: 'Severity', value: <StatusBadge status={ncr.severity} variant="severity" /> },
        source: { label: 'Detection Source', value: ncr.source },
        status: { label: 'Status', value: <StatusBadge status={ncr.status} /> },
        date: { label: 'Date', value: ncr.date.toLocaleDateString() },
      },
    });
  };

  const handleViewSupplier = (supplier: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Supplier ID', value: supplier.id },
        name: { label: 'Supplier Name', value: supplier.name },
        riskLevel: { label: 'Risk Level', value: <StatusBadge status={supplier.riskLevel} variant="severity" /> },
        status: { label: 'Status', value: <StatusBadge status={supplier.status} /> },
        lastAudit: { label: 'Last Audit', value: supplier.lastAudit.toLocaleDateString() },
        issues: { label: 'Open Issues', value: supplier.issues },
      },
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Package className="h-6 w-6 text-accent" />
              Quality & Supplier Management
            </h1>
            <p className="text-muted-foreground mt-1">Quality metrics, NCRs, and supplier risk oversight</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreateSupplierModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create NCR
            </Button>
          </div>
        </div>

        {/* Quality Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {qualityMetrics.map((metric) => (
            <div key={metric.id} className="p-4 bg-card rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">{metric.name}</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{metric.value}{metric.unit === '%' ? '%' : ''}</p>
                {metric.unit !== '%' && <span className="text-sm text-muted-foreground mb-1">{metric.unit}</span>}
              </div>
              <p className={`text-sm flex items-center gap-1 mt-1 ${
                metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {metric.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                {metric.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                Target: {metric.target}{metric.unit === '%' ? '%' : ` ${metric.unit}`}
              </p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="ncrs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ncrs">Non-Conformances</TabsTrigger>
            <TabsTrigger value="suppliers">Supplier Risk</TabsTrigger>
            <TabsTrigger value="calibration">Calibration</TabsTrigger>
          </TabsList>

          <TabsContent value="ncrs">
            <ExecutivePanel title="Non-Conformance Reports">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search NCRs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ncrData.map((ncr) => (
                      <TableRow key={ncr.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{ncr.id}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{ncr.title}</TableCell>
                        <TableCell>{ncr.category}</TableCell>
                        <TableCell><StatusBadge status={ncr.severity} variant="severity" /></TableCell>
                        <TableCell>{ncr.source}</TableCell>
                        <TableCell><StatusBadge status={ncr.status} /></TableCell>
                        <TableCell className="text-center">
                          <ActionButtons
                            onView={() => handleViewNCR(ncr)}
                            onEdit={() => setEditModal({ open: true, data: ncr })}
                            onDelete={() => setDeleteModal({ open: true, id: ncr.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="suppliers">
            <ExecutivePanel title="Supplier Risk Overview">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Last Audit</TableHead>
                      <TableHead>Open Issues</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierRisks.map((supplier) => (
                      <TableRow key={supplier.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{supplier.id}</TableCell>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell><StatusBadge status={supplier.riskLevel} variant="severity" /></TableCell>
                        <TableCell>{supplier.lastAudit.toLocaleDateString()}</TableCell>
                        <TableCell>{supplier.issues}</TableCell>
                        <TableCell><StatusBadge status={supplier.status} /></TableCell>
                        <TableCell className="text-center">
                          <ActionButtons
                            onView={() => handleViewSupplier(supplier)}
                            onEdit={() => setEditModal({ open: true, data: supplier })}
                            onDelete={() => setDeleteModal({ open: true, id: supplier.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="calibration">
            <ExecutivePanel title="Calibration Compliance">
              <div className="text-center py-8">
                <p className="text-4xl font-bold text-success">98%</p>
                <p className="text-muted-foreground mt-2">Equipment Calibration Compliance</p>
                <p className="text-sm text-muted-foreground mt-1">Target: 100%</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-success/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-success">245</p>
                  <p className="text-sm text-muted-foreground">Calibrated</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-warning">5</p>
                  <p className="text-sm text-muted-foreground">Due This Week</p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-destructive">2</p>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create NCR"
        description="Create a new non-conformance report"
        fields={ncrFormFields}
        onSubmit={handleCreate}
        submitLabel="Create NCR"
      />

      <FormModal
        open={createSupplierModalOpen}
        onOpenChange={setCreateSupplierModalOpen}
        title="Add Supplier"
        description="Add a new supplier to the register"
        fields={supplierFormFields}
        onSubmit={handleCreateSupplier}
        submitLabel="Add Supplier"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit Record"
        fields={ncrFormFields}
        onSubmit={handleEdit}
        submitLabel="Update"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Record"
        description="Are you sure you want to delete this record? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default QualityPage;
