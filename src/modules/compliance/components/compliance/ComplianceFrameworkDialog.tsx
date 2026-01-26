import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ComplianceFramework = {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  versionNo: string;
  publisher: string;
  issueDate: string;
  lastReviewDate: string;
  effectiveDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  description: string;
};

type ComplianceFrameworkDialogProps = {
  mode: "view" | "edit" | "create" | null;
  framework: ComplianceFramework | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceFrameworkDialog = ({
  mode,
  framework,
  open,
  onOpenChange,
}: ComplianceFrameworkDialogProps) => {
  const [effectiveDate, setEffectiveDate] = useState<Date>();

  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Framework" : mode === "edit" ? "Edit Framework" : "Framework Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frameworkCode">Framework Code</Label>
              <Input
                id="frameworkCode"
                defaultValue={framework?.frameworkCode}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="versionNo">Version</Label>
              <Input
                id="versionNo"
                defaultValue={framework?.versionNo}
                disabled={isViewMode}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frameworkName">Framework Name</Label>
            <Input
              id="frameworkName"
              defaultValue={framework?.frameworkName}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={framework?.description}
              disabled={isViewMode}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                defaultValue={framework?.publisher}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isViewMode ? (
                <Input value={framework?.status} disabled />
              ) : (
                <Select defaultValue={framework?.status || "ACTIVE"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="REVOKED">Revoked</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Effective Date</Label>
              {isViewMode ? (
                <Input value={framework?.effectiveDate} disabled />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !effectiveDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {effectiveDate ? format(effectiveDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={effectiveDate}
                      onSelect={setEffectiveDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                defaultValue={framework?.issueDate}
                disabled={isViewMode}
              />
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
