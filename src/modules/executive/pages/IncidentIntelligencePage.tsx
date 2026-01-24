import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { StatusBadge, ActionButtons } from '../components/shared/StatusBadge';
import { ViewModal, DeleteConfirmModal } from '../components/modals/FormModal';
import { 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  category: string;
  daysOpen: number;
  hasRegulatoryImpact: boolean;
}

const mockIncidents: Incident[] = [
  { 
    id: 'INC-2024-089', 
    title: 'Production Line Quality Deviation', 
    severity: 'high', 
    status: 'investigating', 
    category: 'Quality', 
    daysOpen: 24,
    hasRegulatoryImpact: true
  },
  { 
    id: 'INC-2024-092', 
    title: 'Near-Miss Safety Event', 
    severity: 'medium', 
    status: 'open', 
    category: 'Safety', 
    daysOpen: 11,
    hasRegulatoryImpact: false
  },
  { 
    id: 'INC-2024-095', 
    title: 'Supplier Non-Conformance', 
    severity: 'high', 
    status: 'investigating', 
    category: 'Supply Chain', 
    daysOpen: 6,
    hasRegulatoryImpact: true
  },
  { 
    id: 'INC-2024-088', 
    title: 'Environmental Monitoring Alert', 
    severity: 'low', 
    status: 'resolved', 
    category: 'Environmental', 
    daysOpen: 0,
    hasRegulatoryImpact: false
  },
];

const IncidentIntelligencePage = () => {
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    severity: '',
    category: '',
    description: ''
  });

  const kpiCards = [
    { 
      label: 'Open Incidents', 
      value: '4', 
      description: 'Requiring resolution',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    { 
      label: 'High/Critical', 
      value: '2', 
      description: 'Elevated severity',
      icon: AlertCircle,
      iconColor: 'text-amber-500'
    },
    { 
      label: 'Regulatory Impact', 
      value: '2', 
      description: 'Potential reporting required',
      icon: AlertTriangle,
      iconColor: 'text-red-500'
    },
    { 
      label: 'Near-Misses (Safety)', 
      value: '1', 
      description: 'Leading indicator',
      icon: TrendingUp,
      iconColor: 'text-amber-500'
    },
  ];

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500 text-white',
      high: 'bg-amber-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-emerald-500 text-white',
    };
    return <Badge className={`${colors[severity]} hover:${colors[severity]}`}>{severity.charAt(0).toUpperCase() + severity.slice(1)}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-emerald-500 text-white',
      investigating: 'bg-teal-600 text-white',
      resolved: 'bg-emerald-600 text-white',
    };
    return <Badge className={`${colors[status]} hover:${colors[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const handleCreateIncident = () => {
    if (!formData.title || !formData.severity || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Incident created successfully');
    setCreateModalOpen(false);
    setFormData({ title: '', severity: '', category: '', description: '' });
  };

  const handleView = (incident: Incident) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'Incident ID', value: incident.id },
        title: { label: 'Title', value: incident.title },
        severity: { label: 'Severity', value: getSeverityBadge(incident.severity) },
        status: { label: 'Status', value: getStatusBadge(incident.status) },
        category: { label: 'Category', value: incident.category },
        daysOpen: { label: 'Days Open', value: `${incident.daysOpen}d` },
        regulatoryImpact: { label: 'Regulatory Impact', value: incident.hasRegulatoryImpact ? 'Yes' : 'No' },
      },
    });
  };

  const handleDelete = () => {
    toast.success('Incident deleted successfully');
    setDeleteModal({ open: false, id: '' });
  };

  return (
    <>
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Incident Intelligence</h1>
            <p className="text-muted-foreground mt-1">Severity-weighted incident trends and regulatory exposure indicators</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
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

        {/* All Incidents Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">All Incidents</h3>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Days Open</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id} className="data-table-row">
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{incident.title}</p>
                        {incident.hasRegulatoryImpact && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            Regulatory Impact
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                    <TableCell>{getStatusBadge(incident.status)}</TableCell>
                    <TableCell>{incident.category}</TableCell>
                    <TableCell>{incident.daysOpen}d</TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        onView={() => handleView(incident)}
                        onEdit={() => toast.info('Edit functionality')}
                        onDelete={() => setDeleteModal({ open: true, id: incident.id })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Create Incident Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Incident</DialogTitle>
            <DialogDescription>Create a new incident report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                placeholder="Enter incident title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Environmental">Environmental</SelectItem>
                  <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter incident description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateIncident}>Create Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default IncidentIntelligencePage;
