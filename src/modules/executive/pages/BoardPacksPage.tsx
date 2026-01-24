import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  FileText, 
  Download, 
  Plus, 
  Clock,
  Lock,
  Archive,
  Eye,
  Edit,
  Send,
  Trash2,
  RefreshCw,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

const kpiData = [
  { label: 'Total Packs', value: '3', icon: Briefcase },
  { label: 'Drafts', value: '1', icon: FileText },
  { label: 'In Review', value: '0', icon: Clock },
  { label: 'Locked', value: '1', icon: Lock },
  { label: 'Archived', value: '1', icon: Archive },
];

const initialBoardPacks = [
  {
    id: 'BP-2024-Q4',
    period: 'Q4 2024',
    status: 'locked',
    created: new Date('2024-12-28'),
    lockedBy: 'Company Secretary',
    sections: 5,
  },
  {
    id: 'BP-2024-Q3',
    period: 'Q3 2024',
    status: 'archived',
    created: new Date('2024-09-28'),
    lockedBy: 'Company Secretary',
    sections: 5,
  },
  {
    id: 'BP-2025-Q1',
    period: 'Q1 2025',
    status: 'draft',
    created: new Date('2025-01-08'),
    lockedBy: null,
    sections: 3,
  },
];

const sectionOptions = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'risk-dashboard', label: 'Risk Dashboard' },
  { id: 'incident-summary', label: 'Incident Summary' },
  { id: 'governance-effectiveness', label: 'Governance Effectiveness' },
  { id: 'regulatory-status', label: 'Regulatory Status' },
  { id: 'financial-metrics', label: 'Financial Metrics' },
  { id: 'compliance-overview', label: 'Compliance Overview' },
  { id: 'strategic-initiatives', label: 'Strategic Initiatives' },
];

const BoardPacksPage = () => {
  const [boardPacks, setBoardPacks] = useState(initialBoardPacks);
  const [activeTab, setActiveTab] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [period, setPeriod] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  
  // View/Edit/Delete modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPack, setViewPack] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPack, setEditPack] = useState<any>(null);
  const [editPeriod, setEditPeriod] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePack, setDeletePack] = useState<any>(null);

  const handleCreatePack = () => {
    if (!period.trim()) {
      toast.error('Please enter a period');
      return;
    }
    if (selectedSections.length === 0) {
      toast.error('Please select at least one section');
      return;
    }
    const newPack = {
      id: `BP-${Date.now()}`,
      period: period,
      status: 'draft',
      created: new Date(),
      lockedBy: null,
      sections: selectedSections.length,
    };
    setBoardPacks([newPack, ...boardPacks]);
    toast.success(`Board pack for ${period} created`);
    setCreateModalOpen(false);
    setPeriod('');
    setSelectedSections([]);
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleRefresh = () => {
    toast.success('Board packs refreshed');
  };

  const handleView = (pack: any) => {
    setViewPack(pack);
    setViewModalOpen(true);
  };

  const handleEdit = (pack: any) => {
    setEditPack(pack);
    setEditPeriod(pack.period);
    setEditModalOpen(true);
  };

  const confirmEdit = () => {
    if (!editPeriod.trim()) {
      toast.error('Please enter a period');
      return;
    }
    setBoardPacks(boardPacks.map(p => 
      p.id === editPack.id ? { ...p, period: editPeriod } : p
    ));
    toast.success('Board pack updated');
    setEditModalOpen(false);
  };

  const handleSend = (pack: any) => {
    toast.success(`Board pack ${pack.period} sent for review`);
  };

  const handleLock = (pack: any) => {
    setBoardPacks(boardPacks.map(p => 
      p.id === pack.id ? { ...p, status: 'locked', lockedBy: 'Current User' } : p
    ));
    toast.success(`Board pack ${pack.period} locked`);
  };

  const handleArchive = (pack: any) => {
    setBoardPacks(boardPacks.map(p => 
      p.id === pack.id ? { ...p, status: 'archived' } : p
    ));
    toast.success(`Board pack ${pack.period} archived`);
  };

  const handleDownload = (pack: any) => {
    toast.success(`Downloading board pack ${pack.period}...`);
  };

  const handleDelete = (pack: any) => {
    setDeletePack(pack);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setBoardPacks(boardPacks.filter(p => p.id !== deletePack.id));
    toast.success('Board pack deleted');
    setDeleteModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-200">Locked</Badge>;
      case 'archived':
        return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'review':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border border-amber-200">Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPacks = activeTab === 'all' 
    ? boardPacks 
    : boardPacks.filter(pack => pack.status === activeTab);

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Board Packs</h1>
            <p className="text-muted-foreground mt-1">Create and manage board reporting packages</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Board Pack
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Board Pack Management Table */}
        <ExecutivePanel title="Board Pack Management">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                  <TabsTrigger value="locked">Locked</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Locked By</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacks.map((pack) => (
                  <TableRow key={pack.id}>
                    <TableCell className="font-medium">{pack.id}</TableCell>
                    <TableCell>{pack.period}</TableCell>
                    <TableCell>{getStatusBadge(pack.status)}</TableCell>
                    <TableCell>{pack.created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                    <TableCell>{pack.lockedBy || '-'}</TableCell>
                    <TableCell>{pack.sections} sections</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(pack)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        {pack.status === 'draft' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(pack)}>
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSend(pack)}>
                              <Send className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </>
                        )}
                        {pack.status !== 'archived' && pack.status !== 'locked' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLock(pack)}>
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        {pack.status !== 'draft' && pack.status !== 'archived' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleArchive(pack)}>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(pack)}>
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        {pack.status === 'draft' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(pack)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ExecutivePanel>

        {/* Create Board Pack Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Board Pack</DialogTitle>
              <DialogDescription>
                Create a new board pack for a reporting period
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  placeholder="e.g., Q1 2025"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div className="space-y-3">
                <Label>Sections to Include</Label>
                <div className="grid grid-cols-2 gap-3">
                  {sectionOptions.map((section) => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => toggleSection(section.id)}
                      />
                      <Label
                        htmlFor={section.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {section.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={handleCreatePack}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Board Pack Details</DialogTitle>
            </DialogHeader>
            {viewPack && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">ID</Label>
                    <p className="font-medium">{viewPack.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Period</Label>
                    <p className="font-medium">{viewPack.period}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(viewPack.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="font-medium">{viewPack.created.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Locked By</Label>
                    <p className="font-medium">{viewPack.lockedBy || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sections</Label>
                    <p className="font-medium">{viewPack.sections} sections</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Board Pack</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Period</Label>
                <Input 
                  value={editPeriod} 
                  onChange={(e) => setEditPeriod(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={confirmEdit}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Board Pack</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this board pack? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default BoardPacksPage;
