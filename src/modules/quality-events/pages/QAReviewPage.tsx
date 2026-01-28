import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Clock, FileCheck, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { SeverityBadge, StatusBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';

export default function QAReviewPage() {
  const { incidents, updateIncident, qualityEvents, updateQualityEvent } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [reviewIncidentId, setReviewIncidentId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Filter incidents ready for QA review
  const reviewIncidents = incidents.filter(
    i => i.status === 'review' || i.status === 'lessons-learned'
  );

  // Filter events that need QA review before closure
  const reviewEvents = qualityEvents.filter(
    e => e.status === 'validated' || e.status === 'triage'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const reviewIncident = reviewIncidentId ? incidents.find(i => i.id === reviewIncidentId) : null;

  const handleApprove = () => {
    if (!reviewIncident) return;
    
    updateIncident(reviewIncident.id, { status: 'closed' });
    
    toast({ 
      title: 'Incident Approved', 
      description: `${reviewIncident.id} has been approved and closed.` 
    });
    
    setReviewIncidentId(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!reviewIncident) return;
    
    updateIncident(reviewIncident.id, { status: 'corrective-action' });
    
    toast({ 
      title: 'Incident Returned', 
      description: `${reviewIncident.id} has been returned for further action.`,
      variant: 'destructive'
    });
    
    setReviewIncidentId(null);
    setReviewNotes('');
  };

  const handleApproveEvent = (eventId: string) => {
    updateQualityEvent(eventId, { status: 'closed' });
    toast({ 
      title: 'Event Approved', 
      description: `${eventId} has been approved and closed.` 
    });
  };

  const handleRejectEvent = (eventId: string) => {
    updateQualityEvent(eventId, { status: 'submitted' });
    toast({ 
      title: 'Event Returned', 
      description: `${eventId} has been returned for review.`,
      variant: 'destructive'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">QA Review</h1>
        <p className="text-muted-foreground">Review and approve events and incidents before closure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{reviewIncidents.length + reviewEvents.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{reviewIncidents.length}</p>
                <p className="text-sm text-muted-foreground">Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Send className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{reviewEvents.length}</p>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {incidents.filter(i => i.status === 'closed').length}
                </p>
                <p className="text-sm text-muted-foreground">Closed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents for Review */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents Pending QA Approval</CardTitle>
          <CardDescription>Review incidents that have completed corrective actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No incidents pending QA review
                  </TableCell>
                </TableRow>
              ) : (
                reviewIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="max-w-48 truncate font-medium">{incident.title}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity as any} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge variant={incident.status as any} />
                    </TableCell>
                    <TableCell className="text-sm">{incident.owner.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewIncidentId(incident.id)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setReviewIncidentId(incident.id)}
                            >
                              <FileCheck className="h-4 w-4 text-primary" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Review</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Events for Review */}
      <Card>
        <CardHeader>
          <CardTitle>Events Pending QA Approval</CardTitle>
          <CardDescription>Review and approve validated quality events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No events pending QA review
                  </TableCell>
                </TableRow>
              ) : (
                reviewEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{event.id}</TableCell>
                    <TableCell className="max-w-48 truncate font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge variant={event.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {event.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{event.category}</TableCell>
                    <TableCell className="text-sm">{event.reporter.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleApproveEvent(event.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Approve & Close</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRejectEvent(event.id)}
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Return</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Incident Modal */}
      {selectedIncident && (
        <ViewIncidentModal
          open={!!viewIncidentId}
          onOpenChange={(open) => !open && setViewIncidentId(null)}
          incident={selectedIncident}
        />
      )}

      {/* Review Modal */}
      <Dialog open={!!reviewIncidentId} onOpenChange={(open) => !open && setReviewIncidentId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              QA Review
            </DialogTitle>
            <DialogDescription>
              {reviewIncident?.id} - {reviewIncident?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-4">
                <SeverityBadge severity={reviewIncident?.severity as any} />
                <StatusBadge variant={reviewIncident?.status as any} />
              </div>
              <p className="text-sm">{reviewIncident?.description}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Corrective Actions Summary</Label>
              <div className="space-y-2">
                {reviewIncident?.correctiveActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{typeof action === 'string' ? action : action.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Review Notes</Label>
              <Textarea
                placeholder="Add any review notes or comments..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewIncidentId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="h-4 w-4 mr-1" />
              Return for Review
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}