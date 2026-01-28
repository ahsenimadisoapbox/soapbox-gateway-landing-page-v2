import React, { useState } from 'react';
import { Eye, Tag, CheckCircle, MoreHorizontal, FileSearch, ArrowUpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import { StatusBadge, PriorityBadge, RiskScore } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';
import { Checkbox } from '../components/ui/checkbox';

interface ClassificationData {
  eventType: string;
  regulatoryImpact: string;
  requiresCAPA: boolean;
  requiresNotification: boolean;
  classification: string;
  justification: string;
}

const eventTypes = [
  'Deviation',
  'Non-Conformance',
  'Customer Complaint',
  'Supplier Issue',
  'Equipment Failure',
  'Environmental',
  'Documentation Error',
  'Process Deviation',
  'Safety Incident',
];

const regulatoryImpacts = [
  'None',
  'Minor - Internal Only',
  'Moderate - May Require Reporting',
  'Major - Reporting Required',
  'Critical - Immediate Reporting Required',
];

const classifications = [
  { value: 'observation', label: 'Observation', description: 'Minor issue, no immediate action required' },
  { value: 'minor', label: 'Minor NC', description: 'Non-conformance with limited impact' },
  { value: 'major', label: 'Major NC', description: 'Significant non-conformance requiring action' },
  { value: 'critical', label: 'Critical NC', description: 'Severe non-conformance, immediate action required' },
];

export default function QAClassificationPage() {
  const { qualityEvents, updateQualityEvent } = useQualityEvents();
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [classifyEventId, setClassifyEventId] = useState<string | null>(null);
  const [classificationData, setClassificationData] = useState<ClassificationData>({
    eventType: '',
    regulatoryImpact: '',
    requiresCAPA: false,
    requiresNotification: false,
    classification: '',
    justification: '',
  });

  // Filter events that need classification (validated status)
  const classificationEvents = qualityEvents.filter(
    e => e.status === 'validated' || e.status === 'triage'
  );
  
  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const classifyEvent = classifyEventId ? qualityEvents.find(e => e.id === classifyEventId) : null;

  const handleSaveClassification = () => {
    if (!classifyEvent) return;
    
    updateQualityEvent(classifyEvent.id, {
      category: classificationData.eventType || classifyEvent.category,
    });
    
    toast({ 
      title: 'Classification Saved', 
      description: `Classification saved for ${classifyEvent.id}` 
    });
    resetAndClose();
  };

  const handleCompleteClassification = () => {
    if (!classifyEvent || !classificationData.classification) {
      toast({ 
        title: 'Validation Error', 
        description: 'Please select a classification before completing.',
        variant: 'destructive'
      });
      return;
    }
    
    const newPriority = classificationData.classification === 'critical' ? 'critical' 
      : classificationData.classification === 'major' ? 'high'
      : classificationData.classification === 'minor' ? 'medium' : 'low';

    updateQualityEvent(classifyEvent.id, {
      category: classificationData.eventType || classifyEvent.category,
      priority: newPriority,
      status: classificationData.classification === 'critical' ? 'escalated' : 'validated',
    });
    
    toast({ 
      title: 'Classification Completed', 
      description: `Event ${classifyEvent.id} has been classified as ${classificationData.classification}.` 
    });
    resetAndClose();
  };

  const handleEscalate = () => {
    if (!classifyEvent) return;
    
    updateQualityEvent(classifyEvent.id, {
      status: 'escalated',
      priority: 'critical',
    });
    
    toast({ 
      title: 'Event Escalated', 
      description: `Event ${classifyEvent.id} has been escalated to incident.` 
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setClassifyEventId(null);
    setClassificationData({
      eventType: '',
      regulatoryImpact: '',
      requiresCAPA: false,
      requiresNotification: false,
      classification: '',
      justification: '',
    });
  };

  const openClassification = (eventId: string) => {
    const event = qualityEvents.find(e => e.id === eventId);
    if (event) {
      setClassificationData({
        eventType: event.category,
        regulatoryImpact: '',
        requiresCAPA: false,
        requiresNotification: false,
        classification: '',
        justification: '',
      });
    }
    setClassifyEventId(eventId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">QA Classification</h1>
        <p className="text-muted-foreground">Classify and categorize quality events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{classificationEvents.length}</p>
            <p className="text-sm text-muted-foreground">Pending Classification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {classificationEvents.filter(e => e.category === 'Customer Complaint').length}
            </p>
            <p className="text-sm text-muted-foreground">Customer Complaints</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {classificationEvents.filter(e => e.category === 'Process Deviation').length}
            </p>
            <p className="text-sm text-muted-foreground">Process Deviations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {classificationEvents.filter(e => e.priority === 'critical').length}
            </p>
            <p className="text-sm text-muted-foreground">Critical Priority</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Pending Classification</CardTitle>
          <CardDescription>Review and assign proper classification to quality events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classificationEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events pending classification
              </div>
            ) : (
              classificationEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
                        <StatusBadge variant={event.status as any} />
                        <PriorityBadge priority={event.priority as any} />
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Risk:</span>
                          <RiskScore score={event.riskScore} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Source: {event.source}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDistanceToNow(new Date(event.dueDate), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => openClassification(event.id)}>
                        <Tag className="h-4 w-4 mr-1" />
                        Classify
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewEventId(event.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Event Modal */}
      {selectedEvent && (
        <ViewEventModal
          open={!!viewEventId}
          onOpenChange={(open) => !open && setViewEventId(null)}
          event={selectedEvent}
        />
      )}

      {/* Classification Modal */}
      <Dialog open={!!classifyEventId} onOpenChange={(open) => !open && resetAndClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              QA Classification
            </DialogTitle>
            <DialogDescription>
              {classifyEvent?.id} - {classifyEvent?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Event Type */}
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={classificationData.eventType}
                onValueChange={(v) => setClassificationData({ ...classificationData, eventType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type..." />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Regulatory Impact */}
            <div className="space-y-2">
              <Label>Regulatory Impact</Label>
              <Select
                value={classificationData.regulatoryImpact}
                onValueChange={(v) => setClassificationData({ ...classificationData, regulatoryImpact: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assess regulatory impact..." />
                </SelectTrigger>
                <SelectContent>
                  {regulatoryImpacts.map((impact) => (
                    <SelectItem key={impact} value={impact}>{impact}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Classification */}
            <div className="space-y-2">
              <Label>Classification *</Label>
              <div className="grid grid-cols-2 gap-2">
                {classifications.map((cls) => (
                  <div
                    key={cls.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      classificationData.classification === cls.value 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setClassificationData({ ...classificationData, classification: cls.value })}
                  >
                    <p className="font-medium text-sm">{cls.label}</p>
                    <p className="text-xs text-muted-foreground">{cls.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Flags */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="capa"
                  checked={classificationData.requiresCAPA}
                  onCheckedChange={(checked) => 
                    setClassificationData({ ...classificationData, requiresCAPA: !!checked })
                  }
                />
                <Label htmlFor="capa" className="text-sm font-normal cursor-pointer">
                  Requires CAPA (Corrective and Preventive Action)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="notification"
                  checked={classificationData.requiresNotification}
                  onCheckedChange={(checked) => 
                    setClassificationData({ ...classificationData, requiresNotification: !!checked })
                  }
                />
                <Label htmlFor="notification" className="text-sm font-normal cursor-pointer">
                  Requires Regulatory Notification
                </Label>
              </div>
            </div>

            {/* Justification */}
            <div className="space-y-2">
              <Label>Classification Justification</Label>
              <Textarea
                placeholder="Provide rationale for the classification..."
                value={classificationData.justification}
                onChange={(e) => setClassificationData({ ...classificationData, justification: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={resetAndClose} className="sm:mr-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEscalate}>
              <ArrowUpCircle className="h-4 w-4 mr-1" />
              Escalate
            </Button>
            <Button variant="outline" onClick={handleSaveClassification}>
              Save Draft
            </Button>
            <Button onClick={handleCompleteClassification}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
