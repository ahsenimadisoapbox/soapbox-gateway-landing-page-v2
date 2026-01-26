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

type ComplianceDomain = {
  domainId: string;
  frameworkId: string;
  domainCode: string;
  domainName: string;
  description: string;
  frameworkName?: string;
};

type ComplianceDomainDialogProps = {
  mode: "view" | "edit" | "create" | null;
  domain: ComplianceDomain | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ComplianceDomainDialog = ({
  mode,
  domain,
  open,
  onOpenChange,
}: ComplianceDomainDialogProps) => {
  if (!mode) return null;

  const isViewMode = mode === "view";
  const title = mode === "create" ? "Create Domain" : mode === "edit" ? "Edit Domain" : "Domain Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domainCode">Domain Code</Label>
              <Input
                id="domainCode"
                defaultValue={domain?.domainCode}
                disabled={isViewMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              {isViewMode ? (
                <Input value={domain?.frameworkName} disabled />
              ) : (
                <Select defaultValue={domain?.frameworkId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FWK-001">GDPR</SelectItem>
                    <SelectItem value="FWK-002">HIPAA</SelectItem>
                    <SelectItem value="FWK-003">ISO 27001</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domainName">Domain Name</Label>
            <Input
              id="domainName"
              defaultValue={domain?.domainName}
              disabled={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={domain?.description}
              disabled={isViewMode}
              rows={4}
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
