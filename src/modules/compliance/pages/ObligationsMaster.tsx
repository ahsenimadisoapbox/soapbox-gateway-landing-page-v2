import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Link2, AlertTriangle, Users, Clock } from "lucide-react";
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
import { Progress } from "../components/ui/progress";

type Obligation = {
  id: string;
  title: string;
  description: string;
  frameworkId: string;
  frameworkName: string;
  domainId: string;
  controlId: string;
  owner: string;
  status: "compliant" | "at-risk" | "pending" | "overdue" | "non-compliant";
  priority: "low" | "medium" | "high" | "critical";
  riskLevel: "low" | "medium" | "high" | "critical";
  dueDate: string;
  frequency: string;
  tasksCount: number;
  evidenceCount: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
};

const ObligationsMaster = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  const obligations: Obligation[] = [
    {
      id: "OBL-001",
      title: "Annual GDPR Data Protection Impact Assessment",
      description: "Conduct comprehensive data protection impact assessment for all processing activities",
      frameworkId: "FW-001",
      frameworkName: "GDPR",
      domainId: "DOM-001",
      controlId: "CTRL-001",
      owner: "sarah.johnson@company.com",
      status: "at-risk",
      priority: "high",
      riskLevel: "high",
      dueDate: "2025-10-15",
      frequency: "ANNUAL",
      tasksCount: 5,
      evidenceCount: 3,
      completionRate: 60,
      createdAt: "2024-01-15",
      updatedAt: "2024-12-01",
    },
    {
      id: "OBL-002",
      title: "ISO 27001 Information Security Review",
      description: "Quarterly information security management system review",
      frameworkId: "FW-003",
      frameworkName: "ISO27001",
      domainId: "DOM-004",
      controlId: "CTRL-002",
      owner: "mike.rodriguez@company.com",
      status: "compliant",
      priority: "medium",
      riskLevel: "medium",
      dueDate: "2025-11-20",
      frequency: "QUARTERLY",
      tasksCount: 8,
      evidenceCount: 12,
      completionRate: 100,
      createdAt: "2024-02-01",
      updatedAt: "2024-11-20",
    },
    {
      id: "OBL-003",
      title: "SOX Financial Controls Assessment",
      description: "Annual assessment of financial reporting controls",
      frameworkId: "FW-004",
      frameworkName: "SOX",
      domainId: "DOM-005",
      controlId: "CTRL-003",
      owner: "jennifer.walsh@company.com",
      status: "pending",
      priority: "critical",
      riskLevel: "critical",
      dueDate: "2025-12-05",
      frequency: "ANNUAL",
      tasksCount: 12,
      evidenceCount: 5,
      completionRate: 45,
      createdAt: "2024-03-01",
      updatedAt: "2024-11-15",
    },
    {
      id: "OBL-004",
      title: "HIPAA Security Risk Assessment",
      description: "Comprehensive security risk assessment for PHI",
      frameworkId: "FW-002",
      frameworkName: "HIPAA",
      domainId: "DOM-003",
      controlId: "CTRL-004",
      owner: "david.kim@company.com",
      status: "overdue",
      priority: "critical",
      riskLevel: "critical",
      dueDate: "2024-09-01",
      frequency: "ANNUAL",
      tasksCount: 10,
      evidenceCount: 2,
      completionRate: 20,
      createdAt: "2024-01-01",
      updatedAt: "2024-10-15",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "at-risk": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "pending": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "overdue": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "non-compliant": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDialogMode("view");
  };

  const handleEdit = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedObligation(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Compliant", value: "compliant", checked: false },
        { label: "At Risk", value: "at-risk", checked: false },
        { label: "Pending", value: "pending", checked: false },
        { label: "Overdue", value: "overdue", checked: false },
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
    {
      label: "Risk Level",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Obligation" : dialogMode === "edit" ? "Edit Obligation" : "Obligation Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligations Master</h1>
          <p className="text-muted-foreground">Central store for all compliance obligations</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Obligation
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{obligations.length}</div>
            <p className="text-xs text-muted-foreground">Total Obligations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{obligations.filter(o => o.status === "compliant").length}</div>
            <p className="text-xs text-muted-foreground">Compliant</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{obligations.filter(o => o.status === "at-risk").length}</div>
            <p className="text-xs text-muted-foreground">At Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{obligations.filter(o => o.status === "overdue").length}</div>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{Math.round(obligations.reduce((acc, o) => acc + o.completionRate, 0) / obligations.length)}%</div>
            <p className="text-xs text-muted-foreground">Avg Completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search obligations..."
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
              <TableHead>Framework</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((obligation) => (
              <TableRow key={obligation.id}>
                <TableCell className="font-medium">{obligation.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{obligation.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{obligation.frameworkName}</Badge>
                </TableCell>
                <TableCell className="text-sm">{obligation.owner.split("@")[0]}</TableCell>
                <TableCell>{obligation.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(obligation.priority)}>
                    {obligation.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(obligation.riskLevel)}>
                    {obligation.riskLevel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(obligation.status)}>
                    {obligation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={obligation.completionRate} className="w-16 h-2" />
                    <span className="text-xs">{obligation.completionRate}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(obligation)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(obligation)}>
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
              <TabsTrigger value="risk">Risk & Metrics</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Obligation ID</Label>
                  <Input id="id" defaultValue={selectedObligation?.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedObligation?.frameworkName} disabled />
                  ) : (
                    <Select defaultValue={selectedObligation?.frameworkId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FW-001">GDPR</SelectItem>
                        <SelectItem value="FW-002">HIPAA</SelectItem>
                        <SelectItem value="FW-003">ISO27001</SelectItem>
                        <SelectItem value="FW-004">SOX</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={selectedObligation?.title} disabled={isViewMode} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" defaultValue={selectedObligation?.dueDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedObligation?.frequency} disabled />
                  ) : (
                    <Select defaultValue={selectedObligation?.frequency || "ANNUAL"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="ANNUAL">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedObligation?.status} disabled />
                  ) : (
                    <Select defaultValue={selectedObligation?.status || "pending"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="at-risk">At Risk</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="non-compliant">Non-Compliant</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedObligation?.description} disabled={isViewMode} rows={4} />
              </div>
            </TabsContent>
            
            <TabsContent value="owner" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Owner Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner">Primary Owner</Label>
                    <Input id="owner" defaultValue={selectedObligation?.owner} disabled={isViewMode} />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">Assignment History</div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>sarah.johnson@company.com</span>
                        <span>Assigned on 2024-01-15</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="risk" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Risk Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      {isViewMode ? (
                        <Badge className={getPriorityColor(selectedObligation?.riskLevel || "medium")}>
                          {selectedObligation?.riskLevel}
                        </Badge>
                      ) : (
                        <Select defaultValue={selectedObligation?.riskLevel || "medium"}>
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
                      <Label>Priority</Label>
                      {isViewMode ? (
                        <Badge className={getPriorityColor(selectedObligation?.priority || "medium")}>
                          {selectedObligation?.priority}
                        </Badge>
                      ) : (
                        <Select defaultValue={selectedObligation?.priority || "medium"}>
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
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Completion Rate</span>
                          <span className="text-sm font-medium">{selectedObligation?.completionRate}%</span>
                        </div>
                        <Progress value={selectedObligation?.completionRate} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tasks</span>
                        <span className="font-medium">{selectedObligation?.tasksCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Evidence Items</span>
                        <span className="font-medium">{selectedObligation?.evidenceCount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Linked Tasks
                  </CardTitle>
                  <Button variant="outline" size="sm">+ Add Task</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{selectedObligation?.tasksCount || 0}</div>
                  <Button variant="link" className="p-0 h-auto">View all tasks →</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="evidence" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" /> Evidence Items
                  </CardTitle>
                  <Button variant="outline" size="sm">+ Upload Evidence</Button>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{selectedObligation?.evidenceCount || 0}</div>
                  <Button variant="link" className="p-0 h-auto">View evidence library →</Button>
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

export default ObligationsMaster;
