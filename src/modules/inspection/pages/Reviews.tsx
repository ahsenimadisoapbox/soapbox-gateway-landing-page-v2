import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { CheckCircle, XCircle, Eye, AlertCircle } from "lucide-react";
import { mockInspections, mockFindings } from "../lib/mockData";
import { StatusBadge } from "../components/inspection/StatusBadge";
import { SeverityBadge } from "../components/inspection/SeverityBadge";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";

const Reviews = () => {
  const { id } = useParams();
  const pendingReviews = mockInspections.filter((i) => i.status.includes("REVIEW"));
  const selectedInspection = id ? mockInspections.find((i) => i.id === id) : null;
  const relatedFindings = selectedInspection
    ? mockFindings.filter((f) => f.inspectionId === selectedInspection.id)
    : [];

  const handleApprove = () => {
    toast.success("Inspection approved successfully!");
  };

  const handleReject = () => {
    toast.success("Inspection returned for rework");
  };

  if (selectedInspection) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Review Inspection: {selectedInspection.id}</h1>
            <p className="text-muted-foreground">{selectedInspection.title}</p>
          </div>
          <StatusBadge status={selectedInspection.status} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site:</span>
                <span className="font-medium">{selectedInspection.site}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Area:</span>
                <span className="font-medium">{selectedInspection.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inspector:</span>
                <span className="font-medium">{selectedInspection.inspector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{selectedInspection.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity:</span>
                <SeverityBadge severity={selectedInspection.severity} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completion:</span>
                <span className="font-medium">{selectedInspection.completionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Findings:</span>
                <Badge variant="outline">{selectedInspection.findingsCount} findings</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Template:</span>
                <span className="font-medium text-sm">{selectedInspection.template}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Related Findings</CardTitle>
            <CardDescription>Issues identified during this inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {relatedFindings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Finding ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedFindings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell className="font-medium">{finding.id}</TableCell>
                      <TableCell>{finding.title}</TableCell>
                      <TableCell>
                        <SeverityBadge severity={finding.severity} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={finding.status} />
                      </TableCell>
                      <TableCell>{finding.assignedTo}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No findings recorded</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
            <CardDescription>Approve or request rework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Review Comments</Label>
              <Textarea placeholder="Enter your review comments..." rows={4} />
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject & Return for Rework
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Inspection</DialogTitle>
                    <DialogDescription>
                      The inspection will be returned to the inspector for rework
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Rejection Reason *</Label>
                      <Textarea placeholder="Explain what needs to be corrected..." rows={4} required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" onClick={handleReject}>
                      Confirm Rejection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Inspection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Inspection</DialogTitle>
                    <DialogDescription>
                      Confirm approval of inspection {selectedInspection.id}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      The inspection will be marked as approved and move to the next stage in the workflow.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleApprove}>Confirm Approval</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">Inspections pending your review and approval</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>Inspections awaiting L1/L2 review</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspection ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Findings</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReviews.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">{inspection.id}</TableCell>
                  <TableCell>{inspection.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={inspection.status} />
                  </TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{inspection.findingsCount} findings</Badge>
                  </TableCell>
                  <TableCell>{inspection.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/inspection/reviews/${inspection.id}`}>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Review
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
