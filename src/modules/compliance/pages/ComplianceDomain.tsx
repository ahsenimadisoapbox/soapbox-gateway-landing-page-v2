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
import { ComplianceDomainDialog } from "../components/compliance/ComplianceDomainDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceDomain = {
  domainId: string;
  frameworkId: string;
  domainCode: string;
  domainName: string;
  description: string;
  frameworkName?: string;
};

const ComplianceDomain = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<ComplianceDomain | null>(null);

  const domains: ComplianceDomain[] = [
    {
      domainId: "DOM-001",
      frameworkId: "FWK-001",
      domainCode: "DATA_PROTECTION",
      domainName: "Data Protection",
      frameworkName: "GDPR",
      description: "Covers all aspects of personal data protection and privacy rights under GDPR.",
    },
    {
      domainId: "DOM-002",
      frameworkId: "FWK-003",
      domainCode: "INFORMATION_SECURITY",
      domainName: "Information Security",
      frameworkName: "ISO 27001",
      description: "Information security management systems and controls.",
    },
    {
      domainId: "DOM-003",
      frameworkId: "FWK-002",
      domainCode: "HEALTH_INFO_SECURITY",
      domainName: "Health Information Security",
      frameworkName: "HIPAA",
      description: "Protection of health information and patient privacy.",
    },
  ];

  const handleView = (domain: ComplianceDomain) => {
    setSelectedDomain(domain);
    setDialogMode("view");
  };

  const handleEdit = (domain: ComplianceDomain) => {
    setSelectedDomain(domain);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedDomain(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Framework",
      options: [
        { label: "GDPR", value: "FWK-001", checked: false },
        { label: "HIPAA", value: "FWK-002", checked: false },
        { label: "ISO 27001", value: "FWK-003", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Compliance Domains</h1>
          <p className="text-muted-foreground">Manage compliance domains within frameworks</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Domain
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search domains..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Code</TableHead>
              <TableHead>Domain Name</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.domainId}>
                <TableCell className="font-medium">{domain.domainCode}</TableCell>
                <TableCell>{domain.domainName}</TableCell>
                <TableCell>{domain.frameworkName}</TableCell>
                <TableCell className="max-w-md truncate">{domain.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(domain)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(domain)}
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

      <ComplianceDomainDialog
        mode={dialogMode}
        domain={selectedDomain}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceDomain;
