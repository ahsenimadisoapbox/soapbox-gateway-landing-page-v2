import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, PlayCircle, StopCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ActiveJSA {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  site: string;
  startDate: string;
  startTime: string;
  assignedTo: string;
  riskLevel: string;
  status: "In Progress" | "On Hold" | "Active";
}

const ActiveJSAs = () => {
  const [selectedJSA, setSelectedJSA] = useState<ActiveJSA | null>(null);
  const [viewDialog, setViewDialog] = useState(false);

  const mockActiveJSAs: ActiveJSA[] = [
    { id: "1", jsaNumber: "JSA-2025-001", jobTitle: "Electrical Panel Maintenance", site: "Manufacturing Plant A", startDate: "2025-01-17", startTime: "08:00", assignedTo: "John Doe", riskLevel: "High", status: "In Progress" },
    { id: "2", jsaNumber: "JSA-2025-005", jobTitle: "Crane Operations", site: "Warehouse B", startDate: "2025-01-17", startTime: "07:30", assignedTo: "Mike Rodriguez", riskLevel: "High", status: "Active" },
    { id: "3", jsaNumber: "JSA-2025-003", jobTitle: "Hot Work Operations", site: "Plant C", startDate: "2025-01-17", startTime: "09:00", assignedTo: "Sarah Chen", riskLevel: "Critical", status: "On Hold" },
  ];

  const handleView = (jsa: ActiveJSA) => {
    setSelectedJSA(jsa);
    setViewDialog(true);
  };

  const handleStop = (jsa: ActiveJSA) => {
    toast.success(`${jsa.jsaNumber} stopped - Proceeding to closeout`);
  };

  const handleMonitor = (jsa: ActiveJSA) => {
    toast.info(`Opening monitoring view for ${jsa.jsaNumber}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Active JSAs</h1>
        <p className="text-muted-foreground">Currently executing job safety analyses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active JSAs ({mockActiveJSAs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActiveJSAs.map((jsa) => (
                <TableRow key={jsa.id}>
                  <TableCell className="font-medium">{jsa.jsaNumber}</TableCell>
                  <TableCell>{jsa.jobTitle}</TableCell>
                  <TableCell>{jsa.site}</TableCell>
                  <TableCell>{jsa.startDate}</TableCell>
                  <TableCell>{jsa.startTime}</TableCell>
                  <TableCell>{jsa.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={jsa.riskLevel === "Critical" ? "destructive" : "default"}>
                      {jsa.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={jsa.status === "In Progress" ? "default" : jsa.status === "On Hold" ? "secondary" : "outline"}>
                      {jsa.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(jsa)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleMonitor(jsa)}>
                        <PlayCircle className="h-4 w-4 text-status-info" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleStop(jsa)}>
                        <StopCircle className="h-4 w-4 text-status-error" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Active JSA - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <p className="text-sm">{selectedJSA?.jobTitle}</p>
              </div>
              <div>
                <Label>Site</Label>
                <p className="text-sm">{selectedJSA?.site}</p>
              </div>
              <div>
                <Label>Start Date</Label>
                <p className="text-sm">{selectedJSA?.startDate}</p>
              </div>
              <div>
                <Label>Start Time</Label>
                <p className="text-sm">{selectedJSA?.startTime}</p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p className="text-sm">{selectedJSA?.assignedTo}</p>
              </div>
              <div>
                <Label>Risk Level</Label>
                <Badge variant={selectedJSA?.riskLevel === "Critical" ? "destructive" : "default"}>
                  {selectedJSA?.riskLevel}
                </Badge>
              </div>
              <div>
                <Label>Status</Label>
                <Badge>{selectedJSA?.status}</Badge>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setViewDialog(false)}>
                Close
              </Button>
              <Button onClick={() => { setViewDialog(false); handleMonitor(selectedJSA!); }}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Monitor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveJSAs;
