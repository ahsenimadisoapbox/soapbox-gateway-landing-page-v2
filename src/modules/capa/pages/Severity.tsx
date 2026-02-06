import { useState } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { mockCapas } from "../data/mockData";
import { AlertCircle, AlertTriangle, Info, Shield } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { StatusBadge } from "../components/capa/StatusBadge";
import { PriorityBadge } from "../components/capa/PriorityBadge";

const Severity = () => {
  const [capas] = useState(mockCapas);

  const severeCapas = capas.filter((c) => c.severity === "severe");
  const majorCapas = capas.filter((c) => c.severity === "major");
  const moderateCapas = capas.filter((c) => c.severity === "moderate");
  const minorCapas = capas.filter((c) => c.severity === "minor");

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CAPA Dashboard by Severity</h1>
          <p className="text-muted-foreground">
            Visualize and manage CAPAs based on severity levels
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Severe
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{severeCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Critical safety/quality impact
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Major</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{majorCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Significant operational impact
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Moderate
              </CardTitle>
              <Info className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moderateCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Moderate impact
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Minor</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{minorCapas.length}</div>
              <p className="text-xs text-muted-foreground">
                Low impact
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Severe CAPAs */}
        {severeCapas.length > 0 && (
          <Card className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Severe Severity CAPAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CAPA ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {severeCapas.map((capa) => (
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
                        {new Date(capa.dueDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Major CAPAs */}
        {majorCapas.length > 0 && (
          <Card className="border-l-4 border-l-warning">
            <CardHeader>
              <CardTitle className="text-warning">
                Major Severity CAPAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CAPA ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {majorCapas.map((capa) => (
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
                        {new Date(capa.dueDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Moderate and Minor CAPAs */}
        <div className="grid gap-4 md:grid-cols-2">
          {moderateCapas.length > 0 && (
            <Card className="border-l-4 border-l-info">
              <CardHeader>
                <CardTitle className="text-info text-lg">
                  Moderate Severity ({moderateCapas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {moderateCapas.map((capa) => (
                    <div
                      key={capa.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{capa.id}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {capa.title}
                        </p>
                      </div>
                      <StatusBadge status={capa.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {minorCapas.length > 0 && (
            <Card className="border-l-4 border-l-success">
              <CardHeader>
                <CardTitle className="text-success text-lg">
                  Minor Severity ({minorCapas.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {minorCapas.map((capa) => (
                    <div
                      key={capa.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium text-sm">{capa.id}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {capa.title}
                        </p>
                      </div>
                      <StatusBadge status={capa.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Severity;
