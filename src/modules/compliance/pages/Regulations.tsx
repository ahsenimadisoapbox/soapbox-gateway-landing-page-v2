import { useState } from "react";
import { Eye, Edit, Trash2, Plus, History, FileText } from "lucide-react";
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
import { ScrollArea } from "../components/ui/scroll-area";

type Regulation = {
  id: string;
  frameworkId: string;
  domainId: string;
  code: string;
  title: string;
  description: string;
  content: string;
  jurisdiction: string;
  region: string;
  version: string;
  status: "draft" | "active" | "withdrawn" | "superseded" | "archived";
  effectiveDate: string;
  expiryDate: string;
  language: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

const Regulations = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);

  const regulations: Regulation[] = [
    {
      id: "REG-001",
      frameworkId: "FW-001",
      domainId: "DOM-001",
      code: "GDPR-ART5",
      title: "Principles relating to processing of personal data",
      description: "Personal data shall be processed lawfully, fairly and in a transparent manner",
      content: "1. Personal data shall be:\n(a) processed lawfully, fairly and in a transparent manner in relation to the data subject ('lawfulness, fairness and transparency');\n(b) collected for specified, explicit and legitimate purposes...",
      jurisdiction: "EU",
      region: "European Union",
      version: "2018",
      status: "active",
      effectiveDate: "2018-05-25",
      expiryDate: "",
      language: "EN",
      isCurrent: true,
      createdAt: "2018-05-25",
      updatedAt: "2024-01-15",
    },
    {
      id: "REG-002",
      frameworkId: "FW-001",
      domainId: "DOM-002",
      code: "GDPR-ART17",
      title: "Right to erasure ('right to be forgotten')",
      description: "The data subject shall have the right to obtain erasure of personal data",
      content: "1. The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay...",
      jurisdiction: "EU",
      region: "European Union",
      version: "2018",
      status: "active",
      effectiveDate: "2018-05-25",
      expiryDate: "",
      language: "EN",
      isCurrent: true,
      createdAt: "2018-05-25",
      updatedAt: "2024-01-15",
    },
    {
      id: "REG-003",
      frameworkId: "FW-002",
      domainId: "DOM-003",
      code: "HIPAA-164.502",
      title: "Uses and disclosures of protected health information",
      description: "General rules for uses and disclosures of PHI",
      content: "A covered entity or business associate may not use or disclose protected health information, except as permitted or required by this subpart...",
      jurisdiction: "US",
      region: "Federal",
      version: "2013",
      status: "active",
      effectiveDate: "2013-03-26",
      expiryDate: "",
      language: "EN",
      isCurrent: true,
      createdAt: "2013-03-26",
      updatedAt: "2024-02-10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "draft": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "withdrawn": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "superseded": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "archived": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (regulation: Regulation) => {
    setSelectedRegulation(regulation);
    setDialogMode("view");
  };

  const handleEdit = (regulation: Regulation) => {
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
        { label: "Active", value: "active", checked: false },
        { label: "Draft", value: "draft", checked: false },
        { label: "Withdrawn", value: "withdrawn", checked: false },
        { label: "Archived", value: "archived", checked: false },
      ],
    },
    {
      label: "Jurisdiction",
      options: [
        { label: "EU", value: "eu", checked: false },
        { label: "US", value: "us", checked: false },
        { label: "UK", value: "uk", checked: false },
        { label: "Global", value: "global", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Regulation" : dialogMode === "edit" ? "Edit Regulation" : "Regulation Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulations</h1>
          <p className="text-muted-foreground">Regulation library with full content and version history</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Regulation
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{regulations.length}</div>
            <p className="text-xs text-muted-foreground">Total Regulations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{regulations.filter(r => r.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{regulations.filter(r => r.status === "draft").length}</div>
            <p className="text-xs text-muted-foreground">Draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{regulations.filter(r => r.isCurrent).length}</div>
            <p className="text-xs text-muted-foreground">Current Version</p>
          </CardContent>
        </Card>
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
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regulations.map((regulation) => (
              <TableRow key={regulation.id}>
                <TableCell className="font-medium">{regulation.code}</TableCell>
                <TableCell className="max-w-[250px] truncate">{regulation.title}</TableCell>
                <TableCell>{regulation.jurisdiction}</TableCell>
                <TableCell>{regulation.version}</TableCell>
                <TableCell>{regulation.effectiveDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(regulation.status)}>
                    {regulation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {regulation.isCurrent ? (
                    <Badge variant="outline" className="bg-green-50">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(regulation)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(regulation)}>
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="content">Full Content</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="traceability">Traceability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Regulation Code</Label>
                  <Input id="code" defaultValue={selectedRegulation?.code} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" defaultValue={selectedRegulation?.version} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedRegulation?.status} disabled />
                  ) : (
                    <Select defaultValue={selectedRegulation?.status || "draft"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                        <SelectItem value="superseded">Superseded</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={selectedRegulation?.title} disabled={isViewMode} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Input id="jurisdiction" defaultValue={selectedRegulation?.jurisdiction} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" defaultValue={selectedRegulation?.region} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" defaultValue={selectedRegulation?.language} disabled={isViewMode} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input id="effectiveDate" type="date" defaultValue={selectedRegulation?.effectiveDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" defaultValue={selectedRegulation?.expiryDate} disabled={isViewMode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedRegulation?.description} disabled={isViewMode} rows={3} />
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Full Regulation Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {isViewMode ? (
                      <pre className="whitespace-pre-wrap text-sm">{selectedRegulation?.content}</pre>
                    ) : (
                      <Textarea 
                        className="min-h-[350px] font-mono text-sm"
                        defaultValue={selectedRegulation?.content}
                        rows={15}
                      />
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Version 2018 - Current</div>
                    <div className="text-sm text-muted-foreground">Published on {selectedRegulation?.effectiveDate}</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Current</Badge>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg opacity-60">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Version 2016 - Superseded</div>
                    <div className="text-sm text-muted-foreground">Published on 2016-04-14</div>
                  </div>
                  <Badge variant="outline">Superseded</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="traceability" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Linked Clauses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View clauses →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Linked Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View controls →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Linked Obligations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View obligations →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View assessments →</Button>
                  </CardContent>
                </Card>
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

export default Regulations;
