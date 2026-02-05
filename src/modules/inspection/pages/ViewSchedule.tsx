import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { mockSchedules } from "../lib/mockData";

const ViewSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const schedule = mockSchedules.find((s) => s.id === id);

  if (!schedule) {
    return <div className="text-center py-8">Schedule not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">View Schedule: {schedule.id}</h1>
          <p className="text-muted-foreground">{schedule.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/schedules")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => navigate(`/schedules/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
          <CardDescription>Complete information about this inspection schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Schedule ID</div>
              <div className="font-medium">{schedule.id}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Schedule Name</div>
              <div className="font-medium">{schedule.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Frequency</div>
              <Badge variant="outline">{schedule.frequency}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Next Due</div>
              <div className="font-medium">{schedule.nextDue}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Template</div>
              <div className="font-medium">{schedule.template}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Assigned To</div>
              <div className="font-medium">{schedule.assignedTo}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Sites</div>
              <div className="font-medium">{Array.isArray(schedule.sites) ? schedule.sites.join(", ") : schedule.sites}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="outline" className="border-success text-success bg-success/10">{schedule.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewSchedule;
