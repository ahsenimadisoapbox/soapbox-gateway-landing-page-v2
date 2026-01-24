import React, { useState } from 'react';
import { ExecutivePanel } from '../components/dashboard/ExecutivePanel';
import { StatusBadge, ActionButtons } from '../components/shared/StatusBadge';
import { FormModal, ViewModal, DeleteConfirmModal } from '../components/modals/FormModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Settings, Plus, Search, Users, Building2, Bell, Shield, Edit } from 'lucide-react';
import { toast } from 'sonner';

const usersData = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen..company.com', role: 'Compliance Manager', status: 'active', lastLogin: new Date() },
  { id: '2', name: 'Mike Rodriguez', email: 'mike.rodriguez..company.com', role: 'EHS Officer', status: 'active', lastLogin: new Date(Date.now() - 86400000) },
  { id: '3', name: 'Jennifer Walsh', email: 'jennifer.walsh..company.com', role: 'Department Head', status: 'active', lastLogin: new Date(Date.now() - 172800000) },
  { id: '4', name: 'David Kim', email: 'david.kim..company.com', role: 'Auditor', status: 'active', lastLogin: new Date(Date.now() - 259200000) },
];

const rolesData = [
  { id: '1', name: 'Administrator', users: 2, permissions: 'Full access' },
  { id: '2', name: 'Compliance Manager', users: 3, permissions: 'Compliance, Audit, Reports' },
  { id: '3', name: 'EHS Officer', users: 5, permissions: 'Safety, Incidents, CAPA' },
  { id: '4', name: 'Auditor', users: 4, permissions: 'Audit (Read-only), Reports' },
  { id: '5', name: 'Viewer', users: 10, permissions: 'View only' },
];

const userFormFields = [
  { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
  { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
  { name: 'role', label: 'Role', type: 'select' as const, required: true, options: [
    { value: 'Administrator', label: 'Administrator' },
    { value: 'Compliance Manager', label: 'Compliance Manager' },
    { value: 'EHS Officer', label: 'EHS Officer' },
    { value: 'Auditor', label: 'Auditor' },
    { value: 'Viewer', label: 'Viewer' },
  ]},
  { name: 'department', label: 'Department', type: 'text' as const },
  { name: 'phone', label: 'Phone Number', type: 'text' as const },
];

const AdministrationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [viewModal, setViewModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  
  // General settings state
  const [orgName, setOrgName] = useState('ABC Corp');
  const [timezone, setTimezone] = useState('UTC-5 (Eastern Time)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [language, setLanguage] = useState('English (US)');
  
  // Role editing
  const [roleEditModal, setRoleEditModal] = useState<{ open: boolean; role: any }>({ open: false, role: null });
  const [rolePermissions, setRolePermissions] = useState('');
  
  // Organization modals
  const [sitesModal, setSitesModal] = useState(false);
  const [departmentsModal, setDepartmentsModal] = useState(false);
  const [unitsModal, setUnitsModal] = useState(false);
  const [regionsModal, setRegionsModal] = useState(false);
  
  // Notification modals
  const [emailConfigModal, setEmailConfigModal] = useState(false);
  const [inAppConfigModal, setInAppConfigModal] = useState(false);
  const [escalationConfigModal, setEscalationConfigModal] = useState(false);
  
  // Security modals
  const [passwordPolicyModal, setPasswordPolicyModal] = useState(false);
  const [mfaConfigModal, setMfaConfigModal] = useState(false);
  const [sessionConfigModal, setSessionConfigModal] = useState(false);
  const [auditLogsModal, setAuditLogsModal] = useState(false);

  const filteredUsers = usersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (data: any) => {
    toast.success('User created successfully');
  };

  const handleEdit = (data: any) => {
    toast.success('User updated successfully');
  };

  const handleDelete = () => {
    toast.success('User deleted successfully');
  };

  const handleView = (user: any) => {
    setViewModal({
      open: true,
      data: {
        id: { label: 'User ID', value: user.id },
        name: { label: 'Name', value: user.name },
        email: { label: 'Email', value: user.email },
        role: { label: 'Role', value: user.role },
        status: { label: 'Status', value: <StatusBadge status={user.status} /> },
        lastLogin: { label: 'Last Login', value: user.lastLogin.toLocaleString() },
      },
    });
  };

  const handleSaveGeneralSettings = () => {
    toast.success('General settings saved successfully');
  };

  const handleEditRole = (role: any) => {
    setRolePermissions(role.permissions);
    setRoleEditModal({ open: true, role });
  };

  const handleSaveRole = () => {
    toast.success(`Role "${roleEditModal.role?.name}" updated successfully`);
    setRoleEditModal({ open: false, role: null });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Settings className="h-6 w-6 text-accent" />
              Settings & Administration
            </h1>
            <p className="text-muted-foreground mt-1">Configure system settings and manage users</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <ExecutivePanel title="General Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Organization Name</label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date Format</label>
                    <Input value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Default Language</label>
                    <Input value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveGeneralSettings}>Save Changes</Button>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <ExecutivePanel title="User Management" icon={<Users className="h-5 w-5" />}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="data-table-row">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell><StatusBadge status={user.status} /></TableCell>
                        <TableCell>{user.lastLogin.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <ActionButtons
                            onView={() => handleView(user)}
                            onEdit={() => setEditModal({ open: true, data: user })}
                            onDelete={() => setDeleteModal({ open: true, id: user.id })}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ExecutivePanel>

            <ExecutivePanel title="Roles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesData.map((role) => (
                  <div key={role.id} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold">{role.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{role.users} users</p>
                    <p className="text-xs text-muted-foreground mt-2">{role.permissions}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => handleEditRole(role)}>
                      Edit Permissions
                    </Button>
                  </div>
                ))}
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="organization">
            <ExecutivePanel title="Organization Structure" icon={<Building2 className="h-5 w-5" />}>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">Sites</h4>
                  <p className="text-2xl font-bold mt-2">5</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setSitesModal(true)}>Manage Sites</Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">Departments</h4>
                  <p className="text-2xl font-bold mt-2">12</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setDepartmentsModal(true)}>Manage Departments</Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">Business Units</h4>
                  <p className="text-2xl font-bold mt-2">3</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setUnitsModal(true)}>Manage Units</Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">Regions</h4>
                  <p className="text-2xl font-bold mt-2">4</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setRegionsModal(true)}>Manage Regions</Button>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="notifications">
            <ExecutivePanel title="Notification Settings" icon={<Bell className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEmailConfigModal(true)}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">In-App Notifications</h4>
                    <p className="text-sm text-muted-foreground">Push notifications within the application</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setInAppConfigModal(true)}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Alert Escalation</h4>
                    <p className="text-sm text-muted-foreground">Configure escalation rules for critical alerts</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEscalationConfigModal(true)}>Configure</Button>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>

          <TabsContent value="security">
            <ExecutivePanel title="Security Settings" icon={<Shield className="h-5 w-5" />}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Password Policy</h4>
                    <p className="text-sm text-muted-foreground">Minimum 12 characters, requires special characters</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPasswordPolicyModal(true)}>Edit</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Enabled for all users</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setMfaConfigModal(true)}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">30 minutes of inactivity</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSessionConfigModal(true)}>Edit</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">All actions are logged for compliance</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setAuditLogsModal(true)}>View Logs</Button>
                </div>
              </div>
            </ExecutivePanel>
          </TabsContent>
        </Tabs>
      </div>

      <FormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Add User"
        description="Create a new user account"
        fields={userFormFields}
        onSubmit={handleCreate}
        submitLabel="Create User"
      />

      <FormModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        title="Edit User"
        fields={userFormFields.map(f => ({
          ...f,
          defaultValue: editModal.data?.[f.name],
        }))}
        onSubmit={handleEdit}
        submitLabel="Update User"
        mode="edit"
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ ...viewModal, open })}
        title="User Details"
        data={viewModal.data || {}}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
      />

      {/* Role Edit Modal */}
      <Dialog open={roleEditModal.open} onOpenChange={(open) => setRoleEditModal({ ...roleEditModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role: {roleEditModal.role?.name}</DialogTitle>
            <DialogDescription>Configure permissions for this role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Input value={rolePermissions} onChange={(e) => setRolePermissions(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleEditModal({ open: false, role: null })}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={handleSaveRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Organization Modals */}
      <Dialog open={sitesModal} onOpenChange={setSitesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Sites</DialogTitle>
            <DialogDescription>Add, edit, or remove organization sites</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Site management interface will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSitesModal(false)}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Sites saved'); setSitesModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={departmentsModal} onOpenChange={setDepartmentsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Departments</DialogTitle>
            <DialogDescription>Add, edit, or remove departments</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Department management interface will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepartmentsModal(false)}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Departments saved'); setDepartmentsModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={unitsModal} onOpenChange={setUnitsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Business Units</DialogTitle>
            <DialogDescription>Add, edit, or remove business units</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Business unit management interface will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnitsModal(false)}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Business units saved'); setUnitsModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={regionsModal} onOpenChange={setRegionsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Regions</DialogTitle>
            <DialogDescription>Add, edit, or remove regions</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Region management interface will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegionsModal(false)}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Regions saved'); setRegionsModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Modals */}
      <Dialog open={emailConfigModal} onOpenChange={setEmailConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Notification Settings</DialogTitle>
            <DialogDescription>Configure email notification preferences</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Email configuration options will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Email settings saved'); setEmailConfigModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inAppConfigModal} onOpenChange={setInAppConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>In-App Notification Settings</DialogTitle>
            <DialogDescription>Configure in-app notification preferences</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">In-app notification options will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInAppConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('In-app notification settings saved'); setInAppConfigModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={escalationConfigModal} onOpenChange={setEscalationConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Escalation Rules</DialogTitle>
            <DialogDescription>Configure alert escalation policies</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Escalation rule configuration will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalationConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Escalation rules saved'); setEscalationConfigModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Modals */}
      <Dialog open={passwordPolicyModal} onOpenChange={setPasswordPolicyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Policy</DialogTitle>
            <DialogDescription>Configure password requirements</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Password policy configuration will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordPolicyModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Password policy saved'); setPasswordPolicyModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mfaConfigModal} onOpenChange={setMfaConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>Configure MFA settings</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">MFA configuration options will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMfaConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('MFA settings saved'); setMfaConfigModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sessionConfigModal} onOpenChange={setSessionConfigModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Timeout Settings</DialogTitle>
            <DialogDescription>Configure session timeout preferences</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Session timeout configuration will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionConfigModal(false)}>Cancel</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Session settings saved'); setSessionConfigModal(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={auditLogsModal} onOpenChange={setAuditLogsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Audit Logs</DialogTitle>
            <DialogDescription>View system audit logs</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">Audit log viewer will be displayed here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditLogsModal(false)}>Close</Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => { toast.success('Logs exported'); }}>Export Logs</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdministrationPage;
