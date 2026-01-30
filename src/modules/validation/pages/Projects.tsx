import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronDown,
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
import { LifecycleStepper } from '../components/validation/LifecycleStepper';
import { cn } from '../lib/utils';

export const Projects: React.FC = () => {
  const { projects, users } = useValidation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.system.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleView = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setViewDialogOpen(true);
  };

  const getLeadName = (leadId: string) => {
    const user = users.find(u => u.id === leadId);
    return user?.name || 'Unassigned';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validation Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all validation projects
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[150px]">
              <Filter size={16} className="mr-2" />
              {statusFilter === 'all' ? 'All Statuses' : 
               statusFilter === 'validated' ? 'Validated' :
               statusFilter === 'conditional' ? 'Conditional' : 'Required'}
              <ChevronDown size={14} className="ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('validated')}>Validated</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('conditional')}>Conditional</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('required')}>Required</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="enterprise-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
                    <span
                      className={cn(
                        'status-badge',
                        project.status === 'conditional' && 'status-badge-pending',
                        project.status === 'required' && 'status-badge-critical',
                        project.status === 'validated' && 'status-badge-active'
                      )}
                    >
                      {project.status === 'conditional' ? 'Conditionally Valid' : 
                       project.status === 'required' ? 'Validation Required' : 'Validated'}
                    </span>
                  </div>
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.system}</p>
                </div>
                <div className="flex gap-1">
                  <button 
                    className="action-icon" 
                    title="View"
                    onClick={() => handleView(project)}
                  >
                    <Eye size={16} className="text-muted-foreground" />
                  </button>
                  <button className="action-icon" title="Edit">
                    <Edit2 size={16} className="text-muted-foreground" />
                  </button>
                  <button className="action-icon" title="Delete">
                    <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LifecycleStepper
                currentStep={project.currentStep}
                completedSteps={project.completedSteps}
                compact
              />
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="text-muted-foreground">
                  Lead: <span className="text-foreground">{getLeadName(project.leadId)}</span>
                </div>
                <div className="text-muted-foreground">
                  Target: <span className="text-foreground">{project.targetDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="enterprise-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No projects found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Validation Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="Enter project name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system">System/Application</Label>
              <Input id="system" placeholder="e.g., Manufacturing Execution System" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Event</Label>
              <select 
                id="trigger"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select trigger event</option>
                <option value="new-system">New System / Release</option>
                <option value="config-change">Configuration Change</option>
                <option value="audit-finding">Audit Finding</option>
                <option value="incident">Incident</option>
                <option value="non-conformance">Non-conformance</option>
                <option value="risk-assessment">Risk Assessment</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Brief description of validation scope" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Completion Date</Label>
              <Input id="target" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateDialogOpen(false)}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedProject?.id}</span>
              {selectedProject?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">System</p>
                  <p className="font-medium">{selectedProject.system}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <span
                    className={cn(
                      'status-badge mt-1 inline-flex',
                      selectedProject.status === 'conditional' && 'status-badge-pending',
                      selectedProject.status === 'required' && 'status-badge-critical',
                      selectedProject.status === 'validated' && 'status-badge-active'
                    )}
                  >
                    {selectedProject.status === 'conditional' ? 'Conditionally Valid' : 
                     selectedProject.status === 'required' ? 'Validation Required' : 'Validated'}
                  </span>
                </div>
                <div>
                  <p className="text-muted-foreground">Lead</p>
                  <p className="font-medium">{getLeadName(selectedProject.leadId)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target Date</p>
                  <p className="font-medium">{selectedProject.targetDate}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-sm mb-3">Lifecycle Progress</p>
                <LifecycleStepper
                  currentStep={selectedProject.currentStep}
                  completedSteps={selectedProject.completedSteps}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="enterprise-card p-4 text-center">
                  <p className="text-2xl font-bold">{selectedProject.requirementsCount}</p>
                  <p className="text-sm text-muted-foreground">Requirements</p>
                </div>
                <div className="enterprise-card p-4 text-center">
                  <p className="text-2xl font-bold">{selectedProject.testsCount}</p>
                  <p className="text-sm text-muted-foreground">Tests</p>
                </div>
                <div className="enterprise-card p-4 text-center">
                  <p className={cn(
                    'text-2xl font-bold',
                    selectedProject.deviationsCount > 0 && 'text-status-conditional'
                  )}>
                    {selectedProject.deviationsCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Deviations</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              Open Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
