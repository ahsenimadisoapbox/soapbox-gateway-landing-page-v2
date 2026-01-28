import React, { useState } from 'react';
import { Inbox, Clock, AlertTriangle, CheckCircle, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';

export default function MyWorkPage() {
  const { qualityEvents, incidents, currentUser } = useQualityEvents();
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);

  const myEvents = qualityEvents.filter(
    e => e.assignee?.id === currentUser.id || e.reporter.id === currentUser.id
  );
  const myIncidents = incidents.filter(i => i.owner.id === currentUser.id);
  const pendingActions = myEvents.filter(e => e.status !== 'closed');

  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Work Queue</h1>
        <p className="text-muted-foreground">Your assigned events, incidents, and pending actions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Inbox className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{myEvents.length}</p>
              <p className="text-sm text-muted-foreground">My Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">{myIncidents.length}</p>
              <p className="text-sm text-muted-foreground">My Incidents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-info" />
            <div>
              <p className="text-2xl font-bold">{pendingActions.length}</p>
              <p className="text-sm text-muted-foreground">Pending Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-bold">{myEvents.filter(e => e.status === 'closed').length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events ({myEvents.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incidents ({myIncidents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myEvents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No events assigned to you
                  </div>
                ) : (
                  myEvents.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
                            <StatusBadge variant={event.status as any} />
                            <PriorityBadge priority={event.priority as any} />
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {formatDistanceToNow(new Date(event.dueDate), { addSuffix: true })}</span>
                            <span>Category: {event.category}</span>
                          </div>
                        </div>
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
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Take Action
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myIncidents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No incidents owned by you
                  </div>
                ) : (
                  myIncidents.map((incident) => (
                    <div key={incident.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                            <StatusBadge variant={incident.status as any} />
                            <SeverityBadge severity={incident.severity as any} />
                          </div>
                          <h4 className="font-medium">{incident.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{incident.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}</span>
                            <span>Actions: {incident.correctiveActions.length}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setViewIncidentId(incident.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <ViewEventModal
          open={!!viewEventId}
          onOpenChange={(open) => !open && setViewEventId(null)}
          event={selectedEvent}
        />
      )}

      {selectedIncident && (
        <ViewIncidentModal
          open={!!viewIncidentId}
          onOpenChange={(open) => !open && setViewIncidentId(null)}
          incident={selectedIncident}
        />
      )}
    </div>
  );
}
