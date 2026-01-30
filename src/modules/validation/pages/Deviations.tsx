import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2,
  ChevronDown,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useValidation } from '../context/ValidationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';

export const Deviations: React.FC = () => {
  const { deviations, projects, users } = useValidation();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDeviation, setSelectedDeviation] = useState<typeof deviations[0] | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredDeviations = deviations.filter(deviation => {
    const matchesSearch = 
      deviation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || deviation.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  };

  const getAssigneeName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle size={16} className="text-status-required" />;
      case 'Under Investigation':
        return <Clock size={16} className="text-step-current" />;
      case 'CAPA Required':
        return <AlertTriangle size={16} className="text-status-conditional" />;
      case 'Closed':
        return <CheckCircle size={16} className="text-status-validated" />;
      default:
        return null;
    }
  };

  const openCount = deviations.filter(d => d.status === 'Open').length;
  const investigationCount = deviations.filter(d => d.status === 'Under Investigation').length;
  const capaCount = deviations.filter(d => d.status === 'CAPA Required').length;
  const closedCount = deviations.filter(d => d.status === 'Closed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deviations & CAPA</h1>
          <p className="text-muted-foreground">
            Track and manage deviations, investigations, and corrective actions
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          Log Deviation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-required/10">
              <AlertCircle size={20} className="text-status-required" />
            </div>
            <div>
              <p className="text-xl font-bold">{openCount}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-step-current/10">
              <Clock size={20} className="text-step-current" />
            </div>
            <div>
              <p className="text-xl font-bold">{investigationCount}</p>
              <p className="text-xs text-muted-foreground">Investigation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-conditional/10">
              <AlertTriangle size={20} className="text-status-conditional" />
            </div>
            <div>
              <p className="text-xl font-bold">{capaCount}</p>
              <p className="text-xs text-muted-foreground">CAPA Required</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-validated/10">
              <CheckCircle size={20} className="text-status-validated" />
            </div>
            <div>
              <p className="text-xl font-bold">{closedCount}</p>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deviations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[150px]">
              <Filter size={16} className="mr-2" />
              {severityFilter === 'all' ? 'All Severities' : severityFilter}
              <ChevronDown size={14} className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSeverityFilter('all')}>All Severities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('Critical')}>Critical</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('Major')}>Major</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSeverityFilter('Minor')}>Minor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Deviations List */}
      <div className="space-y-3">
        {filteredDeviations.map((deviation) => (
          <Card key={deviation.id} className="enterprise-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{deviation.id}</span>
                    <span
                      className={cn(
                        'status-badge',
                        deviation.severity === 'Critical' && 'status-badge-critical',
                        deviation.severity === 'Major' && 'status-badge-pending',
                        deviation.severity === 'Minor' && 'status-badge-draft'
                      )}
                    >
                      {deviation.severity}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getStatusIcon(deviation.status)}
                      {deviation.status}
                    </span>
                  </div>
                  <h3 className="font-medium">{deviation.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Project: {getProjectName(deviation.projectId)}</span>
                    <span>Assigned: {getAssigneeName(deviation.assignedTo)}</span>
                    <span>Created: {deviation.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    className="action-icon" 
                    title="View"
                    onClick={() => {
                      setSelectedDeviation(deviation);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye size={16} className="text-muted-foreground" />
                  </button>
                  <button className="action-icon" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeviations.length === 0 && (
        <Card className="enterprise-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No deviations found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedDeviation?.id}</span>
              Deviation Details
            </DialogTitle>
          </DialogHeader>
          {selectedDeviation && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium mt-1">{selectedDeviation.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Severity</Label>
                  <div className="mt-1">
                    <span
                      className={cn(
                        'status-badge',
                        selectedDeviation.severity === 'Critical' && 'status-badge-critical',
                        selectedDeviation.severity === 'Major' && 'status-badge-pending',
                        selectedDeviation.severity === 'Minor' && 'status-badge-draft'
                      )}
                    >
                      {selectedDeviation.severity}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className="font-medium mt-1 flex items-center gap-1">
                    {getStatusIcon(selectedDeviation.status)}
                    {selectedDeviation.status}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Project</Label>
                  <p className="font-medium mt-1">{getProjectName(selectedDeviation.projectId)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="font-medium mt-1">{getAssigneeName(selectedDeviation.assignedTo)}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p className="font-medium mt-1">{selectedDeviation.createdAt}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              Manage Deviation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log New Deviation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dev-project">Related Project</Label>
              <select 
                id="dev-project"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dev-title">Deviation Title</Label>
              <Input id="dev-title" placeholder="Brief description of the deviation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dev-severity">Severity</Label>
              <select 
                id="dev-severity"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select severity</option>
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dev-description">Detailed Description</Label>
              <Textarea id="dev-description" placeholder="Describe the deviation in detail" rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dev-assignee">Assign To</Label>
              <select 
                id="dev-assignee"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select assignee</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateDialogOpen(false)}>
              Log Deviation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deviations;
