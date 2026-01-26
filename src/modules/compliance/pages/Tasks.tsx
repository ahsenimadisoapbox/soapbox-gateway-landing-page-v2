import { useState } from "react";
import { Eye, Edit, Trash2, Plus, AlertTriangle, Clock, User, ArrowUp } from "lucide-react";
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
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

type Task = {
  id: string;
  tenantId: string;
  obligationId: string;
  title: string;
  description: string;
  owner: string;
  siteId: string;
  siteName: string;
  dueDate: string;
  status: "open" | "in_progress" | "completed" | "overdue" | "blocked";
  severity: "low" | "medium" | "high" | "critical";
  priority: "low" | "medium" | "high" | "critical";
  escalationLevel: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
};

const Tasks = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks: Task[] = [
    {
      id: "TSK-001",
      tenantId: "T-001",
      obligationId: "OBL-001",
      title: "Complete Data Inventory Documentation",
      description: "Document all personal data processing activities across departments",
      owner: "john.smith@company.com",
      siteId: "SITE-001",
      siteName: "London HQ",
      dueDate: "2025-01-15",
      status: "in_progress",
      severity: "high",
      priority: "high",
      escalationLevel: 0,
      evidenceCount: 3,
      createdAt: "2024-11-01",
      updatedAt: "2024-12-01",
    },
    {
      id: "TSK-002",
      tenantId: "T-001",
      obligationId: "OBL-001",
      title: "Review Third-Party Processors",
      description: "Audit all third-party data processors and update contracts",
      owner: "sarah.johnson@company.com",
      siteId: "SITE-001",
      siteName: "London HQ",
      dueDate: "2024-12-20",
      status: "overdue",
      severity: "critical",
      priority: "critical",
      escalationLevel: 2,
      evidenceCount: 1,
      createdAt: "2024-10-15",
      updatedAt: "2024-12-05",
    },
    {
      id: "TSK-003",
      tenantId: "T-001",
      obligationId: "OBL-002",
      title: "Update Security Policies",
      description: "Review and update information security policies for ISO compliance",
      owner: "mike.rodriguez@company.com",
      siteId: "SITE-001",
      siteName: "London HQ",
      dueDate: "2025-02-01",
      status: "open",
      severity: "medium",
      priority: "medium",
      escalationLevel: 0,
      evidenceCount: 0,
      createdAt: "2024-11-20",
      updatedAt: "2024-11-20",
    },
    {
      id: "TSK-004",
      tenantId: "T-001",
      obligationId: "OBL-003",
      title: "Financial Control Testing",
      description: "Execute quarterly financial control testing procedures",
      owner: "jennifer.walsh@company.com",
      siteId: "SITE-003",
      siteName: "New York Office",
      dueDate: "2025-01-31",
      status: "in_progress",
      severity: "critical",
      priority: "high",
      escalationLevel: 1,
      evidenceCount: 5,
      createdAt: "2024-10-01",
      updatedAt: "2024-12-02",
    },
    {
      id: "TSK-005",
      tenantId: "T-001",
      obligationId: "OBL-004",
      title: "HIPAA Training Completion",
      description: "Ensure all healthcare staff complete HIPAA training",
      owner: "david.kim@company.com",
      siteId: "SITE-002",
      siteName: "Berlin Office",
      dueDate: "2025-03-15",
      status: "completed",
      severity: "high",
      priority: "high",
      escalationLevel: 0,
      evidenceCount: 8,
      createdAt: "2024-09-01",
      updatedAt: "2024-11-30",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in_progress": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "open": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "overdue": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "blocked": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
    setDialogMode("view");
  };

  const handleEdit = (task: Task) => {
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
        { label: "Open", value: "open", checked: false },
        { label: "In Progress", value: "in_progress", checked: false },
        { label: "Completed", value: "completed", checked: false },
        { label: "Overdue", value: "overdue", checked: false },
        { label: "Blocked", value: "blocked", checked: false },
      ],
    },
    {
      label: "Severity",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
    {
      label: "Priority",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Task" : dialogMode === "edit" ? "Edit Task" : "Task Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Operational compliance tasks with assignment and escalation</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === "overdue").length}</div>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{tasks.filter(t => t.escalationLevel > 0).length}</div>
            <p className="text-xs text-muted-foreground">Escalated</p>
          </CardContent>
        </Card>
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
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Escalation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{task.title}</TableCell>
                <TableCell className="text-sm">{task.owner.split("@")[0]}</TableCell>
                <TableCell>{task.siteName}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getSeverityColor(task.severity)}>
                    {task.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getSeverityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(task.status)}>
                    {task.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.escalationLevel > 0 ? (
                    <Badge variant="outline" className="gap-1">
                      <ArrowUp className="w-3 h-3" />
                      L{task.escalationLevel}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(task)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
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

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
              <TabsTrigger value="escalation">Escalation</TabsTrigger>
              <TabsTrigger value="evidence">Evidence & Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Task ID</Label>
                  <Input id="id" defaultValue={selectedTask?.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site">Site</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedTask?.siteName} disabled />
                  ) : (
                    <Select defaultValue={selectedTask?.siteId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SITE-001">London HQ</SelectItem>
                        <SelectItem value="SITE-002">Berlin Office</SelectItem>
                        <SelectItem value="SITE-003">New York Office</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={selectedTask?.title} disabled={isViewMode} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" defaultValue={selectedTask?.dueDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedTask?.severity} disabled />
                  ) : (
                    <Select defaultValue={selectedTask?.severity || "medium"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedTask?.status} disabled />
                  ) : (
                    <Select defaultValue={selectedTask?.status || "open"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedTask?.description} disabled={isViewMode} rows={4} />
              </div>
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Owner Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner">Current Owner</Label>
                    <Input id="owner" defaultValue={selectedTask?.owner} disabled={isViewMode} />
                  </div>
                  {!isViewMode && (
                    <Button variant="outline">Reassign Task</Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="escalation" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Escalation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Current Escalation Level</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTask?.escalationLevel === 0 ? "Not escalated" : `Level ${selectedTask?.escalationLevel}`}
                      </div>
                    </div>
                    {selectedTask?.escalationLevel && selectedTask.escalationLevel > 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <ArrowUp className="w-3 h-3" />
                        Escalated
                      </Badge>
                    ) : (
                      <Badge variant="outline">Normal</Badge>
                    )}
                  </div>
                  {!isViewMode && (
                    <div className="flex gap-2">
                      <Button variant="outline">Escalate Task</Button>
                      <Button variant="outline">De-escalate</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="evidence" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Evidence & Activity Logs
                  </CardTitle>
                  <Button variant="outline" size="sm">+ Upload Evidence</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Evidence Items</div>
                        <div className="text-sm text-muted-foreground">{selectedTask?.evidenceCount} files attached</div>
                      </div>
                      <Button variant="link">View all →</Button>
                    </div>
                    <div className="border-t pt-4">
                      <div className="font-medium mb-2">Activity Log</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Task updated</span>
                          <span>{selectedTask?.updatedAt}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Task created</span>
                          <span>{selectedTask?.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {dialogMode === "create" ? "Create" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
