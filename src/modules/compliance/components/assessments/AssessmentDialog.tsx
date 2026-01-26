import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "create";
  assessment?: any;
}

export const AssessmentDialog = ({ open, onOpenChange, mode, assessment }: AssessmentDialogProps) => {
  const isReadOnly = mode === "view";
  const title = mode === "create" ? "New Assessment" : mode === "edit" ? "Edit Assessment" : "Assessment Details";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Assessment Name</Label>
              <Input id="name" defaultValue={assessment?.name} readOnly={isReadOnly} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Select defaultValue={assessment?.framework} disabled={isReadOnly}>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISO 27001:2022">ISO 27001:2022</SelectItem>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                  <SelectItem value="SOX">SOX</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assessor">Assessor</Label>
              <Input id="assessor" defaultValue={assessment?.assessor} readOnly={isReadOnly} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" defaultValue={assessment?.dueDate} readOnly={isReadOnly} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={assessment?.status} disabled={isReadOnly}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "view" && assessment?.score && (
              <div className="space-y-2">
                <Label htmlFor="score">Score</Label>
                <Input id="score" defaultValue={assessment?.score} readOnly />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} readOnly={isReadOnly} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? "Close" : "Cancel"}
            </Button>
            {!isReadOnly && (
              <Button className="bg-primary hover:bg-primary/90">
                {mode === "create" ? "Create" : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
