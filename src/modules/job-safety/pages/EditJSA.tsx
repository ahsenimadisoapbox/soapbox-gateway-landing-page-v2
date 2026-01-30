import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const EditJSA = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jsaId = searchParams.get("id") || "JSA-2025-001";

  const [formData, setFormData] = useState({
    jsaNumber: jsaId,
    jobTitle: "Electrical Panel Maintenance",
    jobDescription: "Routine maintenance of main electrical panel including inspection and testing",
    site: "Manufacturing Plant A",
    department: "Maintenance",
    jsaOwner: "John Doe",
    date: "2025-01-15",
    status: "Draft",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast.success("JSA saved successfully");
  };

  const handleSubmit = () => {
    toast.success("JSA submitted for review");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit JSA</h1>
          <p className="text-muted-foreground">Modify draft JSA details</p>
        </div>
        <Badge variant={formData.status === "Draft" ? "secondary" : "default"}>
          {formData.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSA Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jsaNumber">JSA Number</Label>
              <Input
                id="jsaNumber"
                name="jsaNumber"
                value={formData.jsaNumber}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                value={formData.status}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="Enter job title"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                placeholder="Describe the job and its objectives"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="site">Site *</Label>
              <Input
                id="site"
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                placeholder="Select or enter site"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Select or enter department"
              />
            </div>
            <div>
              <Label htmlFor="jsaOwner">JSA Owner</Label>
              <Input
                id="jsaOwner"
                name="jsaOwner"
                value={formData.jsaOwner}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSave}>
              Save Draft
            </Button>
            <Button onClick={handleSubmit}>
              Submit for Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditJSA;
