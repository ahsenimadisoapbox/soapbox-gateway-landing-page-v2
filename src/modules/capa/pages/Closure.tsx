import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { mockCapas } from "../data/mockData";
import { CheckCircle2, FileCheck, XCircle, Clock } from "lucide-react";
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
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";

const Closure = () => {
  const [capas] = useState(mockCapas);
  const [closureDialogOpen, setClosureDialogOpen] = useState(false);
  const [selectedCapaId, setSelectedCapaId] = useState<string | null>(null);

  const pendingClosure = capas.filter(
    (c) => c.status === "pending-review" || c.status === "in-progress"
  );
  const closedCapas = capas.filter((c) => c.status === "closed");

  const handleInitiateClosure = (capaId: string) => {
    setSelectedCapaId(capaId);
    setClosureDialogOpen(true);
  };

  const handleClosureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`CAPA ${selectedCapaId} closed successfully`);
    setClosureDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Closure</h1>
          <p className="text-muted-foreground">
            Verify and close completed CAPA activities
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Closure
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClosure.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Closed This Month
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{closedCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Closure Rate
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((closedCapas.length / capas.length) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Of total CAPAs
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CAPAs Ready for Closure</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions Completed</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingClosure.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No CAPAs pending closure
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingClosure.map((capa) => {
                    const completedActions = capa.actions.filter(
                      (a) => a.status === "completed" || a.status === "verified"
                    ).length;
                    const totalActions = capa.actions.length;

                    return (
                      <TableRow key={capa.id}>
                        <TableCell className="font-medium">{capa.id}</TableCell>
                        <TableCell className="max-w-md">{capa.title}</TableCell>
                        <TableCell>
                          <StatusBadge status={capa.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={capa.priority} />
                        </TableCell>
                        <TableCell>
                          {completedActions} / {totalActions}
                        </TableCell>
                        <TableCell>
                          {new Date(capa.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInitiateClosure(capa.id)}
                            disabled={completedActions !== totalActions}
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            Close CAPA
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recently Closed CAPAs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Closure Date</TableHead>
                  <TableHead>Effectiveness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedCapas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No closed CAPAs
                    </TableCell>
                  </TableRow>
                ) : (
                  closedCapas.map((capa) => (
                    <TableRow key={capa.id}>
                      <TableCell className="font-medium">{capa.id}</TableCell>
                      <TableCell className="max-w-md">{capa.title}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={capa.priority} />
                      </TableCell>
                      <TableCell>
                        {capa.closureDate
                          ? new Date(capa.closureDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {capa.effectiveness === "effective" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : capa.effectiveness === "not-effective" ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <Clock className="h-4 w-4 text-warning" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={closureDialogOpen} onOpenChange={setClosureDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Close CAPA</DialogTitle>
            <DialogDescription>
              Verify all closure criteria and document final validation for CAPA{" "}
              {selectedCapaId}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleClosureSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Closure Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check1" required />
                  <label htmlFor="check1" className="text-sm">
                    All corrective/preventive actions completed
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check2" required />
                  <label htmlFor="check2" className="text-sm">
                    Root cause analysis documented
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check3" required />
                  <label htmlFor="check3" className="text-sm">
                    Evidence of completion uploaded
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check4" required />
                  <label htmlFor="check4" className="text-sm">
                    Stakeholder verification completed
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closureNotes">Closure Notes *</Label>
              <Textarea
                id="closureNotes"
                rows={4}
                placeholder="Document final verification, lessons learned, and any recommendations..."
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setClosureDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Close CAPA</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Closure;
