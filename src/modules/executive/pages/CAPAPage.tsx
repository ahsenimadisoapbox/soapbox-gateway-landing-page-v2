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
import { FileCheck, Plus, Search, Filter } from 'lucide-react';
import { capaData, rootCausePatterns } from '../data/mockData';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const capaAgeData = [
  { range: '0-30 days', count: 15 },
  { range: '31-60 days', count: 11 },
  { range: '61-90 days', count: 7 },
  { range: '90+ days', count: 5 },
];

const capaStatusData = [
  { name: 'Open', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'In Progress', value: 18, color: 'hsl(var(--info))' },
  { name: 'Verification', value: 5, color: 'hsl(var(--warning))' },
  { name: 'Closed', value: 42, color: 'hsl(var(--success))' },
];

const capaFormFields = [
  { name: 'title', label: 'CAPA Title', type: 'text' as const, required: true },
  { name: 'type', label: 'Type', type: 'select' as const, required: true, options: [
    { value: 'corrective', label: 'Corrective' },
    { value: 'preventive', label: 'Preventive' },
  ]},
  { name: 'source', label: 'Source', type: 'select' as const, required: true, options: [
    { value: 'Audit Finding', label: 'Audit Finding' },
    { value: 'Incident', label: 'Incident' },
    { value: 'Customer Complaint', label: 'Customer Complaint' },
    { value: 'Management Review', label: 'Management Review' },
    { value: 'Internal Review', label: 'Internal Review' },
  ]},
  { name: 'priority', label: 'Priority', type: 'select' as const, required: true, options: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'owner', label: 'Owner', type: 'text' as const, required: true },
  { name: 'dueDate', label: 'Due Date', type: 'date' as const, required: true },
  { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea' as const },
  { name: 'correctiveAction', label: 'Corrective Action', type: 'textarea' as const },
  { name: 'verification', label: 'Verification Method', type: 'textarea' as const },
];

const CAPAPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const filteredCAPAs = capaData.filter(capa =>
    capa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capa.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCAPAs = capaData.filter(c => c.status !== 'closed').length;
  const overdueCAPAs = capaData.filter(c => new Date(c.dueDate) < new Date() && c.status !== 'closed').length;
  const ineffectiveCAPAs = capaData.filter(c => c.status === 'ineffective').length;
  const avgClosureTime = 47;

  const handleCreate = (data: any) => {
    toast.success('CAPA created successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('CAPA updated successfully');
  };

  const handleDelete = () => {
    toast.success('CAPA deleted successfully');
  };

  const handleView = (capa: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'CAPA ID', value: capa.id },
        title: { label: 'Title', value: capa.title },
        type: { label: 'Type', value: capa.type.charAt(0).toUpperCase() + capa.type.slice(1) },
        source: { label: 'Source', value: capa.source },
        priority: { label: 'Priority', value: <StatusBadge status={capa.priority} variant="severity" /> },
        owner: { label: 'Owner', value: capa.owner },
        dueDate: { label: 'Due Date', value: capa.dueDate.toLocaleDateString() },
        status: { label: 'Status', value: <StatusBadge status={capa.status} /> },
        age: { label: 'Age (days)', value: capa.age },
      },
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <FileCheck className="h-6 w-6 text-accent" />
              CAPA & Corrective Effectiveness
            </h1>
            <p className="text-muted-foreground mt-1">Corrective and preventive action management</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create CAPA
          </Button>
        </div>

        {/* CAPA Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Open CAPAs</p>
            <p className="text-3xl font-bold">{openCAPAs}</p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-3xl font-bold text-warning">{overdueCAPAs}</p>
          </div>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-muted-foreground">Ineffective</p>
            <p className="text-3xl font-bold text-destructive">{ineffectiveCAPAs}</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Avg Closure Time</p>
            <p className="text-3xl font-bold">{avgClosureTime} days</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="register">CAPA Register</TabsTrigger>
            <TabsTrigger value="analysis">Root Cause Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutivePanel title="CAPA Aging Distribution">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={capaAgeData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ExecutivePanel>

              <ExecutivePanel title="CAPA Status Distribution">
                <div className="h-64 flex items-center">
                  <ResponsiveContainer width="60%" height="100%">
                    <PieChart>
                      <Pie
                        data={capaStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {capaStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {capaStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <ExecutivePanel title="CAPA Register">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search CAPAs..."
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
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCAPAs.map((capa) => (
                      <TableRow key={capa.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{capa.id}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{capa.title}</TableCell>
                        <TableCell className="capitalize">{capa.type}</TableCell>
                        <TableCell>{capa.source}</TableCell>
                        <TableCell><StatusBadge status={capa.priority} variant="severity" /></TableCell>
                        <TableCell>{capa.owner}</TableCell>
                        <TableCell>{capa.dueDate.toLocaleDateString()}</TableCell>
                        <TableCell><StatusBadge status={capa.status} /></TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => handleView(capa)}
                            onEdit={() => setEditModal({ open: true, data: capa })}
                            onDelete={() => setDeleteModal({ open: true, id: capa.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="analysis">
            <ExecutivePanel title="Root Cause Patterns">
              <div className="space-y-4">
                {rootCausePatterns.map((pattern) => (
                  <div key={pattern.cause} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{pattern.cause}</span>
                      <span className="text-sm text-muted-foreground">{pattern.count} occurrences ({pattern.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${pattern.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create CAPA"
        description="Create a new corrective or preventive action"
        fields={capaFormFields}
        onSubmit={handleCreate}
        submitLabel="Create CAPA"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit CAPA"
        fields={capaFormFields.map(f => ({
          ...f,
          defaultValue: editModal.data?.[f.name],
        }))}
        onSubmit={handleEdit}
        submitLabel="Update CAPA"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="CAPA Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete CAPA"
        description="Are you sure you want to delete this CAPA? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default CAPAPage;
