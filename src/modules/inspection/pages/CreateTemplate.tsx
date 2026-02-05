import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateTemplate = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([{ id: 1, name: "", items: [{ id: 1, text: "", type: "yes_no" }] }]);

  const addSection = () => {
    setSections([...sections, { id: Date.now(), name: "", items: [{ id: Date.now(), text: "", type: "yes_no" }] }]);
  };

  const removeSection = (sectionId: number) => {
    setSections(sections.filter((s) => s.id !== sectionId));
  };

  const addItem = (sectionId: number) => {
    setSections(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, { id: Date.now(), text: "", type: "yes_no" }] } : s
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Template created successfully!");
    navigate("/templates");
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Create Inspection Template</h1>
        <p className="text-muted-foreground">Design a structured checklist for inspections</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Template Information</CardTitle>
            <CardDescription>Basic template details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input id="name" placeholder="Safety Inspection Template" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input id="version" placeholder="1.0" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="standard">Compliance Standard *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iso-9001">ISO 9001</SelectItem>
                    <SelectItem value="iso-13485">ISO 13485</SelectItem>
                    <SelectItem value="iatf-16949">IATF 16949</SelectItem>
                    <SelectItem value="fda-21-cfr">FDA 21 CFR Part 820</SelectItem>
                    <SelectItem value="iso-45001">ISO 45001</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Template purpose and usage..." rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Checklist Sections</CardTitle>
                <CardDescription>Define sections and checklist items</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Section {sectionIndex + 1}</Label>
                  {sections.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Input placeholder="Section name (e.g., Fire Safety Equipment)" required />

                <div className="space-y-3 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex gap-2">
                      <Input
                        placeholder={`Item ${itemIndex + 1} (e.g., Are fire extinguishers accessible?)`}
                        className="flex-1"
                        required
                      />
                      <Select defaultValue="yes_no">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes_no">Yes/No</SelectItem>
                          <SelectItem value="pass_fail">Pass/Fail</SelectItem>
                          <SelectItem value="numeric">Numeric</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(section.id)}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate("/templates")}>
            Cancel
          </Button>
          <Button type="submit">Create Template</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;
