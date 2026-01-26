import { useState } from "react";
import { Eye, Download, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";

type AuditLog = {
  id: string;
  tenantId: string;
  siteId: string;
  performedBy: string;
  performedAt: string;
  action: string;
  tableName: string;
  recordId: string;
  oldValue: string;
  newValue: string;
  status: "SUCCESS" | "FAILED";
  ipAddress: string;
  browser: string;
};

const AuditLogs = () => {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const logs: AuditLog[] = [
    { id: "L-0001", tenantId: "T-001", siteId: "S-001", performedBy: "sara@org.com", performedAt: "2025-10-10 09:10:23", action: "CREATE_OBLIGATION", tableName: "OBLIGATIONS", recordId: "OBL-2024-005", oldValue: "", newValue: '{"title": "New GDPR Assessment", "status": "PENDING"}', status: "SUCCESS", ipAddress: "192.168.1.100", browser: "Chrome 118" },
    { id: "L-0002", tenantId: "T-001", siteId: "S-001", performedBy: "mike@org.com", performedAt: "2025-10-10 10:25:45", action: "UPDATE_TASK", tableName: "TASKS", recordId: "TASK-100", oldValue: '{"status": "PENDING"}', newValue: '{"status": "IN_PROGRESS"}', status: "SUCCESS", ipAddress: "192.168.1.105", browser: "Firefox 119" },
    { id: "L-0003", tenantId: "T-001", siteId: "S-002", performedBy: "jennifer@org.com", performedAt: "2025-10-10 11:30:00", action: "DELETE_EVIDENCE", tableName: "EVIDENCE", recordId: "EV-003", oldValue: '{"fileName": "old_policy.pdf"}', newValue: "", status: "SUCCESS", ipAddress: "192.168.1.110", browser: "Safari 17" },
    { id: "L-0004", tenantId: "T-001", siteId: "S-001", performedBy: "admin@org.com", performedAt: "2025-10-10 14:15:30", action: "UPDATE_USER", tableName: "USERS", recordId: "USR-010", oldValue: '{"role": "viewer"}', newValue: '{"role": "admin"}', status: "FAILED", ipAddress: "192.168.1.1", browser: "Chrome 118" },
    { id: "L-0005", tenantId: "T-001", siteId: "S-003", performedBy: "david@org.com", performedAt: "2025-10-10 16:45:12", action: "CREATE_ASSESSMENT", tableName: "ASSESSMENTS", recordId: "RUN-2025-005", oldValue: "", newValue: '{"template": "OSHA_SAFETY", "site": "Warehouse"}', status: "SUCCESS", ipAddress: "192.168.1.120", browser: "Edge 118" },
  ];

  const getStatusColor = (status: string) => status === "SUCCESS" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  const getActionColor = (action: string) => {
    if (action.startsWith("CREATE")) return "bg-green-100 text-green-800";
    if (action.startsWith("UPDATE")) return "bg-blue-100 text-blue-800";
    if (action.startsWith("DELETE")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const toggleRow = (id: string) => setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  const handleView = (log: AuditLog) => { setSelectedLog(log); setDialogOpen(true); };

  const filterGroups = [
    { label: "Action", options: [{ label: "Create", value: "CREATE", checked: false }, { label: "Update", value: "UPDATE", checked: false }, { label: "Delete", value: "DELETE", checked: false }] },
    { label: "Status", options: [{ label: "Success", value: "SUCCESS", checked: false }, { label: "Failed", value: "FAILED", checked: false }] },
    { label: "Table", options: [{ label: "Obligations", value: "OBLIGATIONS", checked: false }, { label: "Tasks", value: "TASKS", checked: false }, { label: "Evidence", value: "EVIDENCE", checked: false }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">System activity and change history</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Export Logs</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{logs.length}</div><p className="text-xs text-muted-foreground">Total Logs</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{logs.filter(l => l.status === "SUCCESS").length}</div><p className="text-xs text-muted-foreground">Successful</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{logs.filter(l => l.status === "FAILED").length}</div><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(logs.map(l => l.performedBy)).size}</div><p className="text-xs text-muted-foreground">Unique Users</p></CardContent></Card>
      </div>

      <Card><CardContent className="pt-6"><FilterSearch searchPlaceholder="Search logs..." filterGroups={filterGroups} /></CardContent></Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Log ID</TableHead>
              <TableHead>Performed By</TableHead>
              <TableHead>Performed At</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <Collapsible key={log.id} open={expandedRows.includes(log.id)} onOpenChange={() => toggleRow(log.id)} asChild>
                <>
                  <TableRow>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {expandedRows.includes(log.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.performedBy.split("@")[0]}</TableCell>
                    <TableCell className="text-sm">{log.performedAt}</TableCell>
                    <TableCell><Badge className={getActionColor(log.action)}>{log.action}</Badge></TableCell>
                    <TableCell>{log.tableName}</TableCell>
                    <TableCell>{log.recordId}</TableCell>
                    <TableCell><Badge className={getStatusColor(log.status)}>{log.status}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleView(log)}><Eye className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={9} className="p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-1">Old Value</p>
                            <pre className="bg-background p-2 rounded text-xs overflow-auto max-h-32">{log.oldValue || "(empty)"}</pre>
                          </div>
                          <div>
                            <p className="font-medium mb-1">New Value</p>
                            <pre className="bg-background p-2 rounded text-xs overflow-auto max-h-32">{log.newValue || "(empty)"}</pre>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
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
          <span className="text-sm">Page {currentPage} of {Math.ceil(logs.length / rowsPerPage)}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Full log information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><p className="text-sm text-muted-foreground">Log ID</p><p className="font-medium">{selectedLog?.id}</p></div>
            <div><p className="text-sm text-muted-foreground">Status</p><Badge className={getStatusColor(selectedLog?.status || "")}>{selectedLog?.status}</Badge></div>
            <div><p className="text-sm text-muted-foreground">Performed By</p><p className="font-medium">{selectedLog?.performedBy}</p></div>
            <div><p className="text-sm text-muted-foreground">Performed At</p><p className="font-medium">{selectedLog?.performedAt}</p></div>
            <div><p className="text-sm text-muted-foreground">Action</p><Badge className={getActionColor(selectedLog?.action || "")}>{selectedLog?.action}</Badge></div>
            <div><p className="text-sm text-muted-foreground">Table</p><p className="font-medium">{selectedLog?.tableName}</p></div>
            <div><p className="text-sm text-muted-foreground">Record ID</p><p className="font-medium">{selectedLog?.recordId}</p></div>
            <div><p className="text-sm text-muted-foreground">Site</p><p className="font-medium">{selectedLog?.siteId}</p></div>
            <div><p className="text-sm text-muted-foreground">IP Address</p><p className="font-medium">{selectedLog?.ipAddress}</p></div>
            <div><p className="text-sm text-muted-foreground">Browser</p><p className="font-medium">{selectedLog?.browser}</p></div>
            <div className="col-span-2"><p className="text-sm text-muted-foreground">Old Value</p><pre className="bg-muted p-2 rounded text-xs mt-1 overflow-auto max-h-32">{selectedLog?.oldValue || "(empty)"}</pre></div>
            <div className="col-span-2"><p className="text-sm text-muted-foreground">New Value</p><pre className="bg-muted p-2 rounded text-xs mt-1 overflow-auto max-h-32">{selectedLog?.newValue || "(empty)"}</pre></div>
          </div>
          <DialogFooter><Button onClick={() => setDialogOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;
