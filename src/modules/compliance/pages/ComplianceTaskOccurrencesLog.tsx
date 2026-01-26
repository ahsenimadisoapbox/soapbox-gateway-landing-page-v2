import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { TaskOccurrenceLogDialog } from "../components/compliance/TaskOccurrenceLogDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type TaskOccurrenceLog = {
  taskOccurrenceId: string;
  tenantId: string;
  siteId: string;
  taskId: string;
  status: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  completedBy?: string;
  completedAt?: string;
  generatedAt: string;
  meta: string;
};

const ComplianceTaskOccurrencesLog = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedOccurrence, setSelectedOccurrence] = useState<TaskOccurrenceLog | null>(null);

  const occurrences: TaskOccurrenceLog[] = [
    {
      taskOccurrenceId: "OCC-001",
      tenantId: "TNT-001",
      siteId: "SITE-001",
      taskId: "TSK-001",
      status: "COMPLETED",
      occurrenceStart: "2025-11-01 00:00:00",
      occurrenceEnd: "2025-11-07 23:59:59",
      completedBy: "john@example.com",
      completedAt: "2025-11-05 16:30:00",
      generatedAt: "2025-11-01 00:00:00",
      meta: '{"frequency":"WEEKLY","iteration":1}',
    },
    {
      taskOccurrenceId: "OCC-002",
      tenantId: "TNT-001",
      siteId: "SITE-001",
      taskId: "TSK-001",
      status: "PENDING",
      occurrenceStart: "2025-11-08 00:00:00",
      occurrenceEnd: "2025-11-14 23:59:59",
      generatedAt: "2025-11-08 00:00:00",
      meta: '{"frequency":"WEEKLY","iteration":2}',
    },
    {
      taskOccurrenceId: "OCC-003",
      tenantId: "TNT-001",
      siteId: "SITE-002",
      taskId: "TSK-002",
      status: "OVERDUE",
      occurrenceStart: "2025-10-01 00:00:00",
      occurrenceEnd: "2025-10-31 23:59:59",
      generatedAt: "2025-10-01 00:00:00",
      meta: '{"frequency":"MONTHLY","iteration":1}',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PENDING": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "OVERDUE": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (occurrence: TaskOccurrenceLog) => {
    setSelectedOccurrence(occurrence);
    setDialogMode("view");
  };

  const handleEdit = (occurrence: TaskOccurrenceLog) => {
    setSelectedOccurrence(occurrence);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedOccurrence(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Completed", value: "COMPLETED", checked: false },
        { label: "Pending", value: "PENDING", checked: false },
        { label: "In Progress", value: "IN_PROGRESS", checked: false },
        { label: "Overdue", value: "OVERDUE", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Occurrence Log</h1>
          <p className="text-muted-foreground">Track recurring task occurrences and completions</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Occurrence
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search occurrences..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Occurrence Start</TableHead>
              <TableHead>Occurrence End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed By</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occurrences.map((occurrence) => (
              <TableRow key={occurrence.taskOccurrenceId}>
                <TableCell className="font-medium">{occurrence.taskId}</TableCell>
                <TableCell>{occurrence.occurrenceStart}</TableCell>
                <TableCell>{occurrence.occurrenceEnd}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(occurrence.status)}>
                    {occurrence.status}
                  </Badge>
                </TableCell>
                <TableCell>{occurrence.completedBy || "-"}</TableCell>
                <TableCell>{occurrence.completedAt || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(occurrence)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(occurrence)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskOccurrenceLogDialog
        mode={dialogMode}
        occurrence={selectedOccurrence}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceTaskOccurrencesLog;
