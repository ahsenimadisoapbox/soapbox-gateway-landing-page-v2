import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { mockCapas } from "../data/mockData";
import { Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/capa/StatusBadge";
import { PriorityBadge } from "../components/capa/PriorityBadge";

const Timeline = () => {
  const [capas] = useState(mockCapas);

  // Calculate timeline metrics
  const today = new Date();
  const dueToday = capas.filter((c) => {
    const due = new Date(c.dueDate);
    return (
      due.toDateString() === today.toDateString() &&
      c.status !== "closed"
    );
  });

  const dueThisWeek = capas.filter((c) => {
    const due = new Date(c.dueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return (
      due >= today &&
      due <= weekFromNow &&
      c.status !== "closed"
    );
  });

  const overdue = capas.filter((c) => {
    const due = new Date(c.dueDate);
    return due < today && c.status !== "closed";
  });

  const upcoming = capas.filter((c) => {
    const due = new Date(c.dueDate);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due > weekFromNow && c.status !== "closed";
  });

  // Sort CAPAs by due date
  const sortedCapas = [...capas]
    .filter((c) => c.status !== "closed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Timeline Tracker</h1>
          <p className="text-muted-foreground">
            Track CAPA deadlines and manage time-sensitive actions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Due Today
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueToday.length}</div>
              <p className="text-xs text-muted-foreground">
                Immediate attention required
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Due This Week
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueThisWeek.length}</div>
              <p className="text-xs text-muted-foreground">
                Next 7 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {overdue.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Past due date
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcoming.length}</div>
              <p className="text-xs text-muted-foreground">
                Beyond this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline View */}
        <Card>
          <CardHeader>
            <CardTitle>CAPA Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdue.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Overdue CAPAs
                  </h3>
                  <div className="space-y-2">
                    {overdue.map((capa) => (
                      <div
                        key={capa.id}
                        className="flex items-center justify-between p-4 border-l-4 border-l-destructive rounded bg-destructive/5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{capa.id}</span>
                            <StatusBadge status={capa.status} />
                            <PriorityBadge priority={capa.priority} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {capa.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-destructive">
                            {new Date(capa.dueDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.floor(
                              (today.getTime() -
                                new Date(capa.dueDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days overdue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dueToday.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Due Today
                  </h3>
                  <div className="space-y-2">
                    {dueToday.map((capa) => (
                      <div
                        key={capa.id}
                        className="flex items-center justify-between p-4 border-l-4 border-l-warning rounded bg-warning/5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{capa.id}</span>
                            <StatusBadge status={capa.status} />
                            <PriorityBadge priority={capa.priority} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {capa.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Today</p>
                          <p className="text-xs text-muted-foreground">
                            {capa.ownerName || "Unassigned"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {dueThisWeek.filter((c) => !dueToday.includes(c)).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-info mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due This Week
                  </h3>
                  <div className="space-y-2">
                    {dueThisWeek
                      .filter((c) => !dueToday.includes(c))
                      .map((capa) => (
                        <div
                          key={capa.id}
                          className="flex items-center justify-between p-4 border-l-4 border-l-info rounded"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{capa.id}</span>
                              <StatusBadge status={capa.status} />
                              <PriorityBadge priority={capa.priority} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {capa.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Date(capa.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.ceil(
                                (new Date(capa.dueDate).getTime() -
                                  today.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days remaining
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Upcoming CAPAs
                  </h3>
                  <div className="space-y-2">
                    {upcoming.slice(0, 5).map((capa) => (
                      <div
                        key={capa.id}
                        className="flex items-center justify-between p-4 border rounded"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{capa.id}</span>
                            <StatusBadge status={capa.status} />
                            <PriorityBadge priority={capa.priority} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {capa.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(capa.dueDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {capa.ownerName || "Unassigned"}
                          </p>
                        </div>
                      </div>
                    ))}
                    {upcoming.length > 5 && (
                      <p className="text-sm text-center text-muted-foreground">
                        + {upcoming.length - 5} more upcoming CAPAs
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Timeline;
