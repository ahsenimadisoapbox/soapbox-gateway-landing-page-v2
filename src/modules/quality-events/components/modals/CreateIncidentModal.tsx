import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useQualityEvents } from '../../contexts/QualityEventsContext';
import { Incident, mockUsers } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';

const incidentSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  severity: z.enum(['minor', 'major', 'critical']),
  ownerId: z.string().min(1, 'Owner is required'),
  eventId: z.string().optional(),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

interface CreateIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editIncident?: Incident;
}

export default function CreateIncidentModal({ open, onOpenChange, editIncident }: CreateIncidentModalProps) {
  const { addIncident, updateIncident, qualityEvents } = useQualityEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: editIncident
      ? {
          title: editIncident.title,
          description: editIncident.description,
          severity: editIncident.severity,
          ownerId: editIncident.owner.id,
          eventId: editIncident.eventId || 'none',
        }
      : {
          title: '',
          description: '',
          severity: 'major',
          ownerId: '',
          eventId: 'none',
        },
  });

  const onSubmit = async (data: IncidentFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const owner = mockUsers.find(u => u.id === data.ownerId) || mockUsers[0];

    if (editIncident) {
      updateIncident(editIncident.id, {
        title: data.title,
        description: data.description,
        severity: data.severity,
        owner,
        eventId: data.eventId === 'none' ? '' : (data.eventId || ''),
      });
      toast({
        title: 'Incident Updated',
        description: `Incident ${editIncident.id} has been updated.`,
      });
    } else {
      addIncident({
        eventId: data.eventId === 'none' ? '' : (data.eventId || ''),
        title: data.title,
        description: data.description,
        status: 'open',
        severity: data.severity,
        owner,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        containmentActions: [],
        correctiveActions: [],
      });
      toast({
        title: 'Incident Created',
        description: 'New incident has been declared.',
      });
    }

    setIsSubmitting(false);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editIncident ? 'Edit Incident' : 'Declare Incident'}</DialogTitle>
          <DialogDescription>
            {editIncident ? 'Update incident details.' : 'Escalate a quality event to an incident for formal investigation.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Event (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select related event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {qualityEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.id} - {event.title.substring(0, 40)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the incident" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the incident..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incident Owner *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select owner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editIncident ? 'Update Incident' : 'Declare Incident'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
