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
import { AssessmentDialog } from "../components/assessments/AssessmentDialog";
import { FilterSearch } from "../components/FilterSearch";

const Assessments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view");
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const assessments = [
    {
      id: "ASM-2024-001",
      name: "Q3 2024 ISO 27001 Internal Audit",
      framework: "ISO 27001:2022",
      assessor: "External Auditor",
      dueDate: "2024-09-30",
      score: "87%",
      status: "completed",
    },
    {
      id: "ASM-2024-002",
      name: "GDPR Compliance Assessment",
      framework: "GDPR",
      assessor: "Sarah Johnson",
      dueDate: "2025-10-15",
      score: "N/A",
      status: "in-progress",
    },
    {
      id: "ASM-2024-003",
      name: "SOX IT Controls Testing Q4 2024",
      framework: "SOX",
      assessor: "Emily Rodriguez",
      dueDate: "2025-12-15",
      score: "N/A",
      status: "planned",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (assessment: any) => {
    setSelectedAssessment(assessment);
    setDialogMode("view");
    setDialogOpen(true);
  };

  const handleEdit = (assessment: any) => {
    setSelectedAssessment(assessment);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedAssessment(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Assessments</h1>
          <p className="text-muted-foreground">Plan and track compliance assessments</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Assessor</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.id}</TableCell>
                  <TableCell>{assessment.name}</TableCell>
                  <TableCell>{assessment.framework}</TableCell>
                  <TableCell>{assessment.assessor}</TableCell>
                  <TableCell>{assessment.dueDate}</TableCell>
                  <TableCell>{assessment.score}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(assessment.status)}>
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(assessment)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(assessment)}>
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

      <AssessmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        assessment={selectedAssessment}
      />
    </div>
  );
};

export default Assessments;
