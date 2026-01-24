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
import { AlertTriangle, Plus, Search, Filter, TrendingDown, Building2 } from 'lucide-react';
import { incidentData, highRiskSites } from '../data/mockData';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const incidentTrendData = [
  { month: 'Jan', incidents: 12, severity: 2.1 },
  { month: 'Feb', incidents: 15, severity: 2.3 },
  { month: 'Mar', incidents: 11, severity: 1.9 },
  { month: 'Apr', incidents: 14, severity: 2.0 },
  { month: 'May', incidents: 10, severity: 1.8 },
  { month: 'Jun', incidents: 8, severity: 1.6 },
  { month: 'Jul', incidents: 9, severity: 1.7 },
  { month: 'Aug', incidents: 7, severity: 1.5 },
  { month: 'Sep', incidents: 6, severity: 1.4 },
  { month: 'Oct', incidents: 8, severity: 1.6 },
  { month: 'Nov', incidents: 5, severity: 1.3 },
  { month: 'Dec', incidents: 4, severity: 1.2 },
];

const incidentTypeData = [
  { name: 'Injury', value: 35, color: 'hsl(var(--destructive))' },
  { name: 'Near Miss', value: 40, color: 'hsl(var(--warning))' },
  { name: 'Property Damage', value: 15, color: 'hsl(var(--info))' },
  { name: 'Exposure', value: 10, color: 'hsl(var(--chart-4))' },
];

const incidentFormFields = [
  { name: 'title', label: 'Incident Title', type: 'text' as const, required: true },
  { name: 'type', label: 'Incident Type', type: 'select' as const, required: true, options: [
    { value: 'Injury', label: 'Injury' },
    { value: 'Near Miss', label: 'Near Miss' },
    { value: 'Property Damage', label: 'Property Damage' },
    { value: 'Exposure', label: 'Exposure' },
  ]},
  { name: 'severity', label: 'Severity', type: 'select' as const, required: true, options: [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ]},
  { name: 'site', label: 'Site', type: 'text' as const, required: true },
  { name: 'date', label: 'Incident Date', type: 'date' as const, required: true },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'immediateActions', label: 'Immediate Actions Taken', type: 'textarea' as const },
];

const SafetyPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const filteredIncidents = incidentData.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: any) => {
    toast.success('Incident reported successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('Incident updated successfully');
  };

  const handleDelete = () => {
    toast.success('Incident deleted successfully');
  };

  const handleView = (incident: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Incident ID', value: incident.id },
        title: { label: 'Title', value: incident.title },
        type: { label: 'Type', value: incident.type },
        severity: { label: 'Severity', value: <StatusBadge status={incident.severity} variant="severity" /> },
        site: { label: 'Site', value: incident.site },
        date: { label: 'Date', value: incident.date.toLocaleDateString() },
        status: { label: 'Status', value: <StatusBadge status={incident.status} /> },
        injuryType: { label: 'Injury Type', value: incident.injuryType || 'N/A' },
      },
    });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-accent" />
              Safety & Incident Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">Incident tracking, analysis, and safety performance</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>

        {/* Safety Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Total Incidents (YTD)</p>
            <p className="text-3xl font-bold">104</p>
            <p className="text-sm text-success flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4" /> 18% vs last year
            </p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm text-muted-foreground">Fatality-Free Days</p>
            <p className="text-3xl font-bold text-success">642</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">LTIR</p>
            <p className="text-3xl font-bold">0.8</p>
            <p className="text-sm text-success flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4" /> from 1.2
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">TRIR</p>
            <p className="text-3xl font-bold">2.1</p>
            <p className="text-sm text-success flex items-center gap-1 mt-1">
              <TrendingDown className="h-4 w-4" /> from 2.8
            </p>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="incidents">Incident Log</TabsTrigger>
            <TabsTrigger value="sites">Site Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExecutivePanel title="Incident Trend (12 months)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incidentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="incidents" name="Incidents" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ExecutivePanel>

              <ExecutivePanel title="Incident Types Distribution">
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incidentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {incidentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {incidentTypeData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ExecutivePanel>
            </div>
          </TabsContent>

          <TabsContent value="incidents">
            <ExecutivePanel title="Incident Log">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search incidents..."
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
                      <TableHead>Severity</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id} className="data-table-row">
                        <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{incident.title}</TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell><StatusBadge status={incident.severity} variant="severity" /></TableCell>
                        <TableCell>{incident.site}</TableCell>
                        <TableCell>{incident.date.toLocaleDateString()}</TableCell>
                        <TableCell><StatusBadge status={incident.status} /></TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => handleView(incident)}
                            onEdit={() => setEditModal({ open: true, data: incident })}
                            onDelete={() => setDeleteModal({ open: true, id: incident.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="sites">
            <ExecutivePanel title="High-Risk Site Analysis">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highRiskSites.map((site, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-semibold">{site.name}</h4>
                    </div>
                    <p className="text-sm text-warning mb-2">{site.issue}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Incidents</span>
                      <span className="font-bold">{site.incidentCount}</span>
                    </div>
                    <StatusBadge status={site.riskLevel} variant="severity" />
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
        title="Report Incident"
        description="Log a new safety incident"
        fields={incidentFormFields}
        onSubmit={handleCreate}
        submitLabel="Submit Report"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit Incident"
        fields={incidentFormFields.map(f => ({
          ...f,
          defaultValue: editModal.data?.[f.name],
        }))}
        onSubmit={handleEdit}
        submitLabel="Update Incident"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="Incident Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete Incident"
        description="Are you sure you want to delete this incident? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};

export default SafetyPage;
