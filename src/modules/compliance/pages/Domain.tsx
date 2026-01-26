import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Link2 } from "lucide-react";
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
import { Card, CardContent } from "../components/ui/card";
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

type Domain = {
  id: string;
  frameworkId: string;
  frameworkName: string;
  code: string;
  name: string;
  description: string;
  regulationsCount: number;
  controlsCount: number;
  obligationsCount: number;
  createdAt: string;
  updatedAt: string;
};

const Domain = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const domains: Domain[] = [
    {
      id: "DOM-001",
      frameworkId: "FW-001",
      frameworkName: "GDPR",
      code: "DATA_PROTECTION",
      name: "Data Protection",
      description: "Principles and requirements for personal data protection",
      regulationsCount: 8,
      controlsCount: 25,
      obligationsCount: 15,
      createdAt: "2023-01-15",
      updatedAt: "2024-02-20",
    },
    {
      id: "DOM-002",
      frameworkId: "FW-001",
      frameworkName: "GDPR",
      code: "DATA_SUBJECT_RIGHTS",
      name: "Data Subject Rights",
      description: "Rights of individuals regarding their personal data",
      regulationsCount: 6,
      controlsCount: 18,
      obligationsCount: 12,
      createdAt: "2023-01-15",
      updatedAt: "2024-02-20",
    },
    {
      id: "DOM-003",
      frameworkId: "FW-002",
      frameworkName: "HIPAA",
      code: "PRIVACY_RULE",
      name: "Privacy Rule",
      description: "Standards for the protection of health information",
      regulationsCount: 5,
      controlsCount: 20,
      obligationsCount: 10,
      createdAt: "2023-02-10",
      updatedAt: "2024-01-15",
    },
    {
      id: "DOM-004",
      frameworkId: "FW-003",
      frameworkName: "ISO27001",
      code: "ACCESS_CONTROL",
      name: "Access Control",
      description: "Policies for access control and user management",
      regulationsCount: 10,
      controlsCount: 30,
      obligationsCount: 20,
      createdAt: "2023-03-05",
      updatedAt: "2024-03-01",
    },
  ];

  const handleView = (domain: Domain) => {
    setSelectedDomain(domain);
    setDialogMode("view");
  };

  const handleEdit = (domain: Domain) => {
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
        { label: "GDPR", value: "gdpr", checked: false },
        { label: "HIPAA", value: "hipaa", checked: false },
        { label: "ISO27001", value: "iso27001", checked: false },
        { label: "SOX", value: "sox", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Domain" : dialogMode === "edit" ? "Edit Domain" : "Domain Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Domains</h1>
          <p className="text-muted-foreground">Categorize domains within compliance frameworks</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Domain
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">Total Domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{domains.reduce((acc, d) => acc + d.regulationsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Regulations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{domains.reduce((acc, d) => acc + d.controlsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{domains.reduce((acc, d) => acc + d.obligationsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Obligations</p>
          </CardContent>
        </Card>
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Regulations</TableHead>
              <TableHead>Controls</TableHead>
              <TableHead>Obligations</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell className="font-medium">{domain.code}</TableCell>
                <TableCell>{domain.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{domain.frameworkName}</Badge>
                </TableCell>
                <TableCell>{domain.regulationsCount}</TableCell>
                <TableCell>{domain.controlsCount}</TableCell>
                <TableCell>{domain.obligationsCount}</TableCell>
                <TableCell>{domain.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(domain)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(domain)}>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="linked">Linked Items</TabsTrigger>
              <TabsTrigger value="categorization">Categorization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Domain Code</Label>
                  <Input id="code" defaultValue={selectedDomain?.code} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Domain Name</Label>
                  <Input id="name" defaultValue={selectedDomain?.name} disabled={isViewMode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                {isViewMode ? (
                  <Input defaultValue={selectedDomain?.frameworkName} disabled />
                ) : (
                  <Select defaultValue={selectedDomain?.frameworkId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FW-001">GDPR</SelectItem>
                      <SelectItem value="FW-002">HIPAA</SelectItem>
                      <SelectItem value="FW-003">ISO27001</SelectItem>
                      <SelectItem value="FW-004">SOX</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedDomain?.description} disabled={isViewMode} rows={4} />
              </div>
            </TabsContent>
            
            <TabsContent value="linked" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4" />
                      <span className="font-medium">Regulations</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedDomain?.regulationsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">Manage →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4" />
                      <span className="font-medium">Controls</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedDomain?.controlsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">Manage →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4" />
                      <span className="font-medium">Obligations</span>
                    </div>
                    <div className="text-2xl font-bold">{selectedDomain?.obligationsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">Manage →</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="categorization" className="space-y-4 mt-4">
              <div className="p-4 border rounded-lg">
                <Label>Tags & Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>Data Privacy</Badge>
                  <Badge>Security</Badge>
                  <Badge>Compliance</Badge>
                  {!isViewMode && (
                    <Button variant="outline" size="sm">+ Add Tag</Button>
                  )}
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

export default Domain;
