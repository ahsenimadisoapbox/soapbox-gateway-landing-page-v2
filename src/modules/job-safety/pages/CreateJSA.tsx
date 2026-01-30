import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Users, Plus } from "lucide-react";

const CreateJSA = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    site: "",
    department: "",
    jsaOwner: "John Doe",
    date: new Date().toISOString().split('T')[0],
  });
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [showTeamDialog, setShowTeamDialog] = useState(false);

  const mockUsers = [
    { id: 1, name: "Sarah Chen", role: "EHS Officer" },
    { id: 2, name: "Mike Rodriguez", role: "Supervisor" },
    { id: 3, name: "Jennifer Walsh", role: "Technician" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveDraft = () => {
    toast.success("JSA draft saved successfully");
  };

  const handleContinue = () => {
    if (!formData.jobTitle || !formData.site) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("Proceeding to Job Breakdown");
    navigate("/job-breakdown");
  };

  const addTeamMember = (name: string) => {
    if (!teamMembers.includes(name)) {
      setTeamMembers([...teamMembers, name]);
      toast.success(`Added ${name} to team`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create / Initiate JSA</h1>
        <p className="text-muted-foreground">Start a new Job Safety Analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSA Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {mockUsers.map((user) => (
                      <Button
                        key={user.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          addTeamMember(user.name);
                          setShowTeamDialog(false);
                        }}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {user.name} - {user.role}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleContinue} className="bg-primary hover:bg-primary/90">
              Continue to Job Breakdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJSA;
