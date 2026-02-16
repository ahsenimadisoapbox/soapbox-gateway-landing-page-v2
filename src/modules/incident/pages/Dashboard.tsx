import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { StatusBadge } from "../components/StatusBadge";
import { mockIncidents } from "../lib/mockData";
import { Plus, Search, Eye, UserPlus, TrendingUp, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const totalIncidents = mockIncidents.length;
  const openIncidents = mockIncidents.filter((i) => i.status !== "CLOSED").length;
  const closedIncidents = mockIncidents.filter((i) => i.status === "CLOSED").length;
  const slaBreaches = 0;

  const categoryData = [
    { name: "Safety", value: mockIncidents.filter((i) => i.category === "Safety").length, color: "#3D9970" },
    { name: "Security", value: mockIncidents.filter((i) => i.category === "Security").length, color: "#3B82F6" },
    { name: "IT", value: mockIncidents.filter((i) => i.category === "IT").length, color: "#F59E0B" },
    { name: "Other", value: mockIncidents.filter((i) => i.category === "Other").length, color: "#8B5CF6" },
  ];

  const severityData = [
    { name: "Low", count: mockIncidents.filter((i) => i.severity === "Low").length },
    { name: "Medium", count: mockIncidents.filter((i) => i.severity === "Medium").length },
    { name: "High", count: mockIncidents.filter((i) => i.severity === "High").length },
    { name: "Critical", count: mockIncidents.filter((i) => i.severity === "Critical").length },
  ];

  const filteredIncidents = mockIncidents.filter((incident) =>
    incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your incident overview</p>
        </div>
        <Button onClick={() => navigate("/incident/incidents/new")} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Incident
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{openIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{closedIncidents}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SLA Breaches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{slaBreaches}</div>
            <p className="text-xs text-muted-foreground mt-1">Immediate action needed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {mockIncidents.filter((i) => i.status === "NEW").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Incident Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Incidents</CardTitle>
            <div className="flex items-center gap-2">
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Reported Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'Critical' ? 'bg-destructive/10 text-destructive' :
                      incident.severity === 'High' ? 'bg-warning/10 text-warning' :
                      incident.severity === 'Medium' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {incident.severity}
                    </span>
                  </TableCell>
                  <TableCell>{incident.priority}</TableCell>
                  <TableCell>
                    <StatusBadge status={incident.status} />
                  </TableCell>
                  <TableCell>{incident.assignedTo?.name || "Unassigned"}</TableCell>
                  <TableCell>{new Date(incident.reportedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/incident/incidents/${incident.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
