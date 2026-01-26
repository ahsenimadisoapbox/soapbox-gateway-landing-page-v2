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

const FindingsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const findings = [
    {
      id: "FND-2024-001",
      title: "Missing password complexity requirements",
      audit: "AUD-2024-002",
      severity: "medium",
      status: "open",
      identifiedDate: "2024-09-20",
      owner: "Michael Chen",
    },
    {
      id: "FND-2024-002",
      title: "Incomplete data retention documentation",
      audit: "AUD-2024-001",
      severity: "low",
      status: "resolved",
      identifiedDate: "2024-09-15",
      owner: "Sarah Johnson",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    {
      label: "Severity",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
    {
      label: "Status",
      options: [
        { label: "Open", value: "open", checked: false },
        { label: "In Progress", value: "in-progress", checked: false },
        { label: "Resolved", value: "resolved", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Findings Management</h1>
          <p className="text-muted-foreground">Manage issues identified during audits</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Finding
        </Button>
      </div>

      <FilterSearch
        searchPlaceholder="Search findings..."
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        onFilterChange={setFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Audit</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Identified Date</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {findings.map((finding) => (
                <TableRow key={finding.id}>
                  <TableCell className="font-medium">{finding.id}</TableCell>
                  <TableCell>{finding.title}</TableCell>
                  <TableCell>{finding.audit}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getSeverityColor(finding.severity)}>
                      {finding.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(finding.status)}>
                      {finding.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{finding.identifiedDate}</TableCell>
                  <TableCell>{finding.owner}</TableCell>
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

export default FindingsManagement;
