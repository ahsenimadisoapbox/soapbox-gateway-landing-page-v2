import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/StatusBadge";
import { mockIncidents, mockUsers, Incident, IncidentStatus } from "../lib/mockData";
import { ArrowLeft, Edit, UserPlus, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

export default function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | undefined>(
    mockIncidents.find((inc) => inc.id === id)
  );
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>("NEW");
  const [comment, setComment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [escalationReason, setEscalationReason] = useState("");
  const [resolutionComment, setResolutionComment] = useState("");

  if (!incident) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Incident Not Found</h2>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    if (incident) {
      setIncident({ ...incident, status: newStatus });
      toast.success("Status updated successfully", {
        description: `Incident status changed to ${newStatus}`,
      });
      setUpdateStatusOpen(false);
      setComment("");
    }
  };

  const handleReassign = () => {
    if (incident && selectedUser) {
      const user = mockUsers.find(u => u.id === selectedUser);
      setIncident({ ...incident, assignedTo: user });
      toast.success("Incident reassigned successfully", {
        description: `Assigned to ${user?.name}`,
      });
      setReassignOpen(false);
      setSelectedUser("");
    }
  };

  const handleEscalate = () => {
    if (incident && escalationReason) {
      setIncident({ ...incident, escalationLevel: incident.escalationLevel + 1 });
      toast.warning("Incident escalated", {
        description: `Escalated to Level ${incident.escalationLevel + 1}`,
      });
      setEscalateOpen(false);
      setEscalationReason("");
    }
  };

  const handleResolve = () => {
    if (incident && resolutionComment) {
      setIncident({ ...incident, status: "CLOSED", resolutionDetails: resolutionComment });
      toast.success("Incident resolved", {
        description: "Incident has been marked as resolved",
      });
      setResolveOpen(false);
      setResolutionComment("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{incident.title}</h1>
            <p className="text-muted-foreground">{incident.id}</p>
          </div>
          <StatusBadge status={incident.status} />
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Update Incident Status</DialogTitle>
                <DialogDescription>
                  Change the status of this incident
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>New Status</Label>
                  <Select value={newStatus} onValueChange={(value) => setNewStatus(value as IncidentStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Textarea
                    placeholder="Add a comment about this status change..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleUpdateStatus} className="w-full">
                  Update Status
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="rca">Root Cause Analysis</TabsTrigger>
                <TabsTrigger value="closure">Closure</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Category
                    </h3>
                    <p className="font-semibold">{incident.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Severity
                    </h3>
                    <Badge
                      className={
                        incident.severity === "Critical"
                          ? "bg-destructive text-white"
                          : incident.severity === "High"
                          ? "bg-warning text-white"
                          : incident.severity === "Medium"
                          ? "bg-info text-white"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {incident.severity}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Priority
                    </h3>
                    <p className="font-semibold">{incident.priority}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Site
                    </h3>
                    <p className="font-semibold">{incident.site}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Reported By
                    </h3>
                    <p className="font-semibold">{incident.reportedBy.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Assigned To
                    </h3>
                    <p className="font-semibold">
                      {incident.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed">{incident.description}</p>
                </div>

                {incident.evidence.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Evidence
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {incident.evidence.map((file, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="updates">
                <div className="space-y-4">
                  {incident.updates.length > 0 ? (
                    incident.updates.map((update) => (
                      <Card key={update.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold">{update.user.name}</p>
                            <span className="text-sm text-muted-foreground">
                              {new Date(update.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-primary mb-1">
                            {update.action}
                          </p>
                          {update.comment && (
                            <p className="text-sm text-muted-foreground">
                              {update.comment}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No updates yet
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="rca">
                <div className="space-y-4">
                  {incident.rootCause ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Root Cause</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{incident.rootCause}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Root cause analysis not completed
                      </p>
                      <Button variant="outline">Conduct RCA</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="closure">
                <div className="space-y-4">
                  {incident.status === "CLOSED" ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          Incident Closed
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{incident.resolutionDetails}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Incident not yet closed
                      </p>
                      <Button>Initiate Closure</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SLA Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">SLA Due</p>
                <p className="font-semibold">
                  {new Date(incident.slaDue).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                <p className="font-semibold text-warning">4h 23m</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Escalation Level</p>
                <Badge variant={incident.escalationLevel > 0 ? "destructive" : "outline"}>
                  Level {incident.escalationLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Dialog open={reassignOpen} onOpenChange={setReassignOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Reassign
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Reassign Incident</DialogTitle>
                    <DialogDescription>Select a user to reassign this incident</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Assign To</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {mockUsers.filter(u => u.role !== 'Reporter').map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name} - {user.role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleReassign} className="w-full" disabled={!selectedUser}>
                      Reassign
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={escalateOpen} onOpenChange={setEscalateOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Escalate Incident</DialogTitle>
                    <DialogDescription>Provide reason for escalation</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea
                        placeholder="Why is this incident being escalated?"
                        value={escalationReason}
                        onChange={(e) => setEscalationReason(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleEscalate} className="w-full" disabled={!escalationReason}>
                      Escalate
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Resolve Incident</DialogTitle>
                    <DialogDescription>Provide resolution details</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Resolution Details</Label>
                      <Textarea
                        placeholder="Describe how this incident was resolved..."
                        value={resolutionComment}
                        onChange={(e) => setResolutionComment(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleResolve} className="w-full" disabled={!resolutionComment}>
                      Mark as Resolved
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
