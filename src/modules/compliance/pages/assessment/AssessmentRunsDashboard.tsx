import { useState } from "react";
import { Eye, Play, Pause, Trash2, Download, Filter, Search, MoreHorizontal, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AssessmentRun {
  id: string;
  obligationId: string;
  obligationName: string;
  templateName: string;
  templateVersion: string;
  assignee: string;
  site: string;
  status: "completed" | "in_progress" | "paused" | "not_started" | "draft";
  progress: number;
  score: number;
  startedAt: string;
  completedAt: string;
  dueDate: string;
}

const mockRuns: AssessmentRun[] = [
  { id: "AR-001", obligationId: "OBL-001", obligationName: "GDPR Data Protection", templateName: "GDPR Privacy Assessment", templateVersion: "2.1", assignee: "sarah.johnson@company.com", site: "Headquarters", status: "completed", progress: 100, score: 85, startedAt: "2024-11-01", completedAt: "2024-11-15", dueDate: "2024-11-30" },
  { id: "AR-002", obligationId: "OBL-002", obligationName: "ISO 27001 Certification", templateName: "ISO 27001 Security Review", templateVersion: "1.3", assignee: "mike.rodriguez@company.com", site: "Data Center", status: "in_progress", progress: 65, score: 0, startedAt: "2024-11-20", completedAt: "", dueDate: "2024-12-15" },
  { id: "AR-003", obligationId: "OBL-003", obligationName: "SOX Compliance", templateName: "SOX IT Controls", templateVersion: "2.0", assignee: "jennifer.walsh@company.com", site: "Headquarters", status: "paused", progress: 30, score: 0, startedAt: "2024-11-15", completedAt: "", dueDate: "2024-12-31" },
  { id: "AR-004", obligationId: "OBL-004", obligationName: "HIPAA Privacy Rule", templateName: "HIPAA Privacy Assessment", templateVersion: "1.0", assignee: "david.kim@company.com", site: "Healthcare Facility", status: "not_started", progress: 0, score: 0, startedAt: "", completedAt: "", dueDate: "2025-01-15" },
  { id: "AR-005", obligationId: "OBL-001", obligationName: "GDPR Data Protection", templateName: "GDPR Privacy Assessment", templateVersion: "2.0", assignee: "sarah.johnson@company.com", site: "European Office", status: "completed", progress: 100, score: 72, startedAt: "2024-08-01", completedAt: "2024-08-20", dueDate: "2024-08-31" },
  { id: "AR-006", obligationId: "OBL-005", obligationName: "PCI DSS Compliance", templateName: "PCI DSS Assessment", templateVersion: "1.2", assignee: "emily.chen@company.com", site: "E-Commerce Platform", status: "draft", progress: 15, score: 0, startedAt: "2024-11-25", completedAt: "", dueDate: "2024-12-20" },
];

const AssessmentRunsDashboard = () => {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<AssessmentRun[]>(mockRuns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runToDelete, setRunToDelete] = useState<string | null>(null);

  const stats = {
    total: runs.length,
    completed: runs.filter(r => r.status === "completed").length,
    inProgress: runs.filter(r => r.status === "in_progress").length,
    avgScore: runs.filter(r => r.status === "completed").length > 0 
      ? Math.round(runs.filter(r => r.status === "completed").reduce((a, r) => a + r.score, 0) / runs.filter(r => r.status === "completed").length)
      : 0,
  };

  const filteredRuns = runs.filter(run => {
    const matchesSearch = run.obligationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      run.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || run.status === statusFilter;
    const matchesTemplate = templateFilter === "all" || run.templateName === templateFilter;
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const templates = [...new Set(runs.map(r => r.templateName))];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      paused: "bg-yellow-100 text-yellow-800",
      not_started: "bg-gray-100 text-gray-800",
      draft: "bg-purple-100 text-purple-800",
    };
    const labels: Record<string, string> = {
      completed: "Completed",
      in_progress: "In Progress",
      paused: "Paused",
      not_started: "Not Started",
      draft: "Draft",
    };
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const handleView = (runId: string) => {
    navigate(`/assessment/result/${runId}`);
  };

  const handleContinue = (runId: string) => {
    navigate("/assessment/wizard", { state: { runId } });
  };

  const handleDelete = (runId: string) => {
    setRunToDelete(runId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (runToDelete) {
      setRuns(prev => prev.filter(r => r.id !== runToDelete));
      toast.success("Assessment run deleted");
    }
    setDeleteDialogOpen(false);
    setRunToDelete(null);
  };

  const handleBulkDelete = () => {
    setRuns(prev => prev.filter(r => !selectedRuns.includes(r.id)));
    toast.success(`${selectedRuns.length} assessment runs deleted`);
    setSelectedRuns([]);
  };

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedRuns.length} assessment runs...`);
  };

  const toggleSelectAll = () => {
    if (selectedRuns.length === filteredRuns.length) {
      setSelectedRuns([]);
    } else {
      setSelectedRuns(filteredRuns.map(r => r.id));
    }
  };

  const toggleSelect = (runId: string) => {
    setSelectedRuns(prev => 
      prev.includes(runId) 
        ? prev.filter(id => id !== runId)
        : [...prev, runId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessment Runs</h1>
          <p className="text-muted-foreground">Track and manage all assessment executions</p>
        </div>
        <Button onClick={() => navigate("/assessment/select-template")} className="gap-2 bg-primary hover:bg-primary/90">
          <Play className="w-4 h-4" />
          Start New Assessment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <RefreshCw className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by obligation, template, or assignee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {templates.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedRuns.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedRuns.length} selected</span>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleBulkExport}>
            <Download className="w-4 h-4" />
            Export Selected
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Runs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRuns.length === filteredRuns.length && filteredRuns.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Run ID</TableHead>
                <TableHead>Obligation</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRuns.includes(run.id)}
                      onCheckedChange={() => toggleSelect(run.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono font-medium">{run.id}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{run.obligationName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="truncate max-w-[150px]">{run.templateName}</span>
                      <span className="text-xs text-muted-foreground">v{run.templateVersion}</span>
                    </div>
                  </TableCell>
                  <TableCell>{run.assignee.split("@")[0]}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={run.progress} className="w-16 h-2" />
                      <span className="text-sm">{run.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(run.status)}</TableCell>
                  <TableCell>
                    {run.score > 0 ? (
                      <Badge className={run.score >= 80 ? "bg-green-100 text-green-800" : run.score >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {run.score}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{run.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(run.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {(run.status === "in_progress" || run.status === "draft" || run.status === "paused") && (
                          <DropdownMenuItem onClick={() => handleContinue(run.id)}>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </DropdownMenuItem>
                        )}
                        {run.status === "in_progress" && (
                          <DropdownMenuItem onClick={() => {
                            setRuns(prev => prev.map(r => r.id === run.id ? {...r, status: "paused" as const} : r));
                            toast.success("Assessment paused");
                          }}>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => toast.success(`Exporting ${run.id} as PDF...`)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {(run.status === "draft" || run.status === "not_started") && (
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(run.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredRuns.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No assessment runs match your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment Run</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment run? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentRunsDashboard;
