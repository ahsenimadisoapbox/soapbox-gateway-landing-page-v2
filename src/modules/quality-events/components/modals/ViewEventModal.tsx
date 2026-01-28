import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { StatusBadge, PriorityBadge, RiskScore } from '../ui/status-badge';
import { QualityEvent } from '../../data/mockData';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Building2,
  User,
  Paperclip,
  MessageSquare,
  Clock,
  Tag,
  ChevronDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useQualityEvents } from '../../contexts/QualityEventsContext';
import { toast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ViewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: QualityEvent;
}

export default function ViewEventModal({ open, onOpenChange, event }: ViewEventModalProps) {
  const { updateQualityEvent } = useQualityEvents();
  const navigate = useNavigate();

  const handleMoveToTriage = () => {
    updateQualityEvent(event.id, { status: 'triage' });
    toast({ title: 'Event Updated', description: `${event.id} moved to Triage.` });
    onOpenChange(false);
  };

  const handleValidate = () => {
    updateQualityEvent(event.id, { status: 'validated' });
    toast({ title: 'Event Validated', description: `${event.id} has been validated.` });
    onOpenChange(false);
  };

  const handleEscalate = () => {
    updateQualityEvent(event.id, { status: 'escalated', priority: 'critical' });
    toast({ title: 'Event Escalated', description: `${event.id} has been escalated to incident.` });
    onOpenChange(false);
  };

  const handleClose = () => {
    updateQualityEvent(event.id, { status: 'closed' });
    toast({ title: 'Event Closed', description: `${event.id} has been closed.` });
    onOpenChange(false);
  };

  const handleGoToRiskAssessment = () => {
    onOpenChange(false);
    navigate('/risk-assessment');
  };

  const handleGoToClassification = () => {
    onOpenChange(false);
    navigate('/classification');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">{event.id}</span>
            <StatusBadge variant={event.status as any} />
            <PriorityBadge priority={event.priority as any} />
          </div>
          <DialogTitle className="text-xl mt-2">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
            <p className="text-sm leading-relaxed">{event.description}</p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{event.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium">{event.source}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{event.department}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reporter:</span>
                <span className="font-medium">{event.reporter.name}</span>
              </div>
              {event.assignee && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Assignee:</span>
                  <span className="font-medium">{event.assignee.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{format(new Date(event.createdAt), 'MMM d, yyyy HH:mm')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{format(new Date(event.dueDate), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Score */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Risk Assessment</h4>
            <RiskScore score={event.riskScore} />
          </div>

          <Separator />

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              {event.attachments} attachments
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {event.comments} comments
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last updated: {format(new Date(event.updatedAt), 'MMM d, yyyy HH:mm')}
            </div>
          </div>
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleMoveToTriage}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Move to Triage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleValidate}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToRiskAssessment}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Risk Assessment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGoToClassification}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to QA Classification
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEscalate} className="text-destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate to Incident
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClose}>
                <XCircle className="h-4 w-4 mr-2" />
                Close Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DialogContent>
    </Dialog>
  );
}
