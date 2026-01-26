import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { EventDialog } from "../components/calendar/EventDialog";

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      id: 1,
      date: "Oct 15, 2025",
      title: "GDPR Data Protection Impact Assessment",
      type: "Obligation Due",
      priority: "high",
      time: "09:00 AM",
      timeStart: "09:00",
      timeEnd: "10:30",
      day: 2,
      assignee: "Sarah Johnson",
      description: "Annual GDPR assessment and review of data protection measures.",
      color: "bg-blue-500",
    },
    {
      id: 2,
      date: "Oct 15, 2025",
      title: "Team Meeting",
      type: "Meeting",
      priority: "medium",
      time: "02:00 PM",
      timeStart: "14:00",
      timeEnd: "15:00",
      day: 2,
      assignee: "All Team",
      description: "Weekly compliance team sync",
      color: "bg-green-500",
    },
    {
      id: 3,
      date: "Oct 16, 2025",
      title: "ISO 27001 Security Review",
      type: "Assessment",
      priority: "medium",
      time: "08:00 AM",
      timeStart: "08:00",
      timeEnd: "09:30",
      day: 3,
      assignee: "Mike Rodriguez",
      description: "Quarterly information security review and controls assessment.",
      color: "bg-blue-500",
    },
    {
      id: 4,
      date: "Oct 17, 2025",
      title: "Policy Review Session",
      type: "Review",
      priority: "low",
      time: "11:00 AM",
      timeStart: "11:00",
      timeEnd: "12:00",
      day: 4,
      assignee: "Jennifer Walsh",
      description: "Monthly policy documentation review",
      color: "bg-purple-500",
    },
    {
      id: 5,
      date: "Oct 17, 2025",
      title: "Audit Preparation",
      type: "Preparation",
      priority: "high",
      time: "01:00 PM",
      timeStart: "13:00",
      timeEnd: "14:30",
      day: 4,
      assignee: "David Kim",
      description: "Prepare documents for upcoming audit",
      color: "bg-orange-500",
    },
  ];

  const hours = Array.from({ length: 13 }, (_, i) => i + 6); // 6 AM to 6 PM
  const days = ["Mon 14", "Tue 15", "Wed 16", "Thu 17", "Fri 18", "Sat 19", "Sun 20"];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View upcoming obligations and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="ml-2 font-medium">October 14 - 20, 2025</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Week View</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-2 border-r bg-muted/50"></div>
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-2 text-center border-r font-medium ${
                      idx === 1 ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-sm">{day.split(" ")[0]}</div>
                    <div
                      className={`text-2xl ${
                        idx === 1 ? "bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center mx-auto" : ""
                      }`}
                    >
                      {day.split(" ")[1]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <div className="relative">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b" style={{ height: "80px" }}>
                    <div className="p-2 border-r text-sm text-muted-foreground bg-muted/50">
                      {hour.toString().padStart(2, "0")}:00
                    </div>
                    {days.map((_, dayIdx) => (
                      <div key={dayIdx} className="border-r relative hover:bg-muted/30 cursor-pointer">
                        {/* Render events */}
                        {events
                          .filter((event) => event.day === dayIdx + 1)
                          .map((event) => {
                            const startHour = parseInt(event.timeStart.split(":")[0]);
                            const endHour = parseInt(event.timeEnd.split(":")[0]);
                            const startMinute = parseInt(event.timeStart.split(":")[1]);
                            const endMinute = parseInt(event.timeEnd.split(":")[1]);
                            
                            if (startHour === hour) {
                              const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
                              const topOffset = (startMinute / 60) * 80;
                              const height = duration * 80;
                              
                              return (
                                <div
                                  key={event.id}
                                  className={`absolute left-1 right-1 ${event.color} text-white p-2 rounded text-xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden`}
                                  style={{
                                    top: `${topOffset}px`,
                                    height: `${height}px`,
                                  }}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="font-medium">{event.timeStart} - {event.timeEnd}</div>
                                  <div className="truncate">{event.title}</div>
                                </div>
                              );
                            }
                            return null;
                          })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default Calendar;
