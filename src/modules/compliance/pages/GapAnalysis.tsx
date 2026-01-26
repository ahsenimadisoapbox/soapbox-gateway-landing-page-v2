import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

const GapAnalysis = () => {
  const gaps = [
    {
      id: "GAP-2024-001",
      title: "Access Control",
      framework: "ISO 27001:2022",
      currentScore: 75,
      targetScore: 95,
      gap: 20,
      priority: "high",
    },
    {
      id: "GAP-2024-002",
      title: "Data Protection",
      framework: "GDPR",
      currentScore: 88,
      targetScore: 95,
      gap: 7,
      priority: "medium",
    },
    {
      id: "GAP-2024-003",
      title: "Incident Response",
      framework: "ISO 27001:2022",
      currentScore: 65,
      targetScore: 90,
      gap: 25,
      priority: "critical",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gap Analysis</h1>
          <p className="text-muted-foreground">Identify and track compliance gaps</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <div className="space-y-4">
        {gaps.map((gap) => (
          <Card key={gap.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{gap.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{gap.framework}</p>
                </div>
                <Badge variant="secondary" className={getPriorityColor(gap.priority)}>
                  {gap.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Score</p>
                  <p className="text-3xl font-bold">{gap.currentScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Target Score</p>
                  <p className="text-3xl font-bold">{gap.targetScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gap</p>
                  <p className="text-3xl font-bold text-destructive">{gap.gap}%</p>
                </div>
              </div>
              <Progress value={gap.currentScore} className="h-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GapAnalysis;
