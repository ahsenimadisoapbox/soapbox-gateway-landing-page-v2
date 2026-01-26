import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { TaskAssignmentLogDialog } from "../components/compliance/TaskAssignmentLogDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { useToast } from "../hooks/use-toast";

type TaskAssignmentLog = {
  taskAssignmentId: string;
  tenantId: string;
  siteId: string;
  taskId: string;
  assignedRole: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  assignmentNotes: string;
  status: string;
};

const initialData: TaskAssignmentLog[] = [
  {
    taskAssignmentId: "TAL-001",
    tenantId: "TNT-001",
    siteId: "SITE-001",
    taskId: "TSK-001",
    assignedRole: "Compliance Officer",
    assignedTo: "john.smith@company.com",
    assignedBy: "admin@company.com",
    assignedAt: "2024-11-01",
    effectiveFrom: "2024-11-01",
    effectiveTo: "",
    assignmentNotes: "Primary assignment for GDPR compliance tasks",
    status: "ACTIVE",
  },
  {
    taskAssignmentId: "TAL-002",
    tenantId: "TNT-001",
    siteId: "SITE-002",
    taskId: "TSK-002",
    assignedRole: "Data Protection Officer",
    assignedTo: "sarah.johnson@company.com",
    assignedBy: "admin@company.com",
    assignedAt: "2024-10-15",
    effectiveFrom: "2024-10-15",
    effectiveTo: "",
    assignmentNotes: "Assigned for quarterly audit tasks",
    status: "ACTIVE",
  },
  {
    taskAssignmentId: "TAL-003",
    tenantId: "TNT-001",
    siteId: "SITE-001",
    taskId: "TSK-003",
    assignedRole: "Security Analyst",
    assignedTo: "mike.rodriguez@company.com",
    assignedBy: "admin@company.com",
    assignedAt: "2024-11-20",
    effectiveFrom: "2024-11-20",
    effectiveTo: "",
    assignmentNotes: "Security review tasks",
    status: "ACTIVE",
  },
];

const TaskAssignmentLog = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<TaskAssignmentLog[]>(initialData);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedLog, setSelectedLog] = useState<TaskAssignmentLog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<TaskAssignmentLog | null>(null);

  const handleView = (log: TaskAssignmentLog) => {
    setSelectedLog(log);
    setDialogMode("view");
  };

  const handleEdit = (log: TaskAssignmentLog) => {
    setSelectedLog(log);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedLog(null);
    setDialogMode("create");
  };

  const handleDeleteClick = (log: TaskAssignmentLog) => {
    setLogToDelete(log);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (logToDelete) {
      setLogs(logs.filter((l) => l.taskAssignmentId !== logToDelete.taskAssignmentId));
      toast({
        title: "Assignment Deleted",
        description: `Task assignment ${logToDelete.taskAssignmentId} has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setLogToDelete(null);
    }
  };

  const handleSave = (data: TaskAssignmentLog) => {
    if (dialogMode === "create") {
      const newLog: TaskAssignmentLog = {
        ...data,
        taskAssignmentId: `TAL-${String(logs.length + 1).padStart(3, "0")}`,
        assignedAt: new Date().toISOString().split("T")[0],
      };
      setLogs([...logs, newLog]);
      toast({
        title: "Assignment Created",
        description: `Task assignment ${newLog.taskAssignmentId} has been created.`,
      });
    } else if (dialogMode === "edit" && selectedLog) {
      setLogs(logs.map((l) => (l.taskAssignmentId === selectedLog.taskAssignmentId ? data : l)));
      toast({
        title: "Assignment Updated",
        description: `Task assignment ${data.taskAssignmentId} has been updated.`,
      });
    }
    setDialogMode(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "ACTIVE", checked: false },
        { label: "Completed", value: "COMPLETED", checked: false },
        { label: "Cancelled", value: "CANCELLED", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Assignment Log</h1>
          <p className="text-muted-foreground">Track task assignment changes and history</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search assignments..." filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Task ID</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Assigned Role</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.taskAssignmentId}>
                <TableCell className="font-medium">{log.taskAssignmentId}</TableCell>
                <TableCell>{log.taskId}</TableCell>
                <TableCell>{log.assignedTo.split("@")[0]}</TableCell>
                <TableCell>{log.assignedRole}</TableCell>
                <TableCell>{log.assignedBy.split("@")[0]}</TableCell>
                <TableCell>{log.effectiveFrom}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(log)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(log)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(log)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskAssignmentLogDialog
        mode={dialogMode}
        assignment={selectedLog}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete assignment "{logToDelete?.taskAssignmentId}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskAssignmentLog;
