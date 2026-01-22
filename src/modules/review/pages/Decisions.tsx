import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Lightbulb,
} from 'lucide-react';
import { mockDecisions, Decision } from '../data/mockData';
import { cn } from '../lib/utils';

export function Decisions() {
  const [decisions, setDecisions] = useState<Decision[]>(mockDecisions);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'process',
    riskLevel: 'medium',
    decision: '',
    actionRequired: false,
  });

  const filteredDecisions = decisions.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const styles: Record<string, string> = {
      'resource': 'bg-info/15 text-info',
      'process': 'bg-primary/15 text-primary',
      'product': 'bg-success/15 text-success',
      'compliance': 'bg-warning/15 text-warning',
      'strategic': 'bg-muted text-muted-foreground',
    };
    return <Badge variant="secondary" className={styles[category] || ''}>{category}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const styles: Record<string, string> = {
      'low': 'bg-success/15 text-success',
      'medium': 'bg-warning/15 text-warning',
      'high': 'bg-destructive/15 text-destructive',
      'critical': 'bg-destructive text-destructive-foreground',
    };
    return <Badge variant="secondary" className={styles[risk] || ''}>{risk}</Badge>;
  };

  const handleCreate = () => {
    const newDecision: Decision = {
      id: `DEC-${String(decisions.length + 4).padStart(3, '0')}`,
      reviewId: 'MR-2025-Q1',
      title: formData.title,
      description: formData.description,
      category: formData.category as Decision['category'],
      riskLevel: formData.riskLevel as Decision['riskLevel'],
      decision: formData.decision,
      actionRequired: formData.actionRequired,
      madeBy: 'John Doe',
      madeAt: new Date().toISOString().split('T')[0],
    };
    setDecisions([newDecision, ...decisions]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedDecision) return;
    setDecisions(decisions.map(d =>
      d.id === selectedDecision.id
        ? { ...d, ...formData, category: formData.category as Decision['category'], riskLevel: formData.riskLevel as Decision['riskLevel'] }
        : d
    ));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedDecision) return;
    setDecisions(decisions.filter(d => d.id !== selectedDecision.id));
    setIsDeleteOpen(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'process', riskLevel: 'medium', decision: '', actionRequired: false });
  };

  const openView = (decision: Decision) => {
    setSelectedDecision(decision);
    setIsViewOpen(true);
  };

  const openEdit = (decision: Decision) => {
    setSelectedDecision(decision);
    setFormData({
      title: decision.title,
      description: decision.description,
      category: decision.category,
      riskLevel: decision.riskLevel,
      decision: decision.decision,
      actionRequired: decision.actionRequired,
    });
    setIsEditOpen(true);
  };

  const openDelete = (decision: Decision) => {
    setSelectedDecision(decision);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leadership Decisions</h1>
            <p className="text-muted-foreground">Record and track management decisions</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Decision
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="kpi-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi-label">Total Decisions</p>
                  <p className="kpi-value">{decisions.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <p className="kpi-label">High Risk</p>
              <p className="kpi-value">{decisions.filter(d => d.riskLevel === 'high' || d.riskLevel === 'critical').length}</p>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <p className="kpi-label">Actions Required</p>
              <p className="kpi-value">{decisions.filter(d => d.actionRequired).length}</p>
            </CardContent>
          </Card>
          <Card className="kpi-card">
            <CardContent className="p-4">
              <p className="kpi-label">This Quarter</p>
              <p className="kpi-value">{decisions.filter(d => d.reviewId === 'MR-2025-Q1').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search decisions..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="resource">Resource</SelectItem>
                  <SelectItem value="process">Process</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Decisions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Made By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action Required</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecisions.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-sm">{d.id}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{d.title}</TableCell>
                    <TableCell>{getCategoryBadge(d.category)}</TableCell>
                    <TableCell>{getRiskBadge(d.riskLevel)}</TableCell>
                    <TableCell>{d.madeBy}</TableCell>
                    <TableCell>{d.madeAt}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={d.actionRequired ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}>
                        {d.actionRequired ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(d)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(d)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(d)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Record New Decision</DialogTitle><DialogDescription>Document a leadership decision from the review</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Decision title" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Context and background" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="resource">Resource</SelectItem><SelectItem value="process">Process</SelectItem><SelectItem value="product">Product</SelectItem><SelectItem value="compliance">Compliance</SelectItem><SelectItem value="strategic">Strategic</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Risk Level</Label><Select value={formData.riskLevel} onValueChange={(v) => setFormData({ ...formData, riskLevel: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Decision</Label><Textarea value={formData.decision} onChange={(e) => setFormData({ ...formData, decision: e.target.value })} placeholder="What was decided" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="actionRequired" checked={formData.actionRequired} onChange={(e) => setFormData({ ...formData, actionRequired: e.target.checked })} className="h-4 w-4" />
                <Label htmlFor="actionRequired">Action Required</Label>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate}>Record Decision</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Decision Details</DialogTitle></DialogHeader>
            {selectedDecision && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">Decision ID</Label><p className="font-mono">{selectedDecision.id}</p></div>
                  <div><Label className="text-muted-foreground">Review</Label><p className="font-mono">{selectedDecision.reviewId}</p></div>
                </div>
                <div><Label className="text-muted-foreground">Title</Label><p className="font-medium">{selectedDecision.title}</p></div>
                <div><Label className="text-muted-foreground">Description</Label><p className="text-sm">{selectedDecision.description}</p></div>
                <div><Label className="text-muted-foreground">Decision</Label><p className="text-sm font-medium">{selectedDecision.decision}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-muted-foreground">Category</Label><div className="mt-1">{getCategoryBadge(selectedDecision.category)}</div></div>
                  <div><Label className="text-muted-foreground">Risk Level</Label><div className="mt-1">{getRiskBadge(selectedDecision.riskLevel)}</div></div>
                  <div><Label className="text-muted-foreground">Made By</Label><p>{selectedDecision.madeBy}</p></div>
                  <div><Label className="text-muted-foreground">Date</Label><p>{selectedDecision.madeAt}</p></div>
                </div>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Edit Decision</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="resource">Resource</SelectItem><SelectItem value="process">Process</SelectItem><SelectItem value="product">Product</SelectItem><SelectItem value="compliance">Compliance</SelectItem><SelectItem value="strategic">Strategic</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Risk Level</Label><Select value={formData.riskLevel} onValueChange={(v) => setFormData({ ...formData, riskLevel: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Decision</Label><Textarea value={formData.decision} onChange={(e) => setFormData({ ...formData, decision: e.target.value })} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleEdit}>Save Changes</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Delete Decision</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedDecision?.title}"?</DialogDescription></DialogHeader>
            <DialogFooter><Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
