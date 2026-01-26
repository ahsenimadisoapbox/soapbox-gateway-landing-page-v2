import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

type Obligation = {
  id: string;
  title: string;
  framework: string;
  owner: string;
  dueDate: string;
  priority: string;
  status: string;
};

type ObligationDialogProps = {
  mode: "view" | "edit" | "create" | null;
  obligation: Obligation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ObligationDialog = ({ mode, obligation, open, onOpenChange }: ObligationDialogProps) => {
  const [date, setDate] = useState<Date>();

  if (!mode) return null;

  const isView = mode === "view";
  const isCreate = mode === "create";
  const title = isCreate ? "Create Obligation" : isView ? "View Obligation" : "Edit Obligation";
  const description = isCreate
    ? "Create a new compliance obligation"
    : isView
    ? "View obligation details"
    : "Update obligation details";

  const obligationData = obligation || {
    id: "OBL-2024-XXX",
    title: "",
    framework: "",
    owner: "",
    dueDate: "",
    priority: "",
    status: "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id">Obligation ID</Label>
            <Input
              id="id"
              defaultValue={obligationData.id}
              disabled={!isCreate}
              placeholder={isCreate ? "OBL-2024-XXX" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            {isView ? (
              <Input id="framework" value={obligationData.framework} disabled />
            ) : (
              <Select defaultValue={obligationData.framework || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                  <SelectItem value="SOX">SOX</SelectItem>
                  <SelectItem value="OSHA">OSHA</SelectItem>
                  <SelectItem value="ISO 14001">ISO 14001</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              defaultValue={obligationData.title}
              disabled={isView}
              placeholder={isCreate ? "Enter obligation title" : ""}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={
                obligation?.id === "OBL-2024-001"
                  ? "Conduct annual DPIA for all data processing activities"
                  : ""
              }
              disabled={isView}
              placeholder={isCreate ? "Enter detailed description" : ""}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              defaultValue={obligationData.owner}
              disabled={isView}
              placeholder={isCreate ? "Assign owner" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            {isView ? (
              <Input id="dueDate" value={obligationData.dueDate} disabled />
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd-MM-yyyy") : obligationData.dueDate || "dd-mm-yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            {isView ? (
              <Input
                id="priority"
                value={obligationData.priority.charAt(0).toUpperCase() + obligationData.priority.slice(1)}
                disabled
              />
            ) : (
              <Select defaultValue={obligationData.priority || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isView ? (
              <Input
                id="status"
                value={obligationData.status.charAt(0).toUpperCase() + obligationData.status.slice(1)}
                disabled
              />
            ) : (
              <Select defaultValue={obligationData.status || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliant">Compliant</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          {isView ? (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                {isCreate ? "Create" : "Save Changes"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
