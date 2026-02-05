import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockTemplates } from "../lib/mockData";
import { toast } from "sonner";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    return <div className="text-center py-8">Template not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Template updated successfully!");
    navigate("/templates");
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Template: {template.id}</h1>
          <p className="text-muted-foreground">Update template details</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/templates")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Template Information</CardTitle>
            <CardDescription>Modify template details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input id="name" defaultValue={template.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input id="version" defaultValue={template.version} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standard">Standard *</Label>
                <Input id="standard" defaultValue={template.standard} required />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/templates")}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditTemplate;
