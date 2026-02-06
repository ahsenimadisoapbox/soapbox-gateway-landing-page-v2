import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { mockCapas, mockUsers } from "../data/mockData";
import { Calendar, Users, Target, Plus } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const CapaPlanning = () => {
  const [capas] = useState(mockCapas);
  const [users] = useState(mockUsers);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  const openCapas = capas.filter((c) => c.status === "open" || c.status === "in-progress");

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("CAPA plan created successfully");
    setPlanDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CAPA Planning</h1>
            <p className="text-muted-foreground">
              Plan and schedule CAPA activities and resource allocation
            </p>
          </div>
          <Button onClick={() => setPlanDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Action Plan
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active CAPAs
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Requiring action planning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for assignment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scheduled Actions
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {capas.reduce((sum, c) => sum + c.actions.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total action items
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CAPAs Requiring Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openCapas.map((capa) => (
                <div
                  key={capa.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{capa.id}</span>
                      <Badge variant="outline" className="capitalize">
                        {capa.type}
                      </Badge>
                      <Badge
                        className={
                          capa.priority === "critical" || capa.priority === "high"
                            ? "bg-destructive"
                            : "bg-warning"
                        }
                      >
                        {capa.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{capa.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Owner: {capa.ownerName || "Unassigned"}</span>
                      <span>
                        Due: {new Date(capa.dueDate).toLocaleDateString()}
                      </span>
                      <span>Actions: {capa.actions.length}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Plan Actions
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Action Plan</DialogTitle>
            <DialogDescription>
              Define action items and assign responsibilities
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlanSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capaSelect">Select CAPA *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a CAPA" />
                </SelectTrigger>
                <SelectContent>
                  {openCapas.map((capa) => (
                    <SelectItem key={capa.id} value={capa.id}>
                      {capa.id} - {capa.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionTitle">Action Title *</Label>
              <Input id="actionTitle" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionDesc">Action Description *</Label>
              <Textarea id="actionDesc" rows={3} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" required />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPlanDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CapaPlanning;
