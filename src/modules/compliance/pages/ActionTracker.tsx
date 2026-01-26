import { useState } from "react";
import { Plus, Eye, Edit } from "lucide-react";
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

const ActionTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const actions = [
    {
      id: "ACT-2024-001",
      title: "Update password policy documentation",
      relatedTo: "FND-2024-001",
      owner: "Michael Chen",
      dueDate: "2025-10-15",
      priority: "high",
      status: "in-progress",
    },
    {
      id: "ACT-2024-002",
      title: "Complete data retention procedures",
      relatedTo: "FND-2024-002",
      owner: "Sarah Johnson",
      dueDate: "2025-09-30",
      priority: "medium",
      status: "completed",
    },
    {
      id: "ACT-2024-003",
      title: "Implement backup encryption",
      relatedTo: "NC-2024-001",
      owner: "David Kim",
      dueDate: "2025-11-01",
      priority: "critical",
      status: "pending",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterGroups = [
    {
      label: "Priority",
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
        { label: "Pending", value: "pending", checked: false },
        { label: "In Progress", value: "in-progress", checked: false },
        { label: "Completed", value: "completed", checked: false },
        { label: "Overdue", value: "overdue", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Action Tracker</h1>
          <p className="text-muted-foreground">Monitor action items and tasks</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Action
        </Button>
      </div>

      <FilterSearch
        searchPlaceholder="Search actions..."
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        onFilterChange={setFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium">{action.id}</TableCell>
                  <TableCell>{action.title}</TableCell>
                  <TableCell>{action.relatedTo}</TableCell>
                  <TableCell>{action.owner}</TableCell>
                  <TableCell>{action.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getPriorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(action.status)}>
                      {action.status}
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

export default ActionTracker;
