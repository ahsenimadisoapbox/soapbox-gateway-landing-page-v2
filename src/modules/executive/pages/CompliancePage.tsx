import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { StatusBadge, ActionButtons, ProgressBar } from '../components/shared/StatusBadge';
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
import { ClipboardCheck, Plus, Search, Filter } from 'lucide-react';
import { complianceData, auditFindings } from '../data/mockData';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const complianceTrendData = [
  { month: 'Jul', iso45001: 93, iso9001: 89, iso14001: 84, regulatory: 92 },
  { month: 'Aug', iso45001: 94, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Sep', iso45001: 94, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Oct', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Nov', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
  { month: 'Dec', iso45001: 95, iso9001: 90, iso14001: 85, regulatory: 92 },
];

const auditFormFields = [
  { name: 'title', label: 'Finding Title', type: 'text' as const, required: true },
  { name: 'severity', label: 'Severity', type: 'select' as const, required: true, options: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'source', label: 'Audit Source', type: 'text' as const, required: true },
  { name: 'owner', label: 'Owner', type: 'text' as const, required: true },
  { name: 'dueDate', label: 'Due Date', type: 'date' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'remediation', label: 'Remediation Plan', type: 'textarea' as const },
];

const CompliancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const filteredFindings = auditFindings.filter(finding =>
    finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    finding.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: any) => {
    toast.success('Audit finding created successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('Audit finding updated successfully');
  };

  const handleDelete = () => {
    toast.success('Audit finding deleted successfully');
  };

  const handleView = (finding: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Finding ID', value: finding.id },
        title: { label: 'Title', value: finding.title },
        severity: { label: 'Severity', value: <StatusBadge status={finding.severity} variant="severity" /> },
        source: { label: 'Audit Source', value: finding.source },
        owner: { label: 'Owner', value: finding.owner },
        dueDate: { label: 'Due Date', value: finding.dueDate.toLocaleDateString() },
        status: { label: 'Status', value: <StatusBadge status={finding.status} /> },
      },
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-accent" />
              Compliance & Audit Assurance
            </h1>
            <p className="text-muted-foreground mt-1">Compliance coverage and audit posture management</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Finding
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="findings">Audit Findings</TabsTrigger>
            <TabsTrigger value="standards">Standards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutivePanel title="Compliance Coverage">
                <div className="space-y-4">
                  {complianceData.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.standard}</span>
                          <StatusBadge status={item.status} />
                        </div>
                        <span className="text-sm text-muted-foreground">{item.gaps} gaps</span>
                      </div>
                      <ProgressBar
                        value={item.coverage}
                        showValue={true}
                        colorClass={item.coverage >= 90 ? 'bg-success' : item.coverage >= 80 ? 'bg-warning' : 'bg-destructive'}
                      />
                    </div>
                  ))}
                </div>
              </ExecutivePanel>

              <ExecutivePanel title="Compliance Trend (6 months)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complianceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[75, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="iso45001" name="ISO 45001" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="iso9001" name="ISO 9001" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="iso14001" name="ISO 14001" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                      <Line type="monotone" dataKey="regulatory" name="Regulatory" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="findings">
            <ExecutivePanel title="Audit Findings">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search findings..."
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
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFindings.map((finding) => (
                      <TableRow key={finding.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{finding.id}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{finding.title}</TableCell>
                        <TableCell><StatusBadge status={finding.severity} variant="severity" /></TableCell>
                        <TableCell>{finding.source}</TableCell>
                        <TableCell>{finding.dueDate.toLocaleDateString()}</TableCell>
                        <TableCell>{finding.owner}</TableCell>
                        <TableCell><StatusBadge status={finding.status} /></TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => handleView(finding)}
                            onEdit={() => setEditModal({ open: true, data: finding })}
                            onDelete={() => setDeleteModal({ open: true, id: finding.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="standards">
            <ExecutivePanel title="Compliance Standards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {complianceData.map((item) => (
                  <div key={item.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{item.standard}</h4>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="text-3xl font-bold mb-2">{item.coverage}%</div>
                    <p className="text-sm text-muted-foreground">Coverage</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">Next Audit</p>
                      <p className="text-sm font-medium">{item.nextAudit.toLocaleDateString()}</p>
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
        title="Add Audit Finding"
        description="Create a new audit finding"
        fields={auditFormFields}
        onSubmit={handleCreate}
        submitLabel="Create Finding"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit Audit Finding"
        fields={auditFormFields.map(f => ({
          ...f,
          defaultValue: editModal.data?.[f.name],
        }))}
        onSubmit={handleEdit}
        submitLabel="Update Finding"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Audit Finding Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Audit Finding"
        description="Are you sure you want to delete this finding? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default CompliancePage;
