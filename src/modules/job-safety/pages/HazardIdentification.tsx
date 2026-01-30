import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Hazard {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  causes: string;
  consequences: string;
  severity: number;
  likelihood: number;
}

const HazardIdentification = () => {
  const navigate = useNavigate();
  const [hazards, setHazards] = useState<Hazard[]>([
    {
      id: 1,
      stepNumber: 1,
      title: "Electrical Shock",
      description: "Contact with energized components",
      causes: "Failure to lockout, improper PPE",
      consequences: "Severe injury or fatality",
      severity: 5,
      likelihood: 3,
    },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editHazard, setEditHazard] = useState<Hazard | null>(null);
  const [viewHazard, setViewHazard] = useState<Hazard | null>(null);
  const [formData, setFormData] = useState({
    stepNumber: 1,
    title: "",
    description: "",
    causes: "",
    consequences: "",
    severity: 1,
    likelihood: 1,
  });

  const addHazard = () => {
    if (!formData.title) {
      toast.error("Please enter hazard title");
      return;
    }
    const newHazard: Hazard = {
      id: hazards.length + 1,
      ...formData,
    };
    setHazards([...hazards, newHazard]);
    setShowAddDialog(false);
    setFormData({
      stepNumber: 1,
      title: "",
      description: "",
      causes: "",
      consequences: "",
      severity: 1,
      likelihood: 1,
    });
    toast.success("Hazard added");
  };

  const deleteHazard = (id: number) => {
    setHazards(hazards.filter((h) => h.id !== id));
    toast.success("Hazard deleted");
  };

  const getRiskRating = (severity: number, likelihood: number) => {
    const risk = severity * likelihood;
    if (risk >= 15) return { label: "Critical", color: "bg-status-error" };
    if (risk >= 10) return { label: "High", color: "bg-status-warning" };
    if (risk >= 5) return { label: "Medium", color: "bg-status-caution" };
    return { label: "Low", color: "bg-status-success" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hazard Identification</h1>
        <p className="text-muted-foreground">Identify hazards for each job step</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Identified Hazards ({hazards.length})</CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Hazard
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Hazard Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Risk Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hazards.map((hazard) => {
                const risk = getRiskRating(hazard.severity, hazard.likelihood);
                return (
                  <TableRow key={hazard.id}>
                    <TableCell>{hazard.stepNumber}</TableCell>
                    <TableCell className="font-medium">{hazard.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{hazard.description}</TableCell>
                    <TableCell>{hazard.severity}</TableCell>
                    <TableCell>{hazard.likelihood}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                        {risk.label}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setViewHazard(hazard)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditHazard(hazard)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteHazard(hazard.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/steps-management")}>
          Back
        </Button>
        <Button onClick={() => navigate("/control-measures")}>
          Continue to Control Measures
        </Button>
      </div>

      {/* Add/Edit Hazard Dialog */}
      <Dialog open={showAddDialog || !!editHazard} onOpenChange={() => { setShowAddDialog(false); setEditHazard(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editHazard ? "Edit" : "Add"} Hazard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stepNumber">Job Step</Label>
                <Select value={formData.stepNumber.toString()} onValueChange={(v) => setFormData({ ...formData, stepNumber: parseInt(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Step 1</SelectItem>
                    <SelectItem value="2">Step 2</SelectItem>
                    <SelectItem value="3">Step 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Hazard Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter hazard title"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the hazard"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="causes">Causes</Label>
                <Textarea
                  id="causes"
                  value={formData.causes}
                  onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                  placeholder="What can cause this hazard?"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="consequences">Consequences</Label>
                <Textarea
                  id="consequences"
                  value={formData.consequences}
                  onChange={(e) => setFormData({ ...formData, consequences: e.target.value })}
                  placeholder="Potential consequences"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="severity">Severity (1-5)</Label>
                <Select value={formData.severity.toString()} onValueChange={(v) => setFormData({ ...formData, severity: parseInt(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                <Select value={formData.likelihood.toString()} onValueChange={(v) => setFormData({ ...formData, likelihood: parseInt(v) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditHazard(null); }}>
                Cancel
              </Button>
              <Button onClick={addHazard}>Save Hazard</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Hazard Dialog */}
      <Dialog open={!!viewHazard} onOpenChange={() => setViewHazard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hazard Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <p className="text-sm">{viewHazard?.title}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm">{viewHazard?.description}</p>
            </div>
            <div>
              <Label>Causes</Label>
              <p className="text-sm">{viewHazard?.causes}</p>
            </div>
            <div>
              <Label>Consequences</Label>
              <p className="text-sm">{viewHazard?.consequences}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Severity</Label>
                <p className="text-sm">{viewHazard?.severity}</p>
              </div>
              <div>
                <Label>Likelihood</Label>
                <p className="text-sm">{viewHazard?.likelihood}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HazardIdentification;
