import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  value?: string;
  options?: string[];
  placeholder?: string;
}

interface GenericFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FormField[];
  mode: "view" | "edit" | "create";
}

export const GenericFormDialog = ({ open, onOpenChange, title, fields, mode }: GenericFormDialogProps) => {
  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                
                {field.type === "text" && (
                  <Input
                    id={field.id}
                    defaultValue={field.value}
                    readOnly={isReadOnly}
                    placeholder={field.placeholder}
                  />
                )}
                
                {field.type === "date" && (
                  <Input
                    id={field.id}
                    type="date"
                    defaultValue={field.value}
                    readOnly={isReadOnly}
                  />
                )}
                
                {field.type === "select" && (
                  <Select defaultValue={field.value} disabled={isReadOnly}>
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder={field.placeholder || "Select..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === "textarea" && (
                  <Textarea
                    id={field.id}
                    rows={4}
                    defaultValue={field.value}
                    readOnly={isReadOnly}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
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
