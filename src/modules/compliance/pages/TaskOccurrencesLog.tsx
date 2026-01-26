import { Eye, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

const TaskOccurrencesLog = () => {
  const occurrences = [
    { id: "TOL-001", taskId: "TSK-001", status: "completed", start: "2024-11-01", end: "2024-11-15", completedBy: "john.smith@company.com", completedAt: "2024-11-14" },
    { id: "TOL-002", taskId: "TSK-001", status: "in_progress", start: "2024-12-01", end: "2024-12-15", completedBy: "", completedAt: "" },
    { id: "TOL-003", taskId: "TSK-002", status: "overdue", start: "2024-11-15", end: "2024-11-30", completedBy: "", completedAt: "" },
    { id: "TOL-004", taskId: "TSK-003", status: "scheduled", start: "2025-01-01", end: "2025-01-15", completedBy: "", completedAt: "" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [{ label: "Status", options: [{ label: "Completed", value: "completed", checked: false }, { label: "In Progress", value: "in_progress", checked: false }, { label: "Overdue", value: "overdue", checked: false }, { label: "Scheduled", value: "scheduled", checked: false }] }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Task Occurrences Log</h1>
        <p className="text-muted-foreground">Recurring task tracking with calendar view</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{occurrences.length}</div><p className="text-xs text-muted-foreground">Total Occurrences</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{occurrences.filter(o => o.status === "completed").length}</div><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{occurrences.filter(o => o.status === "overdue").length}</div><p className="text-xs text-muted-foreground">Overdue</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{occurrences.filter(o => o.status === "scheduled").length}</div><p className="text-xs text-muted-foreground">Scheduled</p></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search occurrences..." filterGroups={filterGroups} /></CardContent></Card>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed By</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occurrences.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell><Badge variant="outline">{o.taskId}</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{o.start} - {o.end}</div></TableCell>
                <TableCell><Badge className={getStatusColor(o.status)}>{o.status.replace("_", " ")}</Badge></TableCell>
                <TableCell>{o.completedBy ? o.completedBy.split("@")[0] : "-"}</TableCell>
                <TableCell>{o.completedAt || "-"}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskOccurrencesLog;
