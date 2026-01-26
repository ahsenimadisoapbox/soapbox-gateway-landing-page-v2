import { useState } from "react";
import { Eye, Download, Upload, Trash2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Progress } from "../components/ui/progress";

type ReportVersion = {
  id: string;
  siteObligationId: string;
  templateId: string;
  templateName: string;
  fileName: string;
  fileSize: string;
  versionNo: number;
  uploadedBy: string;
  uploadedAt: string;
};

const ReportVersions = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "upload" | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ReportVersion | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [uploadProgress, setUploadProgress] = useState(0);

  const versions: ReportVersion[] = [
    { id: "RV-0001", siteObligationId: "SOBL-001", templateId: "RPT-0001", templateName: "Monthly Status", fileName: "closure_report_oct2025.pdf", fileSize: "2.4 MB", versionNo: 1, uploadedBy: "sara@org.com", uploadedAt: "2025-10-15" },
    { id: "RV-0002", siteObligationId: "SOBL-001", templateId: "RPT-0001", templateName: "Monthly Status", fileName: "closure_report_nov2025.pdf", fileSize: "2.8 MB", versionNo: 2, uploadedBy: "sara@org.com", uploadedAt: "2025-11-15" },
    { id: "RV-0003", siteObligationId: "SOBL-002", templateId: "RPT-0002", templateName: "Quarterly Summary", fileName: "q3_compliance_report.pdf", fileSize: "5.1 MB", versionNo: 1, uploadedBy: "mike@org.com", uploadedAt: "2025-10-01" },
    { id: "RV-0004", siteObligationId: "SOBL-003", templateId: "RPT-0003", templateName: "Annual Audit", fileName: "annual_audit_2024.pdf", fileSize: "12.3 MB", versionNo: 3, uploadedBy: "audit@org.com", uploadedAt: "2025-01-15" },
  ];

  const handleView = (v: ReportVersion) => { setSelectedVersion(v); setDialogMode("view"); };
  const handleUpload = () => { setSelectedVersion(null); setDialogMode("upload"); setUploadProgress(0); };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 10;
      });
    }, 200);
  };

  const filterGroups = [
    { label: "Template", options: [{ label: "Monthly Status", value: "RPT-0001", checked: false }, { label: "Quarterly Summary", value: "RPT-0002", checked: false }, { label: "Annual Audit", value: "RPT-0003", checked: false }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Report Versions</h1>
          <p className="text-muted-foreground">Manage report file versions</p>
        </div>
        <Button onClick={handleUpload} className="bg-primary hover:bg-primary/90"><Upload className="w-4 h-4 mr-2" />Upload Report</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{versions.length}</div><p className="text-xs text-muted-foreground">Total Versions</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">3</div><p className="text-xs text-muted-foreground">Templates Used</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">22.6 MB</div><p className="text-xs text-muted-foreground">Total Size</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">3</div><p className="text-xs text-muted-foreground">Sites</p></CardContent></Card>
      </div>

      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search versions..." filterGroups={filterGroups} /></CardContent></Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead>Version ID</TableHead>
              <TableHead>Site Obligation</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((v) => (
              <TableRow key={v.id}>
                <TableCell><Checkbox checked={selectedRows.includes(v.id)} onCheckedChange={(c) => setSelectedRows(c ? [...selectedRows, v.id] : selectedRows.filter(id => id !== v.id))} /></TableCell>
                <TableCell className="font-medium">{v.id}</TableCell>
                <TableCell>{v.siteObligationId}</TableCell>
                <TableCell>{v.templateName}</TableCell>
                <TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-red-500" />{v.fileName}</div></TableCell>
                <TableCell>{v.fileSize}</TableCell>
                <TableCell><Badge variant="outline">v{v.versionNo}</Badge></TableCell>
                <TableCell>{v.uploadedBy.split("@")[0]}</TableCell>
                <TableCell>{v.uploadedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(v)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
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
          <span className="text-sm">Page {currentPage} of {Math.ceil(versions.length / rowsPerPage)}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Dialog open={dialogMode === "view"} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Version Details</DialogTitle>
            <DialogDescription>View file information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><p className="text-sm text-muted-foreground">Version ID</p><p className="font-medium">{selectedVersion?.id}</p></div>
            <div><p className="text-sm text-muted-foreground">Version</p><Badge variant="outline">v{selectedVersion?.versionNo}</Badge></div>
            <div><p className="text-sm text-muted-foreground">Site Obligation</p><p className="font-medium">{selectedVersion?.siteObligationId}</p></div>
            <div><p className="text-sm text-muted-foreground">Template</p><p className="font-medium">{selectedVersion?.templateName}</p></div>
            <div className="col-span-2"><p className="text-sm text-muted-foreground">File Name</p><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-red-500" /><p className="font-medium">{selectedVersion?.fileName}</p></div></div>
            <div><p className="text-sm text-muted-foreground">File Size</p><p className="font-medium">{selectedVersion?.fileSize}</p></div>
            <div><p className="text-sm text-muted-foreground">Uploaded At</p><p className="font-medium">{selectedVersion?.uploadedAt}</p></div>
            <div className="col-span-2"><p className="text-sm text-muted-foreground">Uploaded By</p><p className="font-medium">{selectedVersion?.uploadedBy}</p></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>Close</Button>
            <Button variant="outline"><Download className="w-4 h-4 mr-2" />Download</Button>
            <Button variant="outline">Promote Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode === "upload"} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Report</DialogTitle>
            <DialogDescription>Upload a new report version</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Site Obligation</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="SOBL-001">SOBL-001</SelectItem><SelectItem value="SOBL-002">SOBL-002</SelectItem><SelectItem value="SOBL-003">SOBL-003</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Template</Label><Select><SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger><SelectContent><SelectItem value="RPT-0001">Monthly Status</SelectItem><SelectItem value="RPT-0002">Quarterly Summary</SelectItem><SelectItem value="RPT-0003">Annual Audit</SelectItem></SelectContent></Select></div>
            <div className="space-y-2">
              <Label>File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to browse</p>
                <Input type="file" className="hidden" id="file-upload" />
                <Button variant="outline" onClick={simulateUpload}>Select File</Button>
              </div>
              {uploadProgress > 0 && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button disabled={uploadProgress > 0 && uploadProgress < 100}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportVersions;
