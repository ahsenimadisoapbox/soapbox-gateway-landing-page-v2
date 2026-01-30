import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PendingAction {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  actionType: string;
  submittedBy: string;
  submittedDate: string;
  priority: "high" | "medium" | "low";
}

const MyPendingActions = () => {
  const [selectedAction, setSelectedAction] = useState<PendingAction | null>(null);
  const [actionDialog, setActionDialog] = useState<"view" | "approve" | "reject" | null>(null);
  const [comments, setComments] = useState("");

  const mockPendingActions: PendingAction[] = [
    { id: "1", jsaNumber: "JSA-2025-001", jobTitle: "Electrical Panel Maintenance", actionType: "L1 Review", submittedBy: "John Doe", submittedDate: "2025-01-15", priority: "high" },
    { id: "2", jsaNumber: "JSA-2025-002", jobTitle: "Confined Space Entry", actionType: "L2 Approval", submittedBy: "Sarah Chen", submittedDate: "2025-01-14", priority: "high" },
    { id: "3", jsaNumber: "JSA-2025-003", jobTitle: "Hot Work Operations", actionType: "Verification", submittedBy: "Mike Rodriguez", submittedDate: "2025-01-13", priority: "medium" },
  ];

  const handleApprove = () => {
    toast.success(`${selectedAction?.jsaNumber} approved successfully`);
    setActionDialog(null);
    setSelectedAction(null);
    setComments("");
  };

  const handleReject = () => {
    if (!comments.trim()) {
      toast.error("Please provide rejection comments");
      return;
    }
    toast.success(`${selectedAction?.jsaNumber} rejected`);
    setActionDialog(null);
    setSelectedAction(null);
    setComments("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Pending Actions</h1>
        <p className="text-muted-foreground">JSAs requiring your action</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Actions ({mockPendingActions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPendingActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium">{action.jsaNumber}</TableCell>
                  <TableCell>{action.jobTitle}</TableCell>
                  <TableCell>{action.actionType}</TableCell>
                  <TableCell>{action.submittedBy}</TableCell>
                  <TableCell>{action.submittedDate}</TableCell>
                  <TableCell>
                    <Badge variant={action.priority === "high" ? "destructive" : action.priority === "medium" ? "default" : "secondary"}>
                      {action.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedAction(action); setActionDialog("view"); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedAction(action); setActionDialog("approve"); }}>
                        <CheckCircle className="h-4 w-4 text-status-success" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedAction(action); setActionDialog("reject"); }}>
                        <XCircle className="h-4 w-4 text-status-error" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={actionDialog === "view"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>JSA Details - {selectedAction?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <p className="text-sm">{selectedAction?.jobTitle}</p>
            </div>
            <div>
              <Label>Action Required</Label>
              <p className="text-sm">{selectedAction?.actionType}</p>
            </div>
            <div>
              <Label>Submitted By</Label>
              <p className="text-sm">{selectedAction?.submittedBy}</p>
            </div>
            <div>
              <Label>Date</Label>
              <p className="text-sm">{selectedAction?.submittedDate}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === "approve"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve JSA - {selectedAction?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approveComments">Comments (Optional)</Label>
              <Textarea
                id="approveComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any approval comments"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button onClick={handleApprove}>Approve</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog === "reject"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject JSA - {selectedAction?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectComments">Rejection Comments *</Label>
              <Textarea
                id="rejectComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide reason for rejection"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Reject</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPendingActions;
