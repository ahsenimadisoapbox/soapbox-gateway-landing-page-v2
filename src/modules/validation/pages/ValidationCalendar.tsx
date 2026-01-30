import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Eye,
  FileText,
  TestTube,
  ClipboardCheck,
  AlertTriangle,
  Plus,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'milestone' | 'review' | 'test' | 'approval' | 'deadline';
  date: string;
  time?: string;
  projectId: string;
  projectName: string;
  description: string;
  status: 'upcoming' | 'today' | 'overdue' | 'completed';
}

const mockEvents: CalendarEvent[] = [
  {
    id: 'EVT-001',
    title: 'Protocol Approval Deadline',
    type: 'deadline',
    date: '2024-01-20',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    description: 'Deadline for VP-2024-001 approval',
    status: 'upcoming',
  },
  {
    id: 'EVT-002',
    title: 'Test Execution Phase Start',
    type: 'milestone',
    date: '2024-01-22',
    time: '09:00',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    description: 'Begin OQ test execution',
    status: 'upcoming',
  },
  {
    id: 'EVT-003',
    title: 'Periodic Review - LIMS',
    type: 'review',
    date: '2024-01-18',
    time: '14:00',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
    description: 'Quarterly periodic validation review',
    status: 'today',
  },
  {
    id: 'EVT-004',
    title: 'UAT Session',
    type: 'test',
    date: '2024-01-19',
    time: '10:00',
    projectId: 'VAL-2024-003',
    projectName: 'MES Integration',
    description: 'User acceptance testing with stakeholders',
    status: 'upcoming',
  },
  {
    id: 'EVT-005',
    title: 'QA Sign-off Meeting',
    type: 'approval',
    date: '2024-01-15',
    time: '11:00',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    description: 'Final QA review before release',
    status: 'overdue',
  },
  {
    id: 'EVT-006',
    title: 'Risk Assessment Review',
    type: 'review',
    date: '2024-01-25',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
    description: 'Review and update risk assessment',
    status: 'upcoming',
  },
];

const ValidationCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 18)); // Jan 18, 2024
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'milestone' as CalendarEvent['type'],
    date: '',
    time: '',
    projectName: '',
    description: '',
  });

  const getTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'milestone': return <CalendarIcon size={14} />;
      case 'review': return <ClipboardCheck size={14} />;
      case 'test': return <TestTube size={14} />;
      case 'approval': return <FileText size={14} />;
      case 'deadline': return <AlertTriangle size={14} />;
    }
  };

  const getTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'milestone': return 'bg-step-current text-white';
      case 'review': return 'bg-accent text-white';
      case 'test': return 'bg-status-conditional text-white';
      case 'approval': return 'bg-status-validated text-white';
      case 'deadline': return 'bg-status-required text-white';
    }
  };

  const getStatusBadge = (status: CalendarEvent['status']) => {
    const styles = {
      upcoming: 'bg-muted text-muted-foreground',
      today: 'bg-step-current/10 text-step-current border-step-current/20',
      overdue: 'bg-status-required/10 text-status-required border-status-required/20',
      completed: 'bg-status-validated/10 text-status-validated border-status-validated/20',
    };
    return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
  };

  // Calendar helpers
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => {
      const matchesDate = e.date === dateStr;
      const matchesType = filterType === 'all' || e.type === filterType;
      return matchesDate && matchesType;
    });
  };

  const isToday = (day: number) => {
    const today = new Date(2024, 0, 18); // Mock today
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const filteredEvents = events.filter(e => filterType === 'all' || e.type === filterType);
  const upcomingEvents = filteredEvents
    .filter(e => e.status === 'upcoming' || e.status === 'today')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const handleCreateEvent = () => {
    const event: CalendarEvent = {
      id: `EVT-${String(events.length + 1).padStart(3, '0')}`,
      ...newEvent,
      projectId: 'VAL-2024-001',
      status: 'upcoming',
    };
    setEvents([...events, event]);
    setCreateDialogOpen(false);
    setNewEvent({ title: '', type: 'milestone', date: '', time: '', projectName: '', description: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validation Calendar</h1>
          <p className="text-muted-foreground">
            Track validation milestones, reviews, and deadlines
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      {/* Filter */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="milestone">Milestones</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="test">Tests</SelectItem>
                <SelectItem value="approval">Approvals</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft size={16} />
                </Button>
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <Button variant="outline" onClick={() => setCurrentDate(new Date(2024, 0, 18))}>
                Today
              </Button>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before the first day of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-24 p-1 bg-muted/30 rounded" />
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div
                      key={day}
                      className={cn(
                        'h-24 p-1 border border-border rounded hover:bg-muted/30 transition-colors overflow-hidden',
                        isToday(day) && 'border-step-current bg-step-current/5'
                      )}
                    >
                      <div className={cn(
                        'text-sm font-medium mb-1',
                        isToday(day) && 'text-step-current'
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setSelectedEvent(event);
                              setViewDialogOpen(true);
                            }}
                            className={cn(
                              'w-full text-left text-xs px-1 py-0.5 rounded truncate flex items-center gap-1',
                              getTypeColor(event.type)
                            )}
                          >
                            {getTypeIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-6">
          <Card className="enterprise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setViewDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn('p-1 rounded', getTypeColor(event.type))}>
                        {getTypeIcon(event.type)}
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.projectName}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="enterprise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'milestone', label: 'Milestone' },
                { type: 'review', label: 'Review' },
                { type: 'test', label: 'Test' },
                { type: 'approval', label: 'Approval' },
                { type: 'deadline', label: 'Deadline' },
              ].map(item => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className={cn('p-1 rounded', getTypeColor(item.type as CalendarEvent['type']))}>
                    {getTypeIcon(item.type as CalendarEvent['type'])}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Event Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={cn('p-2 rounded', getTypeColor(selectedEvent.type))}>
                  {getTypeIcon(selectedEvent.type)}
                </div>
                {getStatusBadge(selectedEvent.status)}
                <Badge variant="outline">{selectedEvent.type}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedEvent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                {selectedEvent.time && (
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedEvent.time}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p className="font-medium">{selectedEvent.projectName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Project ID</p>
                  <p className="font-medium font-mono">{selectedEvent.projectId}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(v) => setNewEvent({ ...newEvent, type: v as CalendarEvent['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project</Label>
                <Input
                  value={newEvent.projectName}
                  onChange={(e) => setNewEvent({ ...newEvent, projectName: e.target.value })}
                  placeholder="Project name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidationCalendar;
