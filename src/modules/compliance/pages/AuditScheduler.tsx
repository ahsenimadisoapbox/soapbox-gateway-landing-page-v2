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
import { FilterSearch } from "../components/FilterSearch";

const AuditScheduler = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const audits = [
    {
      id: "AUD-2024-001",
      name: "Q4 Internal Audit - ISO 27001",
      auditor: "External Auditor",
      scheduledDate: "2025-12-01",
      duration: "3 days",
      type: "internal",
      status: "scheduled",
    },
    {
      id: "AUD-2024-002",
      name: "GDPR Compliance Audit",
      auditor: "Sarah Johnson",
      scheduledDate: "2025-11-15",
      duration: "2 days",
      type: "internal",
      status: "in-progress",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Scheduled", value: "scheduled", checked: false },
        { label: "In Progress", value: "in-progress", checked: false },
        { label: "Completed", value: "completed", checked: false },
      ],
    },
    {
      label: "Type",
      options: [
        { label: "Internal", value: "internal", checked: false },
        { label: "External", value: "external", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Scheduler</h1>
          <p className="text-muted-foreground">Schedule and track compliance audits</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Audit
        </Button>
      </div>

      <FilterSearch
        searchPlaceholder="Search audits..."
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        onFilterChange={setFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Auditor</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.id}</TableCell>
                  <TableCell>{audit.name}</TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell>{audit.scheduledDate}</TableCell>
                  <TableCell>{audit.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{audit.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(audit.status)}>
                      {audit.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
    </div>
  );
};

export default AuditScheduler;
