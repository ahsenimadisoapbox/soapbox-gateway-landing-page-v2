import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StatusBadge } from '../components/common/StatusBadge';
import { toast } from '../hooks/use-toast';
import { Settings, Users, Building2, Bell, Shield, Plus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Compliance Manager', status: 'active' },
  { id: '2', name: 'Mike Rodriguez', email: 'mike.rodriguez@company.com', role: 'EHS Officer', status: 'active' },
  { id: '3', name: 'Jennifer Walsh', email: 'jennifer.walsh@company.com', role: 'Department Head', status: 'active' },
  { id: '4', name: 'David Kim', email: 'david.kim@company.com', role: 'Auditor', status: 'active' },
];

const roleOptions = ['OH Doctor', 'OH Nurse', 'Clinic Admin', 'HSE Manager', 'HR Partner', 'Supervisor', 'Wellness Coordinator', 'OH Admin', 'Tenant Admin', 'Auditor', 'Compliance Manager', 'EHS Officer', 'Department Head'];

export default function Administration() {
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState(mockUsers);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  const handleAddUser = () => {
    const newUser: User = { id: Date.now().toString(), name: formData.name, email: formData.email, role: formData.role, status: 'active' };
    setUsers([...users, newUser]);
    setAddModalOpen(false);
    setFormData({ name: '', email: '', role: '' });
    toast({ title: 'User Added', description: `${formData.name} has been added.` });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: formData.name, email: formData.email, role: formData.role } : u));
    setEditModalOpen(false);
    setFormData({ name: '', email: '', role: '' });
    toast({ title: 'User Updated', description: `${formData.name} has been updated.` });
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast({ title: 'User Deleted', description: `${selectedUser.name} has been removed.`, variant: 'destructive' });
  };

  const openAddModal = () => {
    setFormData({ name: '', email: '', role: '' });
    setAddModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Settings className="h-7 w-7 text-primary" />Settings & Administration</h1>
          <p className="page-subtitle">Configure system settings and manage users</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div><p className="font-medium">Auto-save drafts</p><p className="text-sm text-muted-foreground">Automatically save form drafts</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div><p className="font-medium">Email notifications</p><p className="text-sm text-muted-foreground">Receive email alerts</p></div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2"><Users className="h-5 w-5" /><CardTitle>User Management</CardTitle></div>
              <Button onClick={openAddModal}><Plus className="h-4 w-4 mr-2" />Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={user.status === 'active' ? 'success' : 'muted'}>{user.status}</StatusBadge>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteUser(user)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card><CardHeader><CardTitle><Building2 className="h-5 w-5 inline mr-2" />Organization Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Organization Name</Label><Input defaultValue="Soapbox Industries" /></div>
                <div className="space-y-2"><Label>Primary Contact</Label><Input defaultValue="admin@soapbox.cloud" /></div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle><Bell className="h-5 w-5 inline mr-2" />Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {['PME Due Reminders', 'Critical Alerts', 'Compliance Warnings', 'System Updates'].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">{item}</span><Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card><CardHeader><CardTitle><Shield className="h-5 w-5 inline mr-2" />Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {['Two-Factor Authentication', 'Session Timeout (30 min)', 'Audit Logging', 'PHI Masking'].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">{item}</span><Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      <FormModal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add User" onSubmit={handleAddUser} submitLabel="Add User">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email address" /></div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
              <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                {roleOptions.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      {/* Edit User Modal */}
      <FormModal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit User" onSubmit={handleSaveEdit} submitLabel="Save Changes">
        <div className="space-y-4">
          <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card z-50">
                {roleOptions.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} title="Delete User" description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`} confirmLabel="Delete" variant="destructive" />
    </div>
  );
}
