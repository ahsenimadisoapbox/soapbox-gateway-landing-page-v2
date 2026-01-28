import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Send, Paperclip } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { QualityEvent, organizationSettings } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  source: z.string().min(1, 'Source is required'),
  location: z.string().min(1, 'Location is required'),
  department: z.string().min(1, 'Department is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

const categories = [
  'Environmental Control',
  'Documentation',
  'Supplier Quality',
  'Customer Complaint',
  'Equipment',
  'Process Deviation',
  'Safety',
  'Audit Finding',
  'Other',
];

const sources = [
  'Automated Monitoring',
  'Internal Audit',
  'External Audit',
  'Customer Service',
  'Operator Report',
  'Supplier Management System',
  'Calibration System',
  'Inspection',
  'Other',
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { currentUser, addQualityEvent } = useQualityEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      source: '',
      location: '',
      department: '',
    },
  });

  const handleSaveDraft = async () => {
    const data = form.getValues();
    
    // Basic validation for draft
    if (!data.title || data.title.length < 3) {
      toast({
        title: 'Title Required',
        description: 'Please enter at least a title to save as draft.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newEvent: Omit<QualityEvent, 'id'> = {
      title: data.title || 'Untitled Draft',
      description: data.description || '',
      category: data.category || 'Other',
      priority: data.priority || 'medium',
      source: data.source || 'Other',
      location: data.location || 'Headquarters',
      department: data.department || 'Quality Assurance',
      status: 'draft',
      reporter: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: Math.floor(Math.random() * 40) + 10,
      attachments: 0,
      comments: 0,
    };

    addQualityEvent(newEvent);
    toast({
      title: 'Draft Saved',
      description: 'Your event has been saved as a draft.',
    });
    setIsSubmitting(false);
    navigate('/events/drafts');
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newEvent: Omit<QualityEvent, 'id'> = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      source: data.source,
      location: data.location,
      department: data.department,
      status: 'submitted',
      reporter: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      riskScore: Math.floor(Math.random() * 60) + 20,
      attachments: 0,
      comments: 0,
    };

    addQualityEvent(newEvent);
    toast({
      title: 'Event Submitted',
      description: 'Your quality event has been submitted for triage.',
    });
    setIsSubmitting(false);
    navigate('/events/submitted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Quality Event</h1>
          <p className="text-muted-foreground">Report a new quality event for investigation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Provide detailed information about the quality event</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of the quality event" {...field} />
                        </FormControl>
                        <FormDescription>A clear, concise title for the event</FormDescription>
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
                            placeholder="Provide detailed information about the event including what happened, when, where, and any immediate observations..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Include what happened, when, and any immediate observations</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sources.map((src) => (
                                <SelectItem key={src} value={src}>
                                  {src}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {organizationSettings.sites.map((site) => (
                                <SelectItem key={site} value={site}>
                                  {site}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizationSettings.departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary" onClick={handleSaveDraft} disabled={isSubmitting}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Submitting...' : 'Submit Event'}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop files here</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Be specific about what, when, and where</p>
              <p>• Include any immediate actions taken</p>
              <p>• Attach relevant photos or documents</p>
              <p>• Select appropriate priority level</p>
              <p>• Save as draft if you need more info</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
