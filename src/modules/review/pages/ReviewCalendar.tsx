import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { calendarEvents } from '../data/mockData';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from '../hooks/use-toast';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function ReviewCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 16));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [events, setEvents] = useState(calendarEvents);
  const [formData, setFormData] = useState({
    title: '',
    type: 'review',
    date: '',
    description: '',
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-primary text-primary-foreground';
      case 'action': return 'bg-warning text-warning-foreground';
      case 'capa': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleScheduleReview = () => {
    if (!formData.title || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const newEvent = {
      id: `EVT-${Date.now()}`,
      title: formData.title,
      type: formData.type,
      date: formData.date,
      status: 'scheduled',
    };
    
    setEvents([...events, newEvent]);
    setFormData({ title: '', type: 'review', date: '', description: '' });
    setIsScheduleOpen(false);
    toast({
      title: "Review Scheduled",
      description: `${formData.title} has been scheduled for ${formData.date}`,
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Review Calendar</h1>
            <p className="text-muted-foreground">Schedule and track management reviews</p>
          </div>
          <Button className="gap-2" onClick={() => setIsScheduleOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule Review
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day === 16 && currentDate.getMonth() === 0 && currentDate.getFullYear() === 2025;
                  return (
                    <div
                      key={index}
                      className={cn(
                        'min-h-[80px] p-1 border rounded-md transition-colors',
                        day ? 'hover:bg-accent cursor-pointer' : 'bg-transparent border-transparent',
                        isToday && 'ring-2 ring-primary'
                      )}
                      onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    >
                      {day && (
                        <>
                          <span className={cn(
                            'text-sm font-medium',
                            isToday && 'text-primary'
                          )}>
                            {day}
                          </span>
                          <div className="space-y-1 mt-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={cn(
                                  'text-xs px-1 py-0.5 rounded truncate',
                                  getEventColor(event.type)
                                )}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      event.type === 'review' && 'bg-primary',
                      event.type === 'action' && 'bg-warning',
                      event.type === 'capa' && 'bg-destructive'
                    )} />
                    <span className="text-xs text-muted-foreground uppercase">{event.type}</span>
                  </div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-warning" />
                <span className="text-sm text-muted-foreground">Action Due</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-destructive" />
                <span className="text-sm text-muted-foreground">CAPA Due</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Review Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Review</DialogTitle>
            <DialogDescription>Create a new management review on the calendar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Review Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Q1 2025 Management Review"
              />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="capa">CAPA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any notes or agenda items..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleReview}>Schedule Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
