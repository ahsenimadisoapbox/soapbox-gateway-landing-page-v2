import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Search, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

interface AuditEntry {
  id: string;
  timestamp: string;
  jsaNumber: string;
  action: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
}

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [viewDialog, setViewDialog] = useState(false);

  const mockAuditLog: AuditEntry[] = [
    { id: "1", timestamp: "2025-01-17 10:23:45", jsaNumber: "JSA-2025-001", action: "Approved", user: "Sarah Chen (EHS Manager)", field: "Status", oldValue: "L2 Review", newValue: "Active", ipAddress: "192.168.1.45" },
    { id: "2", timestamp: "2025-01-17 09:15:22", jsaNumber: "JSA-2025-001", action: "Approved", user: "Mike Rodriguez (Supervisor)", field: "Status", oldValue: "L1 Review", newValue: "L2 Review", ipAddress: "192.168.1.32" },
    { id: "3", timestamp: "2025-01-17 08:05:10", jsaNumber: "JSA-2025-001", action: "Submitted", user: "John Doe (Worker)", field: "Status", oldValue: "Draft", newValue: "L1 Review", ipAddress: "192.168.1.21" },
    { id: "4", timestamp: "2025-01-16 16:42:33", jsaNumber: "JSA-2025-001", action: "Modified", user: "John Doe (Worker)", field: "Control Measures", oldValue: "2 controls", newValue: "3 controls", ipAddress: "192.168.1.21" },
    { id: "5", timestamp: "2025-01-16 14:18:56", jsaNumber: "JSA-2025-001", action: "Modified", user: "John Doe (Worker)", field: "Hazards", oldValue: "1 hazard", newValue: "2 hazards", ipAddress: "192.168.1.21" },
    { id: "6", timestamp: "2025-01-16 11:30:12", jsaNumber: "JSA-2025-001", action: "Created", user: "John Doe (Worker)", field: "Status", oldValue: "", newValue: "Draft", ipAddress: "192.168.1.21" },
  ];

  const filteredLog = mockAuditLog.filter((entry) =>
    entry.jsaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    const colors: { [key: string]: "default" | "destructive" | "secondary" | "outline" } = {
      Created: "default",
      Modified: "secondary",
      Submitted: "default",
      Approved: "default",
      Rejected: "destructive",
      Deleted: "destructive",
    };
    return colors[action] || "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground">Complete audit trail of all JSA activities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audit Entries ({filteredLog.length})</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audit log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>JSA Number</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Old Value</TableHead>
                <TableHead>New Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                  <TableCell className="font-medium">{entry.jsaNumber}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadge(entry.action)}>
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.field}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.oldValue || "—"}</TableCell>
                  <TableCell className="font-medium">{entry.newValue}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedEntry(entry); setViewDialog(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Entry Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Timestamp</Label>
                <p className="text-sm font-mono">{selectedEntry?.timestamp}</p>
              </div>
              <div>
                <Label>JSA Number</Label>
                <p className="text-sm">{selectedEntry?.jsaNumber}</p>
              </div>
              <div>
                <Label>Action</Label>
                <Badge variant={selectedEntry ? getActionBadge(selectedEntry.action) : "outline"}>
                  {selectedEntry?.action}
                </Badge>
              </div>
              <div>
                <Label>User</Label>
                <p className="text-sm">{selectedEntry?.user}</p>
              </div>
              <div>
                <Label>Field Changed</Label>
                <p className="text-sm">{selectedEntry?.field}</p>
              </div>
              <div>
                <Label>IP Address</Label>
                <p className="text-sm font-mono">{selectedEntry?.ipAddress}</p>
              </div>
              <div>
                <Label>Old Value</Label>
                <p className="text-sm text-muted-foreground">{selectedEntry?.oldValue || "—"}</p>
              </div>
              <div>
                <Label>New Value</Label>
                <p className="text-sm font-medium">{selectedEntry?.newValue}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLog;
