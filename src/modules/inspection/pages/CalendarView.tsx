import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Mock calendar events
  const events = {
    15: [{ id: "INS-001", title: "Safety Inspection", color: "warning" }],
    10: [{ id: "INS-002", title: "ISO Audit", color: "destructive" }],
    18: [{ id: "SCH-003", title: "Fire Safety", color: "info" }],
    20: [{ id: "INS-004", title: "IATF Audit", color: "success" }],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inspection Calendar</h1>
          <p className="text-muted-foreground">View and manage scheduled inspections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export .ics</Button>
          <Button onClick={() => navigate("/inspection/schedules/create")}>Schedule Inspection</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{monthNames[currentMonth]} {currentYear}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {daysInMonth.map((day) => {
              const dayEvents = events[day as keyof typeof events] || [];
              const isToday = day === 13;

              return (
                <div
                  key={day}
                  className={`min-h-[100px] border rounded-lg p-2 hover:bg-muted/50 transition-colors ${
                    isToday ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${isToday ? "text-primary" : ""}`}>{day}</div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded bg-${event.color}/10 border border-${event.color}/20 cursor-pointer hover:bg-${event.color}/20`}
                      >
                        <div className="font-medium">{event.id}</div>
                        <div className="text-muted-foreground truncate">{event.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Inspections</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(events).map(([day, dayEvents]) => (
                dayEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{day}</div>
                        <div className="text-xs text-muted-foreground">Nov</div>
                      </div>
                      <div>
                        <div className="font-medium">{event.id}</div>
                        <div className="text-sm text-muted-foreground">{event.title}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.color}</Badge>
                  </div>
                ))
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
            <CardDescription>Current month overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Scheduled</span>
                <span className="text-2xl font-bold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold text-success">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-2xl font-bold text-warning">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-2xl font-bold text-info">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
