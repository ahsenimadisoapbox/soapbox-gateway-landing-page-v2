import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { mockIncidents } from "../lib/mockData";
import { Search, Eye, AlertTriangle, Clock, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function SLAMonitoring() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate time remaining for each incident
  const getTimeRemaining = (slaDue: string) => {
    const now = new Date();
    const due = new Date(slaDue);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff < 0) return "Breached";
    if (hours < 2) return `${hours}h ${minutes}m (Critical)`;
    return `${hours}h ${minutes}m`;
  };

  const getSLAStatus = (slaDue: string) => {
    const now = new Date();
    const due = new Date(slaDue);
    const diff = due.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (diff < 0) return "breached";
    if (hours < 2) return "at-risk";
    return "on-track";
  };

  const openIncidents = mockIncidents.filter((i) => i.status !== "CLOSED");
  const breachedCount = openIncidents.filter((i) => getSLAStatus(i.slaDue) === "breached").length;
  const atRiskCount = openIncidents.filter((i) => getSLAStatus(i.slaDue) === "at-risk").length;
  const onTrackCount = openIncidents.filter((i) => getSLAStatus(i.slaDue) === "on-track").length;

  const filteredIncidents = openIncidents.filter(
    (incident) =>
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SLA Monitoring</h1>
        <p className="text-muted-foreground">Track SLA deadlines and breaches</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{onTrackCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Meeting SLA requirements
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{atRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Less than 2 hours remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Breached
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{breachedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Past SLA deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SLA Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Incidents</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>SLA Due</TableHead>
                <TableHead>Time Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SLA Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => {
                const slaStatus = getSLAStatus(incident.slaDue);
                const timeRemaining = getTimeRemaining(incident.slaDue);
                
                return (
                  <TableRow key={incident.id} className={slaStatus === "breached" ? "bg-destructive/5" : slaStatus === "at-risk" ? "bg-warning/5" : ""}>
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{incident.assignedTo?.name || "Unassigned"}</TableCell>
                    <TableCell>
                      {new Date(incident.slaDue).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={
                        slaStatus === "breached" ? "text-destructive font-semibold" :
                        slaStatus === "at-risk" ? "text-warning font-semibold" :
                        "text-success"
                      }>
                        {timeRemaining}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          slaStatus === "breached"
                            ? "bg-destructive text-white"
                            : slaStatus === "at-risk"
                            ? "bg-warning text-white"
                            : "bg-success text-white"
                        }
                      >
                        {slaStatus === "breached" ? "Breached" : slaStatus === "at-risk" ? "At Risk" : "On Track"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/incident/incidents/${incident.id}`)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/incident/rca?incident=${incident.id}`)}
                          title="Root Cause Analysis"
                        >
                          <GitBranch className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
