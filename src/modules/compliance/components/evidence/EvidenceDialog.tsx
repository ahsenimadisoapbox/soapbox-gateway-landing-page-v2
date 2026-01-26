import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Evidence = {
  id: string;
  name: string;
  type: string;
  obligation: string;
  uploadedBy: string;
  uploadedDate: string;
  status: string;
};

type EvidenceDialogProps = {
  mode: "view" | "upload" | null;
  evidence: Evidence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EvidenceDialog = ({ mode, evidence, open, onOpenChange }: EvidenceDialogProps) => {
  if (!mode) return null;

  const isView = mode === "view";
  const title = isView ? "View Evidence" : "Upload Evidence";
  const description = isView ? "Evidence details" : "Upload new compliance evidence";

  if (isView && evidence) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Evidence ID</Label>
                <Input value={evidence.id} disabled />
              </div>
              <div className="space-y-2">
                <Label>File Type</Label>
                <Input value={evidence.type} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Evidence Name</Label>
              <Input value={evidence.name} disabled />
            </div>

            <div className="space-y-2">
              <Label>Linked Obligation</Label>
              <Input value={evidence.obligation} disabled />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Uploaded By</Label>
                <Input value={evidence.uploadedBy} disabled />
              </div>
              <div className="space-y-2">
                <Label>Upload Date</Label>
                <Input value={evidence.uploadedDate} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Badge
                variant="secondary"
                className={
                  evidence.status === "verified"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {evidence.status}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Evidence Name</Label>
            <Input id="name" placeholder="Enter evidence name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="obligation">Link to Obligation</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select obligation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OBL-2024-001">OBL-2024-001 - GDPR DPIA</SelectItem>
                <SelectItem value="OBL-2024-002">OBL-2024-002 - ISO 27001</SelectItem>
                <SelectItem value="OBL-2024-003">OBL-2024-003 - SOX Controls</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
