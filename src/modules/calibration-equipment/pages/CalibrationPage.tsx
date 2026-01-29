import { useState } from 'react';
import { Gauge, Plus, Play } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar } from '../components/FilterBar';
import { StatusBadge, StatusType } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { Button } from '../components/ui/button';
import { CalibrationTaskModal } from '../components/modals/CalibrationTaskModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockCalibrationTasks, CalibrationTask } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const CalibrationPage = () => {
  const [tasks, setTasks] = useState<CalibrationTask[]>(mockCalibrationTasks);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<CalibrationTask | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'execute'>('view');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filterConfigs = [
    { key: 'status', label: 'Status', options: [
      { label: 'Pending', value: 'pending' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' },
      { label: 'OOT', value: 'oot' },
    ]},
    { key: 'taskType', label: 'Type', options: [
      { label: 'Scheduled', value: 'scheduled' },
      { label: 'Unscheduled', value: 'unscheduled' },
      { label: 'Verification', value: 'verification' },
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

  const handleView = (task: CalibrationTask) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const handleEdit = (task: CalibrationTask) => {
    setSelectedTask(task);
    setModalMode('edit');
    setShowTaskModal(true);
  };

  const handleExecute = (task: CalibrationTask) => {
    setSelectedTask(task);
    setModalMode('execute');
    setShowTaskModal(true);
  };

  const handleDelete = (task: CalibrationTask) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      toast({
        title: 'Task Deleted',
        description: 'Calibration task has been deleted.',
      });
    }
    setShowDeleteModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Calibration Management"
        description="Schedule, execute, and track calibration tasks"
        icon={Gauge}
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
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
                <th>Task ID</th>
                <th>Asset ID</th>
                <th>Equipment</th>
                <th>Type</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Assigned To</th>
                <th>Procedure</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td className="font-medium">{task.id}</td>
                  <td>{task.assetId}</td>
                  <td>{task.equipmentName}</td>
                  <td className="capitalize">{task.taskType}</td>
                  <td>
                    <StatusBadge status={task.status as StatusType} />
                  </td>
                  <td>{task.dueDate}</td>
                  <td className="text-muted-foreground">{task.assignedTo}</td>
                  <td className="text-muted-foreground">{task.procedure}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {task.status !== 'completed' && task.status !== 'oot' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-accent hover:text-accent"
                          onClick={() => handleExecute(task)}
                          title="Execute Calibration"
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
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    No calibration tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CalibrationTaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        task={selectedTask}
        mode={modalMode}
        onSave={(data) => {
          if (modalMode === 'create') {
            const newTask: CalibrationTask = {
              ...data,
              id: `CAL-${String(tasks.length + 1).padStart(3, '0')}`,
              status: 'pending',
            } as CalibrationTask;
            setTasks(prev => [...prev, newTask]);
          } else if (modalMode === 'edit' && selectedTask) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...data } as CalibrationTask : t));
          } else if (modalMode === 'execute' && selectedTask) {
            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'completed' } as CalibrationTask : t));
          }
        }}
      />

      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Calibration Task"
        description={`Are you sure you want to delete calibration task ${selectedTask?.id}?`}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CalibrationPage;
