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
import { TaskAssignmentLogDialog } from "../components/compliance/TaskAssignmentLogDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

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

const ComplianceTaskAssignmentLog = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<TaskAssignmentLog | null>(null);

  const assignments: TaskAssignmentLog[] = [
    {
      taskAssignmentId: "ASSIGN-001",
      tenantId: "TNT-001",
      siteId: "SITE-001",
      taskId: "TSK-001",
      assignedRole: "Compliance Officer",
      assignedTo: "john@example.com",
      assignedBy: "manager@example.com",
      assignedAt: "2025-11-01 09:00:00",
      effectiveFrom: "2025-11-01",
      assignmentNotes: "Initial assignment for Q4 compliance review",
      status: "ACTIVE",
    },
    {
      taskAssignmentId: "ASSIGN-002",
      tenantId: "TNT-001",
      siteId: "SITE-002",
      taskId: "TSK-002",
      assignedRole: "Security Lead",
      assignedTo: "sarah@example.com",
      assignedBy: "admin@example.com",
      assignedAt: "2025-10-15 14:30:00",
      effectiveFrom: "2025-10-15",
      effectiveTo: "2025-11-15",
      assignmentNotes: "Temporary assignment during peak audit period",
      status: "COMPLETED",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "COMPLETED": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "CANCELLED": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (assignment: TaskAssignmentLog) => {
    setSelectedAssignment(assignment);
    setDialogMode("view");
  };

  const handleEdit = (assignment: TaskAssignmentLog) => {
    setSelectedAssignment(assignment);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedAssignment(null);
    setDialogMode("create");
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
          <p className="text-muted-foreground">Track task assignments and role-based allocations</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Assignment
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search assignments..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.taskAssignmentId}>
                <TableCell className="font-medium">{assignment.taskId}</TableCell>
                <TableCell>{assignment.assignedTo}</TableCell>
                <TableCell>{assignment.assignedRole}</TableCell>
                <TableCell>{assignment.assignedBy}</TableCell>
                <TableCell>{assignment.effectiveFrom}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(assignment)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(assignment)}
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

      <TaskAssignmentLogDialog
        mode={dialogMode}
        assignment={selectedAssignment}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceTaskAssignmentLog;
