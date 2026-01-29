import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { OOTInvestigation } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';
import { StatusBadge } from '../StatusBadge';
import { AlertTriangle } from 'lucide-react';

interface OOTInvestigationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investigation?: OOTInvestigation;
  mode: 'view' | 'investigate';
  onSave?: (investigation: Partial<OOTInvestigation>) => void;
}

export function OOTInvestigationModal({ open, onOpenChange, investigation, mode, onSave }: OOTInvestigationModalProps) {
  const [formData, setFormData] = useState<Partial<OOTInvestigation>>(
    investigation || {}
  );

  const isViewMode = mode === 'view';
  const title = mode === 'investigate' ? 'OOT Investigation' : 'OOT Investigation Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rootCause || !formData.impactAssessment) {
      toast({
        title: 'Validation Error',
        description: 'Root Cause Analysis and Impact Assessment are mandatory.',
        variant: 'destructive',
      });
      return;
    }
    onSave?.(formData);
    toast({
      title: 'Investigation Updated',
      description: 'OOT investigation has been updated successfully.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-status-overdue" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {mode === 'investigate' 
              ? 'Document root cause analysis and impact assessment. Both fields are mandatory.'
              : 'View OOT investigation details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Equipment Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Asset ID:</span>
                  <p className="font-medium">{investigation?.assetId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Equipment:</span>
                  <p className="font-medium">{investigation?.equipmentName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <StatusBadge status={investigation?.status || 'open'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Root Cause Analysis - Mandatory */}
            <div className="space-y-2">
              <Label htmlFor="rootCause" className="flex items-center gap-1">
                Root Cause Analysis 
                <span className="text-status-overdue">*</span>
              </Label>
              <Textarea
                id="rootCause"
                value={formData.rootCause || ''}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                disabled={isViewMode}
                rows={4}
                placeholder="Document the root cause of the out-of-tolerance condition..."
                required
              />
            </div>

            {/* Impact Assessment - Mandatory */}
            <div className="space-y-2">
              <Label htmlFor="impactAssessment" className="flex items-center gap-1">
                Impact Assessment 
                <span className="text-status-overdue">*</span>
              </Label>
              <Textarea
                id="impactAssessment"
                value={formData.impactAssessment || ''}
                onChange={(e) => setFormData({ ...formData, impactAssessment: e.target.value })}
                disabled={isViewMode}
                rows={4}
                placeholder="Assess the impact on products, processes, and quality..."
                required
              />
            </div>

            {/* Corrective Action */}
            <div className="space-y-2">
              <Label htmlFor="correctiveAction">Corrective Action</Label>
              <Textarea
                id="correctiveAction"
                value={formData.correctiveAction || ''}
                onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                disabled={isViewMode}
                rows={3}
                placeholder="Describe immediate corrective actions taken..."
              />
            </div>

            {/* Preventive Action */}
            <div className="space-y-2">
              <Label htmlFor="preventiveAction">Preventive Action</Label>
              <Textarea
                id="preventiveAction"
                value={formData.preventiveAction || ''}
                onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
                disabled={isViewMode}
                rows={3}
                placeholder="Describe actions to prevent recurrence..."
              />
            </div>

            <div className="bg-status-due-bg p-3 rounded-lg">
              <p className="text-sm text-status-due font-medium">
                Note: This investigation cannot be closed without completing Root Cause Analysis and Impact Assessment.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                Save Investigation
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
