import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Capa } from "../../types/capa";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface CapaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  capa: Capa | null;
}

export function CapaDetailsDialog({
  open,
  onOpenChange,
  capa,
}: CapaDetailsDialogProps) {
  if (!capa) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{capa.id}</span>
            <StatusBadge status={capa.status} />
            <PriorityBadge priority={capa.priority} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="rca">Root Cause</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{capa.title}</h3>
              <p className="text-muted-foreground">{capa.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{capa.type} Action</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Severity</p>
                <Badge variant="outline" className="capitalize">
                  {capa.severity}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{capa.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{capa.department || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{capa.createdByName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CAPA Owner</p>
                <p className="font-medium">{capa.ownerName || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created Date</p>
                <p className="font-medium">
                  {new Date(capa.createdDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {new Date(capa.dueDate).toLocaleDateString()}
                </p>
              </div>
              {capa.linkedIncidentId && (
                <div>
                  <p className="text-sm text-muted-foreground">Linked Incident</p>
                  <p className="font-medium">{capa.linkedIncidentId}</p>
                </div>
              )}
              {capa.closureDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Closure Date</p>
                  <p className="font-medium">
                    {new Date(capa.closureDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capa.actions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No actions defined yet
                    </TableCell>
                  </TableRow>
                ) : (
                  capa.actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium">{action.id}</TableCell>
                      <TableCell>{action.title}</TableCell>
                      <TableCell>{action.assignedToName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {action.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(action.dueDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="rca" className="space-y-4">
            {capa.rootCauseAnalysis ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Methodology</p>
                  <Badge variant="outline" className="capitalize">
                    {capa.rootCauseAnalysis.methodology.replace("-", " ")}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Findings</p>
                  <p className="text-sm">{capa.rootCauseAnalysis.findings}</p>
                </div>

                {capa.rootCauseAnalysis.immediateCorrection && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Immediate Correction
                    </p>
                    <p className="text-sm">
                      {capa.rootCauseAnalysis.immediateCorrection}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Contributing Factors
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {capa.rootCauseAnalysis.contributingFactors.map(
                      (factor, idx) => (
                        <li key={idx} className="text-sm">
                          {factor}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Root cause analysis not completed yet
              </p>
            )}
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-4">
              {capa.auditTrail.map((entry) => (
                <div key={entry.id} className="border-l-2 border-primary pl-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-muted-foreground">
                        by {entry.userName}
                      </p>
                      <p className="text-sm mt-1">{entry.details}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
