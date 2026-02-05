import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Eye, Edit, Plus, Search } from "lucide-react";
import { StatusBadge } from "../components/inspection/StatusBadge";
import { useNavigate } from "react-router-dom";

const CAPA = () => {
  const navigate = useNavigate();
  
  // Mock CAPA data
  const capaRecords = [
    { id: "CAPA-045", title: "Update employee training records", finding: "FND-002", status: "IN_PROGRESS", owner: "Jennifer Walsh", dueDate: "2025-11-12", priority: "CRITICAL" },
    { id: "CAPA-047", title: "Implement proper waste segregation procedures", finding: "FND-004", status: "PENDING_VERIFICATION", owner: "David Kim", dueDate: "2025-11-10", priority: "HIGH" },
    { id: "CAPA-048", title: "Replace missing fire extinguisher", finding: "FND-001", status: "OPEN", owner: "Mike Rodriguez", dueDate: "2025-11-18", priority: "HIGH" },
    { id: "CAPA-049", title: "Clear emergency exit obstruction", finding: "FND-003", status: "ACTIONED", owner: "Sarah Chen", dueDate: "2025-11-14", priority: "CRITICAL" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CAPA Management</h1>
          <p className="text-muted-foreground">Corrective and Preventive Actions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create CAPA
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Open CAPAs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Currently being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting closure verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground mt-1">Past due date</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CAPA Records</CardTitle>
          <CardDescription>All corrective and preventive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search CAPAs..." className="pl-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CAPA ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Linked Finding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capaRecords.map((capa) => (
                <TableRow key={capa.id}>
                  <TableCell className="font-medium">{capa.id}</TableCell>
                  <TableCell>{capa.title}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      {capa.finding}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={capa.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={capa.priority === "CRITICAL" ? "destructive" : "outline"}>
                      {capa.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{capa.owner}</TableCell>
                  <TableCell>{capa.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/capa/${capa.id}/view`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/capa/${capa.id}/edit`)}>
                        <Edit className="h-4 w-4" />
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
};

export default CAPA;
