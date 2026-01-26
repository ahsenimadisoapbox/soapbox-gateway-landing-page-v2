import { Eye, FileText, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";

const AssessmentResponses = () => {
  const responses = [
    { id: "RESP-001", runId: "AR-001", questionId: "AQ-001", answer: "Yes", score: 10, hasEvidence: true, respondedBy: "sarah.johnson@company.com", respondedAt: "2024-11-10" },
    { id: "RESP-002", runId: "AR-001", questionId: "AQ-002", answer: "Quarterly", score: 8, hasEvidence: false, respondedBy: "sarah.johnson@company.com", respondedAt: "2024-11-10" },
    { id: "RESP-003", runId: "AR-001", questionId: "AQ-003", answer: "Our incident response...", score: 15, hasEvidence: true, respondedBy: "sarah.johnson@company.com", respondedAt: "2024-11-11" },
    { id: "RESP-004", runId: "AR-002", questionId: "AQ-001", answer: "Yes", score: 10, hasEvidence: true, respondedBy: "mike.rodriguez@company.com", respondedAt: "2024-11-22" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessment Responses</h1>
        <p className="text-muted-foreground">View submitted responses with evidence and scores</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{responses.length}</div><p className="text-xs text-muted-foreground">Total Responses</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{responses.filter(r => r.hasEvidence).length}</div><p className="text-xs text-muted-foreground">With Evidence</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{responses.reduce((a, r) => a + r.score, 0)}</div><p className="text-xs text-muted-foreground">Total Score</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">2</div><p className="text-xs text-muted-foreground">Assessment Runs</p></CardContent></Card>
      </div>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Assessment Run</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead>Responded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell><Badge variant="outline">{r.runId}</Badge></TableCell>
                <TableCell><Badge variant="outline">{r.questionId}</Badge></TableCell>
                <TableCell className="max-w-[150px] truncate">{r.answer}</TableCell>
                <TableCell><Badge className="bg-green-100 text-green-800">{r.score}</Badge></TableCell>
                <TableCell>{r.hasEvidence ? <div className="flex items-center gap-1"><FileText className="w-4 h-4 text-blue-500" /><span className="text-xs">Attached</span></div> : <span className="text-muted-foreground text-xs">None</span>}</TableCell>
                <TableCell>{r.respondedBy.split("@")[0]}</TableCell>
                <TableCell>{r.respondedAt}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssessmentResponses;
