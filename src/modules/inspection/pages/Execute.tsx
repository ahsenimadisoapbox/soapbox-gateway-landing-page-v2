import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Progress } from "../components/ui/progress";
import { Camera, Upload, Save, Send } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockInspections } from "../lib/mockData";
import { StatusBadge } from "../components/inspection/StatusBadge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const Execute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inspection = id ? mockInspections.find((i) => i.id === id) : null;

  const handleSubmit = () => {
    toast.success("Inspection submitted for review!");
    navigate("/dashboard");
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  // Mock checklist items
  const checklistItems = [
    { id: 1, section: "Fire Safety Equipment", question: "Are fire extinguishers accessible and properly mounted?", response: null },
    { id: 2, section: "Fire Safety Equipment", question: "Are fire extinguishers within inspection date?", response: null },
    { id: 3, section: "Emergency Exits", question: "Are emergency exits clearly marked and illuminated?", response: null },
    { id: 4, section: "Emergency Exits", question: "Are emergency exits free from obstruction?", response: null },
    { id: 5, section: "Safety Signage", question: "Is safety signage visible and in good condition?", response: null },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {inspection ? `Execute Inspection: ${inspection.id}` : "Quick Ad-hoc Inspection"}
          </h1>
          <p className="text-muted-foreground">
            {inspection ? inspection.title : "Create and execute a new inspection"}
          </p>
        </div>
        {inspection && <StatusBadge status={inspection.status} />}
      </div>

      {inspection && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{inspection.completionRate}% Complete</span>
              </div>
              <Progress value={inspection.completionRate} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inspection Details</CardTitle>
          <CardDescription>Basic information about this inspection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Site *</Label>
              <Select defaultValue={inspection?.site || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Headquarters">Headquarters</SelectItem>
                  <SelectItem value="Manufacturing Plant">Manufacturing Plant</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Area *</Label>
              <Input defaultValue={inspection?.area || ""} placeholder="e.g., Building A" />
            </div>

            <div className="space-y-2">
              <Label>Template</Label>
              <Select defaultValue={inspection?.template || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety Inspection Template">Safety Inspection Template</SelectItem>
                  <SelectItem value="ISO 9001 Template">ISO 9001 Template</SelectItem>
                  <SelectItem value="Fire Safety Template">Fire Safety Template</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue="2025-11-13" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Checklist</CardTitle>
          <CardDescription>Complete all required items</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklistItems.map((item, index) => (
            <div key={item.id} className="border-b pb-6 last:border-0">
              {(index === 0 || checklistItems[index - 1].section !== item.section) && (
                <h3 className="font-semibold text-lg mb-4">{item.section}</h3>
              )}

              <div className="space-y-3">
                <Label className="text-base">{item.question}</Label>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`yes-${item.id}`} />
                    <Label htmlFor={`yes-${item.id}`} className="font-normal cursor-pointer">
                      Yes / Pass
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`no-${item.id}`} />
                    <Label htmlFor={`no-${item.id}`} className="font-normal cursor-pointer">
                      No / Fail
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="na" id={`na-${item.id}`} />
                    <Label htmlFor={`na-${item.id}`} className="font-normal cursor-pointer">
                      N/A
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex gap-2 mt-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Capture Photo Evidence</DialogTitle>
                        <DialogDescription>Take a photo for this checklist item</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input type="file" accept="image/*" capture="environment" />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => toast.success("Photo captured!")}>Save Photo</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Evidence
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Evidence</DialogTitle>
                        <DialogDescription>Upload photos or documents for this item</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Select Files</Label>
                          <Input type="file" accept="image/*,application/pdf" multiple />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => toast.success("Evidence uploaded!")}>Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <Textarea placeholder="Add notes or observations..." className="mt-2" rows={2} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Observations</CardTitle>
          <CardDescription>Free-form observations not covered by checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Enter any additional observations, concerns, or comments..." rows={4} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit}>
          <Send className="h-4 w-4 mr-2" />
          Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default Execute;
