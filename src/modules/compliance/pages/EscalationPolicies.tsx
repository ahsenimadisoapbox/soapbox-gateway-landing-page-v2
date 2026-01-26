import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Bell, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const EscalationPolicies = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const policies = [
    { id: "EP-001", name: "High Priority Task Escalation", levels: 3, triggerDays: 7, notifyEmail: true, notifySms: false, status: "active" },
    { id: "EP-002", name: "Critical Obligation Escalation", levels: 4, triggerDays: 3, notifyEmail: true, notifySms: true, status: "active" },
    { id: "EP-003", name: "Overdue Assessment Escalation", levels: 2, triggerDays: 14, notifyEmail: true, notifySms: false, status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Escalation Policies</h1>
          <p className="text-muted-foreground">Configure tenant-specific escalation rules</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Policy</Button>
      </div>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Policy Name</TableHead>
              <TableHead>Levels</TableHead>
              <TableHead>Trigger (Days)</TableHead>
              <TableHead>Notifications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell><Badge variant="outline">{p.levels} levels</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.triggerDays} days</div></TableCell>
                <TableCell><div className="flex gap-1">{p.notifyEmail && <Badge variant="secondary">Email</Badge>}{p.notifySms && <Badge variant="secondary">SMS</Badge>}</div></TableCell>
                <TableCell><Badge className="bg-green-100 text-green-800">{p.status}</Badge></TableCell>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create Escalation Policy</DialogTitle></DialogHeader>
          <Tabs defaultValue="config">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="config">Configuration</TabsTrigger><TabsTrigger value="rules">Rules (JSON)</TabsTrigger></TabsList>
            <TabsContent value="config" className="space-y-4 mt-4">
              <div className="space-y-2"><Label>Policy Name</Label><Input placeholder="Enter policy name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Escalation Levels</Label><Input type="number" defaultValue={3} /></div>
                <div className="space-y-2"><Label>Trigger After (Days)</Label><Input type="number" defaultValue={7} /></div>
              </div>
            </TabsContent>
            <TabsContent value="rules" className="space-y-4 mt-4">
              <Card><CardHeader><CardTitle className="text-sm">JSON Rule Editor</CardTitle></CardHeader><CardContent><Textarea className="font-mono text-sm" rows={10} defaultValue={`{\n  "levels": [\n    { "level": 1, "notifyAfterDays": 3, "recipients": ["manager"] },\n    { "level": 2, "notifyAfterDays": 5, "recipients": ["director"] },\n    { "level": 3, "notifyAfterDays": 7, "recipients": ["vp"] }\n  ]\n}`} /></CardContent></Card>
            </TabsContent>
          </Tabs>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Create Policy</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscalationPolicies;
