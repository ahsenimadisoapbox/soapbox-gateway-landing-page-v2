import React, { useState } from 'react';
import { Eye, Edit, Trash2, MoreHorizontal, CheckCircle, ArrowUpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { StatusBadge, PriorityBadge, RiskScore } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import CreateEventModal from '../components/modals/CreateEventModal';
import EscalationWarningModal from '../components/modals/EscalationWarningModal';
import { toast } from '../hooks/use-toast';

export default function TriagePage() {
  const { qualityEvents, updateQualityEvent } = useQualityEvents();
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [escalateEventId, setEscalateEventId] = useState<string | null>(null);

  const triageEvents = qualityEvents.filter(e => e.status === 'submitted' || e.status === 'triage');
  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const editEvent = editEventId ? qualityEvents.find(e => e.id === editEventId) : null;
  const escalateEvent = escalateEventId ? qualityEvents.find(e => e.id === escalateEventId) : null;

  const handleValidate = (eventId: string) => {
    updateQualityEvent(eventId, { status: 'validated' });
    toast({ title: 'Event Validated', description: 'Event has been validated and moved to assessment.' });
  };

  const handleEscalate = (eventId: string) => {
    updateQualityEvent(eventId, { status: 'escalated' });
    setEscalateEventId(null);
    toast({ title: 'Event Escalated', description: 'Event has been escalated to an incident.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Triage Queue</h1>
        <p className="text-muted-foreground">Review and validate incoming quality events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{triageEvents.length}</p>
            <p className="text-sm text-muted-foreground">Awaiting Triage</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{triageEvents.filter(e => e.priority === 'critical' || e.priority === 'high').length}</p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{triageEvents.filter(e => e.riskScore >= 70).length}</p>
            <p className="text-sm text-muted-foreground">High Risk</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events Pending Triage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {triageEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events pending triage
              </div>
            ) : (
              triageEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
                        <StatusBadge variant={event.status as any} />
                        <PriorityBadge priority={event.priority as any} />
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <div>
                          <span className="text-xs text-muted-foreground">Risk Score:</span>
                          <RiskScore score={event.riskScore} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reporter: {event.reporter.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDistanceToNow(new Date(event.dueDate), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleValidate(event.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Validate
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setEscalateEventId(event.id)}>
                        <ArrowUpCircle className="h-4 w-4 mr-1" />
                        Escalate
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
                          <DropdownMenuItem onClick={() => setEditEventId(event.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
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

      {selectedEvent && (
        <ViewEventModal
          open={!!viewEventId}
          onOpenChange={(open) => !open && setViewEventId(null)}
          event={selectedEvent}
        />
      )}

      {editEvent && (
        <CreateEventModal
          open={!!editEventId}
          onOpenChange={(open) => !open && setEditEventId(null)}
          editEvent={editEvent}
        />
      )}

      {escalateEvent && (
        <EscalationWarningModal
          open={!!escalateEventId}
          onOpenChange={(open) => !open && setEscalateEventId(null)}
          event={escalateEvent}
          onConfirm={() => handleEscalate(escalateEvent.id)}
        />
      )}
    </div>
  );
}
