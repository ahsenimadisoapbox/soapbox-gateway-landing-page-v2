import { useState } from 'react';
import { Wrench, Plus, Play } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { Button } from '../components/ui/button';
import { PMTaskModal } from '../components/modals/PMTaskModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockPMTasks, PMTask } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const PMPage = () => {
  const [tasks, setTasks] = useState<PMTask[]>(mockPMTasks);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<PMTask | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'execute'>('view');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filterConfigs = [
    { key: 'status', label: 'Status', options: [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'Overdue', value: 'overdue' },
    ]},
    { key: 'taskType', label: 'Type', options: [
      { label: 'Routine Maintenance', value: 'Routine Maintenance' },
      { label: 'Cleaning & Inspection', value: 'Cleaning & Inspection' },
      { label: 'Sensor Replacement', value: 'Sensor Replacement' },
    ]},
  ];

  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.assetId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.taskType && filters.taskType !== 'all' && task.taskType !== filters.taskType) return false;
    return true;
  });

  const handleCreate = () => {
    setSelectedTask(undefined);
    setModalMode('create');
    setShowTaskModal(true);
  };

  const handleView = (task: PMTask) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const handleEdit = (task: PMTask) => {
    setSelectedTask(task);
    setModalMode('edit');
    setShowTaskModal(true);
  };

  const handleExecute = (task: PMTask) => {
    setSelectedTask(task);
    setModalMode('execute');
    setShowTaskModal(true);
  };

  const handleDelete = (task: PMTask) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      toast({
        title: 'Task Deleted',
        description: 'PM task has been deleted.',
      });
    }
    setShowDeleteModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Preventive Maintenance"
        description="Schedule and track preventive maintenance activities"
        icon={Wrench}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create PM Task
          </Button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onSearch={setSearchQuery}
        searchValue={searchQuery}
        onClear={() => { setFilters({}); setSearchQuery(''); }}
      />

      {/* Task List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>PM ID</th>
                <th>Asset ID</th>
                <th>Equipment</th>
                <th>Task Type</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Assigned To</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium">{task.id}</td>
                  <td>{task.assetId}</td>
                  <td>{task.equipmentName}</td>
                  <td className="text-muted-foreground">{task.taskType}</td>
                  <td>
                    <StatusBadge status={task.status as StatusType} />
                  </td>
                  <td>{task.dueDate}</td>
                  <td className="text-muted-foreground">{task.assignedTo}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {task.status !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-accent hover:text-accent"
                          onClick={() => handleExecute(task)}
                          title="Execute Maintenance"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <ActionButtons
                        onView={() => handleView(task)}
                        onEdit={() => handleEdit(task)}
                        onDelete={() => handleDelete(task)}
                        showEdit={true}
                        showDelete={true}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-muted-foreground">
                    No PM tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PMTaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        task={selectedTask}
        mode={modalMode}
        onSave={(data) => {
          if (modalMode === 'create') {
            const newTask: PMTask = {
              ...data,
              id: `PM-${String(tasks.length + 1).padStart(3, '0')}`,
              status: 'pending',
            } as PMTask;
            setTasks(prev => [...prev, newTask]);
          } else if (modalMode === 'edit' && selectedTask) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...data } as PMTask : t));
          } else if (modalMode === 'execute' && selectedTask) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'completed' } as PMTask : t));
          }
        }}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete PM Task"
        description={`Are you sure you want to delete PM task ${selectedTask?.id}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PMPage;
