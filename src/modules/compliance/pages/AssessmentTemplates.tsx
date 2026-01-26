import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Copy, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const AssessmentTemplates = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const templates = [
    { id: "AT-001", name: "GDPR Compliance Assessment", sections: 5, questions: 45, version: "2.1", status: "published", usedCount: 12 },
    { id: "AT-002", name: "ISO 27001 Security Review", sections: 14, questions: 114, version: "1.0", status: "published", usedCount: 8 },
    { id: "AT-003", name: "SOX Control Testing", sections: 4, questions: 32, version: "1.5", status: "draft", usedCount: 0 },
    { id: "AT-004", name: "HIPAA Privacy Assessment", sections: 6, questions: 52, version: "1.2", status: "published", usedCount: 5 },
  ];

  const getStatusColor = (status: string) => status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assessment Templates</h1>
          <p className="text-muted-foreground">Build and manage reusable assessment templates</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Template</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{templates.length}</div><p className="text-xs text-muted-foreground">Total Templates</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{templates.filter(t => t.status === "published").length}</div><p className="text-xs text-muted-foreground">Published</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{templates.reduce((a, t) => a + t.questions, 0)}</div><p className="text-xs text-muted-foreground">Total Questions</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{templates.reduce((a, t) => a + t.usedCount, 0)}</div><p className="text-xs text-muted-foreground">Times Used</p></CardContent></Card>
      </div>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" /><span className="font-medium">{t.name}</span></div></TableCell>
                <TableCell>{t.sections}</TableCell>
                <TableCell>{t.questions}</TableCell>
                <TableCell>v{t.version}</TableCell>
                <TableCell><Badge className={getStatusColor(t.status)}>{t.status}</Badge></TableCell>
                <TableCell>{t.usedCount}x</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>Create Assessment Template</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Template Name</Label><Input placeholder="Enter template name" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the assessment..." /></div>
            <div className="p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">Drag & drop sections and questions here</div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Create Template</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssessmentTemplates;
