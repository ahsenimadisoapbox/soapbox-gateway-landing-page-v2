import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const CalendarEvents = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMonth] = useState("December 2024");

  const events = [
    { id: "CE-001", title: "GDPR Annual Review", date: "2024-12-15", type: "REVIEW", priority: "high", site: "London HQ" },
    { id: "CE-002", title: "SOX Audit Meeting", date: "2024-12-18", type: "AUDIT", priority: "critical", site: "New York" },
    { id: "CE-003", title: "Security Training", date: "2024-12-20", type: "TRAINING", priority: "medium", site: "All Sites" },
    { id: "CE-004", title: "ISO Certification Deadline", date: "2024-12-31", type: "DEADLINE", priority: "critical", site: "Global" },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-l-4 border-l-red-500";
      case "high": return "bg-orange-100 text-orange-800 border-l-4 border-l-orange-500";
      case "medium": return "bg-yellow-100 text-yellow-800 border-l-4 border-l-yellow-500";
      default: return "bg-gray-100 text-gray-800 border-l-4 border-l-gray-500";
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 35 }, (_, i) => {
    const day = i - 6;
    return day > 0 && day <= 31 ? day : null;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar Events</h1>
          <p className="text-muted-foreground">Activity calendar with recurring events</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Event</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-5 h-5" />{currentMonth}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {days.map(day => (<div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>))}
                {dates.map((date, i) => (
                  <div key={i} className={`min-h-[80px] p-1 border rounded ${date ? "bg-card" : "bg-muted/30"}`}>
                    {date && (<><div className="text-sm font-medium mb-1">{date}</div>
                      {events.filter(e => new Date(e.date).getDate() === date).map(e => (
                        <div key={e.id} className={`text-xs p-1 rounded mb-1 truncate ${getPriorityColor(e.priority)}`}>{e.title}</div>
                      ))}
                    </>)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {events.map(e => (
                <div key={e.id} className={`p-3 rounded ${getPriorityColor(e.priority)}`}>
                  <div className="font-medium text-sm">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{e.date} • {e.site}</div>
                  <Badge variant="outline" className="mt-2 text-xs">{e.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="Event title" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
              <div className="space-y-2"><Label>Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="AUDIT">Audit</SelectItem><SelectItem value="REVIEW">Review</SelectItem><SelectItem value="TRAINING">Training</SelectItem><SelectItem value="DEADLINE">Deadline</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Priority</Label><Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Site</Label><Select><SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger><SelectContent><SelectItem value="all">All Sites</SelectItem><SelectItem value="london">London HQ</SelectItem><SelectItem value="newyork">New York</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Event details..." /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarEvents;
