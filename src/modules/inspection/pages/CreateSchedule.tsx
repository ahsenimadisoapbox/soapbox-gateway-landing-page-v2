import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateSchedule = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Schedule created successfully!");
    navigate("/schedules");
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Create Inspection Schedule</h1>
        <p className="text-muted-foreground">Set up recurring or one-time inspections</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
            <CardDescription>Configure your inspection schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Schedule Name *</Label>
                <Input id="name" placeholder="Monthly Safety Inspection" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Inspection Template *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tpl-001">Safety Inspection Template</SelectItem>
                    <SelectItem value="tpl-002">ISO 9001 Template</SelectItem>
                    <SelectItem value="tpl-003">Environmental Template</SelectItem>
                    <SelectItem value="tpl-004">Fire Safety Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <div className="relative">
                  <Input id="startDate" type="date" required />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspector">Assigned Inspector *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-1">John Doe</SelectItem>
                    <SelectItem value="user-2">Sarah Chen</SelectItem>
                    <SelectItem value="user-3">Mike Rodriguez</SelectItem>
                    <SelectItem value="user-4">Jennifer Walsh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewer">Reviewer *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user-3">Mike Rodriguez</SelectItem>
                    <SelectItem value="user-4">Jennifer Walsh</SelectItem>
                    <SelectItem value="user-5">David Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site">Site *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hq">Headquarters</SelectItem>
                    <SelectItem value="plant">Manufacturing Plant</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="all">All Sites</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input id="area" placeholder="e.g., Building A, Floor 2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Optional schedule description..." rows={3} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/schedules")}>
                Cancel
              </Button>
              <Button type="submit">Create Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateSchedule;
