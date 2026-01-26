import { useState } from "react";
import { Eye, Edit, Trash2, Plus, AlertTriangle, CheckCircle, XCircle, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { FilterSearch } from "../components/FilterSearch";
import { useToast } from "../hooks/use-toast";

type Exception = {
  id: string;
  taskId: string;
  siteId: string;
  siteName: string;
  reason: string;
  justification: string;
  status: "pending" | "approved" | "rejected";
  validFrom: string;
  validTo: string;
  requestedBy: string;
  requestedAt: string;
  decidedBy: string;
  decidedAt: string;
};

const initialExceptions: Exception[] = [
  { id: "EXC-001", taskId: "TSK-002", siteId: "S-001", siteName: "HQ", reason: "Resource constraints", justification: "Team is understaffed due to recent departures. Requesting extension.", status: "approved", validFrom: "2024-12-01", validTo: "2025-01-31", requestedBy: "sarah.johnson@company.com", requestedAt: "2024-11-25", decidedBy: "director@company.com", decidedAt: "2024-11-28" },
  { id: "EXC-002", taskId: "TSK-004", siteId: "S-002", siteName: "Plant A", reason: "System migration in progress", justification: "Critical systems being migrated to new platform. Cannot complete audit during this period.", status: "pending", validFrom: "2024-12-15", validTo: "2025-02-28", requestedBy: "jennifer.walsh@company.com", requestedAt: "2024-12-01", decidedBy: "", decidedAt: "" },
  { id: "EXC-003", taskId: "TSK-001", siteId: "S-001", siteName: "HQ", reason: "Budget reallocation", justification: "Budget has been reallocated to higher priority project.", status: "rejected", validFrom: "2024-11-01", validTo: "2024-12-31", requestedBy: "john.smith@company.com", requestedAt: "2024-10-20", decidedBy: "vp@company.com", decidedAt: "2024-10-25" },
];

const TasksExceptions = () => {
  const { toast } = useToast();
  const [exceptions, setExceptions] = useState<Exception[]>(initialExceptions);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Exception | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Exception | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Form state
  const [formData, setFormData] = useState<Partial<Exception>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const handleView = (item: Exception) => {
    setSelectedItem(item);
    setFormData(item);
    setDialogMode("view");
  };

  const handleEdit = (item: Exception) => {
    setSelectedItem(item);
    setFormData(item);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormData({
      id: `EXC-${String(exceptions.length + 1).padStart(3, "0")}`,
      taskId: "",
      siteId: "",
      siteName: "",
      reason: "",
      justification: "",
      status: "pending",
      validFrom: "",
      validTo: "",
      requestedBy: "current.user@company.com",
      requestedAt: new Date().toISOString().split("T")[0],
      decidedBy: "",
      decidedAt: "",
    });
    setDialogMode("create");
  };

  const handleDelete = (item: Exception) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setExceptions(exceptions.filter(e => e.id !== itemToDelete.id));
      toast({ title: "Exception deleted", description: `${itemToDelete.id} has been removed.` });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = () => {
    if (dialogMode === "create") {
      const newException = { ...formData } as Exception;
      setExceptions([...exceptions, newException]);
      toast({ title: "Exception created", description: `${newException.id} has been created.` });
    } else if (dialogMode === "edit" && selectedItem) {
      setExceptions(exceptions.map(e => e.id === selectedItem.id ? { ...formData } as Exception : e));
      toast({ title: "Exception updated", description: `${selectedItem.id} has been updated.` });
    }
    setDialogMode(null);
  };

  const handleApprove = (item: Exception) => {
    setExceptions(exceptions.map(e => e.id === item.id ? { ...e, status: "approved" as const, decidedBy: "current.user@company.com", decidedAt: new Date().toISOString().split("T")[0] } : e));
    toast({ title: "Exception approved", description: `${item.id} has been approved.` });
  };

  const handleReject = (item: Exception) => {
    setExceptions(exceptions.map(e => e.id === item.id ? { ...e, status: "rejected" as const, decidedBy: "current.user@company.com", decidedAt: new Date().toISOString().split("T")[0] } : e));
    toast({ title: "Exception rejected", description: `${item.id} has been rejected.` });
  };

  const filterGroups = [
    { label: "Status", options: [{ label: "Pending", value: "pending", checked: false }, { label: "Approved", value: "approved", checked: false }, { label: "Rejected", value: "rejected", checked: false }] },
    { label: "Site", options: [{ label: "HQ", value: "S-001", checked: false }, { label: "Plant A", value: "S-002", checked: false }] },
  ];

  const isView = dialogMode === "view";
  const isCreate = dialogMode === "create";
  const dialogTitle = isCreate ? "Request Exception" : isView ? "Exception Details" : "Edit Exception";
  const totalPages = Math.ceil(exceptions.length / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Exceptions</h1>
          <p className="text-muted-foreground">Exception and waiver workflow management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export CSV</Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />Request Exception</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{exceptions.length}</div><p className="text-xs text-muted-foreground">Total Exceptions</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{exceptions.filter(e => e.status === "approved").length}</div><p className="text-xs text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-yellow-600">{exceptions.filter(e => e.status === "pending").length}</div><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{exceptions.filter(e => e.status === "rejected").length}</div><p className="text-xs text-muted-foreground">Rejected</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search exceptions..." filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validity Period</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exceptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell><Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={(checked) => setSelectedRows(checked ? [...selectedRows, item.id] : selectedRows.filter(id => id !== item.id))} /></TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell><Badge variant="outline">{item.taskId}</Badge></TableCell>
                <TableCell>{item.siteName}</TableCell>
                <TableCell className="max-w-[200px] truncate">{item.reason}</TableCell>
                <TableCell><div className="flex items-center gap-2">{getStatusIcon(item.status)}<Badge className={getStatusColor(item.status)}>{item.status}</Badge></div></TableCell>
                <TableCell className="text-sm">{item.validFrom} - {item.validTo}</TableCell>
                <TableCell>{item.requestedBy.split("@")[0]}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    {item.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleApprove(item)} title="Approve"><CheckCircle className="w-4 h-4 text-green-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleReject(item)} title="Reject"><XCircle className="w-4 h-4 text-red-600" /></Button>
                      </>
                    )}
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
          <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm">Page {currentPage} of {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex gap-2 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedRows.length} selected</span>
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Change Status</Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      )}

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{isCreate ? "Submit a new exception request" : isView ? "View exception details" : "Update exception details"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Exception ID</Label>
              <Input value={formData.id || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Task</Label>
              <Select value={formData.taskId || ""} onValueChange={(v) => setFormData({ ...formData, taskId: v })} disabled={isView}>
                <SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TSK-001">TSK-001</SelectItem>
                  <SelectItem value="TSK-002">TSK-002</SelectItem>
                  <SelectItem value="TSK-003">TSK-003</SelectItem>
                  <SelectItem value="TSK-004">TSK-004</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={formData.siteId || ""} onValueChange={(v) => setFormData({ ...formData, siteId: v, siteName: v === "S-001" ? "HQ" : "Plant A" })} disabled={isView}>
                <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="S-001">HQ</SelectItem>
                  <SelectItem value="S-002">Plant A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status || "pending"} onValueChange={(v) => setFormData({ ...formData, status: v as Exception["status"] })} disabled={isView}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Reason</Label>
              <Input value={formData.reason || ""} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} disabled={isView} placeholder="Brief reason for exception" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Justification</Label>
              <Textarea value={formData.justification || ""} onChange={(e) => setFormData({ ...formData, justification: e.target.value })} disabled={isView} placeholder="Detailed justification..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Input type="date" value={formData.validFrom || ""} onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })} disabled={isView} />
            </div>
            <div className="space-y-2">
              <Label>Valid To</Label>
              <Input type="date" value={formData.validTo || ""} onChange={(e) => setFormData({ ...formData, validTo: e.target.value })} disabled={isView} />
            </div>
            <div className="space-y-2">
              <Label>Requested By</Label>
              <Input value={formData.requestedBy || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Requested At</Label>
              <Input value={formData.requestedAt || ""} disabled />
            </div>
            {formData.decidedBy && (
              <>
                <div className="space-y-2">
                  <Label>Decided By</Label>
                  <Input value={formData.decidedBy || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Decided At</Label>
                  <Input value={formData.decidedAt || ""} disabled />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {isView ? (
              <Button onClick={() => setDialogMode(null)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
                <Button onClick={handleSave}>{isCreate ? "Submit Request" : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exception</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {itemToDelete?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TasksExceptions;
