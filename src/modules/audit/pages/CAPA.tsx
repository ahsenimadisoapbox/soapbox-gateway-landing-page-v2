import { useState } from 'react';
import { useAudit } from '../contexts/AuditContext';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileCheck, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { KPICard } from '../components/dashboard/KPICard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CAPA() {
  const { capas, findings, updateCAPA, addCAPA } = useAudit();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [formData, setFormData] = useState({
    findingId: '',
    title: '',
    rootCause: '',
    actionPlan: '',
    owner: '',
    dueDate: '',
  });

  const totalCAPAs = capas.length;
  const overdueCAPAs = capas.filter(c => c.status === 'Overdue').length;
  const completedCAPAs = capas.filter(c => c.status === 'Completed').length;
  const onTimeRate = totalCAPAs > 0 ? Math.round((completedCAPAs / totalCAPAs) * 100) : 0;

  // Data for visualizations
  const statusData = [
    { name: 'Completed', value: capas.filter(c => c.status === 'Completed').length },
    { name: 'In Progress', value: capas.filter(c => c.status === 'In Progress').length },
    { name: 'Not Started', value: capas.filter(c => c.status === 'Not Started').length },
    { name: 'Overdue', value: capas.filter(c => c.status === 'Overdue').length },
  ];

  const rootCauseData = [
    { name: 'Process Gap', value: 2 },
    { name: 'Training', value: 1 },
    { name: 'Equipment', value: 1 },
    { name: 'Documentation', value: 1 },
  ];

  const COLORS = ['hsl(var(--success))', 'hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--destructive))'];

  const handleProgressChange = (id: string, value: number[]) => {
    updateCAPA(id, { progress: value[0] });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateCAPA(id, { status: status as any });
    toast.success('CAPA status updated');
  };

  const handleCreateCAPA = () => {
    const newCAPA = {
      id: `CAPA-${String(capas.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'Not Started' as const,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addCAPA(newCAPA);
    toast.success('CAPA created successfully');
    setIsCreateOpen(false);
    setFormData({
      findingId: '',
      title: '',
      rootCause: '',
      actionPlan: '',
      owner: '',
      dueDate: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'secondary';
      case 'In Progress': return 'default';
      case 'Not Started': return 'outline';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  if (capas.length === 0) {
    return (
      <EmptyState
        icon={FileCheck}
        title="No CAPA Actions"
        description="No corrective action plans currently defined."
        action={{
          label: 'Create CAPA',
          onClick: () => setIsCreateOpen(true),
        }}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">CAPA Actions</h1>
            <p className="text-muted-foreground mt-2">
              Corrective and Preventive Action Plans
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create CAPA
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard title="Total Actions" value={totalCAPAs} icon={FileCheck} />
          <KPICard title="Completed" value={completedCAPAs} icon={FileCheck} />
          <KPICard title="Overdue Actions" value={overdueCAPAs} icon={FileCheck} />
          <KPICard title="On-Time Rate" value={`${onTimeRate}%`} icon={FileCheck} />
        </div>

        {/* Data Visualizations */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>CAPA Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CAPA by Root Cause</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rootCauseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Action Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action ID</TableHead>
                      <TableHead>Finding ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {capas.map(capa => (
                      <TableRow key={capa.id}>
                        <TableCell className="font-medium">{capa.id}</TableCell>
                        <TableCell>
                          <span className="text-sm text-primary">{capa.findingId}</span>
                        </TableCell>
                        <TableCell>{capa.title}</TableCell>
                        <TableCell>{capa.owner}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(capa.status)}>
                            {capa.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[capa.progress]}
                              onValueChange={(value) => handleProgressChange(capa.id, value)}
                              max={100}
                              step={10}
                              className="w-32"
                            />
                            <span className="text-sm font-medium w-12">{capa.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{capa.dueDate}</TableCell>
                        <TableCell>
                          {capa.status !== 'Completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(capa.id, 'Completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  CAPA Timeline (Mock Gantt View)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {capas.map(capa => (
                    <div key={capa.id} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-medium">{capa.id}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-muted rounded-md relative overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${capa.progress}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {capa.title.substring(0, 40)}...
                          </span>
                        </div>
                      </div>
                      <div className="w-24 text-sm text-muted-foreground">{capa.dueDate}</div>
                      <Badge variant={getStatusColor(capa.status)}>{capa.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create CAPA Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create CAPA</DialogTitle>
            <DialogDescription>Create a new corrective and preventive action</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Finding Linkage</Label>
              <Select
                value={formData.findingId}
                onValueChange={(value) => setFormData({ ...formData, findingId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select finding" />
                </SelectTrigger>
                <SelectContent>
                  {findings.map(finding => (
                    <SelectItem key={finding.id} value={finding.id}>
                      {finding.id} - {finding.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>CAPA Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter CAPA title"
              />
            </div>
            <div>
              <Label>Root Cause Analysis</Label>
              <Textarea
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                placeholder="Describe the root cause"
                rows={3}
              />
            </div>
            <div>
              <Label>Action Plan</Label>
              <Textarea
                value={formData.actionPlan}
                onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                placeholder="Describe corrective/preventive actions"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Owner</Label>
                <Input
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="Owner name"
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCAPA}>Create CAPA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
