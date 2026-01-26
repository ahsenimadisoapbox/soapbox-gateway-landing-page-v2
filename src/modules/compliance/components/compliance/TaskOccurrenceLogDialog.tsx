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

type TaskOccurrenceLog = {
  taskOccurrenceId: string;
  tenantId: string;
  siteId: string;
  taskId: string;
  status: string;
  occurrenceStart: string;
  occurrenceEnd: string;
  completedBy?: string;
  completedAt?: string;
  generatedAt: string;
  meta: string;
};

type TaskOccurrenceLogDialogProps = {
  mode: "view" | "edit" | "create" | null;
  occurrence: TaskOccurrenceLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TaskOccurrenceLogDialog = ({
  mode,
  occurrence,
  open,
  onOpenChange,
}: TaskOccurrenceLogDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Occurrence" : mode === "edit" ? "Edit Occurrence" : "Occurrence Details";

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
                defaultValue={occurrence?.taskId}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteId">Site ID</Label>
              <Input
                id="siteId"
                defaultValue={occurrence?.siteId}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="occurrenceStart">Occurrence Start</Label>
              <Input
                id="occurrenceStart"
                type="datetime-local"
                defaultValue={occurrence?.occurrenceStart}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occurrenceEnd">Occurrence End</Label>
              <Input
                id="occurrenceEnd"
                type="datetime-local"
                defaultValue={occurrence?.occurrenceEnd}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isViewMode ? (
              <Input value={occurrence?.status} disabled />
            ) : (
              <Select defaultValue={occurrence?.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="completedBy">Completed By</Label>
              <Input
                id="completedBy"
                defaultValue={occurrence?.completedBy}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedAt">Completed At</Label>
              <Input
                id="completedAt"
                type="datetime-local"
                defaultValue={occurrence?.completedAt}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta">Metadata (JSON)</Label>
            <Textarea
              id="meta"
              defaultValue={occurrence?.meta}
              disabled={isViewMode}
              rows={4}
              className="font-mono text-sm"
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
