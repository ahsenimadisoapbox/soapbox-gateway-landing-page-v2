import { useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
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
import { useToast } from "../hooks/use-toast";

type RegulatoryChange = {
  id: string;
  title: string;
  description: string;
  framework: string;
  effectiveDate: string;
  impact: string;
  status: string;
  reviewedBy: string;
  sourceUrl: string;
  affectedControls: string;
};

const initialData: RegulatoryChange[] = [
  {
    id: "REG-2024-001",
    title: "GDPR Article 33 Amendment - Breach Notification",
    description: "Updated breach notification requirements under GDPR Article 33",
    framework: "GDPR",
    effectiveDate: "2025-01-01",
    impact: "high",
    status: "under-review",
    reviewedBy: "Sarah Johnson",
    sourceUrl: "https://gdpr.eu/article-33",
    affectedControls: "CTRL-001, CTRL-002",
  },
  {
    id: "REG-2024-002",
    title: "ISO 27001:2023 Update - Control Set Changes",
    description: "Major revision to ISO 27001 control framework",
    framework: "ISO 27001",
    effectiveDate: "2024-12-15",
    impact: "medium",
    status: "assessed",
    reviewedBy: "Michael Chen",
    sourceUrl: "https://iso.org/27001",
    affectedControls: "CTRL-003, CTRL-004, CTRL-005",
  },
  {
    id: "REG-2024-003",
    title: "SOX Section 404 Compliance Update",
    description: "New requirements for internal control assessment",
    framework: "SOX",
    effectiveDate: "2025-03-01",
    impact: "high",
    status: "action-required",
    reviewedBy: "Emily Rodriguez",
    sourceUrl: "https://sec.gov/sox",
    affectedControls: "CTRL-006",
  },
];

const RegulatoryChanges = () => {
  const { toast } = useToast();
  const [changes, setChanges] = useState<RegulatoryChange[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({});
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create" | null>(null);
  const [selectedChange, setSelectedChange] = useState<RegulatoryChange | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [changeToDelete, setChangeToDelete] = useState<RegulatoryChange | null>(null);

  const [formData, setFormData] = useState<Partial<RegulatoryChange>>({});

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assessed":
        return "bg-green-100 text-green-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "action-required":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (change: RegulatoryChange) => {
    setSelectedChange(change);
    setFormData(change);
    setDialogMode("view");
  };

  const handleEdit = (change: RegulatoryChange) => {
    setSelectedChange(change);
    setFormData(change);
    setDialogMode("edit");
  };

  const handleCreate = () => {
    setSelectedChange(null);
    setFormData({
      id: `REG-${new Date().getFullYear()}-${String(changes.length + 1).padStart(3, "0")}`,
      title: "",
      description: "",
      framework: "",
      effectiveDate: "",
      impact: "medium",
      status: "under-review",
      reviewedBy: "",
      sourceUrl: "",
      affectedControls: "",
    });
    setDialogMode("create");
  };

  const handleDeleteClick = (change: RegulatoryChange) => {
    setChangeToDelete(change);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (changeToDelete) {
      setChanges(changes.filter((c) => c.id !== changeToDelete.id));
      toast({
        title: "Change Deleted",
        description: `Regulatory change ${changeToDelete.id} has been deleted.`,
      });
      setDeleteDialogOpen(false);
      setChangeToDelete(null);
    }
  };

  const handleSave = () => {
    if (dialogMode === "create") {
      setChanges([...changes, formData as RegulatoryChange]);
      toast({
        title: "Change Created",
        description: `Regulatory change ${formData.id} has been created.`,
      });
    } else if (dialogMode === "edit") {
      setChanges(changes.map((c) => (c.id === formData.id ? (formData as RegulatoryChange) : c)));
      toast({
        title: "Change Updated",
        description: `Regulatory change ${formData.id} has been updated.`,
      });
    }
    setDialogMode(null);
  };

  const filterGroups = [
    {
      label: "Impact",
      options: [
        { label: "Critical", value: "critical", checked: false },
        { label: "High", value: "high", checked: false },
        { label: "Medium", value: "medium", checked: false },
        { label: "Low", value: "low", checked: false },
      ],
    },
    {
      label: "Status",
      options: [
        { label: "Assessed", value: "assessed", checked: false },
        { label: "Under Review", value: "under-review", checked: false },
        { label: "Action Required", value: "action-required", checked: false },
      ],
    },
    {
      label: "Framework",
      options: [
        { label: "GDPR", value: "gdpr", checked: false },
        { label: "ISO 27001", value: "iso-27001", checked: false },
        { label: "SOX", value: "sox", checked: false },
      ],
    },
  ];

  const isViewMode = dialogMode === "view";
  const dialogTitle =
    dialogMode === "create"
      ? "Add Regulatory Change"
      : dialogMode === "edit"
      ? "Edit Regulatory Change"
      : "Regulatory Change Details";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Changes</h1>
          <p className="text-muted-foreground">Monitor and manage regulatory updates</p>
        </div>
        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Change
        </Button>
      </div>

      <FilterSearch
        searchPlaceholder="Search regulatory changes..."
        onSearchChange={setSearchQuery}
        filterGroups={filterGroups}
        onFilterChange={setFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Regulatory Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reviewed By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium">{change.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{change.title}</TableCell>
                  <TableCell>{change.framework}</TableCell>
                  <TableCell>{change.effectiveDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getImpactColor(change.impact)}>
                      {change.impact}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(change.status)}>
                      {change.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{change.reviewedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(change)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(change)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(change)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && setDialogMode(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">Change ID</Label>
                <Input id="id" value={formData.id || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                {isViewMode ? (
                  <Input value={formData.framework || ""} disabled />
                ) : (
                  <Select
                    value={formData.framework}
                    onValueChange={(value) => setFormData({ ...formData, framework: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GDPR">GDPR</SelectItem>
                      <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                      <SelectItem value="SOX">SOX</SelectItem>
                      <SelectItem value="HIPAA">HIPAA</SelectItem>
                      <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isViewMode}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate || ""}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewedBy">Reviewed By</Label>
                <Input
                  id="reviewedBy"
                  value={formData.reviewedBy || ""}
                  onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Impact</Label>
                {isViewMode ? (
                  <Input value={formData.impact || ""} disabled />
                ) : (
                  <Select
                    value={formData.impact}
                    onValueChange={(value) => setFormData({ ...formData, impact: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                {isViewMode ? (
                  <Input value={formData.status || ""} disabled />
                ) : (
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="assessed">Assessed</SelectItem>
                      <SelectItem value="action-required">Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                id="sourceUrl"
                value={formData.sourceUrl || ""}
                onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                disabled={isViewMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affectedControls">Affected Controls</Label>
              <Input
                id="affectedControls"
                value={formData.affectedControls || ""}
                onChange={(e) => setFormData({ ...formData, affectedControls: e.target.value })}
                disabled={isViewMode}
                placeholder="e.g., CTRL-001, CTRL-002"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && <Button onClick={handleSave}>{dialogMode === "create" ? "Create" : "Save Changes"}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Regulatory Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{changeToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegulatoryChanges;
