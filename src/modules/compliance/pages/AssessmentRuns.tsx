import { useState } from "react";
import { Eye, Play, Pause, CheckCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";

const AssessmentRuns = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const runs = [
    { id: "AR-001", template: "GDPR Compliance Assessment", assignee: "sarah.johnson@company.com", status: "completed", progress: 100, score: 85, startedAt: "2024-11-01", completedAt: "2024-11-15" },
    { id: "AR-002", template: "ISO 27001 Security Review", assignee: "mike.rodriguez@company.com", status: "in_progress", progress: 65, score: 0, startedAt: "2024-11-20", completedAt: "" },
    { id: "AR-003", template: "SOX Control Testing", assignee: "jennifer.walsh@company.com", status: "paused", progress: 30, score: 0, startedAt: "2024-11-15", completedAt: "" },
    { id: "AR-004", template: "HIPAA Privacy Assessment", assignee: "david.kim@company.com", status: "not_started", progress: 0, score: 0, startedAt: "", completedAt: "" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessment Runs</h1>
          <p className="text-muted-foreground">Execute assessments with multi-step questionnaire</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Play className="w-4 h-4 mr-2" />Start Assessment</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{runs.length}</div><p className="text-xs text-muted-foreground">Total Runs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{runs.filter(r => r.status === "completed").length}</div><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{runs.filter(r => r.status === "in_progress").length}</div><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{runs.filter(r => r.status === "completed").length > 0 ? Math.round(runs.filter(r => r.status === "completed").reduce((a, r) => a + r.score, 0) / runs.filter(r => r.status === "completed").length) : 0}%</div><p className="text-xs text-muted-foreground">Avg Score</p></CardContent></Card>
      </div>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Started</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{r.template}</TableCell>
                <TableCell>{r.assignee.split("@")[0]}</TableCell>
                <TableCell><div className="flex items-center gap-2"><Progress value={r.progress} className="w-16 h-2" /><span className="text-xs">{r.progress}%</span></div></TableCell>
                <TableCell><Badge className={getStatusColor(r.status)}>{r.status.replace("_", " ")}</Badge></TableCell>
                <TableCell>{r.score > 0 ? `${r.score}%` : "-"}</TableCell>
                <TableCell>{r.startedAt || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    {r.status === "in_progress" && <Button variant="ghost" size="icon"><Pause className="w-4 h-4" /></Button>}
                    {r.status === "paused" && <Button variant="ghost" size="icon"><Play className="w-4 h-4" /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Start New Assessment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Select Template</Label><Select><SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger><SelectContent><SelectItem value="AT-001">GDPR Compliance Assessment</SelectItem><SelectItem value="AT-002">ISO 27001 Security Review</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Assign To</Label><Select><SelectTrigger><SelectValue placeholder="Select assignee" /></SelectTrigger><SelectContent><SelectItem value="user1">sarah.johnson@company.com</SelectItem><SelectItem value="user2">mike.rodriguez@company.com</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Start Assessment</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentRuns;
