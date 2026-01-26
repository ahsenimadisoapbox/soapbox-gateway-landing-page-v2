import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Download, ChevronLeft, ChevronRight } from "lucide-react";
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

type SiteMapping = {
  id: string;
  tenantId: string;
  obligationId: string;
  siteId: string;
  siteName: string;
  siteOfficer: string;
  mappingType: "REQUIRED" | "OPTIONAL" | "EXEMPTION";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  lastVerifiedAt: string;
  lastVerifiedBy: string;
  createdAt: string;
  createdBy: string;
};

const ObligationSiteMapping = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<SiteMapping | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const mappings: SiteMapping[] = [
    { id: "SITE-2024-001", tenantId: "T-001", obligationId: "OBL-2024-001", siteId: "S-001", siteName: "HQ", siteOfficer: "sara@org.com", mappingType: "REQUIRED", status: "ACTIVE", lastVerifiedAt: "2024-11-15", lastVerifiedBy: "admin@org.com", createdAt: "2024-01-01", createdBy: "system" },
    { id: "SITE-2024-002", tenantId: "T-001", obligationId: "OBL-2024-002", siteId: "S-002", siteName: "Plant A", siteOfficer: "khan@org.com", mappingType: "OPTIONAL", status: "INACTIVE", lastVerifiedAt: "2024-10-20", lastVerifiedBy: "admin@org.com", createdAt: "2024-02-15", createdBy: "system" },
    { id: "SITE-2024-003", tenantId: "T-001", obligationId: "OBL-2024-003", siteId: "S-003", siteName: "Warehouse", siteOfficer: "john@org.com", mappingType: "REQUIRED", status: "ACTIVE", lastVerifiedAt: "2024-11-01", lastVerifiedBy: "sara@org.com", createdAt: "2024-03-10", createdBy: "admin" },
    { id: "SITE-2024-004", tenantId: "T-001", obligationId: "OBL-2024-001", siteId: "S-004", siteName: "Office B", siteOfficer: "mike@org.com", mappingType: "EXEMPTION", status: "PENDING", lastVerifiedAt: "", lastVerifiedBy: "", createdAt: "2024-11-20", createdBy: "admin" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "INACTIVE": return "bg-gray-100 text-gray-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "REQUIRED": return "bg-blue-100 text-blue-800";
      case "OPTIONAL": return "bg-purple-100 text-purple-800";
      case "EXEMPTION": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (mapping: SiteMapping) => { setSelectedMapping(mapping); setDialogMode("view"); };
  const handleEdit = (mapping: SiteMapping) => { setSelectedMapping(mapping); setDialogMode("edit"); };
  const handleCreate = () => { setSelectedMapping(null); setDialogMode("create"); };

  const filterGroups = [
    { label: "Status", options: [{ label: "Active", value: "ACTIVE", checked: false }, { label: "Inactive", value: "INACTIVE", checked: false }, { label: "Pending", value: "PENDING", checked: false }] },
    { label: "Type", options: [{ label: "Required", value: "REQUIRED", checked: false }, { label: "Optional", value: "OPTIONAL", checked: false }, { label: "Exemption", value: "EXEMPTION", checked: false }] },
  ];

  const isView = dialogMode === "view";
  const isCreate = dialogMode === "create";
  const dialogTitle = isCreate ? "New Obligation Site Mapping" : isView ? "View Site Mapping" : "Edit Site Mapping";

  const totalPages = Math.ceil(mappings.length / rowsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligation Site Mapping</h1>
          <p className="text-muted-foreground">Map obligations to organizational sites</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export CSV</Button>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />New Mapping</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search mappings..." filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Obligation ID</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Site Officer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell><Checkbox checked={selectedRows.includes(mapping.id)} onCheckedChange={(checked) => setSelectedRows(checked ? [...selectedRows, mapping.id] : selectedRows.filter(id => id !== mapping.id))} /></TableCell>
                <TableCell className="font-medium">{mapping.id}</TableCell>
                <TableCell>{mapping.obligationId}</TableCell>
                <TableCell>{mapping.siteName}</TableCell>
                <TableCell>{mapping.siteOfficer}</TableCell>
                <TableCell><Badge className={getTypeColor(mapping.mappingType)}>{mapping.mappingType}</Badge></TableCell>
                <TableCell><Badge className={getStatusColor(mapping.status)}>{mapping.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(mapping)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(mapping)}><Edit className="w-4 h-4" /></Button>
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
          <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
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
            <DialogDescription>{isCreate ? "Create a new site mapping" : isView ? "View mapping details" : "Update mapping details"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Site Mapping ID</Label><Input defaultValue={selectedMapping?.id || "SITE-2024-XXX"} disabled={!isCreate} /></div>
            <div className="space-y-2"><Label>Tenant</Label><Select defaultValue={selectedMapping?.tenantId || "T-001"} disabled={isView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="T-001">Tenant 1</SelectItem><SelectItem value="T-002">Tenant 2</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Obligation ID</Label><Select defaultValue={selectedMapping?.obligationId} disabled={isView}><SelectTrigger><SelectValue placeholder="Select obligation" /></SelectTrigger><SelectContent><SelectItem value="OBL-2024-001">OBL-2024-001</SelectItem><SelectItem value="OBL-2024-002">OBL-2024-002</SelectItem><SelectItem value="OBL-2024-003">OBL-2024-003</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Site</Label><Select defaultValue={selectedMapping?.siteId} disabled={isView}><SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger><SelectContent><SelectItem value="S-001">HQ</SelectItem><SelectItem value="S-002">Plant A</SelectItem><SelectItem value="S-003">Warehouse</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Site Officer</Label><Input defaultValue={selectedMapping?.siteOfficer} disabled={isView} placeholder="email@org.com" /></div>
            <div className="space-y-2"><Label>Mapping Type</Label><Select defaultValue={selectedMapping?.mappingType} disabled={isView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="REQUIRED">Required</SelectItem><SelectItem value="OPTIONAL">Optional</SelectItem><SelectItem value="EXEMPTION">Exemption</SelectItem></SelectContent></Select></div>
            <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea disabled={isView} placeholder="Mapping description..." rows={3} /></div>
            <div className="space-y-2"><Label>Status</Label><Select defaultValue={selectedMapping?.status || "ACTIVE"} disabled={isView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="INACTIVE">Inactive</SelectItem><SelectItem value="PENDING">Pending</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Last Verified At</Label><Input type="datetime-local" defaultValue={selectedMapping?.lastVerifiedAt} disabled={isView} /></div>
            {!isCreate && <div className="space-y-2"><Label>Created At</Label><Input value={selectedMapping?.createdAt} disabled /></div>}
            {!isCreate && <div className="space-y-2"><Label>Created By</Label><Input value={selectedMapping?.createdBy} disabled /></div>}
          </div>
          <DialogFooter>
            {isView ? <Button onClick={() => setDialogMode(null)}>Close</Button> : (
              <>
                <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-primary hover:bg-primary/90">{isCreate ? "Create" : "Save Changes"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationSiteMapping;
