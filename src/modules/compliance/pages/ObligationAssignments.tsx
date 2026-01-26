import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const ObligationAssignments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const assignments = [
    { id: "OA-001", obligationId: "OBL-001", userId: "sarah.johnson@company.com", role: "owner", effectiveFrom: "2024-01-01", effectiveTo: "", status: "active" },
    { id: "OA-002", obligationId: "OBL-001", userId: "mike.rodriguez@company.com", role: "reviewer", effectiveFrom: "2024-01-01", effectiveTo: "", status: "active" },
    { id: "OA-003", obligationId: "OBL-002", userId: "jennifer.walsh@company.com", role: "owner", effectiveFrom: "2024-02-01", effectiveTo: "", status: "active" },
    { id: "OA-004", obligationId: "OBL-003", userId: "david.kim@company.com", role: "auditor", effectiveFrom: "2024-03-01", effectiveTo: "", status: "active" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-blue-100 text-blue-800";
      case "reviewer": return "bg-purple-100 text-purple-800";
      case "auditor": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [{ label: "Role", options: [{ label: "Owner", value: "owner", checked: false }, { label: "Reviewer", value: "reviewer", checked: false }, { label: "Auditor", value: "auditor", checked: false }] }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligation Assignments</h1>
          <p className="text-muted-foreground">Assign obligations to users with roles</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Assignment</Button>
      </div>
      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search assignments..." filterGroups={filterGroups} /></CardContent></Card>
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Obligation</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell><Badge variant="outline">{a.obligationId}</Badge></TableCell>
                <TableCell>{a.userId.split("@")[0]}</TableCell>
                <TableCell><Badge className={getRoleColor(a.role)}>{a.role}</Badge></TableCell>
                <TableCell>{a.effectiveFrom}</TableCell>
                <TableCell><Badge variant="secondary" className="bg-green-100 text-green-800">{a.status}</Badge></TableCell>
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
          <DialogHeader><DialogTitle>New Assignment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Obligation</Label><Select><SelectTrigger><SelectValue placeholder="Select obligation" /></SelectTrigger><SelectContent><SelectItem value="OBL-001">OBL-001 - GDPR DPIA</SelectItem><SelectItem value="OBL-002">OBL-002 - ISO Review</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>User</Label><Input placeholder="user@company.com" /></div>
            <div className="space-y-2"><Label>Role</Label><Select><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent><SelectItem value="owner">Owner</SelectItem><SelectItem value="reviewer">Reviewer</SelectItem><SelectItem value="auditor">Auditor</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Effective From</Label><Input type="date" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button>Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationAssignments;
