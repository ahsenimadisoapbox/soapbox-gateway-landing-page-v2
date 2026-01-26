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

type ComplianceRegulation = {
  regulationId: string;
  frameworkId: string;
  domainId: string;
  code: string;
  title: string;
  description: string;
  version: string;
  status: "DRAFT" | "ACTIVE" | "WITHDRAWN" | "SUPERSEDED" | "ARCHIVED";
  effectiveDate: string;
  jurisdiction: string;
  isCurrent: boolean;
};

type ComplianceRegulationDialogProps = {
  mode: "view" | "edit" | "create" | null;
  regulation: ComplianceRegulation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceRegulationDialog = ({
  mode,
  regulation,
  open,
  onOpenChange,
}: ComplianceRegulationDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Regulation" : mode === "edit" ? "Edit Regulation" : "Regulation Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Regulation Code</Label>
              <Input
                id="code"
                defaultValue={regulation?.code}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                defaultValue={regulation?.version}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              defaultValue={regulation?.title}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={regulation?.description}
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jurisdiction">Jurisdiction</Label>
              {isViewMode ? (
                <Input value={regulation?.jurisdiction} disabled />
              ) : (
                <Select defaultValue={regulation?.jurisdiction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EU">EU</SelectItem>
                    <SelectItem value="US">US</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="GLOBAL">Global</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isViewMode ? (
                <Input value={regulation?.status} disabled />
              ) : (
                <Select defaultValue={regulation?.status || "DRAFT"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    <SelectItem value="SUPERSEDED">Superseded</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date</Label>
            <Input
              id="effectiveDate"
              type="date"
              defaultValue={regulation?.effectiveDate}
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
