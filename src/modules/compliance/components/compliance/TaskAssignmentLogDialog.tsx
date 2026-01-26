import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskAssignmentLog = {
  taskAssignmentId: string;
  tenantId: string;
  siteId: string;
  taskId: string;
  assignedRole: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  assignmentNotes: string;
  status: string;
};

type TaskAssignmentLogDialogProps = {
  mode: "view" | "edit" | "create" | null;
  assignment: TaskAssignmentLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: TaskAssignmentLog) => void;
};

const emptyAssignment: TaskAssignmentLog = {
  taskAssignmentId: "",
  tenantId: "TNT-001",
  siteId: "",
  taskId: "",
  assignedRole: "",
  assignedTo: "",
  assignedBy: "",
  assignedAt: "",
  effectiveFrom: "",
  effectiveTo: "",
  assignmentNotes: "",
  status: "ACTIVE",
};

export const TaskAssignmentLogDialog = ({
  mode,
  assignment,
  open,
  onOpenChange,
  onSave,
}: TaskAssignmentLogDialogProps) => {
  const [formData, setFormData] = useState<TaskAssignmentLog>(emptyAssignment);

  useEffect(() => {
    if (assignment) {
      setFormData(assignment);
    } else {
      setFormData(emptyAssignment);
    }
  }, [assignment, open]);

  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Assignment" : mode === "edit" ? "Edit Assignment" : "Assignment Details";

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taskId">Task ID</Label>
              <Input
                id="taskId"
                value={formData.taskId}
                onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteId">Site ID</Label>
              <Input
                id="siteId"
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedRole">Assigned Role</Label>
              <Input
                id="assignedRole"
                value={formData.assignedRole}
                onChange={(e) => setFormData({ ...formData, assignedRole: e.target.value })}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedBy">Assigned By</Label>
              <Input
                id="assignedBy"
                value={formData.assignedBy}
                onChange={(e) => setFormData({ ...formData, assignedBy: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isViewMode ? (
                <Input value={formData.status} disabled />
              ) : (
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveFrom">Effective From</Label>
              <Input
                id="effectiveFrom"
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveTo">Effective To</Label>
              <Input
                id="effectiveTo"
                type="date"
                value={formData.effectiveTo || ""}
                onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentNotes">Assignment Notes</Label>
            <Textarea
              id="assignmentNotes"
              value={formData.assignmentNotes}
              onChange={(e) => setFormData({ ...formData, assignmentNotes: e.target.value })}
              disabled={isViewMode}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button onClick={handleSave}>
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
