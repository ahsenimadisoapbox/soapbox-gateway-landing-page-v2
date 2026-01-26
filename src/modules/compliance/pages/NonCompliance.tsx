import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { GenericFormDialog } from "../components/shared/GenericFormDialog";
import { FilterSearch } from "../components/FilterSearch";

const NonCompliance = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = [
    {
      id: "NC-2024-001",
      title: "Missing encryption on backup storage",
      severity: "high",
      status: "in-progress",
      dateIdentified: "2024-09-10",
      owner: "Michael Chen",
      linkedObligation: "OBL-2024-002",
    },
    {
      id: "NC-2024-002",
      title: "Incomplete access control documentation",
      severity: "medium",
      status: "open",
      dateIdentified: "2024-09-25",
      owner: "Emily Rodriguez",
      linkedObligation: "OBL-2024-003",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const formFields = [
    { id: "title", label: "Title", type: "text" as const, value: selectedItem?.title },
    { id: "severity", label: "Severity", type: "select" as const, value: selectedItem?.severity, options: ["low", "medium", "high", "critical"] },
    { id: "status", label: "Status", type: "select" as const, value: selectedItem?.status, options: ["open", "in-progress", "resolved"] },
    { id: "owner", label: "Owner", type: "text" as const, value: selectedItem?.owner },
    { id: "dateIdentified", label: "Date Identified", type: "date" as const, value: selectedItem?.dateIdentified },
  ];

  const filterGroups = [
    { label: "Status", options: [{ label: "Open", value: "open", checked: false }, { label: "In Progress", value: "in-progress", checked: false }] },
    { label: "Severity", options: [{ label: "Critical", value: "critical", checked: false }, { label: "High", value: "high", checked: false }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Non-Compliance Management</h1>
          <p className="text-muted-foreground">Track and manage non-compliance issues</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => { setDialogMode("create"); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Non-Compliance
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch searchPlaceholder="Search issues..." filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>All Issues</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Identified</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell><Badge variant="secondary" className={getSeverityColor(item.severity)}>{item.severity}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={getStatusColor(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell>{item.dateIdentified}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setDialogMode("view"); setDialogOpen(true); }}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setDialogMode("edit"); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <GenericFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={dialogMode === "create" ? "New Issue" : dialogMode === "edit" ? "Edit Issue" : "Issue Details"} fields={formFields} mode={dialogMode} />
    </div>
  );
};

export default NonCompliance;
