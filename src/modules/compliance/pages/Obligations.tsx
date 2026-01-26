import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Plus, ClipboardCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ObligationDialog } from "../components/obligations/ObligationDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type Obligation = {
  id: string;
  title: string;
  framework: string;
  owner: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "compliant" | "at-risk" | "pending" | "overdue";
};

const Obligations = () => {
  const navigate = useNavigate();
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  const handleStartAssessment = (obligationId: string) => {
    navigate(`/assessment/obligation/${obligationId}`);
  };

  const obligations: Obligation[] = [
    {
      id: "OBL-2024-001",
      title: "Annual GDPR Data Protection Impact Assessment",
      framework: "GDPR",
      owner: "Sarah Johnson",
      dueDate: "15-10-2025",
      priority: "high",
      status: "at-risk",
    },
    {
      id: "OBL-2024-002",
      title: "ISO 27001 Information Security Review",
      framework: "ISO 27001",
      owner: "Mike Rodriguez",
      dueDate: "20-11-2025",
      priority: "medium",
      status: "compliant",
    },
    {
      id: "OBL-2024-003",
      title: "SOX Financial Controls Assessment",
      framework: "SOX",
      owner: "Jennifer Walsh",
      dueDate: "05-12-2025",
      priority: "critical",
      status: "pending",
    },
    {
      id: "OBL-2024-004",
      title: "OSHA Workplace Safety Audit",
      framework: "OSHA",
      owner: "David Kim",
      dueDate: "01-09-2024",
      priority: "critical",
      status: "overdue",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "at-risk": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "pending": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "overdue": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDialogMode("view");
  };

  const handleEdit = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedObligation(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Compliant", value: "compliant", checked: false },
        { label: "At Risk", value: "at-risk", checked: false },
        { label: "Pending", value: "pending", checked: false },
        { label: "Overdue", value: "overdue", checked: false },
      ],
    },
    {
      label: "Priority",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligations</h1>
          <p className="text-muted-foreground">Manage compliance obligations</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Obligation
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search obligations..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligations.map((obligation) => (
              <TableRow key={obligation.id}>
                <TableCell className="font-medium">{obligation.id}</TableCell>
                <TableCell>{obligation.title}</TableCell>
                <TableCell>{obligation.framework}</TableCell>
                <TableCell>{obligation.owner}</TableCell>
                <TableCell>{obligation.dueDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(obligation.priority)}>
                    {obligation.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(obligation.status)}>
                    {obligation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartAssessment(obligation.id)}
                      title="Start Assessment"
                    >
                      <ClipboardCheck className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(obligation)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(obligation)}
                    >
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
      </div>

      <ObligationDialog
        mode={dialogMode}
        obligation={selectedObligation}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default Obligations;
