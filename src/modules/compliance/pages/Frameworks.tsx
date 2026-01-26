import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Link2, History } from "lucide-react";
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

type Framework = {
  id: string;
  code: string;
  name: string;
  version: string;
  publisher: string;
  jurisdiction: string;
  effectiveDate: string;
  expiryDate: string;
  status: "active" | "revoked" | "expired";
  description: string;
  domainsCount: number;
  regulationsCount: number;
  controlsCount: number;
};

const Frameworks = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  const frameworks: Framework[] = [
    {
      id: "FW-001",
      code: "GDPR",
      name: "General Data Protection Regulation",
      version: "2018",
      publisher: "European Union",
      jurisdiction: "EU",
      effectiveDate: "2018-05-25",
      expiryDate: "",
      status: "active",
      description: "EU regulation on data protection and privacy",
      domainsCount: 5,
      regulationsCount: 12,
      controlsCount: 45,
    },
    {
      id: "FW-002",
      code: "HIPAA",
      name: "Health Insurance Portability and Accountability Act",
      version: "1996",
      publisher: "US HHS",
      jurisdiction: "US",
      effectiveDate: "1996-08-21",
      expiryDate: "",
      status: "active",
      description: "US legislation for data privacy in healthcare",
      domainsCount: 3,
      regulationsCount: 8,
      controlsCount: 32,
    },
    {
      id: "FW-003",
      code: "ISO27001",
      name: "ISO/IEC 27001 Information Security",
      version: "2022",
      publisher: "ISO",
      jurisdiction: "Global",
      effectiveDate: "2022-10-25",
      expiryDate: "",
      status: "active",
      description: "International standard for information security management",
      domainsCount: 14,
      regulationsCount: 93,
      controlsCount: 114,
    },
    {
      id: "FW-004",
      code: "SOX",
      name: "Sarbanes-Oxley Act",
      version: "2002",
      publisher: "US Congress",
      jurisdiction: "US",
      effectiveDate: "2002-07-30",
      expiryDate: "",
      status: "active",
      description: "US federal law on corporate financial practices",
      domainsCount: 4,
      regulationsCount: 11,
      controlsCount: 28,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "revoked": return "bg-red-100 text-red-800 hover:bg-red-100";
      case "expired": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (framework: Framework) => {
    setSelectedFramework(framework);
    setDialogMode("view");
  };

  const handleEdit = (framework: Framework) => {
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
        { label: "Active", value: "active", checked: false },
        { label: "Revoked", value: "revoked", checked: false },
        { label: "Expired", value: "expired", checked: false },
      ],
    },
    {
      label: "Jurisdiction",
      options: [
        { label: "EU", value: "eu", checked: false },
        { label: "US", value: "us", checked: false },
        { label: "Global", value: "global", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Create Framework" : dialogMode === "edit" ? "Edit Framework" : "Framework Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Frameworks</h1>
          <p className="text-muted-foreground">Registry of compliance frameworks (GDPR, HIPAA, ISO27001)</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Framework
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">Total Frameworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{frameworks.filter(f => f.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{frameworks.reduce((acc, f) => acc + f.domainsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{frameworks.reduce((acc, f) => acc + f.controlsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Controls</p>
          </CardContent>
        </Card>
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
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Linked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frameworks.map((framework) => (
              <TableRow key={framework.id}>
                <TableCell className="font-medium">{framework.code}</TableCell>
                <TableCell className="max-w-[200px] truncate">{framework.name}</TableCell>
                <TableCell>{framework.version}</TableCell>
                <TableCell>{framework.publisher}</TableCell>
                <TableCell>{framework.jurisdiction}</TableCell>
                <TableCell>{framework.effectiveDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(framework.status)}>
                    {framework.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{framework.domainsCount} D</Badge>
                    <Badge variant="outline" className="text-xs">{framework.regulationsCount} R</Badge>
                    <Badge variant="outline" className="text-xs">{framework.controlsCount} C</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(framework)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(framework)}>
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
              <TabsTrigger value="linked">Linked Items</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Framework Code</Label>
                  <Input id="code" defaultValue={selectedFramework?.code} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Framework Name</Label>
                  <Input id="name" defaultValue={selectedFramework?.name} disabled={isViewMode} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" defaultValue={selectedFramework?.version} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input id="publisher" defaultValue={selectedFramework?.publisher} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedFramework?.jurisdiction} disabled />
                  ) : (
                    <Select defaultValue={selectedFramework?.jurisdiction || "global"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EU">EU</SelectItem>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date</Label>
                  <Input id="effectiveDate" type="date" defaultValue={selectedFramework?.effectiveDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" defaultValue={selectedFramework?.expiryDate} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isViewMode ? (
                    <Input defaultValue={selectedFramework?.status} disabled />
                  ) : (
                    <Select defaultValue={selectedFramework?.status || "active"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={selectedFramework?.description} disabled={isViewMode} rows={4} />
              </div>
            </TabsContent>
            
            <TabsContent value="linked" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Domains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedFramework?.domainsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View all domains →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Regulations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedFramework?.regulationsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View all regulations →</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Link2 className="w-4 h-4" /> Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedFramework?.controlsCount || 0}</div>
                    <Button variant="link" className="p-0 h-auto text-xs">View all controls →</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="lifecycle" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Issue Date</div>
                    <div className="text-sm text-muted-foreground">{selectedFramework?.effectiveDate || "Not set"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Last Review Date</div>
                    <div className="text-sm text-muted-foreground">2024-01-15</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <History className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Created By</div>
                    <div className="text-sm text-muted-foreground">admin@company.com • 2023-06-01</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-4 mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <p>No integrations configured for this framework.</p>
                <Button variant="outline" className="mt-4">Configure Integration</Button>
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

export default Frameworks;
