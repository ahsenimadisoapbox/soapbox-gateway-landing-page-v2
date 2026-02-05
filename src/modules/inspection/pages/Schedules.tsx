import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Eye, Edit, Trash2, Search, Plus } from "lucide-react";
import { mockSchedules } from "../lib/mockData";
import { useNavigate } from "react-router-dom";

const Schedules = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inspection Schedules</h1>
          <p className="text-muted-foreground">Manage recurring and one-time inspection schedules</p>
        </div>
        <Button onClick={() => navigate("/schedules/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Schedules</CardTitle>
          <CardDescription>Recurring inspection schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search schedules..." className="pl-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.id}</TableCell>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{schedule.frequency}</Badge>
                  </TableCell>
                  <TableCell>{schedule.nextDue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{schedule.template}</TableCell>
                  <TableCell>{schedule.assignedTo}</TableCell>
                  <TableCell>
                    {Array.isArray(schedule.sites) ? schedule.sites.join(", ") : schedule.sites}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-success text-success bg-success/10">
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/schedules/${schedule.id}/view`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/schedules/${schedule.id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        if (confirm(`Delete schedule ${schedule.id}?`)) {
                          console.log("Delete schedule:", schedule.id);
                        }
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Schedules;
