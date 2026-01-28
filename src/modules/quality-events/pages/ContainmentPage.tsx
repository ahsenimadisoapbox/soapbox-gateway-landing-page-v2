import React, { useState } from 'react';
import { Eye, Plus, CheckCircle, MoreHorizontal, Shield, Trash2, Edit, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import { SeverityBadge } from '../components/ui/status-badge';
import { useQualityEvents } from '../contexts/QualityEventsContext';
import { formatDistanceToNow, format } from 'date-fns';
import ViewIncidentModal from '../components/modals/ViewIncidentModal';
import { toast } from '../hooks/use-toast';
import { Separator } from '../components/ui/separator';

interface ContainmentAction {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
  dueDate: string;
  completedDate?: string;
}

export default function ContainmentPage() {
  const { incidents, updateIncident, users } = useQualityEvents();
  const [viewIncidentId, setViewIncidentId] = useState<string | null>(null);
  const [manageIncidentId, setManageIncidentId] = useState<string | null>(null);
  const [newAction, setNewAction] = useState('');
  const [newActionAssignee, setNewActionAssignee] = useState('');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editingActionText, setEditingActionText] = useState('');

  // Filter incidents in containment phase
  const containmentIncidents = incidents.filter(
    i => i.status === 'open' || i.status === 'containment'
  );
  
  const selectedIncident = viewIncidentId ? incidents.find(i => i.id === viewIncidentId) : null;
  const manageIncident = manageIncidentId ? incidents.find(i => i.id === manageIncidentId) : null;

  const handleAddAction = () => {
    if (!manageIncident || !newAction.trim()) return;
    
    const updatedActions = [...manageIncident.containmentActions, newAction.trim()];
    updateIncident(manageIncident.id, { 
      containmentActions: updatedActions,
      status: 'containment'
    });
    
    setNewAction('');
    setNewActionAssignee('');
    toast({ title: 'Action Added', description: 'Containment action has been added.' });
  };

  const handleRemoveAction = (index: number) => {
    if (!manageIncident) return;
    
    const updatedActions = manageIncident.containmentActions.filter((_, i) => i !== index);
    updateIncident(manageIncident.id, { containmentActions: updatedActions });
    toast({ title: 'Action Removed', description: 'Containment action has been removed.' });
  };

  const handleEditAction = (index: number) => {
    if (!manageIncident) return;
    setEditingActionId(String(index));
    setEditingActionText(manageIncident.containmentActions[index]);
  };

  const handleSaveEditAction = () => {
    if (!manageIncident || editingActionId === null) return;
    
    const index = Number(editingActionId);
    const updatedActions = [...manageIncident.containmentActions];
    updatedActions[index] = editingActionText;
    updateIncident(manageIncident.id, { containmentActions: updatedActions });
    
    setEditingActionId(null);
    setEditingActionText('');
    toast({ title: 'Action Updated', description: 'Containment action has been updated.' });
  };

  const handleMoveToInvestigation = () => {
    if (!manageIncident) return;
    
    updateIncident(manageIncident.id, { status: 'investigation' });
    setManageIncidentId(null);
    toast({ 
      title: 'Moved to Investigation', 
      description: `Incident ${manageIncident.id} has been moved to the investigation phase.` 
    });
  };

  const getActionStatusBadge = (index: number, total: number) => {
    // Simulate status based on position
    if (index < total / 3) return <Badge variant="default">Completed</Badge>;
    if (index < (2 * total) / 3) return <Badge variant="secondary">In Progress</Badge>;
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Containment</h1>
        <p className="text-muted-foreground">Manage immediate containment actions for incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{containmentIncidents.length}</p>
            <p className="text-sm text-muted-foreground">Active Containment</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">
              {containmentIncidents.filter(i => i.severity === 'critical').length}
            </p>
            <p className="text-sm text-muted-foreground">Critical Severity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {containmentIncidents.reduce((sum, i) => sum + i.containmentActions.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-orange-500">
              {containmentIncidents.filter(i => new Date(i.dueDate) < new Date()).length}
            </p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents Requiring Containment</CardTitle>
          <CardDescription>Define and track immediate containment actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {containmentIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No incidents in containment phase
              </div>
            ) : (
              containmentIncidents.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
                        <Badge variant={incident.status === 'containment' ? 'default' : 'secondary'}>
                          {incident.status}
                        </Badge>
                        <SeverityBadge severity={incident.severity as any} />
                      </div>
                      <h4 className="font-medium">{incident.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{incident.description}</p>
                      
                      {/* Containment Actions Preview */}
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Containment Actions ({incident.containmentActions.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {incident.containmentActions.slice(0, 3).map((action, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {action.length > 30 ? action.substring(0, 30) + '...' : action}
                            </Badge>
                          ))}
                          {incident.containmentActions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{incident.containmentActions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 mt-3">
                        <div className="text-xs text-muted-foreground">
                          Owner: {incident.owner.name}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Due: {formatDistanceToNow(new Date(incident.dueDate), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => setManageIncidentId(incident.id)}>
                        <Shield className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewIncidentId(incident.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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

      {/* Manage Containment Modal */}
      <Dialog open={!!manageIncidentId} onOpenChange={(open) => !open && setManageIncidentId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Containment Actions
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
              <Label className="text-base font-medium">Current Containment Actions</Label>
              {manageIncident?.containmentActions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                  No containment actions defined yet
                </p>
              ) : (
                <div className="space-y-2">
                  {manageIncident?.containmentActions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      {editingActionId === String(index) ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={editingActionText}
                            onChange={(e) => setEditingActionText(e.target.value)}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleSaveEditAction}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingActionId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="flex-1 text-sm">{action}</span>
                          {getActionStatusBadge(index, manageIncident.containmentActions.length)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAction(index)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleRemoveAction(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                  placeholder="Describe the containment action..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="flex-1"
                />
                <Select value={newActionAssignee} onValueChange={setNewActionAssignee}>
                  <SelectTrigger className="w-48">
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
              onClick={handleMoveToInvestigation}
              disabled={!manageIncident?.containmentActions.length}
            >
              Move to Investigation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
