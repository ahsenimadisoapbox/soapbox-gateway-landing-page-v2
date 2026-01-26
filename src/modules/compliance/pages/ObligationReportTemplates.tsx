import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Switch } from "../components/ui/switch";
import { Checkbox } from "../components/ui/checkbox";

type ReportTemplate = {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const ObligationReportTemplates = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const templates: ReportTemplate[] = [
    { id: "RPT-0001", tenantId: "T-001", name: "Monthly Obligation Status", description: "Monthly overview of all obligation statuses", category: "Operations", isActive: true, createdBy: "admin@org.com", createdAt: "2024-01-15", updatedAt: "2024-09-01" },
    { id: "RPT-0002", tenantId: "T-001", name: "Quarterly Compliance Summary", description: "Quarterly compliance metrics and KPIs", category: "Compliance", isActive: true, createdBy: "admin@org.com", createdAt: "2024-02-01", updatedAt: "2024-10-15" },
    { id: "RPT-0003", tenantId: "T-001", name: "Annual Audit Report", description: "Annual audit findings and recommendations", category: "Audit", isActive: true, createdBy: "audit@org.com", createdAt: "2024-03-01", updatedAt: "2024-11-01" },
    { id: "RPT-0004", tenantId: "T-001", name: "Risk Assessment Summary", description: "Summary of risk assessments by site", category: "Risk", isActive: false, createdBy: "risk@org.com", createdAt: "2024-04-01", updatedAt: "2024-08-15" },
  ];

  const handleView = (t: ReportTemplate) => { setSelectedTemplate(t); setDialogMode("view"); };
  const handleEdit = (t: ReportTemplate) => { setSelectedTemplate(t); setDialogMode("edit"); };
  const handleCreate = () => { setSelectedTemplate(null); setDialogMode("create"); };

  const filterGroups = [
    { label: "Category", options: [{ label: "Operations", value: "Operations", checked: false }, { label: "Compliance", value: "Compliance", checked: false }, { label: "Audit", value: "Audit", checked: false }, { label: "Risk", value: "Risk", checked: false }] },
    { label: "Status", options: [{ label: "Active", value: "true", checked: false }, { label: "Inactive", value: "false", checked: false }] },
  ];

  const isView = dialogMode === "view";
  const isCreate = dialogMode === "create";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligation Report Templates</h1>
          <p className="text-muted-foreground">Manage report templates for obligations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export CSV</Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Report Template</Button>
        </div>
      </div>

      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search templates..." filterGroups={filterGroups} /></CardContent></Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Template Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell><Checkbox checked={selectedRows.includes(t.id)} onCheckedChange={(c) => setSelectedRows(c ? [...selectedRows, t.id] : selectedRows.filter(id => id !== t.id))} /></TableCell>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground" />{t.name}</div></TableCell>
                <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                <TableCell>{t.isActive ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge variant="outline">No</Badge>}</TableCell>
                <TableCell>{t.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(t)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
          <span className="text-sm">Page {currentPage} of {Math.ceil(templates.length / rowsPerPage)}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isCreate ? "New Report Template" : isView ? "View Report Template" : "Edit Report Template"}</DialogTitle>
            <DialogDescription>{isCreate ? "Create a new report template" : isView ? "View template details" : "Update template"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Template ID</Label><Input defaultValue={selectedTemplate?.id || "RPT-XXXX"} disabled={!isCreate} /></div>
            <div className="space-y-2"><Label>Tenant</Label><Select defaultValue={selectedTemplate?.tenantId || "T-001"} disabled={isView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="T-001">Tenant 1</SelectItem><SelectItem value="T-002">Tenant 2</SelectItem></SelectContent></Select></div>
            <div className="col-span-2 space-y-2"><Label>Template Name</Label><Input defaultValue={selectedTemplate?.name} disabled={isView} placeholder="Report name" /></div>
            <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea defaultValue={selectedTemplate?.description} disabled={isView} placeholder="Report description..." rows={2} /></div>
            <div className="space-y-2"><Label>Category</Label><Select defaultValue={selectedTemplate?.category} disabled={isView}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="Operations">Operations</SelectItem><SelectItem value="Compliance">Compliance</SelectItem><SelectItem value="Audit">Audit</SelectItem><SelectItem value="Risk">Risk</SelectItem></SelectContent></Select></div>
            <div className="flex items-center gap-2 pt-6"><Switch defaultChecked={selectedTemplate?.isActive !== false} disabled={isView} /><Label>Active</Label></div>
            <div className="col-span-2 space-y-2"><Label>Schema (JSON)</Label><Textarea className="font-mono text-sm" disabled={isView} placeholder='{"columns": [], "filters": []}' rows={4} /></div>
            <div className="col-span-2 space-y-2"><Label>Definition (JSON)</Label><Textarea className="font-mono text-sm" disabled={isView} placeholder='{"query": "", "formatting": {}}' rows={4} /></div>
          </div>
          <DialogFooter>
            {isView ? (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Close</Button>
                <Button variant="outline">Preview Report</Button>
                <Button variant="outline">Export Sample</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">{isCreate ? "Create" : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationReportTemplates;
