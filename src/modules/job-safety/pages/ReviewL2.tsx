import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Eye, CheckCircle, XCircle, MessageSquare, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useState } from "react";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

interface JSAApproval {
  id: string;
  jsaNumber: string;
  jobTitle: string;
  submittedBy: string;
  l1Reviewer: string;
  l1ApprovalDate: string;
  riskLevel: string;
}

const ReviewL2 = () => {
  const [selectedJSA, setSelectedJSA] = useState<JSAApproval | null>(null);
  const [actionDialog, setActionDialog] = useState<"view" | "approve" | "reject" | "request" | "signature" | null>(null);
  const [comments, setComments] = useState("");
  const [signature, setSignature] = useState("");

  const mockApprovals: JSAApproval[] = [
    { id: "1", jsaNumber: "JSA-2025-001", jobTitle: "Electrical Panel Maintenance", submittedBy: "John Doe", l1Reviewer: "Sarah Chen", l1ApprovalDate: "2025-01-16", riskLevel: "High" },
    { id: "2", jsaNumber: "JSA-2025-002", jobTitle: "Confined Space Entry", submittedBy: "Sarah Chen", l1Reviewer: "Mike Rodriguez", l1ApprovalDate: "2025-01-15", riskLevel: "Critical" },
  ];

  const handleApprove = () => {
    if (!signature.trim()) {
      toast.error("Digital signature required");
      return;
    }
    toast.success(`${selectedJSA?.jsaNumber} approved - JSA is now active`);
    setActionDialog(null);
    setSelectedJSA(null);
    setComments("");
    setSignature("");
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

  const handleRequestChanges = () => {
    if (!comments.trim()) {
      toast.error("Please specify required changes");
      return;
    }
    toast.success(`Change request sent for ${selectedJSA?.jsaNumber}`);
    setActionDialog(null);
    setSelectedJSA(null);
    setComments("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">L2 Approval Queue</h1>
        <p className="text-muted-foreground">EHS Manager final approval</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending L2 Approval ({mockApprovals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>JSA Number</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>L1 Reviewer</TableHead>
                <TableHead>L1 Approval Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApprovals.map((approval) => (
                <TableRow key={approval.id}>
                  <TableCell className="font-medium">{approval.jsaNumber}</TableCell>
                  <TableCell>{approval.jobTitle}</TableCell>
                  <TableCell>{approval.submittedBy}</TableCell>
                  <TableCell>{approval.l1Reviewer}</TableCell>
                  <TableCell>{approval.l1ApprovalDate}</TableCell>
                  <TableCell>
                    <Badge variant={approval.riskLevel === "Critical" ? "destructive" : "default"}>
                      {approval.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(approval); setActionDialog("view"); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(approval); setActionDialog("signature"); }}>
                        <CheckCircle className="h-4 w-4 text-status-success" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(approval); setActionDialog("request"); }}>
                        <MessageSquare className="h-4 w-4 text-status-caution" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedJSA(approval); setActionDialog("reject"); }}>
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
            <DialogTitle>JSA Approval - {selectedJSA?.jsaNumber}</DialogTitle>
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
              <Label>L1 Reviewer</Label>
              <p className="text-sm">{selectedJSA?.l1Reviewer}</p>
            </div>
            <div>
              <Label>L1 Approval Date</Label>
              <p className="text-sm">{selectedJSA?.l1ApprovalDate}</p>
            </div>
            <div>
              <Label>Risk Level</Label>
              <p className="text-sm">{selectedJSA?.riskLevel}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Digital Signature Approve Dialog */}
      <Dialog open={actionDialog === "signature"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve JSA - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">By signing this JSA, you confirm that:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>All hazards have been properly identified</li>
                <li>Control measures are adequate and appropriate</li>
                <li>Risk levels are acceptable</li>
                <li>Workers are competent to perform the job</li>
              </ul>
            </div>
            <div>
              <Label htmlFor="signature">Digital Signature *</Label>
              <Input
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Type your full name"
              />
            </div>
            <div>
              <Label htmlFor="approveComments">Comments (Optional)</Label>
              <Textarea
                id="approveComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any approval comments"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button onClick={handleApprove}>
                <FileText className="h-4 w-4 mr-2" />
                Approve & Sign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={actionDialog === "request"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes - {selectedJSA?.jsaNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestComments">Required Changes *</Label>
              <Textarea
                id="requestComments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Specify what changes are needed"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
              <Button onClick={handleRequestChanges}>Request Changes</Button>
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

export default ReviewL2;
