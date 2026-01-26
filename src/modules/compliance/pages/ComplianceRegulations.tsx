import { useState } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
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
import { ComplianceRegulationDialog } from "../components/compliance/ComplianceRegulationDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceRegulation = {
  regulationId: string;
  frameworkId: string;
  domainId: string;
  code: string;
  title: string;
  description: string;
  version: string;
  status: "DRAFT" | "ACTIVE" | "WITHDRAWN" | "SUPERSEDED" | "ARCHIVED";
  effectiveDate: string;
  jurisdiction: string;
  isCurrent: boolean;
};

const ComplianceRegulations = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<ComplianceRegulation | null>(null);

  const regulations: ComplianceRegulation[] = [
    {
      regulationId: "REG-001",
      frameworkId: "FWK-001",
      domainId: "DOM-001",
      code: "GDPR-ART-6",
      title: "Article 6 - Lawfulness of Processing",
      description: "Processing shall be lawful only if and to the extent that at least one of the legal bases applies.",
      version: "1.0",
      status: "ACTIVE",
      effectiveDate: "2018-05-25",
      jurisdiction: "EU",
      isCurrent: true,
    },
    {
      regulationId: "REG-002",
      frameworkId: "FWK-002",
      domainId: "DOM-003",
      code: "HIPAA-164.308",
      title: "Administrative Safeguards",
      description: "Implement policies and procedures to prevent, detect, contain, and correct security violations.",
      version: "1.0",
      status: "ACTIVE",
      effectiveDate: "2003-04-14",
      jurisdiction: "US",
      isCurrent: true,
    },
    {
      regulationId: "REG-003",
      frameworkId: "FWK-003",
      domainId: "DOM-002",
      code: "ISO-A.5.1",
      title: "Policies for Information Security",
      description: "To provide management direction and support for information security.",
      version: "2022",
      status: "ACTIVE",
      effectiveDate: "2022-10-25",
      jurisdiction: "GLOBAL",
      isCurrent: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "DRAFT": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "WITHDRAWN": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "SUPERSEDED": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "ARCHIVED": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (regulation: ComplianceRegulation) => {
    setSelectedRegulation(regulation);
    setDialogMode("view");
  };

  const handleEdit = (regulation: ComplianceRegulation) => {
    setSelectedRegulation(regulation);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedRegulation(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "ACTIVE", checked: false },
        { label: "Draft", value: "DRAFT", checked: false },
        { label: "Withdrawn", value: "WITHDRAWN", checked: false },
      ],
    },
    {
      label: "Jurisdiction",
      options: [
        { label: "EU", value: "EU", checked: false },
        { label: "US", value: "US", checked: false },
        { label: "Global", value: "GLOBAL", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Regulations</h1>
          <p className="text-muted-foreground">Manage compliance regulations and requirements</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Regulation
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search regulations..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regulations.map((regulation) => (
              <TableRow key={regulation.regulationId}>
                <TableCell className="font-medium">{regulation.code}</TableCell>
                <TableCell className="max-w-xs truncate">{regulation.title}</TableCell>
                <TableCell>{regulation.version}</TableCell>
                <TableCell>{regulation.jurisdiction}</TableCell>
                <TableCell>{regulation.effectiveDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(regulation.status)}>
                    {regulation.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(regulation)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(regulation)}
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

      <ComplianceRegulationDialog
        mode={dialogMode}
        regulation={selectedRegulation}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceRegulations;
