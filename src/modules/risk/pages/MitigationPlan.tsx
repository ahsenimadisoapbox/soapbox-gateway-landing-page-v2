import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Send, Edit3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { getRiskById, saveRisk } from '../lib/storage';
import { mockUsers } from '../lib/mockData';
import { Risk, MitigationAction } from '../types/risk';
import { toast } from '../hooks/use-toast';

interface MitigationActionForm {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: string;
}

export default function MitigationPlan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [risk, setRisk] = useState<Risk | null>(null);
  const [actions, setActions] = useState<MitigationAction[]>([]);
  const [editingAction, setEditingAction] = useState<MitigationAction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [actionForm, setActionForm] = useState<MitigationActionForm>({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    estimatedCost: ''
  });

  useEffect(() => {
    if (id) {
      const foundRisk = getRiskById(id);
      setRisk(foundRisk);
      if (foundRisk) {
        setActions(foundRisk.mitigationActions || []);
      }
    }
  }, [id]);

  const resetForm = () => {
    setActionForm({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium',
      estimatedCost: ''
    });
    setEditingAction(null);
  };

  const handleAddAction = () => {
    if (!actionForm.title.trim() || !actionForm.assignedTo || !actionForm.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newAction: MitigationAction = {
      id: `mit_${Date.now()}`,
      riskId: id || '',
      title: actionForm.title,
      description: actionForm.description,
      assignedTo: actionForm.assignedTo,
      dueDate: new Date(actionForm.dueDate),
      priority: actionForm.priority,
      status: 'not_started',
      progress: 0,
      evidence: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setActions([...actions, newAction]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Action Added",
      description: "Mitigation action has been added to the plan."
    });
  };

  const handleEditAction = (action: MitigationAction) => {
    setEditingAction(action);
    setActionForm({
      title: action.title,
      description: action.description,
      assignedTo: action.assignedTo,
      dueDate: action.dueDate.toISOString().split('T')[0],
      priority: action.priority,
      estimatedCost: ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateAction = () => {
    if (!editingAction || !actionForm.title.trim() || !actionForm.assignedTo || !actionForm.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const updatedActions = actions.map(action => 
      action.id === editingAction.id 
        ? {
            ...action,
            title: actionForm.title,
            description: actionForm.description,
            assignedTo: actionForm.assignedTo,
            dueDate: new Date(actionForm.dueDate),
            priority: actionForm.priority,
            updatedAt: new Date()
          }
        : action
    );

    setActions(updatedActions);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Action Updated",
      description: "Mitigation action has been updated successfully."
    });
  };

  const handleDeleteAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
    toast({
      title: "Action Deleted",
      description: "Mitigation action has been removed from the plan."
    });
  };

  const handleSavePlan = () => {
    if (!risk) return;

    const updatedRisk = {
      ...risk,
      mitigationActions: actions,
      updatedAt: new Date()
    };

    saveRisk(updatedRisk);
    setRisk(updatedRisk);

    toast({
      title: "Plan Saved",
      description: "Mitigation plan has been saved as draft."
    });
  };

  const handleSubmitPlan = () => {
    if (!risk || actions.length === 0) {
      toast({
        title: "No Actions Defined",
        description: "Please add at least one mitigation action before submitting.",
        variant: "destructive"
      });
      return;
    }

    const updatedRisk = {
      ...risk,
      mitigationActions: actions,
      status: 'mitigation_in_progress' as const,
      updatedAt: new Date()
    };

    saveRisk(updatedRisk);

    toast({
      title: "Plan Submitted",
      description: "Mitigation plan has been submitted and implementation can begin."
    });

    navigate(`/risks/${risk.id}`);
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'not_started': return 'bg-gray-500 text-white';
      case 'blocked': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (!risk) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Risk Not Found</h1>
          <Link to="/risks">
            <Button className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Risk Register
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/risks/${risk.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Risk
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Mitigation Plan</h1>
          <p className="text-muted-foreground">{risk.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSavePlan}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmitPlan}>
            <Send className="h-4 w-4 mr-2" />
            Submit Plan
          </Button>
        </div>
      </div>

      {/* Risk Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Risk Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold text-primary">{risk.riskScore}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Severity</p>
              <Badge className="mt-1 capitalize">{risk.severity}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <p className="capitalize">{risk.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="outline" className="mt-1">
                {risk.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mitigation Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mitigation Actions</CardTitle>
              <CardDescription>
                Define specific actions to reduce or eliminate the risk
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Action
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingAction ? 'Edit Mitigation Action' : 'Add Mitigation Action'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAction ? 'Update the mitigation action details.' : 'Define a new action to mitigate this risk.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={actionForm.title}
                      onChange={(e) => setActionForm({...actionForm, title: e.target.value})}
                      placeholder="Action title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={actionForm.description}
                      onChange={(e) => setActionForm({...actionForm, description: e.target.value})}
                      placeholder="Detailed description of the action"
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigned To *</Label>
                    <Select 
                      value={actionForm.assignedTo} 
                      onValueChange={(value) => setActionForm({...actionForm, assignedTo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role.replace(/_/g, ' ')})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={actionForm.dueDate}
                      onChange={(e) => setActionForm({...actionForm, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={actionForm.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
                        setActionForm({...actionForm, priority: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                    <Input
                      id="estimatedCost"
                      value={actionForm.estimatedCost}
                      onChange={(e) => setActionForm({...actionForm, estimatedCost: e.target.value})}
                      placeholder="$0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={editingAction ? handleUpdateAction : handleAddAction}>
                    {editingAction ? 'Update Action' : 'Add Action'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {actions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{action.title}</p>
                          {action.description && (
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getUserName(action.assignedTo)}</TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }).format(action.dueDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{action.progress}%</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditAction(action)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAction(action.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No mitigation actions defined yet</p>
              <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Action
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}