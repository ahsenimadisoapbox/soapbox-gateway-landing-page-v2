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

type ComplianceControl = {
  controlId: string;
  tenantId: string;
  clauseId: string;
  controlCode: string;
  controlName: string;
  controlDesc: string;
  controlType: string;
  severityName: string;
  frequency: string;
  mandatoryFlag: "Y" | "N";
  owner: string;
};

type ComplianceControlDialogProps = {
  mode: "view" | "edit" | "create" | null;
  control: ComplianceControl | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceControlDialog = ({
  mode,
  control,
  open,
  onOpenChange,
}: ComplianceControlDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Control" : mode === "edit" ? "Edit Control" : "Control Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="controlCode">Control Code</Label>
              <Input
                id="controlCode"
                defaultValue={control?.controlCode}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="controlType">Control Type</Label>
              {isViewMode ? (
                <Input value={control?.controlType} disabled />
              ) : (
                <Select defaultValue={control?.controlType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                    <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
                    <SelectItem value="PHYSICAL">Physical</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlName">Control Name</Label>
            <Input
              id="controlName"
              defaultValue={control?.controlName}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="controlDesc">Description</Label>
            <Textarea
              id="controlDesc"
              defaultValue={control?.controlDesc}
              disabled={isViewMode}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severityName">Severity</Label>
              {isViewMode ? (
                <Input value={control?.severityName} disabled />
              ) : (
                <Select defaultValue={control?.severityName}>
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
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              {isViewMode ? (
                <Input value={control?.frequency} disabled />
              ) : (
                <Select defaultValue={control?.frequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONETIME">One Time</SelectItem>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="ANNUAL">Annual</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                defaultValue={control?.owner}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mandatoryFlag">Mandatory</Label>
              {isViewMode ? (
                <Input value={control?.mandatoryFlag === "Y" ? "Yes" : "No"} disabled />
              ) : (
                <Select defaultValue={control?.mandatoryFlag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Yes</SelectItem>
                    <SelectItem value="N">No</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
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
