import { useState } from "react";
import { Eye, Edit, Plus, Download, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";

type Closure = {
  id: string;
  siteObligationId: string;
  obligationId: string;
  reviewedBy: string;
  reviewedAt: string;
  reviewComments: string;
  approvedBy: string;
  approvedAt: string;
  approvalComments: string;
  closedBy: string;
  closedAt: string;
  closureReason: string;
  status: "PENDING_REVIEW" | "PENDING_APPROVAL" | "CLOSED" | "REJECTED";
};

const ObligationClosure = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedClosure, setSelectedClosure] = useState<Closure | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const closures: Closure[] = [
    { id: "CLO-0001", siteObligationId: "SOBL-001", obligationId: "OBL-2024-001", reviewedBy: "sara@org.com", reviewedAt: "2025-10-10", reviewComments: "All requirements met", approvedBy: "john@org.com", approvedAt: "2025-10-11", approvalComments: "Approved for closure", closedBy: "admin@org.com", closedAt: "2025-10-12", closureReason: "Annual cycle completed", status: "CLOSED" },
    { id: "CLO-0002", siteObligationId: "SOBL-002", obligationId: "OBL-2024-002", reviewedBy: "mike@org.com", reviewedAt: "2025-10-15", reviewComments: "Pending final documentation", approvedBy: "", approvedAt: "", approvalComments: "", closedBy: "", closedAt: "", closureReason: "", status: "PENDING_APPROVAL" },
    { id: "CLO-0003", siteObligationId: "SOBL-003", obligationId: "OBL-2024-003", reviewedBy: "", reviewedAt: "", reviewComments: "", approvedBy: "", approvedAt: "", approvalComments: "", closedBy: "", closedAt: "", closureReason: "", status: "PENDING_REVIEW" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CLOSED": return "bg-green-100 text-green-800";
      case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800";
      case "PENDING_APPROVAL": return "bg-blue-100 text-blue-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (c: Closure) => { setSelectedClosure(c); setDialogMode("view"); };
  const handleEdit = (c: Closure) => { setSelectedClosure(c); setDialogMode("edit"); };
  const handleCreate = () => { setSelectedClosure(null); setDialogMode("create"); };

  const filterGroups = [
    { label: "Status", options: [{ label: "Closed", value: "CLOSED", checked: false }, { label: "Pending Review", value: "PENDING_REVIEW", checked: false }, { label: "Pending Approval", value: "PENDING_APPROVAL", checked: false }] },
  ];

  const isView = dialogMode === "view";
  const isCreate = dialogMode === "create";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligation Closure</h1>
          <p className="text-muted-foreground">Manage obligation closure workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export CSV</Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Closure</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{closures.length}</div><p className="text-xs text-muted-foreground">Total Closures</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{closures.filter(c => c.status === "CLOSED").length}</div><p className="text-xs text-muted-foreground">Closed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{closures.filter(c => c.status === "PENDING_REVIEW").length}</div><p className="text-xs text-muted-foreground">Pending Review</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{closures.filter(c => c.status === "PENDING_APPROVAL").length}</div><p className="text-xs text-muted-foreground">Pending Approval</p></CardContent></Card>
      </div>

      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search closures..." filterGroups={filterGroups} /></CardContent></Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>Site Obligation ID</TableHead>
              <TableHead>Obligation ID</TableHead>
              <TableHead>Reviewed By</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Closed At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {closures.map((c) => (
              <TableRow key={c.id}>
                <TableCell><Checkbox checked={selectedRows.includes(c.id)} onCheckedChange={(checked) => setSelectedRows(checked ? [...selectedRows, c.id] : selectedRows.filter(id => id !== c.id))} /></TableCell>
                <TableCell className="font-medium">{c.siteObligationId}</TableCell>
                <TableCell>{c.obligationId}</TableCell>
                <TableCell>{c.reviewedBy?.split("@")[0] || "-"}</TableCell>
                <TableCell>{c.approvedBy?.split("@")[0] || "-"}</TableCell>
                <TableCell>{c.closedAt || "-"}</TableCell>
                <TableCell><Badge className={getStatusColor(c.status)}>{c.status.replace(/_/g, " ")}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(c)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Edit className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm">Page {currentPage} of {Math.ceil(closures.length / rowsPerPage)}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreate ? "New Closure" : isView ? "View Closure" : "Edit Closure"}</DialogTitle>
            <DialogDescription>{isCreate ? "Initiate obligation closure" : isView ? "View closure details" : "Update closure"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Site Obligation ID</Label><Select defaultValue={selectedClosure?.siteObligationId} disabled={isView}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="SOBL-001">SOBL-001</SelectItem><SelectItem value="SOBL-002">SOBL-002</SelectItem><SelectItem value="SOBL-003">SOBL-003</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Obligation ID</Label><Input defaultValue={selectedClosure?.obligationId} disabled /></div>
            <div className="col-span-2 border-t pt-4"><h4 className="font-medium text-sm mb-3">Review</h4></div>
            <div className="space-y-2"><Label>Reviewed By</Label><Input defaultValue={selectedClosure?.reviewedBy} disabled={isView} placeholder="reviewer@org.com" /></div>
            <div className="space-y-2"><Label>Reviewed At</Label><Input type="date" defaultValue={selectedClosure?.reviewedAt} disabled={isView} /></div>
            <div className="col-span-2 space-y-2"><Label>Review Comments</Label><Textarea defaultValue={selectedClosure?.reviewComments} disabled={isView} placeholder="Review notes..." rows={2} /></div>
            <div className="col-span-2 border-t pt-4"><h4 className="font-medium text-sm mb-3">Approval</h4></div>
            <div className="space-y-2"><Label>Approved By</Label><Input defaultValue={selectedClosure?.approvedBy} disabled={isView} placeholder="approver@org.com" /></div>
            <div className="space-y-2"><Label>Approved At</Label><Input type="date" defaultValue={selectedClosure?.approvedAt} disabled={isView} /></div>
            <div className="col-span-2 space-y-2"><Label>Approval Comments</Label><Textarea defaultValue={selectedClosure?.approvalComments} disabled={isView} placeholder="Approval notes..." rows={2} /></div>
            <div className="col-span-2 border-t pt-4"><h4 className="font-medium text-sm mb-3">Closure</h4></div>
            <div className="space-y-2"><Label>Closed By</Label><Input defaultValue={selectedClosure?.closedBy} disabled /></div>
            <div className="space-y-2"><Label>Closed At</Label><Input type="date" defaultValue={selectedClosure?.closedAt} disabled /></div>
            <div className="col-span-2 space-y-2"><Label>Closure Reason</Label><Textarea defaultValue={selectedClosure?.closureReason} disabled={isView} placeholder="Reason for closure..." rows={2} /></div>
          </div>
          <DialogFooter>
            {isView ? (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Close</Button>
                {selectedClosure?.status === "PENDING_REVIEW" && <Button className="bg-primary">Approve Review</Button>}
                {selectedClosure?.status === "PENDING_APPROVAL" && (
                  <>
                    <Button variant="outline">Request Changes</Button>
                    <Button className="bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-2" />Approve Closure</Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">{isCreate ? "Initiate Closure" : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationClosure;
