import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react';
import { useValidation } from '../../context/ValidationContext';
import { cn } from '../../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export const ValidationStatusBanner: React.FC = () => {
  const { projects } = useValidation();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calculate overall system status based on projects
  const validatedCount = projects.filter(p => p.status === 'validated').length;
  const conditionalCount = projects.filter(p => p.status === 'conditional').length;
  const requiredCount = projects.filter(p => p.status === 'required').length;

  let overallStatus: 'validated' | 'conditional' | 'required' = 'validated';
  let statusText = 'All Systems Validated';
  let StatusIcon = CheckCircle;

  if (requiredCount > 0) {
    overallStatus = 'required';
    statusText = `${requiredCount} System${requiredCount > 1 ? 's' : ''} Require${requiredCount === 1 ? 's' : ''} Validation`;
    StatusIcon = AlertCircle;
  } else if (conditionalCount > 0) {
    overallStatus = 'conditional';
    statusText = `${conditionalCount} System${conditionalCount > 1 ? 's' : ''} Conditionally Valid`;
    StatusIcon = AlertTriangle;
  }

  const bannerClasses = cn(
    'validation-banner',
    overallStatus === 'validated' && 'validation-banner-validated',
    overallStatus === 'conditional' && 'validation-banner-conditional',
    overallStatus === 'required' && 'validation-banner-required'
  );

  return (
    <>
      <div className="px-6 py-2 bg-card border-b border-border">
        <button
          onClick={() => setDialogOpen(true)}
          className={cn(bannerClasses, 'animate-fade-in')}
        >
          <StatusIcon size={18} />
          <span>{statusText}</span>
          <ChevronRight size={16} className="ml-auto opacity-70" />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Validation Status Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="enterprise-card p-4 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-status-validated/15 flex items-center justify-center mb-2">
                  <CheckCircle size={20} className="text-status-validated" />
                </div>
                <p className="text-2xl font-bold text-status-validated">{validatedCount}</p>
                <p className="text-xs text-muted-foreground">Validated</p>
              </div>
              <div className="enterprise-card p-4 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-status-conditional/15 flex items-center justify-center mb-2">
                  <AlertTriangle size={20} className="text-status-conditional" />
                </div>
                <p className="text-2xl font-bold text-status-conditional">{conditionalCount}</p>
                <p className="text-xs text-muted-foreground">Conditional</p>
              </div>
              <div className="enterprise-card p-4 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-status-required/15 flex items-center justify-center mb-2">
                  <AlertCircle size={20} className="text-status-required" />
                </div>
                <p className="text-2xl font-bold text-status-required">{requiredCount}</p>
                <p className="text-xs text-muted-foreground">Required</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Active Projects</h4>
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="enterprise-card p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.id}</p>
                    </div>
                    <span
                      className={cn(
                        'status-badge',
                        project.status === 'validated' && 'status-badge-active',
                        project.status === 'conditional' && 'status-badge-pending',
                        project.status === 'required' && 'status-badge-critical'
                      )}
                    >
                      {project.status === 'validated' && 'Validated'}
                      {project.status === 'conditional' && 'Conditional'}
                      {project.status === 'required' && 'Required'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
