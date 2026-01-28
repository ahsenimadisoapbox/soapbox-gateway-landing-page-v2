import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, Clock, Users, ArrowUpCircle } from 'lucide-react';
import { QualityEvent } from '../../data/mockData';

interface EscalationWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: QualityEvent;
  onConfirm: () => void;
}

export default function EscalationWarningModal({
  open,
  onOpenChange,
  event,
  onConfirm,
}: EscalationWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 text-warning">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Escalation Required</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            This quality event meets the criteria for escalation to an incident.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Why escalation is required:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Risk score exceeds threshold (Current: {event.riskScore})</li>
              <li>• Event category requires incident investigation</li>
              <li>• Potential regulatory or customer impact identified</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">SLA Changes</p>
                <p className="text-xs text-muted-foreground">
                  New SLA will apply: 5 business days for investigation completion
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Visibility</p>
                <p className="text-xs text-muted-foreground">
                  Management and QA leadership will be notified automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <ArrowUpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Required Approvals</p>
                <p className="text-xs text-muted-foreground">
                  QA Manager approval required for incident closure
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-warning text-warning-foreground hover:bg-warning/90">
            Proceed with Escalation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
