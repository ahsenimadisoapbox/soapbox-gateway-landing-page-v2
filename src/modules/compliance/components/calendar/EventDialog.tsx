import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: {
    date: string;
    title: string;
    type: string;
    priority: string;
    time?: string;
    assignee?: string;
    description?: string;
  };
}

export const EventDialog = ({ open, onOpenChange, event }: EventDialogProps) => {
  if (!event) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline">{event.type}</Badge>
            <Badge variant="secondary" className={getPriorityColor(event.priority)}>
              {event.priority}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{event.date}</span>
            </div>

            {event.time && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
            )}

            {event.assignee && (
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{event.assignee}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Edit Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
