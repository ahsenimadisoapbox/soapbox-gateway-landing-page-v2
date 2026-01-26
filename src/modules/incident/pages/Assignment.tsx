import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { mockIncidents, mockUsers } from "../lib/mockData";
import { UserPlus, Users, Zap } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Assignment() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [assignedIncidentIds, setAssignedIncidentIds] = useState<string[]>([]);

  const unassignedIncidents = mockIncidents.filter(
    (i) => !i.assignedTo && i.status !== "CLOSED" && !assignedIncidentIds.includes(i.id)
  );

  // Calculate workload per user
  const workloadData = mockUsers.map((user) => ({
    name: user.name,
    count: mockIncidents.filter((i) => i.assignedTo?.id === user.id && i.status !== "CLOSED").length,
  }));

  const handleAssign = () => {
    if (selectedIncident && selectedUser) {
      const user = mockUsers.find((u) => u.id === selectedUser);
      
      // Add to assigned incidents list to remove from unassigned
      setAssignedIncidentIds([...assignedIncidentIds, selectedIncident]);
      
      toast.success("Incident assigned successfully", {
        description: `Assigned to ${user?.name}`,
      });
      setAssignDialogOpen(false);
      setSelectedIncident("");
      setSelectedUser("");
    }
  };

  const handleAutoAssign = () => {
    // Mark all unassigned incidents as assigned
    const unassignedIds = unassignedIncidents.map(i => i.id);
    setAssignedIncidentIds([...assignedIncidentIds, ...unassignedIds]);
    
    toast.success("Auto-assignment completed", {
      description: `${unassignedIds.length} incidents distributed evenly across team members`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Assignment</h1>
          <p className="text-muted-foreground">Manage incident assignments to team members</p>
        </div>
        <Button onClick={handleAutoAssign} variant="outline">
          <Zap className="h-4 w-4 mr-2" />
          Auto-Assign All
        </Button>
      </div>

      {/* Workload Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Workload Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workloadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Unassigned Incidents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Unassigned Incidents ({unassignedIncidents.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {unassignedIncidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>All incidents are assigned</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassignedIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.severity === "Critical"
                            ? "bg-destructive/10 text-destructive"
                            : incident.severity === "High"
                            ? "bg-warning/10 text-warning"
                            : incident.severity === "Medium"
                            ? "bg-info/10 text-info"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </TableCell>
                    <TableCell>{incident.priority}</TableCell>
                    <TableCell>
                      <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={assignDialogOpen && selectedIncident === incident.id}
                        onOpenChange={(open) => {
                          setAssignDialogOpen(open);
                          if (open) setSelectedIncident(incident.id);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card">
                          <DialogHeader>
                            <DialogTitle>Assign Incident</DialogTitle>
                            <DialogDescription>
                              Assign {incident.id} to a team member
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Select Team Member</Label>
                              <Select
                                value={selectedUser}
                                onValueChange={setSelectedUser}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a user" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                  {mockUsers.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.role})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button onClick={handleAssign} className="w-full">
                              Assign to User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
