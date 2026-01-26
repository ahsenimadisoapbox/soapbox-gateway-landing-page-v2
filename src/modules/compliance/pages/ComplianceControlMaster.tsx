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
import { ComplianceControlDialog } from "../components/compliance/ComplianceControlDialog";
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent } from "../components/ui/card";

type ComplianceControl = {
  controlId: string;
  tenantId: string;
  clauseId: string;
  controlCode: string;
  controlName: string;
  controlDesc: string;
  controlType: string;
  severityName: string;
  frequency: string;
  mandatoryFlag: "Y" | "N";
  owner: string;
};

const ComplianceControlMaster = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null);

  const controls: ComplianceControl[] = [
    {
      controlId: "CTL-001",
      tenantId: "TNT-001",
      clauseId: "CLS-001",
      controlCode: "ACCESS_CONTROL",
      controlName: "Access Control Management",
      controlDesc: "Implement role-based access control mechanisms",
      controlType: "TECHNICAL",
      severityName: "HIGH",
      frequency: "WEEKLY",
      mandatoryFlag: "Y",
      owner: "security@example.com",
    },
    {
      controlId: "CTL-002",
      tenantId: "TNT-001",
      clauseId: "CLS-002",
      controlCode: "DATA_ENCRYPTION",
      controlName: "Data Encryption",
      controlDesc: "Encrypt sensitive data at rest and in transit",
      controlType: "TECHNICAL",
      severityName: "CRITICAL",
      frequency: "DAILY",
      mandatoryFlag: "Y",
      owner: "it@example.com",
    },
    {
      controlId: "CTL-003",
      tenantId: "TNT-001",
      clauseId: "CLS-003",
      controlCode: "AUDIT_LOGGING",
      controlName: "Audit Logging",
      controlDesc: "Maintain comprehensive audit logs",
      controlType: "ADMINISTRATIVE",
      severityName: "MEDIUM",
      frequency: "MONTHLY",
      mandatoryFlag: "Y",
      owner: "compliance@example.com",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "HIGH": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "LOW": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (control: ComplianceControl) => {
    setSelectedControl(control);
    setDialogMode("view");
  };

  const handleEdit = (control: ComplianceControl) => {
    setSelectedControl(control);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedControl(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Control Type",
      options: [
        { label: "Technical", value: "TECHNICAL", checked: false },
        { label: "Administrative", value: "ADMINISTRATIVE", checked: false },
        { label: "Physical", value: "PHYSICAL", checked: false },
      ],
    },
    {
      label: "Severity",
      options: [
        { label: "Critical", value: "CRITICAL", checked: false },
        { label: "High", value: "HIGH", checked: false },
        { label: "Medium", value: "MEDIUM", checked: false },
        { label: "Low", value: "LOW", checked: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Control Master</h1>
          <p className="text-muted-foreground">Manage compliance controls and requirements</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Control
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search controls..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Control Code</TableHead>
              <TableHead>Control Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Mandatory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => (
              <TableRow key={control.controlId}>
                <TableCell className="font-medium">{control.controlCode}</TableCell>
                <TableCell>{control.controlName}</TableCell>
                <TableCell>{control.controlType}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getSeverityColor(control.severityName)}>
                    {control.severityName}
                  </Badge>
                </TableCell>
                <TableCell>{control.frequency}</TableCell>
                <TableCell>{control.mandatoryFlag === "Y" ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(control)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(control)}
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

      <ComplianceControlDialog
        mode={dialogMode}
        control={selectedControl}
        open={dialogMode !== null}
        onOpenChange={(open) => !open && setDialogMode(null)}
      />
    </div>
  );
};

export default ComplianceControlMaster;
