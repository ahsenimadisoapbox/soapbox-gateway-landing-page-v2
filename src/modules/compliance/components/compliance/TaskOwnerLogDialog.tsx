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

type TaskOwnerLog = {
  historyId: string;
  tenantId: string;
  taskId: string;
  oldOwner: string;
  newOwner: string;
  changedBy: string;
  changedTs: string;
  note: string;
};

type TaskOwnerLogDialogProps = {
  mode: "view" | "edit" | "create" | null;
  log: TaskOwnerLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const TaskOwnerLogDialog = ({
  mode,
  log,
  open,
  onOpenChange,
}: TaskOwnerLogDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Log Entry" : mode === "edit" ? "Edit Log Entry" : "Log Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="taskId">Task ID</Label>
            <Input
              id="taskId"
              defaultValue={log?.taskId}
              disabled={isViewMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oldOwner">Old Owner</Label>
              <Input
                id="oldOwner"
                defaultValue={log?.oldOwner}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOwner">New Owner</Label>
              <Input
                id="newOwner"
                defaultValue={log?.newOwner}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="changedBy">Changed By</Label>
              <Input
                id="changedBy"
                defaultValue={log?.changedBy}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="changedTs">Changed At</Label>
              <Input
                id="changedTs"
                defaultValue={log?.changedTs}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              defaultValue={log?.note}
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
            <Button type="submit">
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
