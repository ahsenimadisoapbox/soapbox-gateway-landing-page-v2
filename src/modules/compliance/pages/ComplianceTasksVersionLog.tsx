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
import { TaskVersionLogDialog } from "../components/compliance/TaskVersionLogDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
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

type TaskVersionLog = {
  taskVersionLogId: string;
  taskId: string;
  tenantId: string;
  siteId: string;
  versionNo: number;
  changeType: string;
  changedBy: string;
  changedAt: string;
  snapshot: string;
  changeReason: string;
};

const initialData: TaskVersionLog[] = [
  {
    taskVersionLogId: "VER-001",
    taskId: "TSK-001",
    tenantId: "TNT-001",
    siteId: "SITE-001",
    versionNo: 1,
    changeType: "CREATE",
    changedBy: "admin@example.com",
    changedAt: "2025-11-01 10:00:00",
    snapshot: '{"title":"Complete GDPR Data Mapping Exercise","status":"OPEN"}',
    changeReason: "Initial task creation",
  },
  {
    taskVersionLogId: "VER-002",
    taskId: "TSK-001",
    tenantId: "TNT-001",
    siteId: "SITE-001",
    versionNo: 2,
    changeType: "UPDATE",
    changedBy: "john@example.com",
    changedAt: "2025-11-15 14:30:00",
    snapshot: '{"title":"Complete GDPR Data Mapping Exercise","status":"IN_PROGRESS"}',
    changeReason: "Task started - status updated",
  },
  {
    taskVersionLogId: "VER-003",
    taskId: "TSK-002",
    tenantId: "TNT-001",
    siteId: "SITE-002",
    versionNo: 1,
    changeType: "CREATE",
    changedBy: "admin@example.com",
    changedAt: "2025-11-10 09:00:00",
    snapshot: '{"title":"Quarterly Security Audit","status":"OPEN"}',
    changeReason: "New audit task created",
  },
];

const ComplianceTasksVersionLog = () => {
  const { toast } = useToast();
  const [versions, setVersions] = useState<TaskVersionLog[]>(initialData);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<TaskVersionLog | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<TaskVersionLog | null>(null);

  const handleView = (version: TaskVersionLog) => {
    setSelectedVersion(version);
    setDialogMode("view");
  };

  const handleEdit = (version: TaskVersionLog) => {
    setSelectedVersion(version);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedVersion(null);
    setDialogMode("create");
  };

  const handleDeleteClick = (version: TaskVersionLog) => {
    setVersionToDelete(version);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (versionToDelete) {
      setVersions(versions.filter((v) => v.taskVersionLogId !== versionToDelete.taskVersionLogId));
      toast({
        title: "Version Log Deleted",
        description: `Version log ${versionToDelete.taskVersionLogId} has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setVersionToDelete(null);
    }
  };

  const handleSave = (data: TaskVersionLog) => {
    if (dialogMode === "create") {
      const newVersion: TaskVersionLog = {
        ...data,
        taskVersionLogId: `VER-${String(versions.length + 1).padStart(3, "0")}`,
        changedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
      setVersions([...versions, newVersion]);
      toast({
        title: "Version Log Created",
        description: `Version log ${newVersion.taskVersionLogId} has been created.`,
      });
    } else if (dialogMode === "edit" && selectedVersion) {
      setVersions(versions.map((v) => (v.taskVersionLogId === selectedVersion.taskVersionLogId ? data : v)));
      toast({
        title: "Version Log Updated",
        description: `Version log ${data.taskVersionLogId} has been updated.`,
      });
    }
    setDialogMode(null);
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case "CREATE":
        return "bg-green-100 text-green-800";
      case "UPDATE":
        return "bg-blue-100 text-blue-800";
      case "DELETE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    {
      label: "Change Type",
      options: [
        { label: "Create", value: "CREATE", checked: false },
        { label: "Update", value: "UPDATE", checked: false },
        { label: "Delete", value: "DELETE", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Version History</h1>
          <p className="text-muted-foreground">Track all changes and versions of compliance tasks</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Version Log
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search version logs..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID</TableHead>
              <TableHead>Task ID</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Change Type</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Changed At</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={version.taskVersionLogId}>
                <TableCell className="font-medium">{version.taskVersionLogId}</TableCell>
                <TableCell>{version.taskId}</TableCell>
                <TableCell>v{version.versionNo}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getChangeTypeColor(version.changeType)}>
                    {version.changeType}
                  </Badge>
                </TableCell>
                <TableCell>{version.changedBy}</TableCell>
                <TableCell>{version.changedAt}</TableCell>
                <TableCell className="max-w-xs truncate">{version.changeReason}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(version)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(version)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(version)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TaskVersionLogDialog
        mode={dialogMode}
        version={selectedVersion}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete version log "{versionToDelete?.taskVersionLogId}"? This action cannot be undone.
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

export default ComplianceTasksVersionLog;
