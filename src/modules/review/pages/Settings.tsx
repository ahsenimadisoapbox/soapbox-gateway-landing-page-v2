import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Users, Building, Bell, Plus, Pencil, Eye, Trash2, Save } from 'lucide-react';
import { roles, orgUnits } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function Settings() {
  const { users } = useApp();
  const [userList, setUserList] = useState(users);
  const [rolesList, setRolesList] = useState(roles);
  const [orgUnitsList, setOrgUnitsList] = useState(orgUnits);
  
  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewRoleOpen, setIsViewRoleOpen] = useState(false);
  const [isEditOrgOpen, setIsEditOrgOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  
  // Selected items
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<typeof orgUnits[0] | null>(null);
  
  // Form data
  const [userFormData, setUserFormData] = useState({ name: '', email: '', role: '' });
  const [orgFormData, setOrgFormData] = useState({ name: '', location: '', manager: '', type: '' });
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    orgName: 'Acme Corporation',
    timezone: 'utc',
    isoEnforcement: true,
    mandatoryEvidence: true,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    reviewReminders: true,
    actionDueAlerts: true,
    capaEscalations: true,
    overdueNotifications: true,
    weeklyDigest: true,
  });

  // User handlers
  const handleAddUser = () => {
    if (!userFormData.name || !userFormData.email || !userFormData.role) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const newUser = {
      id: `USR-${Date.now()}`,
      name: userFormData.name,
      email: userFormData.email,
      role: userFormData.role,
      initials: userFormData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    setUserList([...userList, newUser]);
    setUserFormData({ name: '', email: '', role: '' });
    setIsAddUserOpen(false);
    toast({ title: "User Added", description: `${newUser.name} has been added successfully` });
  };

  const openEditUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setUserFormData({ name: user.name, email: user.email || '', role: user.role });
    setIsEditUserOpen(true);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    setUserList(userList.map(u => 
      u.id === selectedUser.id 
        ? { ...u, name: userFormData.name, email: userFormData.email, role: userFormData.role, initials: userFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() }
        : u
    ));
    setIsEditUserOpen(false);
    toast({ title: "User Updated", description: `${userFormData.name} has been updated` });
  };

  const openDeleteUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUserList(userList.filter(u => u.id !== selectedUser.id));
    setIsDeleteUserOpen(false);
    toast({ title: "User Removed", description: `${selectedUser.name} has been removed` });
  };

  // Role handlers
  const openViewRole = (role: typeof roles[0]) => {
    setSelectedRole(role);
    setIsViewRoleOpen(true);
  };

  // Org handlers
  const openEditOrg = (org: typeof orgUnits[0]) => {
    setSelectedOrg(org);
    setOrgFormData({ name: org.name, location: org.location, manager: org.manager, type: org.type });
    setIsEditOrgOpen(true);
  };

  const handleEditOrg = () => {
    if (!orgFormData.name || !orgFormData.location || !orgFormData.manager) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (selectedOrg) {
      setOrgUnitsList(orgUnitsList.map(o => 
        o.id === selectedOrg.id 
          ? { ...o, ...orgFormData }
          : o
      ));
      setIsEditOrgOpen(false);
      toast({ title: "Organization Updated", description: `${orgFormData.name} has been updated` });
    } else {
      const newOrg = {
        id: `ORG-${Date.now()}`,
        ...orgFormData,
      };
      setOrgUnitsList([...orgUnitsList, newOrg]);
      setIsEditOrgOpen(false);
      toast({ title: "Organization Added", description: `${newOrg.name} has been added successfully` });
    }
  };

  // General settings handler
  const handleSaveGeneralSettings = () => {
    toast({ title: "Settings Saved", description: "General settings have been updated successfully" });
  };

  // Notification toggle handler
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: "Setting Updated", description: `${key.replace(/([A-Z])/g, ' $1').trim()} has been ${!notificationSettings[key] ? 'enabled' : 'disabled'}` });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="h-6 w-6" />
            Settings & Administration
          </h1>
          <p className="text-muted-foreground">Configure system settings and manage users</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">System Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input 
                      value={generalSettings.orgName} 
                      onChange={(e) => setGeneralSettings({ ...generalSettings, orgName: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Timezone</Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">ISO 9001 Frequency Enforcement</p>
                    <p className="text-sm text-muted-foreground">Require reviews at defined intervals</p>
                  </div>
                  <Switch 
                    checked={generalSettings.isoEnforcement} 
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, isoEnforcement: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Mandatory Evidence Review</p>
                    <p className="text-sm text-muted-foreground">Require evidence review before completing ISO inputs</p>
                  </div>
                  <Switch 
                    checked={generalSettings.mandatoryEvidence} 
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, mandatoryEvidence: checked })} 
                  />
                </div>
                <Button onClick={handleSaveGeneralSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />User Management</CardTitle>
                <Button size="sm" onClick={() => setIsAddUserOpen(true)}><Plus className="h-4 w-4 mr-1" />Add User</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {userList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">{user.initials}</div>
                      <div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.role}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/15 text-success">Active</Badge>
                      <Button variant="ghost" size="sm" onClick={() => openEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Roles</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {rolesList.map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div><p className="font-medium">{role.name}</p><p className="text-sm text-muted-foreground">{role.userCount} users</p></div>
                    <Button variant="ghost" size="sm" onClick={() => openViewRole(role)}><Eye className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Building className="h-4 w-4" />Sites & Business Units</CardTitle>
                  <Button size="sm" onClick={() => { setOrgFormData({ name: '', location: '', manager: '', type: 'site' }); setSelectedOrg(null); setIsEditOrgOpen(true); }}><Plus className="h-4 w-4 mr-1" />Add Unit</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {orgUnitsList.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div><p className="font-medium">{unit.name}</p><p className="text-sm text-muted-foreground">{unit.location} • Manager: {unit.manager}</p></div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{unit.type}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => openEditOrg(unit)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notification Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'reviewReminders', label: 'Review Reminders' },
                  { key: 'actionDueAlerts', label: 'Action Due Alerts' },
                  { key: 'capaEscalations', label: 'CAPA Escalations' },
                  { key: 'overdueNotifications', label: 'Overdue Notifications' },
                  { key: 'weeklyDigest', label: 'Weekly Digest' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">{item.label}</p>
                    <Switch 
                      checked={notificationSettings[item.key as keyof typeof notificationSettings]} 
                      onCheckedChange={() => handleNotificationToggle(item.key as keyof typeof notificationSettings)} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add User Dialog */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={userFormData.name} onChange={(e) => setUserFormData({...userFormData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} /></div>
              <div className="space-y-2"><Label>Role</Label><Select value={userFormData.role} onValueChange={(v) => setUserFormData({...userFormData, role: v})}><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{rolesList.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button><Button onClick={handleAddUser}>Add User</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit User</DialogTitle><DialogDescription>Update user information</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Full Name</Label><Input value={userFormData.name} onChange={(e) => setUserFormData({...userFormData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={userFormData.email} onChange={(e) => setUserFormData({...userFormData, email: e.target.value})} /></div>
              <div className="space-y-2"><Label>Role</Label><Select value={userFormData.role} onValueChange={(v) => setUserFormData({...userFormData, role: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{rolesList.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button><Button onClick={handleEditUser}>Save Changes</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Role Dialog */}
        <Dialog open={isViewRoleOpen} onOpenChange={setIsViewRoleOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Role Details</DialogTitle></DialogHeader>
            {selectedRole && (
              <div className="space-y-4 py-4">
                <div><Label className="text-muted-foreground">Role Name</Label><p className="font-medium text-lg">{selectedRole.name}</p></div>
                <div><Label className="text-muted-foreground">Users with this role</Label><p>{selectedRole.userCount} users</p></div>
                <div><Label className="text-muted-foreground">Permissions</Label>
                  <div className="mt-2 space-y-1">
                    {['View Reviews', 'Edit Reviews', 'Create Actions', 'Manage CAPAs', 'View Reports'].map(perm => (
                      <Badge key={perm} variant="secondary" className="mr-1 mb-1">{perm}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setIsViewRoleOpen(false)}>Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Org Dialog */}
        <Dialog open={isEditOrgOpen} onOpenChange={setIsEditOrgOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Organization Unit</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input value={orgFormData.name} onChange={(e) => setOrgFormData({...orgFormData, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>Location</Label><Input value={orgFormData.location} onChange={(e) => setOrgFormData({...orgFormData, location: e.target.value})} /></div>
              <div className="space-y-2"><Label>Manager</Label><Input value={orgFormData.manager} onChange={(e) => setOrgFormData({...orgFormData, manager: e.target.value})} /></div>
              <div className="space-y-2"><Label>Type</Label>
                <Select value={orgFormData.type} onValueChange={(v) => setOrgFormData({...orgFormData, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headquarters">Headquarters</SelectItem>
                    <SelectItem value="Site">Site</SelectItem>
                    <SelectItem value="Business Unit">Business Unit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsEditOrgOpen(false)}>Cancel</Button><Button onClick={handleEditOrg}>Save Changes</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation */}
        <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {selectedUser?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
