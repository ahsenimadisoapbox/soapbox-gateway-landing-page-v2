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

type ComplianceTask = {
  taskId: string;
  tenantId: string;
  obligationId: string;
  controlMapId: string;
  title: string;
  description: string;
  ownerId: string;
  dueDate: string;
  status: string;
  severity: string;
  escalationLevel: number;
  deletedFlag: "Y" | "N";
};

type ComplianceTaskDialogProps = {
  mode: "view" | "edit" | "create" | null;
  task: ComplianceTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceTaskDialog = ({
  mode,
  task,
  open,
  onOpenChange,
}: ComplianceTaskDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Task" : mode === "edit" ? "Edit Task" : "Task Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              defaultValue={task?.title}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={task?.description}
              disabled={isViewMode}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerId">Owner</Label>
              <Input
                id="ownerId"
                defaultValue={task?.ownerId}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                defaultValue={task?.dueDate}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isViewMode ? (
                <Input value={task?.status} disabled />
              ) : (
                <Select defaultValue={task?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              {isViewMode ? (
                <Input value={task?.severity} disabled />
              ) : (
                <Select defaultValue={task?.severity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalationLevel">Escalation Level</Label>
            <Input
              id="escalationLevel"
              type="number"
              defaultValue={task?.escalationLevel}
              disabled={isViewMode}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isViewMode ? "Close" : "Cancel"}
          </Button>
          {!isViewMode && (
            <Button type="submit">
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
