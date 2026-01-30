import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Eye, Download, Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

interface ArchivedJSA {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  site: string;
  completionDate: string;
  riskLevel: string;
  owner: string;
  status: string;
}

const Archive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJSA, setSelectedJSA] = useState<ArchivedJSA | null>(null);
  const [viewDialog, setViewDialog] = useState(false);

  const mockArchive: ArchivedJSA[] = [
    { id: "1", jsaNumber: "JSA-2024-256", jobTitle: "Electrical Panel Maintenance", site: "Plant A", completionDate: "2024-12-20", riskLevel: "High", owner: "John Doe", status: "Completed" },
    { id: "2", jsaNumber: "JSA-2024-255", jobTitle: "Confined Space Entry", site: "Warehouse B", completionDate: "2024-12-18", riskLevel: "Critical", owner: "Sarah Chen", status: "Completed" },
    { id: "3", jsaNumber: "JSA-2024-254", jobTitle: "Hot Work Operations", site: "Plant C", completionDate: "2024-12-15", riskLevel: "High", owner: "Mike Rodriguez", status: "Completed" },
    { id: "4", jsaNumber: "JSA-2024-253", jobTitle: "Working at Height", site: "Plant A", completionDate: "2024-12-10", riskLevel: "High", owner: "Jennifer Walsh", status: "Completed" },
  ];

  const filteredArchive = mockArchive.filter((jsa) =>
    jsa.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jsa.jsaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jsa.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (jsa: ArchivedJSA) => {
    setSelectedJSA(jsa);
    setViewDialog(true);
  };

  const handleDownload = (jsa: ArchivedJSA) => {
    toast.success(`Downloading ${jsa.jsaNumber}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">JSA Archive</h1>
        <p className="text-muted-foreground">Completed and archived job safety analyses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Archived JSAs ({filteredArchive.length})</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search archive..."
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
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArchive.map((jsa) => (
                <TableRow key={jsa.id}>
                  <TableCell className="font-medium">{jsa.jsaNumber}</TableCell>
                  <TableCell>{jsa.jobTitle}</TableCell>
                  <TableCell>{jsa.site}</TableCell>
                  <TableCell>{jsa.completionDate}</TableCell>
                  <TableCell>
                    <Badge variant={jsa.riskLevel === "Critical" ? "destructive" : "default"}>
                      {jsa.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{jsa.owner}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{jsa.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(jsa)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(jsa)}>
                        <Download className="h-4 w-4" />
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
            <DialogTitle>Archived JSA - {selectedJSA?.jsaNumber}</DialogTitle>
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
                <Label>Completion Date</Label>
                <p className="text-sm">{selectedJSA?.completionDate}</p>
              </div>
              <div>
                <Label>Risk Level</Label>
                <Badge variant={selectedJSA?.riskLevel === "Critical" ? "destructive" : "default"}>
                  {selectedJSA?.riskLevel}
                </Badge>
              </div>
              <div>
                <Label>Owner</Label>
                <p className="text-sm">{selectedJSA?.owner}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant="secondary">{selectedJSA?.status}</Badge>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                This JSA has been completed and archived. All associated documents and records are preserved for regulatory compliance.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setViewDialog(false)}>
                Close
              </Button>
              <Button onClick={() => { setViewDialog(false); handleDownload(selectedJSA!); }}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Archive;
