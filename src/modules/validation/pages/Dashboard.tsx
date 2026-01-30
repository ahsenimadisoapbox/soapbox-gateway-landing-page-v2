import React from 'react';
import { 
  FolderKanban, 
  AlertTriangle, 
  ClipboardCheck, 
  Clock, 
  Eye, 
  Edit2,
  ChevronRight,
  FileText,
  TestTube,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useValidation } from '../context/ValidationContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LifecycleStepper } from '../components/validation/LifecycleStepper';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { currentUser, projects, deviations, notifications } = useValidation();
  const navigate = useNavigate();

  const activeProjects = projects.filter(p => p.status !== 'validated');
  const openDeviations = deviations.filter(d => d.status !== 'Closed');
  const pendingApprovals = notifications.filter(n => n.type === 'approval' && !n.read);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjects.length,
      icon: FolderKanban,
      color: 'text-step-current',
      bgColor: 'bg-step-current/10',
    },
    {
      label: 'Open Deviations',
      value: openDeviations.length,
      icon: AlertTriangle,
      color: 'text-status-conditional',
      bgColor: 'bg-status-conditional/10',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovals.length,
      icon: ClipboardCheck,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Tasks Due Today',
      value: 3,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  const systemsRequiringValidation = projects.filter(p => p.status === 'required').length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your validation projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          {systemsRequiringValidation > 0 && (
            <Button 
              variant="outline" 
              className="border-status-required text-status-required hover:bg-status-required/10"
              onClick={() => navigate('/projects?filter=required')}
            >
              <AlertTriangle size={16} className="mr-2" />
              {systemsRequiringValidation} System{systemsRequiringValidation > 1 ? 's' : ''} Require Validation
            </Button>
          )}
          <Button 
            variant="default" 
            className="bg-accent hover:bg-accent/90"
            onClick={() => navigate('/projects')}
          >
            <FolderKanban size={16} className="mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="enterprise-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-lg', stat.bgColor)}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Active Validation Projects</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                View all <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
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
                    <div className="flex gap-1">
                      <button 
                        className="action-icon" 
                        title="View"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Eye size={16} className="text-muted-foreground" />
                      </button>
                      <button 
                        className="action-icon" 
                        title="Edit"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}
                      >
                        <Edit2 size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <LifecycleStepper
                    currentStep={project.currentStep}
                    completedSteps={project.completedSteps}
                    compact
                  />
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText size={12} />
                      {project.requirementsCount} Requirements
                    </span>
                    <span className="flex items-center gap-1">
                      <TestTube size={12} />
                      {project.testsCount} Tests
                    </span>
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
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Open Deviations */}
          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Open Deviations</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/deviations')}>
                View all <ChevronRight size={16} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {openDeviations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No open deviations
                </p>
              ) : (
                <ul className="space-y-3">
                  {openDeviations.slice(0, 3).map((deviation) => (
                    <li
                      key={deviation.id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => navigate(`/deviations/${deviation.id}`)}
                    >
                      <div className="flex items-start justify-between">
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
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{deviation.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{deviation.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="enterprise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/projects')}>
                <FolderKanban size={16} className="mr-2" />
                Create Validation Project
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/inspector')}>
                <Shield size={16} className="mr-2" />
                Enter Inspector Mode
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reports')}>
                <FileText size={16} className="mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
