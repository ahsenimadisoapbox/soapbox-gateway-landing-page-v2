import React, { useState } from 'react';
import { Eye, Plus, CheckCircle, Trash2, Edit, Clock, Wrench, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow, format } from 'date-fns';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';

interface CorrectiveAction {
  id: string;
  incidentId: string;
  description: string;
  type: 'corrective' | 'preventive';
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  assignee: string;
  dueDate: string;
  completedDate?: string;
}

export default function CorrectiveActionsPage() {
  const { incidents, updateIncident, users } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [manageIncidentId, setManageIncidentId] = useState<string | null>(null);
  const [editActionIndex, setEditActionIndex] = useState<number | null>(null);
  const [deleteActionIndex, setDeleteActionIndex] = useState<number | null>(null);
  const [newAction, setNewAction] = useState('');
  const [newActionType, setNewActionType] = useState<'corrective' | 'preventive'>('corrective');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [editingActionText, setEditingActionText] = useState('');

  // Filter incidents that need corrective actions
  const capaIncidents = incidents.filter(
    i => i.status === 'investigation' || i.status === 'containment' || i.status === 'corrective-action'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const manageIncident = manageIncidentId ? incidents.find(i => i.id === manageIncidentId) : null;

  const handleAddAction = () => {
    if (!manageIncident || !newAction.trim()) return;
    
    const newActionObj = {
      id: `CA-${Date.now()}`,
      title: newAction.trim(),
      description: newAction.trim(),
      status: 'pending' as const,
      assignee: users.find(u => u.id === newActionAssignee) || users[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const updatedActions = [...manageIncident.correctiveActions, newActionObj];
    updateIncident(manageIncident.id, { 
      correctiveActions: updatedActions,
      status: 'corrective-action'
    });
    
    setNewAction('');
    setNewActionAssignee('');
    toast({ title: 'Action Added', description: 'Corrective action has been added.' });
  };

  const handleRemoveAction = (index: number) => {
    if (!manageIncident) return;
    
    const updatedActions = manageIncident.correctiveActions.filter((_, i) => i !== index);
    updateIncident(manageIncident.id, { correctiveActions: updatedActions });
    toast({ title: 'Action Removed', description: 'Corrective action has been removed.' });
    setDeleteActionIndex(null);
  };

  const handleEditAction = (index: number) => {
    if (!manageIncident) return;
    setEditActionIndex(index);
    const action = manageIncident.correctiveActions[index];
    setEditingActionText(typeof action === 'string' ? action : action.title);
  };

  const handleSaveEditAction = () => {
    if (!manageIncident || editActionIndex === null) return;
    
    const updatedActions = [...manageIncident.correctiveActions];
    const existingAction = updatedActions[editActionIndex];
    if (typeof existingAction === 'string') {
      updatedActions[editActionIndex] = {
        id: `CA-${Date.now()}`,
        title: editingActionText,
        description: editingActionText,
        status: 'pending' as const,
        assignee: users[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    } else {
      updatedActions[editActionIndex] = { ...existingAction, title: editingActionText, description: editingActionText };
    }
    updateIncident(manageIncident.id, { correctiveActions: updatedActions });
    
    setEditActionIndex(null);
    setEditingActionText('');
    toast({ title: 'Action Updated', description: 'Corrective action has been updated.' });
  };

  const handleMoveToEffectiveness = () => {
    if (!manageIncident) return;
    
    updateIncident(manageIncident.id, { status: 'effectiveness' as const });
    setManageIncidentId(null);
    toast({ 
      title: 'Moved to Effectiveness Check', 
      description: `Incident ${manageIncident.id} is ready for effectiveness verification.` 
    });
  };

  const getActionStatusBadge = (index: number, total: number) => {
    if (index < total / 3) return <Badge variant="default">Completed</Badge>;
    if (index < (2 * total) / 3) return <Badge variant="secondary">In Progress</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Corrective Actions</h1>
        <p className="text-muted-foreground">Manage CAPA (Corrective and Preventive Actions) for incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{capaIncidents.length}</p>
            <p className="text-sm text-muted-foreground">Active CAPA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {capaIncidents.reduce((sum, i) => sum + i.correctiveActions.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">
              {capaIncidents.filter(i => i.severity === 'critical').length}
            </p>
            <p className="text-sm text-muted-foreground">Critical Severity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">
              {capaIncidents.filter(i => new Date(i.dueDate) < new Date()).length}
            </p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents Requiring Corrective Actions</CardTitle>
          <CardDescription>Define and track CAPA items for each incident</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions Count</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {capaIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No incidents requiring corrective actions
                  </TableCell>
                </TableRow>
              ) : (
                capaIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                    <TableCell className="max-w-48 truncate font-medium">{incident.title}</TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity as any} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{incident.correctiveActions.length} actions</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{incident.owner.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setViewIncidentId(incident.id)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setManageIncidentId(incident.id)}
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Manage Actions</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Incident Modal */}
      {selectedIncident && (
        <ViewIncidentModal
          open={!!viewIncidentId}
          onOpenChange={(open) => !open && setViewIncidentId(null)}
          incident={selectedIncident}
        />
      )}

      {/* Manage Corrective Actions Modal */}
      <Dialog open={!!manageIncidentId} onOpenChange={(open) => !open && setManageIncidentId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Corrective Actions
            </DialogTitle>
            <DialogDescription>
              {manageIncident?.id} - {manageIncident?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Incident Info */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <SeverityBadge severity={manageIncident?.severity as any} />
                <span className="text-sm">Owner: {manageIncident?.owner.name}</span>
                <span className="text-sm text-muted-foreground">
                  Due: {manageIncident?.dueDate ? format(new Date(manageIncident.dueDate), 'MMM dd, yyyy') : 'N/A'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Current Actions */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Current Corrective Actions</Label>
              {manageIncident?.correctiveActions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                  No corrective actions defined yet
                </p>
              ) : (
                <div className="space-y-2">
                  {manageIncident?.correctiveActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      {editActionIndex === index ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editingActionText}
                            onChange={(e) => setEditingActionText(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveEditAction}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditActionIndex(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <Target className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1 text-sm">{typeof action === 'string' ? action : action.title}</span>
                          {getActionStatusBadge(index, manageIncident.correctiveActions.length)}
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditAction(index)}
                                >
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleRemoveAction(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove</TooltipContent>
                            </Tooltip>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Add New Action */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Add New Action</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the corrective/preventive action..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="flex-1"
                />
                <Select value={newActionType} onValueChange={(v) => setNewActionType(v as any)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="preventive">Preventive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newActionAssignee} onValueChange={setNewActionAssignee}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddAction} disabled={!newAction.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setManageIncidentId(null)}>
              Close
            </Button>
            <Button 
              onClick={handleMoveToEffectiveness}
              disabled={!manageIncident?.correctiveActions.length}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Move to Effectiveness Check
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
