import React, { useState } from 'react';
import { Shield, Search, Eye, FileText, Download, Lock, Clock, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { useValidation } from '../context/ValidationContext';
import { LifecycleStepper } from '../components/validation/LifecycleStepper';
import { cn } from '../lib/utils';

export const InspectorMode: React.FC = () => {
  const { projects, deviations, currentUser } = useValidation();
  const [inspectorModeActive, setInspectorModeActive] = useState(false);
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isInspectorRole = currentUser.role === 'Auditor / Inspector';

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnterInspectorMode = () => {
    if (isInspectorRole) {
      setInspectorModeActive(true);
    } else {
      setAccessDialogOpen(true);
    }
  };

  const handleViewProject = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Shield size={24} className="text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inspector Mode</h1>
            <p className="text-muted-foreground">
              Read-only access for auditors and inspectors
            </p>
          </div>
        </div>
        {!inspectorModeActive ? (
          <Button 
            className="bg-accent hover:bg-accent/90"
            onClick={handleEnterInspectorMode}
          >
            <Shield size={16} className="mr-2" />
            Enter Inspector Mode
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="status-badge status-badge-active flex items-center gap-1">
              <Lock size={12} />
              Inspector Mode Active
            </span>
            <Button 
              variant="outline"
              onClick={() => setInspectorModeActive(false)}
            >
              Exit Inspector Mode
            </Button>
          </div>
        )}
      </div>

      {!inspectorModeActive ? (
        /* Pre-Inspector Mode Info */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={18} />
                Read-Only Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Inspector Mode provides read-only access to all validation documentation and evidence.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  View all validation projects and status
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  Access Requirements Traceability Matrix (RTM)
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  Review test protocols and execution evidence
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  Examine deviations and CAPA records
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={18} />
                Time-Bound Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Inspector access is tracked and time-limited for security.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  Sessions automatically logged in audit trail
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  All document views are recorded
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  Export watermarked with inspector ID and timestamp
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight size={14} className="text-accent" />
                  No modification capabilities
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Active Inspector Mode */
        <div className="space-y-6">
          {/* Inspector Banner */}
          <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-accent" />
              <div>
                <p className="font-medium text-sm">Inspector Mode Active</p>
                <p className="text-xs text-muted-foreground">
                  All access is being logged • Session expires in 2 hours
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              Session started: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search validation projects, requirements, or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Projects Overview */}
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>Validation Projects Overview</CardTitle>
              <CardDescription>Click on any project to view full validation documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleViewProject(project)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
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
                      <h3 className="font-medium mt-1">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.system}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  <LifecycleStepper
                    currentStep={project.currentStep}
                    completedSteps={project.completedSteps}
                    compact
                  />
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{project.requirementsCount} Requirements</span>
                    <span>{project.testsCount} Test Cases</span>
                    {project.deviationsCount > 0 && (
                      <span className="flex items-center gap-1 text-status-conditional">
                        <AlertTriangle size={12} />
                        {project.deviationsCount} Deviations
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="enterprise-card">
              <CardContent className="p-4">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <FileText size={24} className="text-muted-foreground" />
                  <span>View All RTMs</span>
                </Button>
              </CardContent>
            </Card>
            <Card className="enterprise-card">
              <CardContent className="p-4">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <AlertTriangle size={24} className="text-muted-foreground" />
                  <span>View All Deviations</span>
                </Button>
              </CardContent>
            </Card>
            <Card className="enterprise-card">
              <CardContent className="p-4">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <Download size={24} className="text-muted-foreground" />
                  <span>Export Audit Pack</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Access Request Dialog */}
      <Dialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inspector Access Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Your current role ({currentUser.role}) does not have automatic inspector access. 
              Please provide authorization details.
            </p>
            <div className="space-y-2">
              <Label htmlFor="inspector-name">Inspector Name</Label>
              <Input id="inspector-name" placeholder="Enter inspector name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspector-org">Organization</Label>
              <Input id="inspector-org" placeholder="e.g., FDA, ISO Auditor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-duration">Access Duration</Label>
              <select 
                id="access-duration"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours (full day)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-reason">Purpose of Access</Label>
              <Input id="access-reason" placeholder="e.g., Routine inspection, Audit" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAccessDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-accent hover:bg-accent/90" 
              onClick={() => {
                setAccessDialogOpen(false);
                setInspectorModeActive(true);
              }}
            >
              Request Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedProject?.id}</span>
              {selectedProject?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
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
                  <p className="text-muted-foreground">System</p>
                  <p className="font-medium">{selectedProject.system}</p>
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
                <Card className="enterprise-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedProject.requirementsCount}</p>
                    <p className="text-sm text-muted-foreground">Requirements</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye size={12} className="mr-1" />
                      View RTM
                    </Button>
                  </CardContent>
                </Card>
                <Card className="enterprise-card">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{selectedProject.testsCount}</p>
                    <p className="text-sm text-muted-foreground">Test Cases</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye size={12} className="mr-1" />
                      View Tests
                    </Button>
                  </CardContent>
                </Card>
                <Card className="enterprise-card">
                  <CardContent className="p-4 text-center">
                    <p className={cn(
                      'text-2xl font-bold',
                      selectedProject.deviationsCount > 0 && 'text-status-conditional'
                    )}>
                      {selectedProject.deviationsCount}
                    </p>
                    <p className="text-sm text-muted-foreground">Deviations</p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye size={12} className="mr-1" />
                      View All
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-3">Evidence Documents</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Validation Plan (VP)', status: 'Approved' },
                    { name: 'User Requirements Specification (URS)', status: 'Approved' },
                    { name: 'Functional Specification (FS)', status: 'Approved' },
                    { name: 'Installation Qualification (IQ)', status: selectedProject.status === 'validated' ? 'Approved' : 'In Progress' },
                    { name: 'Operational Qualification (OQ)', status: selectedProject.status === 'validated' ? 'Approved' : 'Pending' },
                    { name: 'Performance Qualification (PQ)', status: selectedProject.status === 'validated' ? 'Approved' : 'Pending' },
                    { name: 'Validation Summary Report (VSR)', status: selectedProject.status === 'validated' ? 'Approved' : 'Pending' },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 border border-border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-muted-foreground" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'status-badge',
                          doc.status === 'Approved' && 'status-badge-active',
                          doc.status === 'In Progress' && 'status-badge-pending',
                          doc.status === 'Pending' && 'status-badge-draft'
                        )}>
                          {doc.status}
                        </span>
                        {doc.status === 'Approved' && (
                          <Button variant="ghost" size="sm">
                            <Eye size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
              Close
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              <Download size={16} className="mr-2" />
              Export Audit Pack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InspectorMode;
