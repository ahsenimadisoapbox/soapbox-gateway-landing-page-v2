import React, { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { StatusBadge, PriorityBadge, RiskScore } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { format } from 'date-fns';
import CreateEventModal from '../components/modals/CreateEventModal';
import ViewEventModal from '../components/modals/ViewEventModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

export default function EventsPage() {
  const { qualityEvents, deleteQualityEvent } = useQualityEvents();
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredEvents = qualityEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const editEvent = editEventId ? qualityEvents.find(e => e.id === editEventId) : null;
  const eventToDelete = deleteEventId ? qualityEvents.find(e => e.id === deleteEventId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Quality Events</h1>
          <p className="text-muted-foreground">Manage and track all quality events</p>
        </div>
        <Button onClick={() => setCreateEventOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="triage">Triage</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">{event.id}</TableCell>
                  <TableCell className="max-w-64 truncate font-medium">{event.title}</TableCell>
                  <TableCell>
                    <StatusBadge variant={event.status as any} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={event.priority as any} />
                  </TableCell>
                  <TableCell className="text-sm">{event.category}</TableCell>
                  <TableCell>
                    <RiskScore score={event.riskScore} showLabel={false} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(event.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewEventId(event.id)}
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
                            onClick={() => setEditEventId(event.id)}
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setDeleteEventId(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No events found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEventModal open={createEventOpen} onOpenChange={setCreateEventOpen} />
      
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

      <DeleteConfirmModal
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
        title="Delete Quality Event"
        description={`Are you sure you want to delete ${eventToDelete?.id}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteEventId) {
            deleteQualityEvent(deleteEventId);
            setDeleteEventId(null);
          }
        }}
      />
    </div>
  );
}
