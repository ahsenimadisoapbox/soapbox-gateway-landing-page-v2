import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';

export default function Audits() {
  const [open, setOpen] = useState(false);

  const handleScheduleAudit = () => {
    toast({
      title: "Audit Scheduled",
      description: "A new audit has been scheduled successfully",
    });
    setOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audits & NCRs</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage audits and non-conformance reports
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Audit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Audit</DialogTitle>
              <DialogDescription>
                Create a new audit schedule for your facility
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="audit-title">Audit Title</Label>
                <Input id="audit-title" placeholder="e.g., Monthly Safety Audit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit-type">Audit Type</Label>
                <Select>
                  <SelectTrigger id="audit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safety">Safety Audit</SelectItem>
                    <SelectItem value="environmental">Environmental Audit</SelectItem>
                    <SelectItem value="compliance">Compliance Audit</SelectItem>
                    <SelectItem value="process">Process Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audit-date">Audit Date</Label>
                <Input id="audit-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auditor">Auditor</Label>
                <Input id="auditor" placeholder="Auditor name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleAudit}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <Card className="max-w-md">
          <CardHeader>
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-center">No Audits Scheduled</CardTitle>
            <CardDescription className="text-center">
              Click the "Schedule Audit" button above to create your first audit
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
