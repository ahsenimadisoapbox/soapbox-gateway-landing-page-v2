import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FileUp, Save, Send } from "lucide-react";

export default function NewIncident() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    severity: "",
    priority: "",
    site: "",
    description: "",
    evidence: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.severity || !formData.priority || !formData.site || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isDraft) {
      toast.success("Incident saved as draft");
    } else {
      toast.success("Incident submitted successfully", {
        description: `Incident ID: INC-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      });
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Report New Incident</h1>
        <p className="text-muted-foreground">Fill in the details below to report an incident</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                <Label htmlFor="severity">
                  Severity <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
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
                <Label htmlFor="priority">
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="site">
                  Site/Location <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.site}
                  onValueChange={(value) => setFormData({ ...formData, site: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Building A - Floor 1">Building A - Floor 1</SelectItem>
                    <SelectItem value="Building A - Floor 2">Building A - Floor 2</SelectItem>
                    <SelectItem value="Building A - Floor 3">Building A - Floor 3</SelectItem>
                    <SelectItem value="Building B - Lobby">Building B - Lobby</SelectItem>
                    <SelectItem value="Building B - Parking">Building B - Parking</SelectItem>
                    <SelectItem value="Building C - All Floors">Building C - All Floors</SelectItem>
                    <SelectItem value="Research Lab - Floor 2">Research Lab - Floor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of the incident..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="evidence">Attach Evidence</Label>
                <label
                  htmlFor="evidence"
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block"
                >
                  <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG, PNG up to 10MB
                  </p>
                  <Input
                    id="evidence"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setFormData({ ...formData, evidence: files });
                      if (files.length > 0) {
                        toast.success(`${files.length} file(s) attached successfully`);
                      }
                    }}
                  />
                </label>
                {formData.evidence.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Selected files: {formData.evidence.map(f => f.name).join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" />
                Submit Incident
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
