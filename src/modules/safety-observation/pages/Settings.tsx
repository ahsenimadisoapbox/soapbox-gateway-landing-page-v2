import React, { useState } from 'react';
import { Settings, Users, Building, Bell, Shield, Plus } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { StatusBadge } from '../components/shared/StatusBadge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { systemUsers, SystemUser } from '../data/mockData';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState<Partial<SystemUser>>({});

  const handleAddUser = () => {
    const newUser: SystemUser = { id: `USR-${String(users.length + 1).padStart(3, '0')}`, name: formData.name || '', email: formData.email || '', role: formData.role || '', department: formData.department || '', status: 'active', lastLogin: '-' };
    setUsers([...users, newUser]);
    setIsAddUserOpen(false);
    setFormData({});
    toast.success('User added successfully');
  };

  const handleEditUser = () => {
    if (!editUser) return;
    setUsers(users.map((u) => (u.id === editUser.id ? { ...u, ...formData } : u)));
    setEditUser(null);
    setFormData({});
    toast.success('User updated successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings & Administration" description="Configure system settings and manage users" icon={Settings} />
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="users">Users & Roles</TabsTrigger><TabsTrigger value="organization">Organization</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger></TabsList>
        
        <TabsContent value="general" className="card-elevated p-6 space-y-6">
          <div className="grid gap-4 max-w-md">
            <div className="grid gap-2"><Label>Application Name</Label><Input defaultValue="Soapbox.Cloud - Safety Observation Reporting Module" /></div>
            <div className="grid gap-2"><Label>Time Zone</Label><Input defaultValue="UTC-5 (Eastern Time)" /></div>
            <div className="flex items-center justify-between"><Label>Enable Dark Mode</Label><Switch /></div>
            <Button className="w-fit">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="users" className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Users className="h-5 w-5" /><h2 className="text-lg font-semibold">User Management</h2></div>
            <Button onClick={() => setIsAddUserOpen(true)}><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.role}</p></div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={user.status} />
                  <Button variant="outline" size="sm" onClick={() => { setFormData(user); setEditUser(user); }}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="organization" className="card-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4"><Building className="h-5 w-5" /><h2 className="text-lg font-semibold">Organization Settings</h2></div>
          <div className="grid gap-4 max-w-md">
            <div className="grid gap-2"><Label>Organization Name</Label><Input defaultValue="Acme Corporation" /></div>
            <div className="grid gap-2"><Label>Industry</Label><Input defaultValue="Manufacturing" /></div>
            <Button className="w-fit">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="card-elevated p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4"><Bell className="h-5 w-5" /><h2 className="text-lg font-semibold">Notification Preferences</h2></div>
          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between"><Label>Email Notifications</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Push Notifications</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Overdue Alerts</Label><Switch defaultChecked /></div>
            <Button className="w-fit">Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddUserOpen || !!editUser} onOpenChange={() => { setIsAddUserOpen(false); setEditUser(null); setFormData({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Name</Label><Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Role</Label><Input value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Department</Label><Input value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setIsAddUserOpen(false); setEditUser(null); setFormData({}); }}>Cancel</Button><Button onClick={editUser ? handleEditUser : handleAddUser}>{editUser ? 'Save' : 'Add'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
