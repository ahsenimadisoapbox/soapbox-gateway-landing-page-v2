import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { IncidentCategory, IncidentSeverity, IncidentPriority } from "../lib/mockData";

interface Template {
  id: string;
  name: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  description: string;
  createdBy: string;
  createdDate: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "TPL-001",
      name: "Server Downtime",
      category: "IT",
      severity: "Critical",
      priority: "High",
      description: "Template for server downtime incidents",
      createdBy: "Admin",
      createdDate: "2024-01-10",
    },
    {
      id: "TPL-002",
      name: "Security Breach",
      category: "Security",
      severity: "Critical",
      priority: "High",
      description: "Template for security breach incidents",
      createdBy: "Admin",
      createdDate: "2024-01-10",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "IT" as IncidentCategory,
    severity: "Medium" as IncidentSeverity,
    priority: "Medium" as IncidentPriority,
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
      toast.success("Template updated successfully");
    } else {
      const newTemplate: Template = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        ...formData,
        createdBy: "Current User",
        createdDate: new Date().toISOString().split('T')[0],
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Template created successfully");
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      severity: template.severity,
      priority: template.priority,
      description: template.description,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted successfully");
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setTemplates([...templates, newTemplate]);
    toast.success("Template duplicated successfully");
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setFormData({
      name: "",
      category: "IT",
      severity: "Medium",
      priority: "Medium",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Templates</h1>
          <p className="text-muted-foreground">Create and manage incident templates</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "Edit" : "Create"} Template</DialogTitle>
              <DialogDescription>
                {editingTemplate ? "Update" : "Create a new"} incident template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Server Downtime"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as IncidentCategory })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity *</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value as IncidentSeverity })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as IncidentPriority })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the template..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingTemplate ? "Update" : "Create"} Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.id}</TableCell>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.category}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.severity === 'Critical' ? 'bg-destructive/10 text-destructive' :
                      template.severity === 'High' ? 'bg-warning/10 text-warning' :
                      template.severity === 'Medium' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {template.severity}
                    </span>
                  </TableCell>
                  <TableCell>{template.priority}</TableCell>
                  <TableCell>{template.createdBy}</TableCell>
                  <TableCell>{new Date(template.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDuplicate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
