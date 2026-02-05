import { useState } from 'react';
import {
  Shield,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'Product' | 'Process' | 'Regulatory' | 'Safety' | 'Financial' | 'Operational';
  status: 'Identified' | 'Assessing' | 'Mitigating' | 'Monitoring' | 'Closed';
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  mitigationPlan: string;
  reviewDate: string;
  linkedComplaints: string[];
  linkedCAPAs: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

const calculateRiskLevel = (score: number): Risk['riskLevel'] => {
  if (score >= 16) return 'Critical';
  if (score >= 9) return 'High';
  if (score >= 4) return 'Medium';
  return 'Low';
};

const mockRisks: Risk[] = [
  {
    id: 'RSK-2025-0015',
    title: 'Component supplier single source dependency',
    description: 'Critical components sourced from single supplier with no qualified alternative.',
    category: 'Operational',
    status: 'Mitigating',
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    riskLevel: 'High',
    owner: 'Mike Rodriguez',
    mitigationPlan: 'Qualify secondary supplier by Q2 2025. Increase safety stock levels.',
    reviewDate: '2025-02-01',
    linkedComplaints: [],
    linkedCAPAs: ['CAPA-2025-0008'],
    trend: 'stable',
  },
  {
    id: 'RSK-2025-0012',
    title: 'Regulatory compliance gap - EU MDR',
    description: 'Potential gaps in technical documentation for EU MDR compliance.',
    category: 'Regulatory',
    status: 'Assessing',
    likelihood: 3,
    impact: 4,
    riskScore: 12,
    riskLevel: 'High',
    owner: 'Robert Johnson',
    mitigationPlan: 'Conduct gap analysis and remediation planning.',
    reviewDate: '2025-01-20',
    linkedComplaints: [],
    linkedCAPAs: [],
    trend: 'increasing',
  },
  {
    id: 'RSK-2025-0010',
    title: 'Product labeling error risk',
    description: 'Manual labeling process increases risk of mislabeling.',
    category: 'Product',
    status: 'Monitoring',
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    riskLevel: 'Medium',
    owner: 'Sarah Chen',
    mitigationPlan: 'Automated label verification system implemented. Weekly audits ongoing.',
    reviewDate: '2025-03-01',
    linkedComplaints: ['CMP-2025-0005'],
    linkedCAPAs: ['CAPA-2024-0095'],
    trend: 'decreasing',
  },
  {
    id: 'RSK-2025-0008',
    title: 'Allergenic material in patient contact products',
    description: 'Risk of allergic reactions from materials used in skin contact products.',
    category: 'Safety',
    status: 'Mitigating',
    likelihood: 2,
    impact: 5,
    riskScore: 10,
    riskLevel: 'High',
    owner: 'Jennifer Walsh',
    mitigationPlan: 'Material composition review and alternative sourcing underway.',
    reviewDate: '2025-01-25',
    linkedComplaints: ['CMP-2025-0006'],
    linkedCAPAs: ['CAPA-2024-0090'],
    trend: 'decreasing',
  },
  {
    id: 'RSK-2025-0005',
    title: 'Cybersecurity vulnerability in connected devices',
    description: 'Potential security vulnerabilities in device firmware.',
    category: 'Product',
    status: 'Identified',
    likelihood: 3,
    impact: 4,
    riskScore: 12,
    riskLevel: 'High',
    owner: 'David Kim',
    mitigationPlan: 'Security assessment to be conducted. Firmware update planned.',
    reviewDate: '2025-02-15',
    linkedComplaints: [],
    linkedCAPAs: [],
    trend: 'stable',
  },
  {
    id: 'RSK-2024-0090',
    title: 'Training program effectiveness',
    description: 'Insufficient training leading to quality deviations.',
    category: 'Process',
    status: 'Closed',
    likelihood: 1,
    impact: 3,
    riskScore: 3,
    riskLevel: 'Low',
    owner: 'Emily Carter',
    mitigationPlan: 'Enhanced training program implemented with competency assessments.',
    reviewDate: '2025-06-01',
    linkedComplaints: [],
    linkedCAPAs: [],
    trend: 'decreasing',
  },
];

export default function RiskRegister() {
  const { toast } = useToast();
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [newRisk, setNewRisk] = useState({
    title: '',
    description: '',
    category: 'Operational' as Risk['category'],
    likelihood: 3 as Risk['likelihood'],
    impact: 3 as Risk['impact'],
    owner: '',
    mitigationPlan: '',
    reviewDate: '',
  });

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = risk.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || risk.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || risk.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const criticalCount = risks.filter(r => r.riskLevel === 'Critical').length;
  const highCount = risks.filter(r => r.riskLevel === 'High').length;
  const mediumCount = risks.filter(r => r.riskLevel === 'Medium').length;
  const lowCount = risks.filter(r => r.riskLevel === 'Low').length;

  const handleCreate = () => {
    const riskScore = newRisk.likelihood * newRisk.impact;
    const newId = `RSK-2025-${String(risks.length + 20).padStart(4, '0')}`;
    const risk: Risk = {
      id: newId,
      ...newRisk,
      riskScore,
      riskLevel: calculateRiskLevel(riskScore),
      status: 'Identified',
      linkedComplaints: [],
      linkedCAPAs: [],
      trend: 'stable',
    };
    setRisks([risk, ...risks]);
    setIsModalOpen(false);
    setNewRisk({ title: '', description: '', category: 'Operational', likelihood: 3, impact: 3, owner: '', mitigationPlan: '', reviewDate: '' });
    toast({ title: 'Risk Created', description: `Risk ${newId} has been added to the register.` });
  };

  const handleEdit = () => {
    if (!selectedRisk) return;
    const riskScore = selectedRisk.likelihood * selectedRisk.impact;
    const updatedRisk = {
      ...selectedRisk,
      riskScore,
      riskLevel: calculateRiskLevel(riskScore),
    };
    setRisks(risks.map(r => r.id === selectedRisk.id ? updatedRisk : r));
    setIsEditModalOpen(false);
    toast({ title: 'Risk Updated', description: `Risk ${selectedRisk.id} has been updated.` });
  };

  const handleDelete = () => {
    if (!selectedRisk) return;
    setRisks(risks.filter(r => r.id !== selectedRisk.id));
    setIsDeleteModalOpen(false);
    setSelectedRisk(null);
    toast({ title: 'Risk Deleted', description: 'The risk has been removed from the register.', variant: 'destructive' });
  };

  const handleExport = () => {
    toast({ title: 'Export Started', description: 'Risk register is being exported to CSV.' });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-success" />;
      default:
        return <span className="text-muted-foreground">—</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Risk Register
          </h1>
          <p className="page-subtitle">Enterprise risk management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Risk
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cn(criticalCount > 0 && 'border-destructive/50 bg-destructive/5')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
            <p className="text-2xl font-bold text-destructive mt-1">{criticalCount}</p>
          </CardContent>
        </Card>
        <Card className={cn(highCount > 0 && 'border-warning/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">High</p>
            <p className="text-2xl font-bold mt-1">{highCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Medium</p>
            <p className="text-2xl font-bold mt-1">{mediumCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <p className="text-sm text-muted-foreground">Low</p>
            </div>
            <p className="text-2xl font-bold text-success mt-1">{lowCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Identified">Identified</SelectItem>
                <SelectItem value="Assessing">Assessing</SelectItem>
                <SelectItem value="Mitigating">Mitigating</SelectItem>
                <SelectItem value="Monitoring">Monitoring</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Process">Process</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">L × I</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.map((risk) => (
                <TableRow key={risk.id} className={cn(
                  'data-table-row',
                  risk.riskLevel === 'Critical' && 'bg-destructive/5'
                )}>
                  <TableCell className="font-medium text-accent">{risk.id}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="line-clamp-1">{risk.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{risk.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {risk.likelihood} × {risk.impact}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {risk.riskScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      risk.riskLevel === 'Critical' && 'severity-critical',
                      risk.riskLevel === 'High' && 'severity-high',
                      risk.riskLevel === 'Medium' && 'severity-medium',
                      risk.riskLevel === 'Low' && 'severity-low'
                    )}>
                      {risk.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      risk.status === 'Mitigating' && 'bg-info/10 text-info border-info',
                      risk.status === 'Monitoring' && 'bg-success/10 text-success border-success',
                      risk.status === 'Closed' && 'bg-muted text-muted-foreground'
                    )}>
                      {risk.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getTrendIcon(risk.trend)}
                  </TableCell>
                  <TableCell className="text-sm">{risk.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedRisk(risk); setIsViewModalOpen(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => { setSelectedRisk(risk); setIsEditModalOpen(true); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedRisk(risk); setIsDeleteModalOpen(true); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredRisks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No risks found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Risk</DialogTitle>
            <DialogDescription>Add a new risk to the register</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newRisk.title}
                onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                placeholder="Risk title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={newRisk.description}
                onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                placeholder="Describe the risk"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newRisk.category} onValueChange={(v) => setNewRisk({ ...newRisk, category: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Process">Process</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Likelihood (1-5)</Label>
                <Select value={String(newRisk.likelihood)} onValueChange={(v) => setNewRisk({ ...newRisk, likelihood: parseInt(v) as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Rare</SelectItem>
                    <SelectItem value="2">2 - Unlikely</SelectItem>
                    <SelectItem value="3">3 - Possible</SelectItem>
                    <SelectItem value="4">4 - Likely</SelectItem>
                    <SelectItem value="5">5 - Almost Certain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Impact (1-5)</Label>
                <Select value={String(newRisk.impact)} onValueChange={(v) => setNewRisk({ ...newRisk, impact: parseInt(v) as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Negligible</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Catastrophic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Score:</span>
                <Badge className={cn(
                  'font-mono',
                  calculateRiskLevel(newRisk.likelihood * newRisk.impact) === 'Critical' && 'severity-critical',
                  calculateRiskLevel(newRisk.likelihood * newRisk.impact) === 'High' && 'severity-high',
                  calculateRiskLevel(newRisk.likelihood * newRisk.impact) === 'Medium' && 'severity-medium',
                  calculateRiskLevel(newRisk.likelihood * newRisk.impact) === 'Low' && 'severity-low'
                )}>
                  {newRisk.likelihood * newRisk.impact} - {calculateRiskLevel(newRisk.likelihood * newRisk.impact)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mitigation Plan</Label>
              <Textarea
                value={newRisk.mitigationPlan}
                onChange={(e) => setNewRisk({ ...newRisk, mitigationPlan: e.target.value })}
                placeholder="Describe the mitigation strategy"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Owner</Label>
                <Input
                  value={newRisk.owner}
                  onChange={(e) => setNewRisk({ ...newRisk, owner: e.target.value })}
                  placeholder="Risk owner"
                />
              </div>
              <div className="space-y-2">
                <Label>Review Date</Label>
                <Input
                  type="date"
                  value={newRisk.reviewDate}
                  onChange={(e) => setNewRisk({ ...newRisk, reviewDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newRisk.title || !newRisk.description}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRisk?.id}</DialogTitle>
            <DialogDescription>Risk Details</DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedRisk.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedRisk.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <Badge variant="outline" className="mt-1">{selectedRisk.category}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Likelihood</Label>
                  <p className="font-mono">{selectedRisk.likelihood}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Impact</Label>
                  <p className="font-mono">{selectedRisk.impact}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Score</Label>
                  <Badge className={cn(
                    'mt-1 font-mono',
                    selectedRisk.riskLevel === 'Critical' && 'severity-critical',
                    selectedRisk.riskLevel === 'High' && 'severity-high',
                    selectedRisk.riskLevel === 'Medium' && 'severity-medium',
                    selectedRisk.riskLevel === 'Low' && 'severity-low'
                  )}>
                    {selectedRisk.riskScore} - {selectedRisk.riskLevel}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Mitigation Plan</Label>
                <p className="text-sm">{selectedRisk.mitigationPlan || 'Not defined'}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className="mt-1">{selectedRisk.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner</Label>
                  <p>{selectedRisk.owner}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trend</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(selectedRisk.trend)}
                    <span className="capitalize">{selectedRisk.trend}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Review Date</Label>
                <p>{new Date(selectedRisk.reviewDate).toLocaleDateString()}</p>
              </div>
              {(selectedRisk.linkedComplaints.length > 0 || selectedRisk.linkedCAPAs.length > 0) && (
                <div>
                  <Label className="text-muted-foreground">Linked Records</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRisk.linkedComplaints.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                    {selectedRisk.linkedCAPAs.map(c => <Badge key={c} variant="outline">{c}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>Update risk details</DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={selectedRisk.title}
                  onChange={(e) => setSelectedRisk({ ...selectedRisk, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={selectedRisk.description}
                  onChange={(e) => setSelectedRisk({ ...selectedRisk, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedRisk.category} onValueChange={(v) => setSelectedRisk({ ...selectedRisk, category: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Process">Process</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Likelihood</Label>
                  <Select value={String(selectedRisk.likelihood)} onValueChange={(v) => setSelectedRisk({ ...selectedRisk, likelihood: parseInt(v) as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Rare</SelectItem>
                      <SelectItem value="2">2 - Unlikely</SelectItem>
                      <SelectItem value="3">3 - Possible</SelectItem>
                      <SelectItem value="4">4 - Likely</SelectItem>
                      <SelectItem value="5">5 - Almost Certain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Impact</Label>
                  <Select value={String(selectedRisk.impact)} onValueChange={(v) => setSelectedRisk({ ...selectedRisk, impact: parseInt(v) as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Negligible</SelectItem>
                      <SelectItem value="2">2 - Minor</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - Major</SelectItem>
                      <SelectItem value="5">5 - Catastrophic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Score:</span>
                  <Badge className={cn(
                    'font-mono',
                    calculateRiskLevel(selectedRisk.likelihood * selectedRisk.impact) === 'Critical' && 'severity-critical',
                    calculateRiskLevel(selectedRisk.likelihood * selectedRisk.impact) === 'High' && 'severity-high',
                    calculateRiskLevel(selectedRisk.likelihood * selectedRisk.impact) === 'Medium' && 'severity-medium',
                    calculateRiskLevel(selectedRisk.likelihood * selectedRisk.impact) === 'Low' && 'severity-low'
                  )}>
                    {selectedRisk.likelihood * selectedRisk.impact} - {calculateRiskLevel(selectedRisk.likelihood * selectedRisk.impact)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedRisk.status} onValueChange={(v) => setSelectedRisk({ ...selectedRisk, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Identified">Identified</SelectItem>
                      <SelectItem value="Assessing">Assessing</SelectItem>
                      <SelectItem value="Mitigating">Mitigating</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trend</Label>
                  <Select value={selectedRisk.trend} onValueChange={(v) => setSelectedRisk({ ...selectedRisk, trend: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increasing">Increasing</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="decreasing">Decreasing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mitigation Plan</Label>
                <Textarea
                  value={selectedRisk.mitigationPlan}
                  onChange={(e) => setSelectedRisk({ ...selectedRisk, mitigationPlan: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Input
                    value={selectedRisk.owner}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, owner: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Review Date</Label>
                  <Input
                    type="date"
                    value={selectedRisk.reviewDate}
                    onChange={(e) => setSelectedRisk({ ...selectedRisk, reviewDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Risk</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRisk?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
