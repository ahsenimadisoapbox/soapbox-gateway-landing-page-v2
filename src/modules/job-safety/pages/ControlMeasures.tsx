import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Trash2, Eye, Edit } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";

interface Control {
  id: number;
  hazardId: number;
  hazardTitle: string;
  type: string;
  description: string;
  responsible: string;
  verification: string;
}

const ControlMeasures = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState<Control[]>([
    {
      id: 1,
      hazardId: 1,
      hazardTitle: "Electrical Shock",
      type: "Elimination",
      description: "De-energize panel using lockout/tagout procedure",
      responsible: "Qualified Electrician",
      verification: "Visual verification of locks and tags",
    },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editControl, setEditControl] = useState<Control | null>(null);
  const [viewControl, setViewControl] = useState<Control | null>(null);
  const [formData, setFormData] = useState({
    hazardId: 1,
    hazardTitle: "Electrical Shock",
    type: "Elimination",
    description: "",
    responsible: "",
    verification: "",
  });

  const controlTypes = ["Elimination", "Substitution", "Engineering", "Administrative", "PPE"];

  const addControl = () => {
    if (!formData.description) {
      toast.error("Please enter control description");
      return;
    }
    const newControl: Control = {
      id: controls.length + 1,
      ...formData,
    };
    setControls([...controls, newControl]);
    setShowAddDialog(false);
    setFormData({
      hazardId: 1,
      hazardTitle: "Electrical Shock",
      type: "Elimination",
      description: "",
      responsible: "",
      verification: "",
    });
    toast.success("Control measure added");
  };

  const deleteControl = (id: number) => {
    setControls(controls.filter((c) => c.id !== id));
    toast.success("Control measure deleted");
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Elimination: "bg-status-success",
      Substitution: "bg-status-info",
      Engineering: "bg-status-caution",
      Administrative: "bg-status-warning",
      PPE: "bg-status-error",
    };
    return colors[type] || "bg-muted";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Control Measures</h1>
        <p className="text-muted-foreground">Define controls using hierarchy of controls</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Control Measures ({controls.length})</CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Control
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hazard</TableHead>
                <TableHead>Control Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((control) => (
                <TableRow key={control.id}>
                  <TableCell className="font-medium">{control.hazardTitle}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(control.type)}>
                      {control.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{control.description}</TableCell>
                  <TableCell>{control.responsible}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setViewControl(control)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditControl(control)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteControl(control.id)}>
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

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/hazard-identification")}>
          Back
        </Button>
        <Button onClick={() => navigate("/risk-matrix")}>
          Continue to Risk Evaluation
        </Button>
      </div>

      {/* Add/Edit Control Dialog */}
      <Dialog open={showAddDialog || !!editControl} onOpenChange={() => { setShowAddDialog(false); setEditControl(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editControl ? "Edit" : "Add"} Control Measure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hazard">Hazard</Label>
              <Select value={formData.hazardId.toString()} onValueChange={(v) => setFormData({ ...formData, hazardId: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Electrical Shock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Control Type *</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {controlTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the control measure"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="responsible">Responsible Person</Label>
              <Input
                id="responsible"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Who is responsible?"
              />
            </div>
            <div>
              <Label htmlFor="verification">Verification Method</Label>
              <Textarea
                id="verification"
                value={formData.verification}
                onChange={(e) => setFormData({ ...formData, verification: e.target.value })}
                placeholder="How will this control be verified?"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowAddDialog(false); setEditControl(null); }}>
                Cancel
              </Button>
              <Button onClick={addControl}>Save Control</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Control Dialog */}
      <Dialog open={!!viewControl} onOpenChange={() => setViewControl(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Control Measure Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Hazard</Label>
              <p className="text-sm">{viewControl?.hazardTitle}</p>
            </div>
            <div>
              <Label>Control Type</Label>
              <p className="text-sm">{viewControl?.type}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p className="text-sm">{viewControl?.description}</p>
            </div>
            <div>
              <Label>Responsible Person</Label>
              <p className="text-sm">{viewControl?.responsible}</p>
            </div>
            <div>
              <Label>Verification Method</Label>
              <p className="text-sm">{viewControl?.verification}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlMeasures;
