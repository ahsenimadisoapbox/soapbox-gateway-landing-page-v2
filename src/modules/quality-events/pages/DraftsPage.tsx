import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileStack, Eye, Edit, Trash2, Send, MoreHorizontal, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { StatusBadge, PriorityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { format } from 'date-fns';
import ViewEventModal from '../components/modals/ViewEventModal';
import CreateEventModal from '../components/modals/CreateEventModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { toast } from '../hooks/use-toast';

export default function DraftsPage() {
  const navigate = useNavigate();
  const { qualityEvents, currentUser, updateQualityEvent, deleteQualityEvent } = useQualityEvents();
  const [viewEventId, setViewEventId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  // Filter drafts belonging to current user
  const draftEvents = qualityEvents.filter(
    e => e.status === 'draft' && e.reporter.id === currentUser.id
  );

  const selectedEvent = viewEventId ? qualityEvents.find(e => e.id === viewEventId) : null;
  const editEvent = editEventId ? qualityEvents.find(e => e.id === editEventId) : null;
  const eventToDelete = deleteEventId ? qualityEvents.find(e => e.id === deleteEventId) : null;

  const handleSubmitDraft = (eventId: string) => {
    const event = qualityEvents.find(e => e.id === eventId);
    if (event) {
      // Check if draft has required fields
      if (!event.title || !event.description || event.description.length < 20) {
        toast({
          title: 'Incomplete Draft',
          description: 'Please complete all required fields before submitting.',
          variant: 'destructive',
        });
        setEditEventId(eventId);
        return;
      }
      
      updateQualityEvent(eventId, { status: 'submitted' });
      toast({
        title: 'Draft Submitted',
        description: `${eventId} has been submitted for triage.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileStack className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">My Drafts</h1>
            <p className="text-muted-foreground">Events you've saved but not yet submitted</p>
          </div>
        </div>
        <Button onClick={() => navigate('/events/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{draftEvents.length}</p>
            <p className="text-sm text-muted-foreground">Total Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {draftEvents.filter(e => e.priority === 'high' || e.priority === 'critical').length}
            </p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {draftEvents.filter(e => {
                const created = new Date(e.createdAt);
                const now = new Date();
                return (now.getTime() - created.getTime()) > 7 * 24 * 60 * 60 * 1000;
              }).length}
            </p>
            <p className="text-sm text-muted-foreground">Older than 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Draft Events</CardTitle>
        </CardHeader>
        <CardContent>
          {draftEvents.length === 0 ? (
            <div className="text-center py-12">
              <FileStack className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No drafts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any draft events. Create one to get started.
              </p>
              <Button onClick={() => navigate('/events/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{event.id}</TableCell>
                    <TableCell className="max-w-64 truncate font-medium">{event.title}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={event.priority as any} />
                    </TableCell>
                    <TableCell className="text-sm">{event.category || 'Not set'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(event.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(event.updatedAt), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitDraft(event.id)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Submit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewEventId(event.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditEventId(event.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteEventId(event.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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

      <DeleteConfirmModal
        open={!!deleteEventId}
        onOpenChange={(open) => !open && setDeleteEventId(null)}
        title="Delete Draft"
        description={`Are you sure you want to delete ${eventToDelete?.id}? This draft will be permanently removed.`}
        onConfirm={() => {
          if (deleteEventId) {
            deleteQualityEvent(deleteEventId);
            setDeleteEventId(null);
            toast({
              title: 'Draft Deleted',
              description: 'The draft has been permanently deleted.',
            });
          }
        }}
      />
    </div>
  );
}
