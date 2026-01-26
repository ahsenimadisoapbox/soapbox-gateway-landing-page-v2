import { useState } from "react";
import { Eye, Edit, Trash2, Plus, History, Link2 } from "lucide-react";
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
import { FilterSearch } from "../components/FilterSearch";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";

type Control = {
  id: string;
  tenantId: string;
  domainId: string;
  clauseId: string;
  code: string;
  name: string;
  description: string;
  requirementText: string;
  controlType: "technical" | "administrative" | "physical";
  severity: "low" | "medium" | "high" | "critical";
  frequency: string;
  mandatory: boolean;
  owner: string;
  effectiveDate: string;
  expiryDate: string;
  frameworksCount: number;
  obligationsCount: number;
  createdAt: string;
  updatedAt: string;
};

const ControlMaster = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);

  const controls: Control[] = [
    {
      id: "CTRL-001",
      tenantId: "T-001",
      domainId: "DOM-001",
      clauseId: "CL-001",
      code: "ACCESS_CONTROL_01",
      name: "User Access Management",
      description: "Control user access to systems and data",
      requirementText: "Organizations must implement appropriate technical and organizational measures to ensure user access is properly controlled, including authentication, authorization, and access logging.",
      controlType: "technical",
      severity: "high",
      frequency: "MONTHLY",
      mandatory: true,
      owner: "security@company.com",
      effectiveDate: "2023-01-01",
      expiryDate: "",
      frameworksCount: 3,
      obligationsCount: 5,
      createdAt: "2023-01-01",
      updatedAt: "2024-02-15",
    },
    {
      id: "CTRL-002",
      tenantId: "T-001",
      domainId: "DOM-001",
      clauseId: "CL-002",
      code: "DATA_ENCRYPTION_01",
      name: "Data Encryption at Rest",
      description: "Encrypt sensitive data when stored",
      requirementText: "All sensitive data must be encrypted using AES-256 or equivalent encryption standard when stored on any system or device.",
      controlType: "technical",
      severity: "critical",
      frequency: "DAILY",
      mandatory: true,
      owner: "data-team@company.com",
      effectiveDate: "2023-01-01",
      expiryDate: "",
      frameworksCount: 4,
      obligationsCount: 8,
      createdAt: "2023-01-01",
      updatedAt: "2024-03-01",
    },
    {
      id: "CTRL-003",
      tenantId: "T-001",
      domainId: "DOM-002",
      clauseId: "CL-003",
      code: "SECURITY_TRAINING_01",
      name: "Security Awareness Training",
      description: "Regular security training for all employees",
      requirementText: "All employees must complete security awareness training upon hire and annually thereafter, covering topics such as phishing, password security, and data handling.",
      controlType: "administrative",
      severity: "medium",
      frequency: "ANNUAL",
      mandatory: true,
      owner: "hr@company.com",
      effectiveDate: "2023-01-01",
      expiryDate: "",
      frameworksCount: 2,
      obligationsCount: 3,
      createdAt: "2023-02-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "CTRL-004",
      tenantId: "T-001",
      domainId: "DOM-003",
      clauseId: "CL-004",
      code: "PHYSICAL_ACCESS_01",
      name: "Data Center Physical Security",
      description: "Physical access controls for data centers",
      requirementText: "Data centers must have physical access controls including badge access, CCTV surveillance, and visitor logs.",
      controlType: "physical",
      severity: "high",
      frequency: "WEEKLY",
      mandatory: true,
      owner: "facilities@company.com",
      effectiveDate: "2023-01-01",
      expiryDate: "",
      frameworksCount: 2,
      obligationsCount: 4,
      createdAt: "2023-03-01",
      updatedAt: "2024-02-20",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technical": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "administrative": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "physical": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (control: Control) => {
    setSelectedControl(control);
    setDialogMode("view");
  };

  const handleEdit = (control: Control) => {
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
        { label: "Technical", value: "technical", checked: false },
        { label: "Administrative", value: "administrative", checked: false },
        { label: "Physical", value: "physical", checked: false },
      ],
    },
    {
      label: "Severity",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Control" : dialogMode === "edit" ? "Edit Control" : "Control Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Control Master</h1>
          <p className="text-muted-foreground">Master catalog of compliance controls</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Control
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{controls.length}</div>
            <p className="text-xs text-muted-foreground">Total Controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{controls.filter(c => c.controlType === "technical").length}</div>
            <p className="text-xs text-muted-foreground">Technical</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{controls.filter(c => c.controlType === "administrative").length}</div>
            <p className="text-xs text-muted-foreground">Administrative</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{controls.filter(c => c.controlType === "physical").length}</div>
            <p className="text-xs text-muted-foreground">Physical</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{controls.filter(c => c.mandatory).length}</div>
            <p className="text-xs text-muted-foreground">Mandatory</p>
          </CardContent>
        </Card>
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Mandatory</TableHead>
              <TableHead>Linked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => (
              <TableRow key={control.id}>
                <TableCell className="font-medium">{control.code}</TableCell>
                <TableCell className="max-w-[200px] truncate">{control.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getTypeColor(control.controlType)}>
                    {control.controlType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getSeverityColor(control.severity)}>
                    {control.severity}
                  </Badge>
                </TableCell>
                <TableCell>{control.frequency}</TableCell>
                <TableCell className="text-sm">{control.owner}</TableCell>
                <TableCell>
                  {control.mandatory ? (
                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{control.frameworksCount} FW</Badge>
                    <Badge variant="outline" className="text-xs">{control.obligationsCount} OBL</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(control)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(control)}>
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

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirement">Requirement</TabsTrigger>
              <TabsTrigger value="mapping">Mappings</TabsTrigger>
              <TabsTrigger value="history">Version History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Control Code</Label>
                  <Input id="code" defaultValue={selectedControl?.code} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Control Name</Label>
                  <Input id="name" defaultValue={selectedControl?.name} disabled={isViewMode} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Control Type</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedControl?.controlType} disabled />
                  ) : (
                    <Select defaultValue={selectedControl?.controlType || "technical"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedControl?.severity} disabled />
                  ) : (
                    <Select defaultValue={selectedControl?.severity || "medium"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedControl?.frequency} disabled />
                  ) : (
                    <Select defaultValue={selectedControl?.frequency || "MONTHLY"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="ANNUAL">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input id="owner" defaultValue={selectedControl?.owner} disabled={isViewMode} />
                </div>
                <div className="space-y-2 flex items-end gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="mandatory" defaultChecked={selectedControl?.mandatory} disabled={isViewMode} />
                    <Label htmlFor="mandatory">Mandatory Control</Label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input id="effectiveDate" type="date" defaultValue={selectedControl?.effectiveDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" defaultValue={selectedControl?.expiryDate} disabled={isViewMode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedControl?.description} disabled={isViewMode} rows={3} />
              </div>
            </TabsContent>
            
            <TabsContent value="requirement" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Full Requirement Text</CardTitle>
                </CardHeader>
                <CardContent>
                  {isViewMode ? (
                    <p className="text-sm whitespace-pre-wrap">{selectedControl?.requirementText}</p>
                  ) : (
                    <Textarea defaultValue={selectedControl?.requirementText} rows={10} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mapping" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Linked Frameworks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline">GDPR</Badge>
                      <Badge variant="outline">ISO27001</Badge>
                      <Badge variant="outline">HIPAA</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Linked Obligations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedControl?.obligationsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View all →</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Version 2.0 - Current</div>
                    <div className="text-sm text-muted-foreground">Updated requirements • {selectedControl?.updatedAt}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Current</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Version 1.0</div>
                    <div className="text-sm text-muted-foreground">Initial creation • {selectedControl?.createdAt}</div>
                  </div>
                  <Badge variant="outline">Superseded</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {dialogMode === "create" ? "Create" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlMaster;
