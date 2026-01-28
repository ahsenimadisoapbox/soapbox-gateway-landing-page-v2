import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { StatusBadge, SeverityBadge } from '../ui/status-badge';
import { Incident } from '../../data/mockData';
import { useQualityEvents } from '../../contexts/QualityEventsContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Calendar,
  User,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface ViewIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident;
}

export default function ViewIncidentModal({ open, onOpenChange, incident }: ViewIncidentModalProps) {
  const navigate = useNavigate();
  const { updateIncident } = useQualityEvents();

  const handleMoveToContainment = () => {
    updateIncident(incident.id, { status: 'containment' });
    toast.success('Incident moved to containment');
    onOpenChange(false);
  };

  const handleMoveToInvestigation = () => {
    updateIncident(incident.id, { status: 'investigation' });
    toast.success('Incident moved to investigation');
    onOpenChange(false);
  };

  const handleMoveToCorrectiveAction = () => {
    updateIncident(incident.id, { status: 'corrective-action' });
    toast.success('Incident moved to corrective actions');
    onOpenChange(false);
  };

  const handleCloseIncident = () => {
    updateIncident(incident.id, { status: 'closed' });
    toast.success('Incident closed');
    onOpenChange(false);
  };

  const handleGoToContainment = () => {
    onOpenChange(false);
    navigate('/containment');
  };

  const handleGoToInvestigation = () => {
    onOpenChange(false);
    navigate('/investigation');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
            <StatusBadge variant={incident.status as any} />
            <SeverityBadge severity={incident.severity as any} />
          </div>
          <DialogTitle className="text-xl mt-2">{incident.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
            <p className="text-sm leading-relaxed">{incident.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium">{incident.owner.name}</span>
              </div>
              {incident.qaApprover && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">QA Approver:</span>
                  <span className="font-medium">{incident.qaApprover.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{format(new Date(incident.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{format(new Date(incident.dueDate), 'MMM d, yyyy')}</span>
              </div>
              {incident.eventId && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Related Event:</span>
                  <span className="font-mono text-xs">{incident.eventId}</span>
                </div>
              )}
            </div>
          </div>

          {incident.containmentActions.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Containment Actions
                </h4>
                <ul className="space-y-2">
                  {incident.containmentActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {incident.correctiveActions.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Corrective Actions</h4>
                <div className="space-y-3">
                  {incident.correctiveActions.map((action) => (
                    <div key={action.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        </div>
                        <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                          {action.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Assignee: {action.assignee.name}</span>
                        <span>Due: {format(new Date(action.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {incident.impactAssessment && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Impact Assessment</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className={`p-2 rounded text-xs ${incident.impactAssessment.productImpact ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    Product Impact: {incident.impactAssessment.productImpact ? 'Yes' : 'No'}
                  </div>
                  <div className={`p-2 rounded text-xs ${incident.impactAssessment.customerImpact ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    Customer Impact: {incident.impactAssessment.customerImpact ? 'Yes' : 'No'}
                  </div>
                  <div className={`p-2 rounded text-xs ${incident.impactAssessment.regulatoryImpact ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    Regulatory Impact: {incident.impactAssessment.regulatoryImpact ? 'Yes' : 'No'}
                  </div>
                  <div className={`p-2 rounded text-xs ${incident.impactAssessment.financialImpact ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                    Financial Impact: {incident.impactAssessment.financialImpact ? 'Yes' : 'No'}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{incident.impactAssessment.description}</p>
              </div>
            </>
          )}

          {incident.rootCause && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Root Cause</h4>
                <p className="text-sm">{incident.rootCause}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                Take Action
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMoveToContainment}>
                Move to Containment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveToInvestigation}>
                Move to Investigation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMoveToCorrectiveAction}>
                Move to Corrective Actions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToContainment}>
                Go to Containment Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToInvestigation}>
                Go to Investigation Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCloseIncident}>
                Close Incident
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogContent>
    </Dialog>
  );
}
