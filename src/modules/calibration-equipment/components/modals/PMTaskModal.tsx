import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PMTask } from '../../data/mockData';
import { mockUsers } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';

interface PMTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: PMTask;
  mode: 'create' | 'edit' | 'view' | 'execute';
  onSave?: (task: Partial<PMTask>) => void;
}

export function PMTaskModal({ open, onOpenChange, task, mode, onSave }: PMTaskModalProps) {
  const [formData, setFormData] = useState<Partial<PMTask>>(
    task || {
      equipmentName: '',
      assetId: '',
      taskType: 'Routine Maintenance',
      dueDate: '',
      assignedTo: '',
      procedure: '',
    }
  );

  const isViewMode = mode === 'view';
  const isExecuteMode = mode === 'execute';
  
  const title = mode === 'create' ? 'Create PM Task' : 
                mode === 'edit' ? 'Edit PM Task' : 
                mode === 'execute' ? 'Execute Maintenance' :
                'PM Task Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave?.(formData);
      toast({
        title: mode === 'create' ? 'Task Created' : mode === 'execute' ? 'Maintenance Completed' : 'Task Updated',
        description: `PM task has been ${mode === 'create' ? 'created' : mode === 'execute' ? 'completed' : 'updated'} successfully.`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === 'execute' ? 'Execute maintenance task and record findings.' : 
             mode === 'create' ? 'Create a new preventive maintenance task.' : 
             'Preventive maintenance task information.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetId">Asset ID</Label>
                <Input
                  id="assetId"
                  value={formData.assetId || ''}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  disabled={isViewMode || isExecuteMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentName">Equipment Name</Label>
                <Input
                  id="equipmentName"
                  value={formData.equipmentName || ''}
                  onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                  disabled={isViewMode || isExecuteMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select
                  value={formData.taskType || 'Routine Maintenance'}
                  onValueChange={(value) => setFormData({ ...formData, taskType: value })}
                  disabled={isViewMode || isExecuteMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                    <SelectItem value="Cleaning & Inspection">Cleaning & Inspection</SelectItem>
                    <SelectItem value="Sensor Replacement">Sensor Replacement</SelectItem>
                    <SelectItem value="Preventive Overhaul">Preventive Overhaul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  disabled={isViewMode || isExecuteMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  value={formData.assignedTo || ''}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                  disabled={isViewMode || isExecuteMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.filter(u => u.role.includes('Technician')).map((user) => (
                      <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="procedure">Procedure/SOP</Label>
                <Input
                  id="procedure"
                  value={formData.procedure || ''}
                  onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                  disabled={isViewMode || isExecuteMode}
                  placeholder="SOP-PM-XXX"
                />
              </div>
            </div>

            {isExecuteMode && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">Maintenance Findings</h3>
                <div className="space-y-2">
                  <Label htmlFor="findings">Findings & Observations</Label>
                  <Textarea
                    id="findings"
                    value={formData.findings || ''}
                    onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                    rows={4}
                    placeholder="Document any findings, observations, or issues discovered during maintenance..."
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit">
                {mode === 'create' ? 'Create Task' : mode === 'execute' ? 'Complete Maintenance' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
