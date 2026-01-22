import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { mockActions, Action } from '../data/mockData';
import { cn } from '../lib/utils';

export function Actions() {
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    owner: '',
    dueDate: '',
    priority: 'medium',
    category: '',
  });

  const filteredActions = actions.filter((action) => {
    const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      'open': { class: 'bg-warning/15 text-warning', icon: <Clock className="h-3 w-3" /> },
      'in-progress': { class: 'bg-info/15 text-info', icon: <Clock className="h-3 w-3" /> },
      'completed': { class: 'bg-success/15 text-success', icon: <CheckCircle2 className="h-3 w-3" /> },
      'overdue': { class: 'bg-destructive/15 text-destructive', icon: <AlertCircle className="h-3 w-3" /> },
    };
    const style = styles[status] || styles['open'];
    return (
      <Badge variant="secondary" className={cn('gap-1', style.class)}>
        {style.icon}
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      'low': 'bg-muted text-muted-foreground',
      'medium': 'bg-warning/15 text-warning',
      'high': 'bg-destructive/15 text-destructive',
      'critical': 'bg-destructive text-destructive-foreground',
    };
    return (
      <Badge variant="secondary" className={styles[priority] || ''}>
        {priority}
      </Badge>
    );
  };

  const handleCreate = () => {
    const newAction: Action = {
      id: `ACT-${String(actions.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      owner: formData.owner,
      dueDate: formData.dueDate,
      priority: formData.priority as Action['priority'],
      status: 'open',
      reviewId: 'MR-2025-Q1',
      category: formData.category,
    };
    setActions([newAction, ...actions]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedAction) return;
    setActions(actions.map(a =>
      a.id === selectedAction.id
        ? { ...a, ...formData, priority: formData.priority as Action['priority'] }
        : a
    ));
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    if (!selectedAction) return;
    setActions(actions.filter(a => a.id !== selectedAction.id));
    setIsDeleteOpen(false);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', owner: '', dueDate: '', priority: 'medium', category: '' });
  };

  const openView = (action: Action) => {
    setSelectedAction(action);
    setIsViewOpen(true);
  };

  const openEdit = (action: Action) => {
    setSelectedAction(action);
    setFormData({
      title: action.title,
      description: action.description,
      owner: action.owner,
      dueDate: action.dueDate,
      priority: action.priority,
      category: action.category,
    });
    setIsEditOpen(true);
  };

  const openDelete = (action: Action) => {
    setSelectedAction(action);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Actions</h1>
            <p className="text-muted-foreground">Track and manage review actions</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Action
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search actions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell className="font-mono text-sm">{action.id}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{action.title}</TableCell>
                    <TableCell>{action.owner}</TableCell>
                    <TableCell>{action.dueDate}</TableCell>
                    <TableCell>{getPriorityBadge(action.priority)}</TableCell>
                    <TableCell>{getStatusBadge(action.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{action.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openView(action)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(action)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(action)}>
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

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Action</DialogTitle>
              <DialogDescription>Add a new action from the management review</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Action title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Select value={formData.owner} onValueChange={(v) => setFormData({ ...formData, owner: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="Mike Rodriguez">Mike Rodriguez</SelectItem>
                      <SelectItem value="Jennifer Walsh">Jennifer Walsh</SelectItem>
                      <SelectItem value="David Kim">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
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
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Risk Management"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Action</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Action Details</DialogTitle>
            </DialogHeader>
            {selectedAction && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Action ID</Label>
                    <p className="font-mono">{selectedAction.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedAction.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{selectedAction.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedAction.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Owner</Label>
                    <p>{selectedAction.owner}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p>{selectedAction.dueDate}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedAction.priority)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p>{selectedAction.category}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Action</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Select value={formData.owner} onValueChange={(v) => setFormData({ ...formData, owner: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                      <SelectItem value="Mike Rodriguez">Mike Rodriguez</SelectItem>
                      <SelectItem value="Jennifer Walsh">Jennifer Walsh</SelectItem>
                      <SelectItem value="David Kim">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedAction?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
