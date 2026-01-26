import { Plus, CheckCircle2, Circle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";

const PolicyChecklist = () => {
  const checklists = [
    {
      id: "CHK-2024-001",
      policy: "Information Security Policy",
      totalItems: 15,
      completedItems: 12,
      owner: "Michael Chen",
      dueDate: "2025-09-01",
      status: "in-progress",
    },
    {
      id: "CHK-2024-002",
      policy: "Data Protection Policy",
      totalItems: 10,
      completedItems: 10,
      owner: "Sarah Johnson",
      dueDate: "2025-08-15",
      status: "completed",
    },
  ];

  const checklistItems = [
    { id: 1, title: "Review policy scope and applicability", completed: true },
    { id: 2, title: "Verify compliance with regulatory requirements", completed: true },
    { id: 3, title: "Check alignment with industry standards", completed: true },
    { id: 4, title: "Review roles and responsibilities section", completed: false },
    { id: 5, title: "Validate approval workflows", completed: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Policy Checklist</h1>
          <p className="text-muted-foreground">Policy compliance checklist management</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Checklist
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Checklists</h2>
          {checklists.map((checklist) => (
            <Card key={checklist.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{checklist.policy}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{checklist.id}</p>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(checklist.status)}>
                    {checklist.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">
                      {checklist.completedItems}/{checklist.totalItems} items
                    </span>
                  </div>
                  <Progress 
                    value={(checklist.completedItems / checklist.totalItems) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Owner: {checklist.owner}</span>
                    <span>Due: {checklist.dueDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Details: Information Security Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox checked={item.completed} className="mt-1" />
                  <div className="flex-1">
                    <p className={item.completed ? "line-through text-muted-foreground" : ""}>
                      {item.title}
                    </p>
                  </div>
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PolicyChecklist;
