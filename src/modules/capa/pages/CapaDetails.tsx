import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { StatusBadge } from "../components/capa/StatusBadge";
import { PriorityBadge } from "../components/capa/PriorityBadge";
import { CapaDetailsDialog } from "../components/capa/CapaDetailsDialog";
import { mockCapas } from "../data/mockData";
import { Capa } from "../types/capa";
import { Eye, Plus, FileText } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

const CapaDetails = () => {
  const [capas] = useState<Capa[]>(mockCapas);
  const [selectedCapa, setSelectedCapa] = useState<Capa | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

  const handleView = (capa: Capa) => {
    setSelectedCapa(capa);
    setViewDialogOpen(true);
  };

  const handleAddAction = (capa: Capa) => {
    setSelectedCapa(capa);
    setActionDialogOpen(true);
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Action added successfully");
    setActionDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Details</h1>
          <p className="text-muted-foreground">
            Detailed view and management of CAPA records
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All CAPA Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Actions Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capas.map((capa) => (
                  <TableRow key={capa.id}>
                    <TableCell className="font-medium">{capa.id}</TableCell>
                    <TableCell className="max-w-md">{capa.title}</TableCell>
                    <TableCell className="capitalize">{capa.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={capa.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={capa.priority} />
                    </TableCell>
                    <TableCell>{capa.ownerName || "Unassigned"}</TableCell>
                    <TableCell>{capa.actions.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(capa)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddAction(capa)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Action
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

      <CapaDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        capa={selectedCapa}
      />

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Action</DialogTitle>
            <DialogDescription>
              Add a new action item to CAPA {selectedCapa?.id}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleActionSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="actionTitle">Action Title *</Label>
              <Input id="actionTitle" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionDescription">Description *</Label>
              <Textarea id="actionDescription" rows={3} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionDue">Due Date *</Label>
              <Input id="actionDue" type="date" required />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Action</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CapaDetails;
