import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ComplianceClauseDialog } from "../components/compliance/ComplianceClauseDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceClause = {
  clauseId: string;
  regulationId: string;
  parentId: string | null;
  clauseCode: string;
  title: string;
  clauseText: string;
  levelNo: number;
};

const ComplianceRegulationClauses = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedClause, setSelectedClause] = useState<ComplianceClause | null>(null);

  const clauses: ComplianceClause[] = [
    {
      clauseId: "CLS-001",
      regulationId: "REG-001",
      parentId: null,
      clauseCode: "6.1",
      title: "Lawful Basis for Processing",
      clauseText: "Processing shall be lawful only if and to the extent that at least one of the following applies: consent, contract, legal obligation, vital interests, public task, or legitimate interests.",
      levelNo: 1,
    },
    {
      clauseId: "CLS-002",
      regulationId: "REG-001",
      parentId: "CLS-001",
      clauseCode: "6.1.a",
      title: "Consent",
      clauseText: "The data subject has given consent to the processing of his or her personal data for one or more specific purposes.",
      levelNo: 2,
    },
    {
      clauseId: "CLS-003",
      regulationId: "REG-002",
      parentId: null,
      clauseCode: "164.308(a)(1)",
      title: "Security Management Process",
      clauseText: "Implement policies and procedures to prevent, detect, contain, and correct security violations.",
      levelNo: 1,
    },
  ];

  const handleView = (clause: ComplianceClause) => {
    setSelectedClause(clause);
    setDialogMode("view");
  };

  const handleEdit = (clause: ComplianceClause) => {
    setSelectedClause(clause);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedClause(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Level",
      options: [
        { label: "Level 1", value: "1", checked: false },
        { label: "Level 2", value: "2", checked: false },
        { label: "Level 3", value: "3", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulation Clauses</h1>
          <p className="text-muted-foreground">Manage hierarchical clauses and subclauses</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Clause
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search clauses..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clause Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Clause Text</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clauses.map((clause) => (
              <TableRow key={clause.clauseId}>
                <TableCell className="font-medium">{clause.clauseCode}</TableCell>
                <TableCell>{clause.title}</TableCell>
                <TableCell>Level {clause.levelNo}</TableCell>
                <TableCell className="max-w-md truncate">{clause.clauseText}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(clause)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(clause)}
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

      <ComplianceClauseDialog
        mode={dialogMode}
        clause={selectedClause}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceRegulationClauses;
