import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusBadge } from "../components/inspection/StatusBadge";

const ViewCAPA = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock CAPA data - in real app would fetch from API
  const capa = {
    id: id,
    title: "Update employee training records",
    finding: "FND-002",
    status: "IN_PROGRESS",
    owner: "Jennifer Walsh",
    dueDate: "2025-11-12",
    priority: "CRITICAL",
    description: "Ensure all employee training records are up to date and properly documented in the system.",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CAPA: {capa.id}</h1>
          <p className="text-muted-foreground">{capa.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/capa")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate(`/capa/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CAPA Details</CardTitle>
          <CardDescription>Corrective and Preventive Action information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">CAPA ID</div>
              <div className="font-medium">{capa.id}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Linked Finding</div>
              <Button variant="link" className="h-auto p-0" onClick={() => navigate(`/findings/${capa.finding}/view`)}>
                {capa.finding}
              </Button>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <StatusBadge status={capa.status} />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Priority</div>
              <Badge variant={capa.priority === "CRITICAL" ? "destructive" : "outline"}>{capa.priority}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Owner</div>
              <div className="font-medium">{capa.owner}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="font-medium">{capa.dueDate}</div>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-sm">{capa.description}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewCAPA;
