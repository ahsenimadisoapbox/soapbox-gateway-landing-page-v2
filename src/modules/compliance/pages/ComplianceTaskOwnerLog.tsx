import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { TaskOwnerLogDialog } from "../components/compliance/TaskOwnerLogDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type TaskOwnerLog = {
  historyId: string;
  tenantId: string;
  taskId: string;
  oldOwner: string;
  newOwner: string;
  changedBy: string;
  changedTs: string;
  note: string;
};

const ComplianceTaskOwnerLog = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedLog, setSelectedLog] = useState<TaskOwnerLog | null>(null);

  const logs: TaskOwnerLog[] = [
    {
      historyId: "HIST-001",
      tenantId: "TNT-001",
      taskId: "TSK-001",
      oldOwner: "john@example.com",
      newOwner: "sarah@example.com",
      changedBy: "admin@example.com",
      changedTs: "2025-11-15 10:30:00",
      note: "Reassigned due to workload rebalancing",
    },
    {
      historyId: "HIST-002",
      tenantId: "TNT-001",
      taskId: "TSK-002",
      oldOwner: "sarah@example.com",
      newOwner: "mike@example.com",
      changedBy: "manager@example.com",
      changedTs: "2025-11-10 14:15:00",
      note: "Transferred to security team lead",
    },
  ];

  const handleView = (log: TaskOwnerLog) => {
    setSelectedLog(log);
    setDialogMode("view");
  };

  const handleEdit = (log: TaskOwnerLog) => {
    setSelectedLog(log);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedLog(null);
    setDialogMode("create");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Owner Change Log</h1>
          <p className="text-muted-foreground">Track task ownership changes and reassignments</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Log Entry
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search logs..." />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Old Owner</TableHead>
              <TableHead>New Owner</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Changed At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.historyId}>
                <TableCell className="font-medium">{log.taskId}</TableCell>
                <TableCell>{log.oldOwner}</TableCell>
                <TableCell>{log.newOwner}</TableCell>
                <TableCell>{log.changedBy}</TableCell>
                <TableCell>{log.changedTs}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(log)}
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

      <TaskOwnerLogDialog
        mode={dialogMode}
        log={selectedLog}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceTaskOwnerLog;
