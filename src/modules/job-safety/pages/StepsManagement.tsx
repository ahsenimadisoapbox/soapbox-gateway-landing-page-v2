import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Plus, Trash2, GripVertical, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface JobStep {
  id: number;
  stepNumber: number;
  description: string;
  attachments: string[];
}

const StepsManagement = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<JobStep[]>([
    { id: 1, stepNumber: 1, description: "De-energize electrical panel and verify lockout", attachments: [] },
    { id: 2, stepNumber: 2, description: "Remove panel cover and inspect components", attachments: [] },
  ]);
  const [editStep, setEditStep] = useState<JobStep | null>(null);
  const [viewStep, setViewStep] = useState<JobStep | null>(null);
  const [stepDescription, setStepDescription] = useState("");

  const addStep = () => {
    const newStep: JobStep = {
      id: steps.length + 1,
      stepNumber: steps.length + 1,
      description: "",
      attachments: [],
    };
    setSteps([...steps, newStep]);
  };

  const deleteStep = (id: number) => {
    if (steps.length === 1) {
      toast.error("At least one step is required");
      return;
    }
    setSteps(steps.filter((step) => step.id !== id).map((step, idx) => ({
      ...step,
      stepNumber: idx + 1,
    })));
    toast.success("Step deleted");
  };

  const openEditDialog = (step: JobStep) => {
    setEditStep(step);
    setStepDescription(step.description);
  };

  const openViewDialog = (step: JobStep) => {
    setViewStep(step);
  };

  const saveStepDescription = () => {
    if (editStep) {
      setSteps(steps.map((step) =>
        step.id === editStep.id ? { ...step, description: stepDescription } : step
      ));
      setEditStep(null);
      toast.success("Step updated");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Steps Management</h1>
        <p className="text-muted-foreground">Define and manage job steps</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Steps</CardTitle>
          <Button onClick={addStep} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Step {step.stepNumber}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openViewDialog(step)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(step)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description || "Click edit to add description"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/create-jsa")}>
          Back
        </Button>
        <Button onClick={() => navigate("/hazard-identification")}>
          Continue to Hazard Identification
        </Button>
      </div>

      {/* View Step Dialog */}
      <Dialog open={!!viewStep} onOpenChange={() => setViewStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Step {viewStep?.stepNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Step Description</Label>
              <p className="text-sm">{viewStep?.description || "No description"}</p>
            </div>
            <div>
              <Label>Attachments</Label>
              <p className="text-sm text-muted-foreground">
                {viewStep?.attachments.length || 0} file(s)
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Step Dialog */}
      <Dialog open={!!editStep} onOpenChange={() => setEditStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Step {editStep?.stepNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stepDescription">Step Description</Label>
              <Textarea
                id="stepDescription"
                value={stepDescription}
                onChange={(e) => setStepDescription(e.target.value)}
                placeholder="Describe what happens in this step"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditStep(null)}>
                Cancel
              </Button>
              <Button onClick={saveStepDescription}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepsManagement;
