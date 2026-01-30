import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Edit2, 
  Filter,
  Search,
  ArrowUpDown,
  ClipboardCheck,
  FileSignature,
  TestTube,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../lib/utils';
import { useValidation } from '../context/ValidationContext';

interface Task {
  id: string;
  title: string;
  type: 'approval' | 'review' | 'execution' | 'document';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  projectId: string;
  projectName: string;
  assignedBy: string;
  description: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: 'TSK-001',
    title: 'Approve Validation Protocol VP-2024-001',
    type: 'approval',
    priority: 'Critical',
    status: 'pending',
    dueDate: '2024-01-20',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    assignedBy: 'Sarah Johnson',
    description: 'Review and approve the validation protocol for ERP system upgrade.',
    createdAt: '2024-01-15',
  },
  {
    id: 'TSK-002',
    title: 'Execute Test Case TC-045',
    type: 'execution',
    priority: 'High',
    status: 'in-progress',
    dueDate: '2024-01-18',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
    assignedBy: 'Mike Chen',
    description: 'Execute functional test cases for data migration validation.',
    createdAt: '2024-01-14',
  },
  {
    id: 'TSK-003',
    title: 'Review Deviation DEV-001',
    type: 'review',
    priority: 'High',
    status: 'overdue',
    dueDate: '2024-01-15',
    projectId: 'VAL-2024-001',
    projectName: 'ERP System Validation',
    assignedBy: 'Emily Davis',
    description: 'Review root cause analysis for deviation DEV-001.',
    createdAt: '2024-01-10',
  },
  {
    id: 'TSK-004',
    title: 'Complete VSR Document',
    type: 'document',
    priority: 'Medium',
    status: 'pending',
    dueDate: '2024-01-25',
    projectId: 'VAL-2024-003',
    projectName: 'MES Integration',
    assignedBy: 'John Smith',
    description: 'Complete the Validation Summary Report for MES integration project.',
    createdAt: '2024-01-12',
  },
  {
    id: 'TSK-005',
    title: 'Sign-off Risk Assessment',
    type: 'approval',
    priority: 'High',
    status: 'pending',
    dueDate: '2024-01-19',
    projectId: 'VAL-2024-002',
    projectName: 'LIMS Migration',
    assignedBy: 'Sarah Johnson',
    description: 'Review and provide QA sign-off for risk assessment document.',
    createdAt: '2024-01-16',
  },
];

const MyTasks: React.FC = () => {
  const { currentUser } = useValidation();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete'>('approve');
  const [comments, setComments] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'approval': return <FileSignature size={16} />;
      case 'review': return <ClipboardCheck size={16} />;
      case 'execution': return <TestTube size={16} />;
      case 'document': return <FileText size={16} />;
    }
  };

  const getStatusBadge = (status: Task['status']) => {
    const styles = {
      pending: 'status-badge-pending',
      'in-progress': 'status-badge-draft',
      completed: 'status-badge-active',
      overdue: 'status-badge-critical',
    };
    const labels = {
      pending: 'Pending',
      'in-progress': 'In Progress',
      completed: 'Completed',
      overdue: 'Overdue',
    };
    return <span className={cn('status-badge', styles[status])}>{labels[status]}</span>;
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const styles = {
      Critical: 'bg-status-required/10 text-status-required border-status-required/20',
      High: 'bg-status-conditional/10 text-status-conditional border-status-conditional/20',
      Medium: 'bg-step-current/10 text-step-current border-step-current/20',
      Low: 'bg-muted text-muted-foreground border-border',
    };
    return <Badge variant="outline" className={styles[priority]}>{priority}</Badge>;
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending' || t.status === 'overdue');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const handleAction = (task: Task, action: 'approve' | 'reject' | 'complete') => {
    setSelectedTask(task);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const executeAction = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id 
          ? { ...t, status: actionType === 'reject' ? 'pending' : 'completed' as Task['status'] }
          : t
      ));
    }
    setActionDialogOpen(false);
    setComments('');
  };

  const stats = [
    { label: 'Pending', value: pendingTasks.length, icon: Clock, color: 'text-status-conditional' },
    { label: 'In Progress', value: inProgressTasks.length, icon: ArrowUpDown, color: 'text-step-current' },
    { label: 'Completed', value: completedTasks.length, icon: CheckCircle2, color: 'text-status-validated' },
    { label: 'Overdue', value: filteredTasks.filter(t => t.status === 'overdue').length, icon: AlertTriangle, color: 'text-status-required' },
  ];

  const TaskRow = ({ task }: { task: Task }) => (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            'p-2 rounded-lg',
            task.type === 'approval' && 'bg-accent/10 text-accent',
            task.type === 'review' && 'bg-step-current/10 text-step-current',
            task.type === 'execution' && 'bg-status-conditional/10 text-status-conditional',
            task.type === 'document' && 'bg-muted text-muted-foreground',
          )}>
            {getTypeIcon(task.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>
            <h4 className="font-medium">{task.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {task.projectName} • Assigned by {task.assignedBy}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="action-icon"
            title="View Details"
            onClick={() => {
              setSelectedTask(task);
              setViewDialogOpen(true);
            }}
          >
            <Eye size={16} className="text-muted-foreground" />
          </button>
          {task.status !== 'completed' && (
            <>
              {task.type === 'approval' ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-status-validated border-status-validated/30 hover:bg-status-validated/10"
                    onClick={() => handleAction(task, 'approve')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-status-required border-status-required/30 hover:bg-status-required/10"
                    onClick={() => handleAction(task, 'reject')}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(task, 'complete')}
                >
                  Complete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks & Approvals</h1>
          <p className="text-muted-foreground">
            Manage your assigned tasks, reviews, and pending approvals
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="enterprise-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <stat.icon size={24} className={stat.color} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="enterprise-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock size={14} />
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="gap-2">
            <ArrowUpDown size={14} />
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 size={14} />
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="enterprise-card">
            <CardContent className="p-4 space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending tasks</p>
              ) : (
                pendingTasks.map(task => <TaskRow key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="enterprise-card">
            <CardContent className="p-4 space-y-3">
              {inProgressTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks in progress</p>
              ) : (
                inProgressTasks.map(task => <TaskRow key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="enterprise-card">
            <CardContent className="p-4 space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No completed tasks</p>
              ) : (
                completedTasks.map(task => <TaskRow key={task.id} task={task} />)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Task Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">{selectedTask.id}</span>
                {getStatusBadge(selectedTask.status)}
                {getPriorityBadge(selectedTask.priority)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedTask.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Project</p>
                  <p className="font-medium">{selectedTask.projectName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned By</p>
                  <p className="font-medium">{selectedTask.assignedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Task' : actionType === 'reject' ? 'Reject Task' : 'Complete Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {actionType === 'approve' && 'Please confirm your approval with electronic signature.'}
              {actionType === 'reject' && 'Please provide a reason for rejection.'}
              {actionType === 'complete' && 'Please confirm task completion.'}
            </p>
            <div>
              <label className="text-sm font-medium">Comments {actionType === 'reject' && '*'}</label>
              <Textarea
                placeholder="Enter your comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={executeAction}
              className={cn(
                actionType === 'approve' && 'bg-status-validated hover:bg-status-validated/90',
                actionType === 'reject' && 'bg-status-required hover:bg-status-required/90',
              )}
              disabled={actionType === 'reject' && !comments}
            >
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Complete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTasks;
