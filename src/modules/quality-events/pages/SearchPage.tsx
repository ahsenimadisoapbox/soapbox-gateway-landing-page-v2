import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatusBadge, PriorityBadge, SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';

export default function SearchPage() {
  const { qualityEvents, incidents } = useQualityEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);

  const filteredEvents = qualityEvents.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIncidents = incidents.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;

  const totalResults = filteredEvents.length + filteredIncidents.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Global Search</h1>
        <p className="text-muted-foreground">Search across all events, incidents, and records</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title, description, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 text-lg"
            autoFocus
          />
        </div>
        <Button variant="outline" className="h-12">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {searchTerm && (
        <p className="text-sm text-muted-foreground">
          Found {totalResults} results for "{searchTerm}"
        </p>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
          <TabsTrigger value="events">Events ({filteredEvents.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incidents ({filteredIncidents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredEvents.slice(0, 5).map((event) => (
              <Card 
                key={event.id} 
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setViewEventId(event.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Quality Event</span>
                        <span className="font-mono text-xs">{event.id}</span>
                        <StatusBadge variant={event.status as any} />
                        <PriorityBadge priority={event.priority as any} />
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredIncidents.slice(0, 5).map((incident) => (
              <Card 
                key={incident.id} 
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setViewIncidentId(incident.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">Incident</span>
                        <span className="font-mono text-xs">{incident.id}</span>
                        <StatusBadge variant={incident.status as any} />
                        <SeverityBadge severity={incident.severity as any} />
                      </div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{incident.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {totalResults === 0 && searchTerm && (
              <div className="text-center py-12 text-muted-foreground">
                No results found for "{searchTerm}"
              </div>
            )}

            {!searchTerm && (
              <div className="text-center py-12 text-muted-foreground">
                Enter a search term to find events and incidents
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setViewEventId(event.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{event.id}</span>
                    <StatusBadge variant={event.status as any} />
                    <PriorityBadge priority={event.priority as any} />
                  </div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incidents">
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => setViewIncidentId(incident.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs">{incident.id}</span>
                    <StatusBadge variant={incident.status as any} />
                    <SeverityBadge severity={incident.severity as any} />
                  </div>
                  <h4 className="font-medium">{incident.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{incident.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
