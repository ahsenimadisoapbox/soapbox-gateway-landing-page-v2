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
import { ComplianceTaskDialog } from "../components/compliance/ComplianceTaskDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceTask = {
  taskId: string;
  tenantId: string;
  obligationId: string;
  controlMapId: string;
  title: string;
  description: string;
  ownerId: string;
  dueDate: string;
  status: string;
  severity: string;
  escalationLevel: number;
  deletedFlag: "Y" | "N";
};

const ComplianceTasksPage = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedTask, setSelectedTask] = useState<ComplianceTask | null>(null);

  const tasks: ComplianceTask[] = [
    {
      taskId: "TSK-001",
      tenantId: "TNT-001",
      obligationId: "OBL-001",
      controlMapId: "CTL-MAP-001",
      title: "Complete GDPR Data Mapping Exercise",
      description: "Map all personal data processing activities",
      ownerId: "john@example.com",
      dueDate: "2025-12-15",
      status: "OPEN",
      severity: "HIGH",
      escalationLevel: 0,
      deletedFlag: "N",
    },
    {
      taskId: "TSK-002",
      tenantId: "TNT-001",
      obligationId: "OBL-002",
      controlMapId: "CTL-MAP-002",
      title: "Implement Access Control Review",
      description: "Review and update user access permissions",
      ownerId: "sarah@example.com",
      dueDate: "2025-11-30",
      status: "IN_PROGRESS",
      severity: "MEDIUM",
      escalationLevel: 1,
      deletedFlag: "N",
    },
    {
      taskId: "TSK-003",
      tenantId: "TNT-001",
      obligationId: "OBL-003",
      controlMapId: "CTL-MAP-003",
      title: "Security Incident Response Drill",
      description: "Conduct quarterly security incident response exercise",
      ownerId: "mike@example.com",
      dueDate: "2025-10-01",
      status: "OVERDUE",
      severity: "CRITICAL",
      escalationLevel: 2,
      deletedFlag: "N",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "COMPLETED": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "OVERDUE": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "HIGH": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "LOW": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (task: ComplianceTask) => {
    setSelectedTask(task);
    setDialogMode("view");
  };

  const handleEdit = (task: ComplianceTask) => {
    setSelectedTask(task);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Open", value: "OPEN", checked: false },
        { label: "In Progress", value: "IN_PROGRESS", checked: false },
        { label: "Completed", value: "COMPLETED", checked: false },
        { label: "Overdue", value: "OVERDUE", checked: false },
      ],
    },
    {
      label: "Severity",
      options: [
        { label: "Critical", value: "CRITICAL", checked: false },
        { label: "High", value: "HIGH", checked: false },
        { label: "Medium", value: "MEDIUM", checked: false },
        { label: "Low", value: "LOW", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Tasks</h1>
          <p className="text-muted-foreground">Manage and track compliance tasks</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search tasks..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell className="font-medium">{task.taskId}</TableCell>
                <TableCell className="max-w-xs truncate">{task.title}</TableCell>
                <TableCell>{task.ownerId}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getSeverityColor(task.severity)}>
                    {task.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(task)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(task)}
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

      <ComplianceTaskDialog
        mode={dialogMode}
        task={selectedTask}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceTasksPage;
