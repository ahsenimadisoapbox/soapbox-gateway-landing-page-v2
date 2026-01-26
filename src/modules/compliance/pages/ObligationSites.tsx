import { useState } from "react";
import { Eye, Edit, Trash2, Plus, MapPin, Building2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";

type ObligationSite = {
  id: string;
  obligationId: string;
  obligationTitle: string;
  siteId: string;
  siteName: string;
  siteLocation: string;
  status: "active" | "inactive" | "pending";
  effectiveFrom: string;
  effectiveTo: string;
  compliance: number;
  tasksCount: number;
  createdAt: string;
  updatedAt: string;
};

const ObligationSites = () => {
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedMapping, setSelectedMapping] = useState<ObligationSite | null>(null);

  const mappings: ObligationSite[] = [
    {
      id: "OS-001",
      obligationId: "OBL-001",
      obligationTitle: "Annual GDPR Data Protection Impact Assessment",
      siteId: "SITE-001",
      siteName: "London HQ",
      siteLocation: "London, UK",
      status: "active",
      effectiveFrom: "2024-01-01",
      effectiveTo: "2025-12-31",
      compliance: 75,
      tasksCount: 5,
      createdAt: "2024-01-01",
      updatedAt: "2024-11-15",
    },
    {
      id: "OS-002",
      obligationId: "OBL-001",
      obligationTitle: "Annual GDPR Data Protection Impact Assessment",
      siteId: "SITE-002",
      siteName: "Berlin Office",
      siteLocation: "Berlin, Germany",
      status: "active",
      effectiveFrom: "2024-01-01",
      effectiveTo: "2025-12-31",
      compliance: 90,
      tasksCount: 4,
      createdAt: "2024-01-01",
      updatedAt: "2024-11-20",
    },
    {
      id: "OS-003",
      obligationId: "OBL-002",
      obligationTitle: "ISO 27001 Information Security Review",
      siteId: "SITE-001",
      siteName: "London HQ",
      siteLocation: "London, UK",
      status: "active",
      effectiveFrom: "2024-01-01",
      effectiveTo: "2025-12-31",
      compliance: 100,
      tasksCount: 8,
      createdAt: "2024-02-01",
      updatedAt: "2024-11-01",
    },
    {
      id: "OS-004",
      obligationId: "OBL-003",
      obligationTitle: "SOX Financial Controls Assessment",
      siteId: "SITE-003",
      siteName: "New York Office",
      siteLocation: "New York, USA",
      status: "pending",
      effectiveFrom: "2024-06-01",
      effectiveTo: "2025-12-31",
      compliance: 45,
      tasksCount: 12,
      createdAt: "2024-06-01",
      updatedAt: "2024-11-10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "inactive": return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleView = (mapping: ObligationSite) => {
    setSelectedMapping(mapping);
    setDialogMode("view");
  };

  const handleEdit = (mapping: ObligationSite) => {
    setSelectedMapping(mapping);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedMapping(null);
    setDialogMode("create");
  };

  const filterGroups = [
    {
      label: "Status",
      options: [
        { label: "Active", value: "active", checked: false },
        { label: "Inactive", value: "inactive", checked: false },
        { label: "Pending", value: "pending", checked: false },
      ],
    },
    {
      label: "Site",
      options: [
        { label: "London HQ", value: "london", checked: false },
        { label: "Berlin Office", value: "berlin", checked: false },
        { label: "New York Office", value: "newyork", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle = dialogMode === "create" ? "Link Obligation to Site" : dialogMode === "edit" ? "Edit Site Mapping" : "Site Mapping Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Obligation Sites</h1>
          <p className="text-muted-foreground">Link obligations to organizational sites</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Link Site
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{mappings.length}</div>
            <p className="text-xs text-muted-foreground">Total Mappings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{mappings.filter(m => m.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Sites</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{Math.round(mappings.reduce((acc, m) => acc + m.compliance, 0) / mappings.length)}%</div>
            <p className="text-xs text-muted-foreground">Avg Compliance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <FilterSearch
            searchPlaceholder="Search site mappings..."
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Obligation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Effective Period</TableHead>
              <TableHead>Compliance</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{mapping.siteName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {mapping.siteLocation}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{mapping.obligationTitle}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(mapping.status)}>
                    {mapping.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {mapping.effectiveFrom} - {mapping.effectiveTo}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={mapping.compliance} className="w-16 h-2" />
                    <span className="text-xs">{mapping.compliance}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{mapping.tasksCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleView(mapping)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(mapping)}>
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
          
          <Tabs defaultValue="mapping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mapping">Mapping Details</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mapping" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site</Label>
                {isViewMode ? (
                  <Input defaultValue={selectedMapping?.siteName} disabled />
                ) : (
                  <Select defaultValue={selectedMapping?.siteId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SITE-001">London HQ</SelectItem>
                      <SelectItem value="SITE-002">Berlin Office</SelectItem>
                      <SelectItem value="SITE-003">New York Office</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="obligation">Obligation</Label>
                {isViewMode ? (
                  <Input defaultValue={selectedMapping?.obligationTitle} disabled />
                ) : (
                  <Select defaultValue={selectedMapping?.obligationId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select obligation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OBL-001">Annual GDPR DPIA</SelectItem>
                      <SelectItem value="OBL-002">ISO 27001 Review</SelectItem>
                      <SelectItem value="OBL-003">SOX Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveFrom">Effective From</Label>
                  <Input id="effectiveFrom" type="date" defaultValue={selectedMapping?.effectiveFrom} disabled={isViewMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveTo">Effective To</Label>
                  <Input id="effectiveTo" type="date" defaultValue={selectedMapping?.effectiveTo} disabled={isViewMode} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isViewMode ? (
                  <Input defaultValue={selectedMapping?.status} disabled />
                ) : (
                  <Select defaultValue={selectedMapping?.status || "pending"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="lifecycle" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Site Lifecycle View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Mapping Created</div>
                        <div className="text-sm text-muted-foreground">{selectedMapping?.createdAt}</div>
                      </div>
                      <Badge variant="outline">Initial</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Last Updated</div>
                        <div className="text-sm text-muted-foreground">{selectedMapping?.updatedAt}</div>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="font-medium mb-2">Compliance Progress</div>
                      <Progress value={selectedMapping?.compliance} className="h-3" />
                      <div className="text-sm text-muted-foreground mt-2">
                        {selectedMapping?.compliance}% complete • {selectedMapping?.tasksCount} tasks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {dialogMode === "create" ? "Link Site" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ObligationSites;
