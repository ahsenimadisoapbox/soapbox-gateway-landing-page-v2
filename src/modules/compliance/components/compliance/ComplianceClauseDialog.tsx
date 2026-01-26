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

type ComplianceClause = {
  clauseId: string;
  regulationId: string;
  parentId: string | null;
  clauseCode: string;
  title: string;
  clauseText: string;
  levelNo: number;
};

type ComplianceClauseDialogProps = {
  mode: "view" | "edit" | "create" | null;
  clause: ComplianceClause | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceClauseDialog = ({
  mode,
  clause,
  open,
  onOpenChange,
}: ComplianceClauseDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Clause" : mode === "edit" ? "Edit Clause" : "Clause Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clauseCode">Clause Code</Label>
              <Input
                id="clauseCode"
                defaultValue={clause?.clauseCode}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="levelNo">Level</Label>
              <Input
                id="levelNo"
                type="number"
                defaultValue={clause?.levelNo}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              defaultValue={clause?.title}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clauseText">Clause Text</Label>
            <Textarea
              id="clauseText"
              defaultValue={clause?.clauseText}
              disabled={isViewMode}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Clause (Optional)</Label>
            <Input
              id="parentId"
              defaultValue={clause?.parentId || ""}
              placeholder="Leave empty for top-level clause"
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
