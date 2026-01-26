import { useState } from "react";
import { Eye, Edit, Trash2, Plus, Tag, Search, Filter, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import "../styles/event-type-master.css";

interface EventType {
  eventTypeId: string;
  tenantId: string;
  eventTypeName: string;
  description: string;
  meta: string;
  createdBy: string;
  createdAt: string;
}

const initialEventTypes: EventType[] = [
  {
    eventTypeId: "EVT-001",
    tenantId: "TENANT-001",
    eventTypeName: "OBLIGATION_DUE",
    description: "Triggered when an obligation reaches its due date. Used for deadline tracking and notification workflows.",
    meta: JSON.stringify({ priority: "high", notifyDaysBefore: 7, category: "Compliance" }),
    createdBy: "admin@company.com",
    createdAt: "2025-01-10T09:00:00Z"
  },
  {
    eventTypeId: "EVT-002",
    tenantId: "TENANT-001",
    eventTypeName: "ASSESSMENT_DUE",
    description: "Indicates an assessment is scheduled or approaching its deadline. Triggers assessment workflow reminders.",
    meta: JSON.stringify({ priority: "medium", notifyDaysBefore: 14, category: "Compliance" }),
    createdBy: "sara@company.com",
    createdAt: "2025-01-08T14:30:00Z"
  },
  {
    eventTypeId: "EVT-003",
    tenantId: "TENANT-001",
    eventTypeName: "AUDIT_SCHEDULED",
    description: "Marks a scheduled audit activity. Used for audit planning and resource allocation.",
    meta: JSON.stringify({ priority: "high", notifyDaysBefore: 30, category: "Audit" }),
    createdBy: "john@company.com",
    createdAt: "2025-01-05T11:15:00Z"
  },
  {
    eventTypeId: "EVT-004",
    tenantId: "TENANT-001",
    eventTypeName: "CONTROL_REVIEW",
    description: "Periodic review of compliance controls. Ensures controls remain effective and up-to-date.",
    meta: JSON.stringify({ priority: "medium", notifyDaysBefore: 7, category: "Compliance" }),
    createdBy: "admin@company.com",
    createdAt: "2025-01-03T16:45:00Z"
  },
  {
    eventTypeId: "EVT-005",
    tenantId: "TENANT-002",
    eventTypeName: "REGULATORY_CHANGE_DETECTED",
    description: "Triggered when a new regulatory change is detected that may impact compliance obligations.",
    meta: JSON.stringify({ priority: "critical", notifyDaysBefore: 0, category: "Regulatory" }),
    createdBy: "compliance@company.com",
    createdAt: "2025-01-02T08:20:00Z"
  },
  {
    eventTypeId: "EVT-006",
    tenantId: "TENANT-001",
    eventTypeName: "TRAINING_DUE",
    description: "Compliance training session is due. Used for employee training tracking and certification management.",
    meta: JSON.stringify({ priority: "low", notifyDaysBefore: 14, category: "HR" }),
    createdBy: "hr@company.com",
    createdAt: "2024-12-28T10:00:00Z"
  },
];

const tenants = [
  { id: "TENANT-001", name: "Acme Corporation" },
  { id: "TENANT-002", name: "Global Industries" },
  { id: "TENANT-003", name: "Tech Solutions" },
];

const EventTypeMaster = () => {
  const { toast } = useToast();
  const [eventTypes, setEventTypes] = useState<EventType[]>(initialEventTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventTypeToDelete, setEventTypeToDelete] = useState<EventType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTenant, setFilterTenant] = useState<string>("all");

  // Form state
  const [formData, setFormData] = useState({
    eventTypeName: "",
    tenantId: "",
    description: "",
    meta: "",
  });

  const handleOpenCreate = () => {
    setDialogMode("create");
    setSelectedEventType(null);
    setFormData({
      eventTypeName: "",
      tenantId: "",
      description: "",
      meta: JSON.stringify({ priority: "medium", notifyDaysBefore: 7, category: "" }, null, 2),
    });
    setDialogOpen(true);
  };

  const handleOpenView = (eventType: EventType) => {
    setDialogMode("view");
    setSelectedEventType(eventType);
    setFormData({
      eventTypeName: eventType.eventTypeName,
      tenantId: eventType.tenantId,
      description: eventType.description,
      meta: eventType.meta,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (eventType: EventType) => {
    setDialogMode("edit");
    setSelectedEventType(eventType);
    setFormData({
      eventTypeName: eventType.eventTypeName,
      tenantId: eventType.tenantId,
      description: eventType.description,
      meta: eventType.meta,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (eventType: EventType) => {
    setEventTypeToDelete(eventType);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    const newEventType: EventType = {
      eventTypeId: `EVT-${String(eventTypes.length + 1).padStart(3, "0")}`,
      tenantId: formData.tenantId,
      eventTypeName: formData.eventTypeName.toUpperCase().replace(/\s+/g, "_"),
      description: formData.description,
      meta: formData.meta,
      createdBy: "current.user@company.com",
      createdAt: new Date().toISOString(),
    };
    setEventTypes([...eventTypes, newEventType]);
    setDialogOpen(false);
    toast({
      title: "Event Type Created",
      description: `${newEventType.eventTypeName} has been created successfully.`,
    });
  };

  const handleUpdate = () => {
    if (!selectedEventType) return;
    const updatedEventTypes = eventTypes.map((et) =>
      et.eventTypeId === selectedEventType.eventTypeId
        ? {
            ...et,
            eventTypeName: formData.eventTypeName.toUpperCase().replace(/\s+/g, "_"),
            tenantId: formData.tenantId,
            description: formData.description,
            meta: formData.meta,
          }
        : et
    );
    setEventTypes(updatedEventTypes);
    setDialogOpen(false);
    toast({
      title: "Event Type Updated",
      description: `${formData.eventTypeName} has been updated successfully.`,
    });
  };

  const handleDelete = () => {
    if (!eventTypeToDelete) return;
    setEventTypes(eventTypes.filter((et) => et.eventTypeId !== eventTypeToDelete.eventTypeId));
    setDeleteDialogOpen(false);
    setEventTypeToDelete(null);
    toast({
      title: "Event Type Deleted",
      description: `${eventTypeToDelete.eventTypeName} has been deleted.`,
      variant: "destructive",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getMetaCategory = (meta: string): string => {
    try {
      const parsed = JSON.parse(meta);
      return parsed.category || "General";
    } catch {
      return "General";
    }
  };

  const getMetaPriority = (meta: string): string => {
    try {
      const parsed = JSON.parse(meta);
      return parsed.priority || "medium";
    } catch {
      return "medium";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return styles[priority] || styles.medium;
  };

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    return tenant?.name || tenantId;
  };

  const filteredEventTypes = eventTypes.filter((et) => {
    const matchesSearch =
      et.eventTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      et.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      et.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTenant = filterTenant === "all" || et.tenantId === filterTenant;
    return matchesSearch && matchesTenant;
  });

  const uniqueCategories = [...new Set(eventTypes.map((et) => getMetaCategory(et.meta)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Event Type Master</h1>
          <p className="text-muted-foreground">
            Centralized registry of compliance event types for standardized categorization
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Event Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{eventTypes.length}</div>
            <p className="text-xs text-muted-foreground">Total Event Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tenants.length}</div>
            <p className="text-xs text-muted-foreground">Tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{uniqueCategories.length}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {eventTypes.filter((et) => getMetaPriority(et.meta) === "critical" || getMetaPriority(et.meta) === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search event types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterTenant} onValueChange={setFilterTenant}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Tenant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenants</SelectItem>
            {tenants.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Type ID</TableHead>
              <TableHead>Event Type Name</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEventTypes.map((et) => (
              <TableRow key={et.eventTypeId}>
                <TableCell className="font-mono text-sm">{et.eventTypeId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{et.eventTypeName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getTenantName(et.tenantId)}</Badge>
                </TableCell>
                <TableCell className="max-w-[250px] truncate">{et.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{getMetaCategory(et.meta)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityBadge(getMetaPriority(et.meta))}>
                    {getMetaPriority(et.meta)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{et.createdBy}</TableCell>
                <TableCell className="text-sm">{formatDate(et.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenView(et)} title="View">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(et)} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(et)} title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit/View Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" && "Create New Event Type"}
              {dialogMode === "edit" && "Edit Event Type"}
              {dialogMode === "view" && "View Event Type"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {dialogMode === "view" && selectedEventType && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Event Type ID</Label>
                  <div className="font-mono text-sm p-2 bg-muted rounded">{selectedEventType.eventTypeId}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created At</Label>
                  <div className="p-2 bg-muted rounded">{formatDate(selectedEventType.createdAt)}</div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventTypeName">Event Type Name *</Label>
                <Input
                  id="eventTypeName"
                  placeholder="e.g., OBLIGATION_DUE"
                  value={formData.eventTypeName}
                  onChange={(e) => setFormData({ ...formData, eventTypeName: e.target.value })}
                  disabled={dialogMode === "view"}
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">Use UPPER_SNAKE_CASE format</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant *</Label>
                <Select
                  value={formData.tenantId}
                  onValueChange={(value) => setFormData({ ...formData, tenantId: value })}
                  disabled={dialogMode === "view"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of this event type..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={dialogMode === "view"}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta">Metadata (JSON)</Label>
              <Textarea
                id="meta"
                placeholder='{"priority": "medium", "category": "Compliance"}'
                value={formData.meta}
                onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                disabled={dialogMode === "view"}
                rows={5}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Extra metadata attributes (priority, notifyDaysBefore, category, etc.)
              </p>
            </div>
            {dialogMode === "view" && selectedEventType && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Created By</Label>
                  <div className="p-2 bg-muted rounded">{selectedEventType.createdBy}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {dialogMode === "view" ? "Close" : "Cancel"}
            </Button>
            {dialogMode === "create" && (
              <Button onClick={handleCreate} disabled={!formData.eventTypeName || !formData.tenantId}>
                Create Event Type
              </Button>
            )}
            {dialogMode === "edit" && (
              <Button onClick={handleUpdate} disabled={!formData.eventTypeName || !formData.tenantId}>
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{eventTypeToDelete?.eventTypeName}</strong>? This action cannot
              be undone and may affect linked calendar events.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventTypeMaster;
