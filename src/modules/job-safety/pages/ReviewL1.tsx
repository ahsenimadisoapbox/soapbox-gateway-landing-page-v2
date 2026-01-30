import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface JSAReview {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  submittedBy: string;
  submitDate: string;
  priority: "high" | "medium" | "low";
  riskLevel: string;
}

const ReviewL1 = () => {
  const [selectedJSA, setSelectedJSA] = useState<JSAReview | null>(null);
  const [actionDialog, setActionDialog] = useState<"view" | "approve" | "reject" | "sendback" | null>(null);
  const [comments, setComments] = useState("");

  const mockReviews: JSAReview[] = [
    { id: "1", jsaNumber: "JSA-2025-001", jobTitle: "Electrical Panel Maintenance", submittedBy: "John Doe", submitDate: "2025-01-15", priority: "high", riskLevel: "High" },
    { id: "2", jsaNumber: "JSA-2025-003", jobTitle: "Hot Work Operations", submittedBy: "Mike Rodriguez", submitDate: "2025-01-13", priority: "high", riskLevel: "Critical" },
  ];

  const handleApprove = () => {
    toast.success(`${selectedJSA?.jsaNumber} approved and forwarded to L2`);
    setActionDialog(null);
    setSelectedJSA(null);
    setComments("");
  };

  const handleReject = () => {
    if (!comments.trim()) {
      toast.error("Please provide rejection comments");
      return;
    }
    toast.success(`${selectedJSA?.jsaNumber} rejected`);
    setActionDialog(null);
    setSelectedJSA(null);
    setComments("");
  };

  const handleSendBack = () => {
    if (!comments.trim()) {
      toast.error("Please provide feedback for revision");
      return;
    }
    toast.success(`${selectedJSA?.jsaNumber} sent back for revision`);
    setActionDialog(null);
    setSelectedJSA(null);
    setComments("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">L1 Review Queue</h1>
        <p className="text-muted-foreground">Supervisor review and approval</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending L1 Review ({mockReviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Submit Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.jsaNumber}</TableCell>
                  <TableCell>{review.jobTitle}</TableCell>
                  <TableCell>{review.submittedBy}</TableCell>
                  <TableCell>{review.submitDate}</TableCell>
                  <TableCell>
                    <Badge variant={review.riskLevel === "Critical" ? "destructive" : "default"}>
                      {review.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.priority === "high" ? "destructive" : review.priority === "medium" ? "default" : "secondary"}>
                      {review.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(review); setActionDialog("view"); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(review); setActionDialog("approve"); }}>
                        <CheckCircle className="h-4 w-4 text-status-success" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(review); setActionDialog("sendback"); }}>
                        <MessageSquare className="h-4 w-4 text-status-caution" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(review); setActionDialog("reject"); }}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>JSA Review - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <p className="text-sm">{selectedJSA?.jobTitle}</p>
            </div>
            <div>
              <Label>Submitted By</Label>
              <p className="text-sm">{selectedJSA?.submittedBy}</p>
            </div>
            <div>
              <Label>Submit Date</Label>
              <p className="text-sm">{selectedJSA?.submitDate}</p>
            </div>
            <div>
              <Label>Risk Level</Label>
              <p className="text-sm">{selectedJSA?.riskLevel}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === "approve"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve JSA - {selectedJSA?.jsaNumber}</DialogTitle>
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
              <Button onClick={handleApprove}>Approve & Forward to L2</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Back Dialog */}
      <Dialog open={actionDialog === "sendback"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Back for Revision - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sendbackComments">Revision Comments *</Label>
              <Textarea
                id="sendbackComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Provide feedback for revision"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button onClick={handleSendBack}>Send Back</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionDialog === "reject"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject JSA - {selectedJSA?.jsaNumber}</DialogTitle>
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

export default ReviewL1;
