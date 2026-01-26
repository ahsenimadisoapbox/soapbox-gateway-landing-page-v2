import { useState } from "react";
import { Eye, Edit, Trash2, Plus, HelpCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";

const AssessmentQuestions = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const questions = [
    { id: "AQ-001", question: "Is personal data encrypted at rest?", type: "yes_no", category: "Data Protection", weight: 10, required: true, evidenceRequired: true },
    { id: "AQ-002", question: "How often are access reviews conducted?", type: "multiple_choice", category: "Access Control", weight: 8, required: true, evidenceRequired: false },
    { id: "AQ-003", question: "Describe your incident response process", type: "text", category: "Incident Response", weight: 15, required: true, evidenceRequired: true },
    { id: "AQ-004", question: "Rate your current security posture (1-10)", type: "scale", category: "General", weight: 5, required: false, evidenceRequired: false },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "yes_no": return "bg-blue-100 text-blue-800";
      case "multiple_choice": return "bg-purple-100 text-purple-800";
      case "text": return "bg-green-100 text-green-800";
      case "scale": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessment Questions</h1>
          <p className="text-muted-foreground">Question bank for assessment templates</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Question</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{questions.length}</div><p className="text-xs text-muted-foreground">Total Questions</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{questions.filter(q => q.required).length}</div><p className="text-xs text-muted-foreground">Required</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{questions.filter(q => q.evidenceRequired).length}</div><p className="text-xs text-muted-foreground">Evidence Required</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">4</div><p className="text-xs text-muted-foreground">Categories</p></CardContent></Card>
      </div>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.id}</TableCell>
                <TableCell className="max-w-[250px] truncate"><div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-muted-foreground" />{q.question}</div></TableCell>
                <TableCell><Badge className={getTypeColor(q.type)}>{q.type.replace("_", " ")}</Badge></TableCell>
                <TableCell><Badge variant="outline">{q.category}</Badge></TableCell>
                <TableCell>{q.weight}</TableCell>
                <TableCell>{q.required ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge variant="outline">No</Badge>}</TableCell>
                <TableCell>{q.evidenceRequired ? <Badge className="bg-blue-100 text-blue-800">Yes</Badge> : <Badge variant="outline">No</Badge>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Question</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Question Text</Label><Textarea placeholder="Enter your question..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="yes_no">Yes/No</SelectItem><SelectItem value="multiple_choice">Multiple Choice</SelectItem><SelectItem value="text">Text</SelectItem><SelectItem value="scale">Scale</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Category</Label><Input placeholder="Category" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Weight/Score</Label><Input type="number" defaultValue={10} /></div>
              <div className="flex items-center gap-8 pt-6"><div className="flex items-center gap-2"><Switch id="required" /><Label htmlFor="required">Required</Label></div><div className="flex items-center gap-2"><Switch id="evidence" /><Label htmlFor="evidence">Evidence</Label></div></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentQuestions;
