import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockFindings } from "../lib/mockData";
import { StatusBadge } from "../components/inspection/StatusBadge";
import { SeverityBadge } from "../components/inspection/SeverityBadge";

const ViewFinding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const finding = mockFindings.find((f) => f.id === id);

  if (!finding) {
    return <div className="text-center py-8">Finding not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Finding: {finding.id}</h1>
          <p className="text-muted-foreground">{finding.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/findings")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate(`/findings/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Finding Details</CardTitle>
          <CardDescription>Complete information about this finding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Finding ID</div>
              <div className="font-medium">{finding.id}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Inspection</div>
              <div className="font-medium">{finding.inspectionId}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Severity</div>
              <SeverityBadge severity={finding.severity} />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <StatusBadge status={finding.status} />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Category</div>
              <Badge variant="outline">{finding.category}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Assigned To</div>
              <div className="font-medium">{finding.assignedTo}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="font-medium">{finding.dueDate}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Location</div>
              <div className="font-medium">{finding.location}</div>
            </div>
            {finding.capaId && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Linked CAPA</div>
                <Button variant="link" className="h-auto p-0" onClick={() => navigate(`/capa/${finding.capaId}/view`)}>
                  {finding.capaId}
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2 pt-4">
            <div className="text-sm text-muted-foreground">Description</div>
            <div className="text-sm">{finding.description}</div>
          </div>

          {finding.evidence.length > 0 && (
            <div className="space-y-2 pt-4">
              <div className="text-sm text-muted-foreground">Evidence</div>
              <div className="flex gap-2">
                {finding.evidence.map((item, index) => (
                  <Badge key={index} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewFinding;
