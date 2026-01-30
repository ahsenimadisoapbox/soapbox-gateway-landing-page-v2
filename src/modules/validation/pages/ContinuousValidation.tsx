import React, { useState } from 'react';
import { RefreshCw, Calendar, AlertTriangle, CheckCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';

interface ChangeEvent {
  id: string;
  type: 'Configuration Change' | 'Incident' | 'Patch Update' | 'User Request';
  description: string;
  system: string;
  status: 'Pending Assessment' | 'Delta Validation Required' | 'Completed' | 'No Impact';
  date: string;
  impactAssessed: boolean;
}

interface PeriodicReview {
  id: string;
  system: string;
  lastReviewDate: string;
  nextReviewDate: string;
  status: 'Scheduled' | 'Overdue' | 'In Progress' | 'Complete';
  findings: number;
}

const mockChanges: ChangeEvent[] = [
  {
    id: 'CHG-001',
    type: 'Configuration Change',
    description: 'Updated user role permissions in MES System',
    system: 'MES System v3.2',
    status: 'Delta Validation Required',
    date: '2025-01-14',
    impactAssessed: true,
  },
  {
    id: 'CHG-002',
    type: 'Patch Update',
    description: 'Security patch KB5034441 applied',
    system: 'LIMS Integration Module',
    status: 'Pending Assessment',
    date: '2025-01-13',
    impactAssessed: false,
  },
  {
    id: 'CHG-003',
    type: 'Incident',
    description: 'Database connection timeout resolved',
    system: 'Document Control System',
    status: 'Completed',
    date: '2025-01-10',
    impactAssessed: true,
  },
  {
    id: 'CHG-004',
    type: 'User Request',
    description: 'New report template added',
    system: 'Document Control System',
    status: 'No Impact',
    date: '2025-01-08',
    impactAssessed: true,
  },
];

const mockReviews: PeriodicReview[] = [
  {
    id: 'PR-001',
    system: 'Document Control System',
    lastReviewDate: '2024-10-15',
    nextReviewDate: '2025-01-15',
    status: 'In Progress',
    findings: 0,
  },
  {
    id: 'PR-002',
    system: 'MES System v3.2',
    lastReviewDate: '2024-07-20',
    nextReviewDate: '2025-01-20',
    status: 'Scheduled',
    findings: 0,
  },
  {
    id: 'PR-003',
    system: 'LIMS Integration Module',
    lastReviewDate: '2024-04-01',
    nextReviewDate: '2024-10-01',
    status: 'Overdue',
    findings: 2,
  },
];

export const ContinuousValidation: React.FC = () => {
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedChange, setSelectedChange] = useState<ChangeEvent | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PeriodicReview | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending Assessment':
        return <Clock size={14} className="text-status-conditional" />;
      case 'Delta Validation Required':
        return <AlertTriangle size={14} className="text-status-required" />;
      case 'Completed':
      case 'No Impact':
        return <CheckCircle size={14} className="text-status-validated" />;
      default:
        return null;
    }
  };

  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case 'Overdue':
        return 'status-badge-critical';
      case 'In Progress':
        return 'status-badge-pending';
      case 'Scheduled':
        return 'status-badge-draft';
      case 'Complete':
        return 'status-badge-active';
      default:
        return 'status-badge-draft';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Continuous Validation</h1>
          <p className="text-muted-foreground">
            Monitor changes and maintain validated state
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-conditional/10">
              <Clock size={20} className="text-status-conditional" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {mockChanges.filter(c => c.status === 'Pending Assessment').length}
              </p>
              <p className="text-xs text-muted-foreground">Pending Assessment</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-required/10">
              <AlertTriangle size={20} className="text-status-required" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {mockChanges.filter(c => c.status === 'Delta Validation Required').length}
              </p>
              <p className="text-xs text-muted-foreground">Delta Validation</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-validated/10">
              <CheckCircle size={20} className="text-status-validated" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {mockChanges.filter(c => c.status === 'Completed' || c.status === 'No Impact').length}
              </p>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="enterprise-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-status-required/10">
              <Calendar size={20} className="text-status-required" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {mockReviews.filter(r => r.status === 'Overdue').length}
              </p>
              <p className="text-xs text-muted-foreground">Overdue Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Events */}
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw size={18} className="text-muted-foreground" />
              <CardTitle className="text-lg">Change Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockChanges.map((change) => (
              <div
                key={change.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedChange(change);
                  setAssessmentDialogOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{change.id}</span>
                      <span className="text-xs px-2 py-0.5 bg-secondary rounded">{change.type}</span>
                    </div>
                    <p className="text-sm font-medium">{change.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{change.system}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'status-badge flex items-center gap-1',
                      change.status === 'Pending Assessment' && 'status-badge-pending',
                      change.status === 'Delta Validation Required' && 'status-badge-critical',
                      (change.status === 'Completed' || change.status === 'No Impact') && 'status-badge-active'
                    )}>
                      {getStatusIcon(change.status)}
                      {change.status}
                    </span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Periodic Reviews */}
        <Card className="enterprise-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
              <CardTitle className="text-lg">Periodic Reviews</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedReview(review);
                  setReviewDialogOpen(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{review.id}</span>
                      <span className={cn('status-badge', getReviewStatusBadge(review.status))}>
                        {review.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{review.system}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Last: {review.lastReviewDate}</span>
                      <span>Next: {review.nextReviewDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.findings > 0 && (
                      <span className="text-xs text-status-conditional">
                        {review.findings} finding{review.findings > 1 ? 's' : ''}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Impact Assessment Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Impact Assessment</DialogTitle>
          </DialogHeader>
          {selectedChange && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Change ID</Label>
                  <p className="font-medium font-mono">{selectedChange.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedChange.type}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium mt-1">{selectedChange.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Affected System</Label>
                <p className="font-medium mt-1">{selectedChange.system}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact-analysis">Impact Analysis</Label>
                <Textarea 
                  id="impact-analysis" 
                  placeholder="Describe the impact of this change on the validated state..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delta-scope">Delta Validation Scope (if applicable)</Label>
                <Textarea 
                  id="delta-scope" 
                  placeholder="List requirements and tests affected by this change..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessment-result">Assessment Result</Label>
                <select 
                  id="assessment-result"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Select result</option>
                  <option value="no-impact">No Impact - No Validation Required</option>
                  <option value="delta">Delta Validation Required</option>
                  <option value="full">Full Re-validation Required</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setAssessmentDialogOpen(false)}>
              Complete Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Periodic Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Periodic Validation Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Review ID</Label>
                  <p className="font-medium font-mono">{selectedReview.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <span className={cn('status-badge', getReviewStatusBadge(selectedReview.status))}>
                      {selectedReview.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">System</Label>
                <p className="font-medium mt-1">{selectedReview.system}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Last Review</Label>
                  <p className="font-medium mt-1">{selectedReview.lastReviewDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Next Due</Label>
                  <p className="font-medium mt-1">{selectedReview.nextReviewDate}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Review Checklist</Label>
                <div className="space-y-2 mt-2">
                  {[
                    'Changes since last review documented',
                    'Incidents reviewed and assessed',
                    'Deviations closed or addressed',
                    'Continued fitness for use confirmed',
                    'No re-validation triggers identified',
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-input" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea 
                  id="review-notes" 
                  placeholder="Document review findings and conclusions..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setReviewDialogOpen(false)}>
              Complete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContinuousValidation;
