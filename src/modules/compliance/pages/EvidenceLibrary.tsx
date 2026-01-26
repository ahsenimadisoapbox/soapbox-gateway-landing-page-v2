import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Upload, FileText, Image, File, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../hooks/use-toast";

type Evidence = {
  id: string;
  name: string;
  description: string;
  type: "pdf" | "doc" | "image" | "other";
  size: string;
  linkedTo: string;
  linkedType: "task" | "obligation" | "assessment";
  version: string;
  uploadedBy: string;
  uploadedAt: string;
};

const initialEvidence: Evidence[] = [
  { id: "EV-001", name: "GDPR Training Completion.pdf", description: "Annual GDPR training completion certificates", type: "pdf", size: "2.4 MB", linkedTo: "TSK-001", linkedType: "task", version: "1.2", uploadedBy: "john.smith@company.com", uploadedAt: "2024-11-15" },
  { id: "EV-002", name: "Security Audit Report.docx", description: "Q3 2024 security audit findings", type: "doc", size: "1.8 MB", linkedTo: "OBL-002", linkedType: "obligation", version: "1.0", uploadedBy: "sarah.johnson@company.com", uploadedAt: "2024-11-10" },
  { id: "EV-003", name: "Data Flow Diagram.png", description: "System data flow architecture", type: "image", size: "540 KB", linkedTo: "TSK-003", linkedType: "task", version: "2.1", uploadedBy: "mike.rodriguez@company.com", uploadedAt: "2024-11-20" },
  { id: "EV-004", name: "Risk Assessment Matrix.xlsx", description: "Annual risk assessment documentation", type: "other", size: "156 KB", linkedTo: "ASR-001", linkedType: "assessment", version: "1.0", uploadedBy: "jennifer.walsh@company.com", uploadedAt: "2024-11-25" },
];

const EvidenceLibrary = () => {
  const { toast } = useToast();
  const [evidence, setEvidence] = useState<Evidence[]>(initialEvidence);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Evidence | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Evidence | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [formData, setFormData] = useState<Partial<Evidence>>({});

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-4 h-4 text-red-500" />;
      case "image": return <Image className="w-4 h-4 text-blue-500" />;
      case "doc": return <FileText className="w-4 h-4 text-blue-600" />;
      default: return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleView = (item: Evidence) => {
    setSelectedItem(item);
    setFormData(item);
    setDialogMode("view");
  };

  const handleEdit = (item: Evidence) => {
    setSelectedItem(item);
    setFormData(item);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormData({
      id: `EV-${String(evidence.length + 1).padStart(3, "0")}`,
      name: "",
      description: "",
      type: "pdf",
      size: "0 KB",
      linkedTo: "",
      linkedType: "task",
      version: "1.0",
      uploadedBy: "current.user@company.com",
      uploadedAt: new Date().toISOString().split("T")[0],
    });
    setDialogMode("create");
  };

  const handleDelete = (item: Evidence) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setEvidence(evidence.filter(e => e.id !== itemToDelete.id));
      toast({ title: "Evidence deleted", description: `${itemToDelete.name} has been removed.` });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSave = () => {
    if (dialogMode === "create") {
      const newEvidence = { ...formData } as Evidence;
      setEvidence([...evidence, newEvidence]);
      toast({ title: "Evidence uploaded", description: `${newEvidence.name} has been added.` });
    } else if (dialogMode === "edit" && selectedItem) {
      setEvidence(evidence.map(e => e.id === selectedItem.id ? { ...formData } as Evidence : e));
      toast({ title: "Evidence updated", description: `${selectedItem.name} has been updated.` });
    }
    setDialogMode(null);
  };

  const filterGroups = [
    { label: "Type", options: [{ label: "PDF", value: "pdf", checked: false }, { label: "Document", value: "doc", checked: false }, { label: "Image", value: "image", checked: false }, { label: "Other", value: "other", checked: false }] },
    { label: "Linked Type", options: [{ label: "Task", value: "task", checked: false }, { label: "Obligation", value: "obligation", checked: false }, { label: "Assessment", value: "assessment", checked: false }] },
  ];

  const isView = dialogMode === "view";
  const isCreate = dialogMode === "create";
  const dialogTitle = isCreate ? "Upload Evidence" : isView ? "Evidence Details" : "Edit Evidence";
  const totalPages = Math.ceil(evidence.length / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Evidence Library</h1>
          <p className="text-muted-foreground">Central evidence store with versioning</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export CSV</Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90"><Upload className="w-4 h-4 mr-2" />Upload Evidence</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{evidence.length}</div><p className="text-xs text-muted-foreground">Total Files</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{evidence.filter(e => e.linkedType === "task").length}</div><p className="text-xs text-muted-foreground">Linked Tasks</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{evidence.filter(e => e.linkedType === "obligation").length}</div><p className="text-xs text-muted-foreground">Linked Obligations</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">4.9 MB</div><p className="text-xs text-muted-foreground">Total Size</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search evidence..." filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>File</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evidence.map((item) => (
              <TableRow key={item.id}>
                <TableCell><Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={(checked) => setSelectedRows(checked ? [...selectedRows, item.id] : selectedRows.filter(id => id !== item.id))} /></TableCell>
                <TableCell><div className="flex items-center gap-2">{getTypeIcon(item.type)}<span className="font-medium">{item.name}</span></div></TableCell>
                <TableCell><Badge variant="outline">{item.linkedTo}</Badge></TableCell>
                <TableCell>v{item.version}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell>{item.uploadedBy.split("@")[0]}</TableCell>
                <TableCell>{item.uploadedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    <Button variant="ghost" size="icon" title="Download"><Download className="w-4 h-4" /></Button>
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
          <Button variant="outline" size="sm">Download</Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      )}

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{isCreate ? "Upload new evidence file" : isView ? "View evidence details" : "Update evidence details"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isCreate && (
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag & drop files or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, XLSX, JPG, PNG</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Evidence ID</Label>
                <Input value={formData.id || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>File Name</Label>
                <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isView} placeholder="filename.pdf" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type || "pdf"} onValueChange={(v) => setFormData({ ...formData, type: v as Evidence["type"] })} disabled={isView}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input value={formData.version || ""} onChange={(e) => setFormData({ ...formData, version: e.target.value })} disabled={isView} />
              </div>
              <div className="space-y-2">
                <Label>Link Type</Label>
                <Select value={formData.linkedType || "task"} onValueChange={(v) => setFormData({ ...formData, linkedType: v as Evidence["linkedType"] })} disabled={isView}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="obligation">Obligation</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Link To</Label>
                <Input value={formData.linkedTo || ""} onChange={(e) => setFormData({ ...formData, linkedTo: e.target.value })} disabled={isView} placeholder="TSK-001, OBL-001, etc." />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isView} placeholder="Add description..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Uploaded By</Label>
                <Input value={formData.uploadedBy || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Upload Date</Label>
                <Input value={formData.uploadedAt || ""} disabled />
              </div>
            </div>
          </div>
          <DialogFooter>
            {isView ? (
              <>
                <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Download</Button>
                <Button onClick={() => setDialogMode(null)}>Close</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
                <Button onClick={handleSave}>{isCreate ? "Upload" : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
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

export default EvidenceLibrary;
