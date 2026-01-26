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
import { ComplianceFrameworkDialog } from "../components/compliance/ComplianceFrameworkDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceFramework = {
  frameworkId: string;
  frameworkCode: string;
  frameworkName: string;
  versionNo: string;
  publisher: string;
  issueDate: string;
  lastReviewDate: string;
  effectiveDate: string;
  expiryDate?: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  description: string;
};

const ComplianceFrameworks = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | null>(null);

  const frameworks: ComplianceFramework[] = [
    {
      frameworkId: "FWK-001",
      frameworkCode: "GDPR",
      frameworkName: "General Data Protection Regulation",
      versionNo: "2016/679",
      publisher: "European Commission",
      issueDate: "2016-04-27",
      lastReviewDate: "2024-01-15",
      effectiveDate: "2018-05-25",
      status: "ACTIVE",
      description: "EU regulation on data protection and privacy for all individuals within the European Union and the European Economic Area.",
    },
    {
      frameworkId: "FWK-002",
      frameworkCode: "HIPAA",
      frameworkName: "Health Insurance Portability and Accountability Act",
      versionNo: "1996",
      publisher: "U.S. Department of Health and Human Services",
      issueDate: "1996-08-21",
      lastReviewDate: "2023-11-10",
      effectiveDate: "1996-08-21",
      status: "ACTIVE",
      description: "United States legislation that provides data privacy and security provisions for safeguarding medical information.",
    },
    {
      frameworkId: "FWK-003",
      frameworkCode: "ISO27001",
      frameworkName: "ISO/IEC 27001:2022",
      versionNo: "2022",
      publisher: "International Organization for Standardization",
      issueDate: "2022-10-25",
      lastReviewDate: "2024-02-20",
      effectiveDate: "2022-10-25",
      status: "ACTIVE",
      description: "International standard for information security management systems.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "REVOKED": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "EXPIRED": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (framework: ComplianceFramework) => {
    setSelectedFramework(framework);
    setDialogMode("view");
  };

  const handleEdit = (framework: ComplianceFramework) => {
    setSelectedFramework(framework);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedFramework(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "ACTIVE", checked: false },
        { label: "Revoked", value: "REVOKED", checked: false },
        { label: "Expired", value: "EXPIRED", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Frameworks</h1>
          <p className="text-muted-foreground">Manage compliance frameworks and standards</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Framework
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search frameworks..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Framework Code</TableHead>
              <TableHead>Framework Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frameworks.map((framework) => (
              <TableRow key={framework.frameworkId}>
                <TableCell className="font-medium">{framework.frameworkCode}</TableCell>
                <TableCell>{framework.frameworkName}</TableCell>
                <TableCell>{framework.versionNo}</TableCell>
                <TableCell>{framework.publisher}</TableCell>
                <TableCell>{framework.effectiveDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(framework.status)}>
                    {framework.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(framework)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(framework)}
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

      <ComplianceFrameworkDialog
        mode={dialogMode}
        framework={selectedFramework}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceFrameworks;
