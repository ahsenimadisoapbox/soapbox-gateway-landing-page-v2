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

const PolicyManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const policies = [
    {
      id: "POL-2024-001",
      title: "Information Security Policy",
      version: "2.1",
      owner: "Michael Chen",
      lastReview: "2024-09-01",
      nextReview: "2025-09-01",
      status: "active",
    },
    {
      id: "POL-2024-002",
      title: "Data Protection Policy",
      version: "1.5",
      owner: "Sarah Johnson",
      lastReview: "2024-08-15",
      nextReview: "2025-08-15",
      status: "under-review",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formFields = [
    { id: "id", label: "Policy ID", type: "text" as const, value: selectedItem?.id },
    { id: "title", label: "Title", type: "text" as const, value: selectedItem?.title },
    { id: "version", label: "Version", type: "text" as const, value: selectedItem?.version },
    { id: "owner", label: "Owner", type: "text" as const, value: selectedItem?.owner },
    { id: "lastReview", label: "Last Review", type: "date" as const, value: selectedItem?.lastReview },
    { id: "nextReview", label: "Next Review", type: "date" as const, value: selectedItem?.nextReview },
    { id: "status", label: "Status", type: "select" as const, value: selectedItem?.status, options: ["active", "under-review", "draft", "archived"] },
  ];

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: false },
        { label: "Under Review", value: "under-review", checked: false },
        { label: "Draft", value: "draft", checked: false },
        { label: "Archived", value: "archived", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Policy Management</h1>
          <p className="text-muted-foreground">Manage compliance policies and procedures</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => { setDialogMode("create"); setSelectedItem(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button>
      </div>

      <FilterSearch
        searchPlaceholder="Search policies..."
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        onFilterChange={setFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Last Review</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.id}</TableCell>
                  <TableCell>{policy.title}</TableCell>
                  <TableCell>{policy.version}</TableCell>
                  <TableCell>{policy.owner}</TableCell>
                  <TableCell>{policy.lastReview}</TableCell>
                  <TableCell>{policy.nextReview}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(policy); setDialogMode("view"); setDialogOpen(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(policy); setDialogMode("edit"); setDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <GenericFormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Policy" fields={formFields} mode={dialogMode} />
    </div>
  );
};

export default PolicyManagement;
