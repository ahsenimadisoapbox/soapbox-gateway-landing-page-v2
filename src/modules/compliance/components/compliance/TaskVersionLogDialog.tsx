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

type TaskVersionLog = {
  taskVersionLogId: string;
  taskId: string;
  tenantId: string;
  siteId: string;
  versionNo: number;
  changeType: string;
  changedBy: string;
  changedAt: string;
  snapshot: string;
  changeReason: string;
};

type TaskVersionLogDialogProps = {
  mode: "view" | "edit" | "create" | null;
  version: TaskVersionLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: TaskVersionLog) => void;
};

const emptyVersion: TaskVersionLog = {
  taskVersionLogId: "",
  taskId: "",
  tenantId: "TNT-001",
  siteId: "",
  versionNo: 1,
  changeType: "CREATE",
  changedBy: "",
  changedAt: "",
  snapshot: "{}",
  changeReason: "",
};

export const TaskVersionLogDialog = ({
  mode,
  version,
  open,
  onOpenChange,
  onSave,
}: TaskVersionLogDialogProps) => {
  const [formData, setFormData] = useState<TaskVersionLog>(emptyVersion);

  useEffect(() => {
    if (version) {
      setFormData(version);
    } else {
      setFormData(emptyVersion);
    }
  }, [version, open]);

  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Version Log" : mode === "edit" ? "Edit Version Log" : "Version Log Details";

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
              <Label htmlFor="versionNo">Version Number</Label>
              <Input
                id="versionNo"
                type="number"
                value={formData.versionNo}
                onChange={(e) => setFormData({ ...formData, versionNo: parseInt(e.target.value) || 1 })}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteId">Site ID</Label>
              <Input
                id="siteId"
                value={formData.siteId}
                onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeType">Change Type</Label>
              {isViewMode ? (
                <Input value={formData.changeType} disabled />
              ) : (
                <Select
                  value={formData.changeType}
                  onValueChange={(value) => setFormData({ ...formData, changeType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select change type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="changedBy">Changed By</Label>
              <Input
                id="changedBy"
                value={formData.changedBy}
                onChange={(e) => setFormData({ ...formData, changedBy: e.target.value })}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changedAt">Changed At</Label>
              <Input
                id="changedAt"
                value={formData.changedAt}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changeReason">Change Reason</Label>
            <Textarea
              id="changeReason"
              value={formData.changeReason}
              onChange={(e) => setFormData({ ...formData, changeReason: e.target.value })}
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snapshot">Snapshot (JSON)</Label>
            <Textarea
              id="snapshot"
              value={formData.snapshot}
              onChange={(e) => setFormData({ ...formData, snapshot: e.target.value })}
              disabled={isViewMode}
              rows={6}
              className="font-mono text-sm"
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
