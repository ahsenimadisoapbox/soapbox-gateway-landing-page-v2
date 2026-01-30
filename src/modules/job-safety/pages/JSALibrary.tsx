import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Copy, Download, Search } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface JSATemplate {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  category: string;
  riskLevel: string;
  stepsCount: number;
  hazardsCount: number;
  controlsCount: number;
  lastUsed: string;
  timesUsed: number;
}

const JSALibrary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJSA, setSelectedJSA] = useState<JSATemplate | null>(null);
  const [viewDialog, setViewDialog] = useState(false);

  const mockLibrary: JSATemplate[] = [
    { id: "1", jsaNumber: "JSA-T-001", jobTitle: "Electrical Panel Maintenance", category: "Electrical", riskLevel: "High", stepsCount: 8, hazardsCount: 12, controlsCount: 18, lastUsed: "2025-01-10", timesUsed: 24 },
    { id: "2", jsaNumber: "JSA-T-002", jobTitle: "Confined Space Entry", category: "Confined Space", riskLevel: "Critical", stepsCount: 10, hazardsCount: 15, controlsCount: 22, lastUsed: "2025-01-08", timesUsed: 18 },
    { id: "3", jsaNumber: "JSA-T-003", jobTitle: "Hot Work Operations", category: "Fire/Explosion", riskLevel: "High", stepsCount: 6, hazardsCount: 10, controlsCount: 16, lastUsed: "2025-01-05", timesUsed: 31 },
    { id: "4", jsaNumber: "JSA-T-004", jobTitle: "Working at Height", category: "Fall Protection", riskLevel: "High", stepsCount: 7, hazardsCount: 11, controlsCount: 19, lastUsed: "2024-12-28", timesUsed: 42 },
  ];

  const filteredLibrary = mockLibrary.filter((jsa) =>
    jsa.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jsa.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jsa.jsaNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (jsa: JSATemplate) => {
    setSelectedJSA(jsa);
    setViewDialog(true);
  };

  const handleUseTemplate = (jsa: JSATemplate) => {
    toast.success(`Creating new JSA from template: ${jsa.jobTitle}`);
    navigate("/create-jsa");
  };

  const handleDelete = (jsa: JSATemplate) => {
    toast.success(`Template ${jsa.jsaNumber} deleted`);
  };

  const handleExport = (jsa: JSATemplate) => {
    toast.success(`Exporting ${jsa.jsaNumber}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">JSA Library</h1>
        <p className="text-muted-foreground">Browse and use JSA templates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>JSA Templates ({filteredLibrary.length})</span>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Hazards</TableHead>
                <TableHead>Controls</TableHead>
                <TableHead>Times Used</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLibrary.map((jsa) => (
                <TableRow key={jsa.id}>
                  <TableCell className="font-medium">{jsa.jsaNumber}</TableCell>
                  <TableCell>{jsa.jobTitle}</TableCell>
                  <TableCell>{jsa.category}</TableCell>
                  <TableCell>
                    <Badge variant={jsa.riskLevel === "Critical" ? "destructive" : "default"}>
                      {jsa.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{jsa.stepsCount}</TableCell>
                  <TableCell>{jsa.hazardsCount}</TableCell>
                  <TableCell>{jsa.controlsCount}</TableCell>
                  <TableCell>{jsa.timesUsed}</TableCell>
                  <TableCell>{jsa.lastUsed}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(jsa)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleUseTemplate(jsa)}>
                        <Copy className="h-4 w-4 text-status-success" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleExport(jsa)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-jsa?id=${jsa.jsaNumber}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(jsa)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>JSA Template - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Title</Label>
                <p className="text-sm">{selectedJSA?.jobTitle}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p className="text-sm">{selectedJSA?.category}</p>
              </div>
              <div>
                <Label>Risk Level</Label>
                <Badge variant={selectedJSA?.riskLevel === "Critical" ? "destructive" : "default"}>
                  {selectedJSA?.riskLevel}
                </Badge>
              </div>
              <div>
                <Label>Times Used</Label>
                <p className="text-sm">{selectedJSA?.timesUsed}</p>
              </div>
              <div>
                <Label>Total Steps</Label>
                <p className="text-sm">{selectedJSA?.stepsCount}</p>
              </div>
              <div>
                <Label>Total Hazards</Label>
                <p className="text-sm">{selectedJSA?.hazardsCount}</p>
              </div>
              <div>
                <Label>Total Controls</Label>
                <p className="text-sm">{selectedJSA?.controlsCount}</p>
              </div>
              <div>
                <Label>Last Used</Label>
                <p className="text-sm">{selectedJSA?.lastUsed}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setViewDialog(false)}>
                Close
              </Button>
              <Button onClick={() => { setViewDialog(false); handleUseTemplate(selectedJSA!); }}>
                <Copy className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JSALibrary;
