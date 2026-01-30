import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [viewJSA, setViewJSA] = useState<any>(null);
  const [deleteJSA, setDeleteJSA] = useState<any>(null);
  const [jsaList, setJsaList] = useState([
    { id: "JSA-2024-001", title: "Electrical Panel Maintenance", site: "Plant A", status: "Pending L1", risk: "High", date: "2024-01-15" },
    { id: "JSA-2024-002", title: "Confined Space Entry", site: "Plant B", status: "Active", risk: "Critical", date: "2024-01-14" },
    { id: "JSA-2024-003", title: "Roof Work Assessment", site: "Warehouse", status: "Completed", risk: "Medium", date: "2024-01-13" },
    { id: "JSA-2024-004", title: "Chemical Handling", site: "Lab", status: "Pending L2", risk: "High", date: "2024-01-12" },
  ]);

  const stats = [
    { title: "Total JSAs", value: "47", icon: FileText, color: "text-primary" },
    { title: "Pending Review", value: "8", icon: Clock, color: "text-warning" },
    { title: "Active", value: "12", icon: AlertCircle, color: "text-info" },
    { title: "Completed", value: "27", icon: CheckCircle, color: "text-success" },
  ];

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      Low: "bg-success/10 text-success",
      Medium: "bg-warning/10 text-warning",
      High: "bg-destructive/10 text-destructive",
      Critical: "bg-destructive text-destructive-foreground",
    };
    return variants[risk] || variants.Medium;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Pending L1": "bg-warning/10 text-warning",
      "Pending L2": "bg-warning/10 text-warning",
      Active: "bg-info/10 text-info",
      Completed: "bg-success/10 text-success",
    };
    return variants[status] || "bg-muted text-muted-foreground";
  };

  const handleEdit = (jsa: any) => {
    navigate(`/edit-jsa?id=${jsa.id}`);
  };

  const handleDelete = () => {
    if (deleteJSA) {
      setJsaList(jsaList.filter(jsa => jsa.id !== deleteJSA.id));
      toast.success(`JSA ${deleteJSA.id} deleted successfully`);
      setDeleteJSA(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">JSA Dashboard</h1>
          <p className="text-muted-foreground">Job Safety Analysis Overview</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/create-jsa")}>
          <FileText className="mr-2 h-4 w-4" />
          Create New JSA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent JSAs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent JSAs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">JSA ID</th>
                  <th className="text-left p-3 font-medium">Title</th>
                  <th className="text-left p-3 font-medium">Site</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Risk Level</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jsaList.map((jsa) => (
                  <tr key={jsa.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{jsa.id}</td>
                    <td className="p-3">{jsa.title}</td>
                    <td className="p-3">{jsa.site}</td>
                    <td className="p-3">
                      <Badge className={getStatusBadge(jsa.status)}>{jsa.status}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getRiskBadge(jsa.risk)}>{jsa.risk}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{jsa.date}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewJSA(jsa)}
                          title="View JSA"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(jsa)}
                          title="Edit JSA"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteJSA(jsa)}
                          title="Delete JSA"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View JSA Dialog */}
      <Dialog open={!!viewJSA} onOpenChange={() => setViewJSA(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View JSA - {viewJSA?.id}</DialogTitle>
          </DialogHeader>
          {viewJSA && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>JSA ID</Label>
                  <Input value={viewJSA.id} readOnly />
                </div>
                <div>
                  <Label>Site</Label>
                  <Input value={viewJSA.site} readOnly />
                </div>
                <div className="col-span-2">
                  <Label>Title</Label>
                  <Input value={viewJSA.title} readOnly />
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusBadge(viewJSA.status)}>{viewJSA.status}</Badge>
                </div>
                <div>
                  <Label>Risk Level</Label>
                  <Badge className={getRiskBadge(viewJSA.risk)}>{viewJSA.risk}</Badge>
                </div>
                <div className="col-span-2">
                  <Label>Date</Label>
                  <Input value={viewJSA.date} readOnly />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteJSA} onOpenChange={() => setDeleteJSA(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete JSA</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteJSA?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteJSA(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
