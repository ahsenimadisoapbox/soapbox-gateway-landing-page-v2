import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Eye, Edit, Copy, Trash2, Search, Plus, FileText } from "lucide-react";
import { mockTemplates } from "../lib/mockData";
import { useNavigate } from "react-router-dom";

const Templates = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Template Library</h1>
          <p className="text-muted-foreground">Manage inspection templates and checklists</p>
        </div>
        <Button onClick={() => navigate("/templates/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <FileText className="h-8 w-8 text-primary" />
                <Badge variant={template.status === "PUBLISHED" ? "default" : "outline"}>
                  {template.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{template.name}</CardTitle>
              <CardDescription>
                Version {template.version} | {template.standard}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sections</span>
                  <span className="font-medium">{template.sections}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{template.items}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium">{template.lastModified}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created By</span>
                  <span className="font-medium">{template.createdBy}</span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/templates/${template.id}/view`)}>
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/templates/${template.id}/edit`)}>
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => console.log("Copy template:", template.id)}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  if (confirm(`Delete template ${template.id}?`)) {
                    console.log("Delete template:", template.id);
                  }
                }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Templates;
