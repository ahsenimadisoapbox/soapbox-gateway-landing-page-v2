import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaintsCustomer } from '../context/ComplaintsCustomerContext';
import {
  ClipboardCheck,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'Triage' | 'Investigation' | 'RCA' | 'Resolution' | 'Approval' | 'Follow-up';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  assignee: string;
  linkedComplaint?: string;
  linkedCapa?: string;
  createdAt: string;
}

const mockActionItems: ActionItem[] = [
  {
    id: 'ACT-2025-0001',
    title: 'Complete triage for new complaint',
    description: 'Review and classify complaint CMP-2025-0004 regarding software update issues.',
    type: 'Triage',
    priority: 'High',
    status: 'Pending',
    dueDate: '2025-01-08',
    assignee: 'John Doe',
    linkedComplaint: 'CMP-2025-0004',
    createdAt: '2025-01-06T11:30:00Z',
  },
  {
    id: 'ACT-2025-0002',
    title: 'Investigate device malfunction root cause',
    description: 'Perform detailed technical analysis on XR-500 device failure. Coordinate with engineering team.',
    type: 'Investigation',
    priority: 'Critical',
    status: 'In Progress',
    dueDate: '2025-01-09',
    assignee: 'John Doe',
    linkedComplaint: 'CMP-2025-0001',
    createdAt: '2025-01-04T09:00:00Z',
  },
  {
    id: 'ACT-2025-0003',
    title: 'Submit RCA for calibration drift issue',
    description: 'Complete root cause analysis using 5-Whys method for LabPro-3000 calibration issue.',
    type: 'RCA',
    priority: 'High',
    status: 'Pending',
    dueDate: '2025-01-10',
    assignee: 'John Doe',
    linkedComplaint: 'CMP-2025-0003',
    linkedCapa: 'CAPA-2025-0012',
    createdAt: '2025-01-05T14:00:00Z',
  },
  {
    id: 'ACT-2025-0004',
    title: 'Approve CAPA effectiveness review',
    description: 'Review and approve the effectiveness verification for CAPA-2025-0008.',
    type: 'Approval',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2025-01-12',
    assignee: 'John Doe',
    linkedCapa: 'CAPA-2025-0008',
    createdAt: '2025-01-06T09:00:00Z',
  },
  {
    id: 'ACT-2025-0005',
    title: 'Follow up with customer on resolution',
    description: 'Contact Northern Health System to confirm satisfaction with allergic reaction complaint resolution.',
    type: 'Follow-up',
    priority: 'High',
    status: 'Overdue',
    dueDate: '2025-01-05',
    assignee: 'John Doe',
    linkedComplaint: 'CMP-2025-0006',
    createdAt: '2025-01-03T10:00:00Z',
  },
  {
    id: 'ACT-2025-0006',
    title: 'Prepare resolution response for order issue',
    description: 'Draft customer communication for incomplete order fulfillment resolution.',
    type: 'Resolution',
    priority: 'Medium',
    status: 'In Progress',
    dueDate: '2025-01-07',
    assignee: 'John Doe',
    linkedComplaint: 'CMP-2025-0008',
    createdAt: '2025-01-05T16:00:00Z',
  },
];

export default function ActionItems() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [actionItems, setActionItems] = useState<ActionItem[]>(mockActionItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'Investigation' as ActionItem['type'],
    priority: 'Medium' as ActionItem['priority'],
    dueDate: '',
    linkedComplaint: '',
  });

  const pendingItems = actionItems.filter(i => i.status === 'Pending');
  const inProgressItems = actionItems.filter(i => i.status === 'In Progress');
  const overdueItems = actionItems.filter(i => i.status === 'Overdue');
  const completedItems = actionItems.filter(i => i.status === 'Completed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-info" />;
      case 'Overdue':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const handleCreate = () => {
    const newId = `ACT-2025-${String(actionItems.length + 10).padStart(4, '0')}`;
    const item: ActionItem = {
      id: newId,
      ...newItem,
      status: 'Pending',
      assignee: 'John Doe',
      createdAt: new Date().toISOString(),
    };
    setActionItems([item, ...actionItems]);
    setIsAddModalOpen(false);
    setNewItem({ title: '', description: '', type: 'Investigation', priority: 'Medium', dueDate: '', linkedComplaint: '' });
    toast({ title: 'Action Item Created', description: `Action item ${newId} has been created.` });
  };

  const handleEdit = () => {
    if (!selectedItem) return;
    setActionItems(actionItems.map(i => i.id === selectedItem.id ? selectedItem : i));
    setIsEditModalOpen(false);
    toast({ title: 'Action Item Updated', description: `Action item ${selectedItem.id} has been updated.` });
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    setActionItems(actionItems.filter(i => i.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
    toast({ title: 'Action Item Deleted', description: 'Action item has been deleted.', variant: 'destructive' });
  };

  const handleComplete = (item: ActionItem) => {
    setActionItems(actionItems.map(i => i.id === item.id ? { ...i, status: 'Completed' as const } : i));
    toast({ title: 'Action Item Completed', description: `${item.id} marked as completed.` });
  };

  const ActionItemCard = ({ item }: { item: ActionItem }) => (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors',
        item.status === 'Overdue' && 'border-destructive/50 bg-destructive/5',
        item.priority === 'Critical' && 'border-warning/50'
      )}
    >
      <div className="flex items-center gap-4">
        {getStatusIcon(item.status)}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.id}</span>
            <Badge className={cn(
              'text-xs',
              item.priority === 'Critical' && 'severity-critical',
              item.priority === 'High' && 'severity-high',
              item.priority === 'Medium' && 'severity-medium',
              item.priority === 'Low' && 'severity-low'
            )}>
              {item.priority}
            </Badge>
            <Badge variant="outline">{item.type}</Badge>
          </div>
          <p className="text-sm font-medium mt-1">{item.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.description}</p>
          {item.linkedComplaint && (
            <p className="text-xs text-accent mt-1">Linked: {item.linkedComplaint}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <Badge variant="outline" className={cn(
            item.status === 'Overdue' && 'bg-destructive/10 text-destructive border-destructive',
            item.status === 'In Progress' && 'bg-info/10 text-info border-info'
          )}>
            {item.status}
          </Badge>
          <p className="text-xs text-muted-foreground mt-1">
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => { setSelectedItem(item); setIsViewModalOpen(true); }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => { setSelectedItem(item); setIsEditModalOpen(true); }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {item.status !== 'Completed' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-success hover:text-success"
              onClick={() => handleComplete(item)}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => { setSelectedItem(item); setIsDeleteModalOpen(true); }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            My Action Items
          </h1>
          <p className="page-subtitle">Tasks and actions requiring your attention</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Action Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={cn(pendingItems.length > 0 && 'border-warning/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{pendingItems.length}</p>
          </CardContent>
        </Card>
        <Card className={cn(inProgressItems.length > 0 && 'border-info/50')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold">{inProgressItems.length}</p>
          </CardContent>
        </Card>
        <Card className={cn(overdueItems.length > 0 && 'border-destructive/50 bg-destructive/5')}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Overdue</p>
            <p className="text-2xl font-bold text-destructive">{overdueItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-success">{completedItems.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({actionItems.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress ({inProgressItems.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {actionItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No action items</p>
                </div>
              ) : (
                actionItems.map((item) => <ActionItemCard key={item.id} item={item} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {pendingItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No pending action items</p>
                </div>
              ) : (
                pendingItems.map((item) => <ActionItemCard key={item.id} item={item} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {inProgressItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No items in progress</p>
                </div>
              ) : (
                inProgressItems.map((item) => <ActionItemCard key={item.id} item={item} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              {overdueItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                  <p>No overdue items</p>
                </div>
              ) : (
                overdueItems.map((item) => <ActionItemCard key={item.id} item={item} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Action Item</DialogTitle>
            <DialogDescription>Create a new action item</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Action item title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe the action item"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newItem.type} onValueChange={(v) => setNewItem({ ...newItem, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Triage">Triage</SelectItem>
                    <SelectItem value="Investigation">Investigation</SelectItem>
                    <SelectItem value="RCA">RCA</SelectItem>
                    <SelectItem value="Resolution">Resolution</SelectItem>
                    <SelectItem value="Approval">Approval</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newItem.priority} onValueChange={(v) => setNewItem({ ...newItem, priority: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Linked Complaint</Label>
                <Input
                  value={newItem.linkedComplaint}
                  onChange={(e) => setNewItem({ ...newItem, linkedComplaint: e.target.value })}
                  placeholder="CMP-2025-XXXX"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newItem.title}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedItem?.id}</DialogTitle>
            <DialogDescription>Action Item Details</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedItem.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="mt-1">{selectedItem.type}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <Badge className={cn(
                    'mt-1',
                    selectedItem.priority === 'Critical' && 'severity-critical',
                    selectedItem.priority === 'High' && 'severity-high',
                    selectedItem.priority === 'Medium' && 'severity-medium',
                    selectedItem.priority === 'Low' && 'severity-low'
                  )}>
                    {selectedItem.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className="mt-1">{selectedItem.status}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Assignee</Label>
                <p>{selectedItem.assignee}</p>
              </div>
              {selectedItem.linkedComplaint && (
                <div>
                  <Label className="text-muted-foreground">Linked Complaint</Label>
                  <Badge variant="outline" className="mt-1 cursor-pointer" onClick={() => navigate(`/complaints/${selectedItem.linkedComplaint}`)}>
                    {selectedItem.linkedComplaint}
                  </Badge>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Action Item</DialogTitle>
            <DialogDescription>Update action item details</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={selectedItem.title}
                  onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={selectedItem.description}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedItem.status} onValueChange={(v) => setSelectedItem({ ...selectedItem, status: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={selectedItem.priority} onValueChange={(v) => setSelectedItem({ ...selectedItem, priority: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={selectedItem.dueDate}
                  onChange={(e) => setSelectedItem({ ...selectedItem, dueDate: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Action Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedItem?.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
