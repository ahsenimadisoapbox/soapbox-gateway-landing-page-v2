import { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { StatusBadge } from '../components/StatusBadge';
import { ActionButtons } from '../components/ActionButtons';
import { UserFormModal } from '../components/modals/UserFormModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';
import { mockUsers, User } from '../data/mockData';
import { toast } from '../hooks/use-toast';

const SettingsPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('view');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <PageHeader title="Settings & Administration" description="Configure system settings and manage users" icon={Settings} />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <Label>Enable Email Notifications</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Auto-lock Overdue Equipment</Label>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Default Calibration Interval (Days)</Label>
              <Input type="number" defaultValue={30} className="max-w-32" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Button onClick={() => { setSelectedUser(undefined); setModalMode('create'); setShowUserModal(true); }}>
              <Plus className="h-4 w-4 mr-2" />Add User
            </Button>
          </div>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={user.status === 'active' ? 'active' : 'retired'} />
                  <ActionButtons
                    onView={() => { setSelectedUser(user); setModalMode('view'); setShowUserModal(true); }}
                    onEdit={() => { setSelectedUser(user); setModalMode('edit'); setShowUserModal(true); }}
                    onDelete={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organization" className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input defaultValue="SoapBox Enterprise" />
            </div>
            <div className="space-y-2">
              <Label>Primary Site</Label>
              <Input defaultValue="Main Facility" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <Label>Calibration Due Reminders</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>OOT Alerts</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>PM Overdue Alerts</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <UserFormModal open={showUserModal} onOpenChange={setShowUserModal} user={selectedUser} mode={modalMode}
        onSave={(data) => {
          if (modalMode === 'create') setUsers(prev => [...prev, { ...data, id: String(prev.length + 1) } as User]);
          else if (selectedUser) setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...data } as User : u));
        }}
      />
      <DeleteConfirmModal open={showDeleteModal} onOpenChange={setShowDeleteModal} title="Delete User"
        description={`Delete ${selectedUser?.name}?`}
        onConfirm={() => { setUsers(prev => prev.filter(u => u.id !== selectedUser?.id)); setShowDeleteModal(false); toast({ title: 'User Deleted' }); }}
      />
    </div>
  );
};

export default SettingsPage;
