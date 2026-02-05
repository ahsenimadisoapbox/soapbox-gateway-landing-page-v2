import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockTemplates } from "../lib/mockData";

const ViewTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    return <div className="text-center py-8">Template not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">Version {template.version} | {template.standard}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/templates")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate(`/templates/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Template Details</CardTitle>
            <Badge variant={template.status === "PUBLISHED" ? "default" : "outline"}>{template.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Template ID</div>
              <div className="font-medium">{template.id}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Version</div>
              <div className="font-medium">{template.version}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Standard</div>
              <div className="font-medium">{template.standard}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Sections</div>
              <div className="font-medium">{template.sections}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Items</div>
              <div className="font-medium">{template.items}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Created By</div>
              <div className="font-medium">{template.createdBy}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Last Modified</div>
              <div className="font-medium">{template.lastModified}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewTemplate;
