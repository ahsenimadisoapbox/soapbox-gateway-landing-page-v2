import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { mockCapas } from "../data/mockData";
import { CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { Badge } from "../components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const Effectiveness = () => {
  const [capas] = useState(mockCapas);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedCapaId, setSelectedCapaId] = useState<string | null>(null);

  const closedCapas = capas.filter((c) => c.status === "closed");
  const effectiveCount = closedCapas.filter((c) => c.effectiveness === "effective").length;
  const partialCount = closedCapas.filter(
    (c) => c.effectiveness === "partially-effective"
  ).length;
  const notEffectiveCount = closedCapas.filter(
    (c) => c.effectiveness === "not-effective"
  ).length;
  const pendingCount = closedCapas.filter((c) => c.effectiveness === "pending").length;

  const handleReview = (capaId: string) => {
    setSelectedCapaId(capaId);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Effectiveness review submitted successfully");
    setReviewDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Effectiveness Tracker</h1>
          <p className="text-muted-foreground">
            Monitor and evaluate the effectiveness of implemented corrective actions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Effective</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{effectiveCount}</div>
              <p className="text-xs text-muted-foreground">
                {closedCapas.length > 0
                  ? ((effectiveCount / closedCapas.length) * 100).toFixed(1)
                  : 0}
                % of closed CAPAs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Partially Effective
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partialCount}</div>
              <p className="text-xs text-muted-foreground">
                Requires additional actions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Not Effective
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notEffectiveCount}</div>
              <p className="text-xs text-muted-foreground">
                Needs re-evaluation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting validation
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Closed CAPAs - Effectiveness Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CAPA ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Closure Date</TableHead>
                  <TableHead>Effectiveness</TableHead>
                  <TableHead>Verification Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closedCapas.map((capa) => (
                  <TableRow key={capa.id}>
                    <TableCell className="font-medium">{capa.id}</TableCell>
                    <TableCell className="max-w-sm">{capa.title}</TableCell>
                    <TableCell>
                      {capa.closureDate
                        ? new Date(capa.closureDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {capa.effectiveness ? (
                        <Badge
                          className={
                            capa.effectiveness === "effective"
                              ? "bg-success"
                              : capa.effectiveness === "partially-effective"
                              ? "bg-warning"
                              : capa.effectiveness === "not-effective"
                              ? "bg-destructive"
                              : "bg-info"
                          }
                        >
                          {capa.effectiveness.replace("-", " ")}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Reviewed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {capa.verificationNotes || "No notes"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(capa.id)}
                      >
                        {capa.effectiveness ? "Update Review" : "Add Review"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Effectiveness Review</DialogTitle>
            <DialogDescription>
              Evaluate the effectiveness of CAPA {selectedCapaId}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveness">Effectiveness Rating *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="effective">Effective</SelectItem>
                  <SelectItem value="partially-effective">
                    Partially Effective
                  </SelectItem>
                  <SelectItem value="not-effective">Not Effective</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Verification Notes *</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Document your findings and verification evidence..."
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Effectiveness;
