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
import { CalibrationTask } from '../../data/mockData';
import { mockUsers } from '../../data/mockData';
import { toast } from '../../hooks/use-toast';

interface CalibrationTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: CalibrationTask;
  mode: 'create' | 'edit' | 'view' | 'execute';
  onSave?: (task: Partial<CalibrationTask>) => void;
}

export function CalibrationTaskModal({ open, onOpenChange, task, mode, onSave }: CalibrationTaskModalProps) {
  const [formData, setFormData] = useState<Partial<CalibrationTask>>(
    task || {
      equipmentName: '',
      assetId: '',
      taskType: 'scheduled',
      dueDate: '',
      assignedTo: '',
      method: '',
      procedure: '',
    }
  );

  const isViewMode = mode === 'view';
  const isExecuteMode = mode === 'execute';
  
  const title = mode === 'create' ? 'Create Calibration Task' : 
                mode === 'edit' ? 'Edit Calibration Task' : 
                mode === 'execute' ? 'Execute Calibration' :
                'Calibration Task Details';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave?.(formData);
      toast({
        title: mode === 'create' ? 'Task Created' : mode === 'execute' ? 'Calibration Submitted' : 'Task Updated',
        description: `Calibration task has been ${mode === 'create' ? 'created' : mode === 'execute' ? 'submitted for review' : 'updated'} successfully.`,
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
            {mode === 'execute' ? 'Execute calibration and record results.' : 
             mode === 'create' ? 'Create a new calibration task.' : 
             'Calibration task information.'}
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
                  value={formData.taskType || 'scheduled'}
                  onValueChange={(value) => setFormData({ ...formData, taskType: value as CalibrationTask['taskType'] })}
                  disabled={isViewMode || isExecuteMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="unscheduled">Unscheduled</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
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
                  placeholder="SOP-CAL-XXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Calibration Method</Label>
              <Textarea
                id="method"
                value={formData.method || ''}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                disabled={isViewMode || isExecuteMode}
                rows={2}
              />
            </div>

            {isExecuteMode && (
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">Calibration Results</h3>
                <p className="text-sm text-muted-foreground">
                  Record measurement data and upload evidence. The system will automatically evaluate PASS/OOT status.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Data entry grid and evidence upload would appear here
                  </p>
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
                {mode === 'create' ? 'Create Task' : mode === 'execute' ? 'Submit Results' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
