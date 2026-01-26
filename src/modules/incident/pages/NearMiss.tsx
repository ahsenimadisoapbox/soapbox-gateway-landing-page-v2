import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Plus, Eye, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface NearMiss {
  id: string;
  title: string;
  category: string;
  severity: string;
  site: string;
  reportedBy: string;
  reportedDate: string;
  description: string;
  preventiveAction: string;
  status: "Open" | "Under Review" | "Closed";
}

export default function NearMiss() {
  const [nearMisses, setNearMisses] = useState<NearMiss[]>([
    {
      id: "NM-2024-001",
      title: "Loose Cable in Walkway",
      category: "Safety",
      severity: "Medium",
      site: "Building A - Floor 2",
      reportedBy: "John Doe",
      reportedDate: "2024-01-14",
      description: "Cable was spotted lying across walkway, could have caused trip hazard",
      preventiveAction: "Cable secured and walkway inspected",
      status: "Closed",
    },
    {
      id: "NM-2024-002",
      title: "Unauthorized Door Access Attempt",
      category: "Security",
      severity: "High",
      site: "Building B - Server Room",
      reportedBy: "Sarah Chen",
      reportedDate: "2024-01-15",
      description: "Badge swipe detected on wrong access level, caught before entry",
      preventiveAction: "Badge permissions reviewed",
      status: "Under Review",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNearMiss, setSelectedNearMiss] = useState<NearMiss | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Safety",
    severity: "Low",
    site: "",
    description: "",
    preventiveAction: "",
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    const newNearMiss: NearMiss = {
      id: `NM-2024-${String(nearMisses.length + 1).padStart(3, '0')}`,
      ...formData,
      reportedBy: "Current User",
      reportedDate: new Date().toISOString().split('T')[0],
      status: "Open",
    };

    setNearMisses([...nearMisses, newNearMiss]);
    toast.success("Near-miss reported successfully");
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Safety",
      severity: "Low",
      site: "",
      description: "",
      preventiveAction: "",
    });
  };

  const handleView = (nearMiss: NearMiss) => {
    setSelectedNearMiss(nearMiss);
    setViewOpen(true);
  };

  const categoryData = [
    { name: "Safety", value: nearMisses.filter(nm => nm.category === "Safety").length, color: "#3D9970" },
    { name: "Security", value: nearMisses.filter(nm => nm.category === "Security").length, color: "#3B82F6" },
    { name: "IT", value: nearMisses.filter(nm => nm.category === "IT").length, color: "#F59E0B" },
    { name: "Other", value: nearMisses.filter(nm => nm.category === "Other").length, color: "#8B5CF6" },
  ];

  const severityData = [
    { name: "Low", count: nearMisses.filter(nm => nm.severity === "Low").length },
    { name: "Medium", count: nearMisses.filter(nm => nm.severity === "Medium").length },
    { name: "High", count: nearMisses.filter(nm => nm.severity === "High").length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Near-Miss Tracking</h1>
          <p className="text-muted-foreground">Report and track near-miss incidents</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Near-Miss
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Near-Miss Incident</DialogTitle>
              <DialogDescription>Capture details of a near-miss event</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the near-miss"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity *</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Site/Location</Label>
                  <Input
                    value={formData.site}
                    onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                    placeholder="e.g., Building A"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What happened? What could have occurred?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Preventive Action Taken</Label>
                <Textarea
                  value={formData.preventiveAction}
                  onChange={(e) => setFormData({ ...formData, preventiveAction: e.target.value })}
                  placeholder="What was done to prevent recurrence?"
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Submit Near-Miss Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Near-Misses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{nearMisses.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {nearMisses.filter(nm => nm.status === "Open").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {nearMisses.filter(nm => nm.status === "Under Review").length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {nearMisses.filter(nm => nm.status === "Closed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Near-Miss by Category</CardTitle>
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
            <CardTitle className="text-lg">Near-Miss by Severity</CardTitle>
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Near-Miss Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nearMisses.map((nearMiss) => (
                <TableRow key={nearMiss.id}>
                  <TableCell className="font-medium">{nearMiss.id}</TableCell>
                  <TableCell>{nearMiss.title}</TableCell>
                  <TableCell>{nearMiss.category}</TableCell>
                  <TableCell>
                    <Badge variant={
                      nearMiss.severity === "High" ? "destructive" :
                      nearMiss.severity === "Medium" ? "default" : "outline"
                    }>
                      {nearMiss.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>{nearMiss.site}</TableCell>
                  <TableCell>{nearMiss.reportedBy}</TableCell>
                  <TableCell>{new Date(nearMiss.reportedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      nearMiss.status === "Closed" ? "default" :
                      nearMiss.status === "Under Review" ? "secondary" : "outline"
                    }>
                      {nearMiss.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleView(nearMiss)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNearMiss?.id} - {selectedNearMiss?.title}</DialogTitle>
          </DialogHeader>
          {selectedNearMiss && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{selectedNearMiss.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Severity</Label>
                  <p className="font-medium">{selectedNearMiss.severity}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Site</Label>
                  <p className="font-medium">{selectedNearMiss.site}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge>{selectedNearMiss.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedNearMiss.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Preventive Action</Label>
                <p className="text-sm mt-1">{selectedNearMiss.preventiveAction || "None specified"}</p>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Reported by: {selectedNearMiss.reportedBy}</span>
                <span>{new Date(selectedNearMiss.reportedDate).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
