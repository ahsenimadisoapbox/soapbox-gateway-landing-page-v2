import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Building2, Bell, Shield, Plus, Edit2 } from 'lucide-react';
import { useValidation } from '../context/ValidationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { users } = useValidation();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  const handleEditUser = (user: typeof users[0]) => {
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <SettingsIcon size={24} className="text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings & Administration</h1>
          <p className="text-muted-foreground">
            Configure system settings and manage users
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="enterprise-card">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="Soapbox.Cloud - Validation Module" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <select 
                  id="timezone"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  defaultValue="UTC"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <select 
                  id="date-format"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  defaultValue="YYYY-MM-DD"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Trail</Label>
                  <p className="text-sm text-muted-foreground">Enable comprehensive audit logging</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users">
          <Card className="enterprise-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-muted-foreground" />
                <div>
                  <CardTitle>User Management</CardTitle>
                </div>
              </div>
              <Button 
                className="bg-accent hover:bg-accent/90"
                onClick={() => setAddUserDialogOpen(true)}
              >
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border border-border rounded-lg flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-accent-foreground font-semibold text-sm">
                          {user.initials}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="status-badge status-badge-active">Active</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="organization">
          <Card className="enterprise-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 size={20} className="text-muted-foreground" />
                <CardTitle>Organization Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="ACME Pharmaceuticals" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-address">Address</Label>
                <Input id="org-address" defaultValue="123 Corporate Drive, Suite 100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-city">City</Label>
                  <Input id="org-city" defaultValue="Boston" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-country">Country</Label>
                  <Input id="org-country" defaultValue="United States" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Compliance Standards</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['ISO 9001', 'ISO 13485', 'FDA 21 CFR Part 820', 'GAMP 5', 'Annex 11'].map((standard) => (
                    <span key={standard} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="enterprise-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-muted-foreground" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email for approvals and escalations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Deviation Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when deviations are created</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Approval Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminder for pending approvals</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Escalation Notifications</Label>
                  <p className="text-sm text-muted-foreground">Notify when tasks are escalated</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Receive daily summary of activities</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card className="enterprise-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-muted-foreground" />
                <CardTitle>Security Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                </div>
                <select className="h-9 px-3 rounded-md border border-input bg-background text-sm">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <Label>Electronic Signatures (21 CFR Part 11)</Label>
                  <p className="text-sm text-muted-foreground">Require e-signature for approvals</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>IP Whitelist</Label>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">Select role</option>
                <option value="Validation Lead">Validation Lead</option>
                <option value="QA / Compliance">QA / Compliance</option>
                <option value="Test Executor">Test Executor</option>
                <option value="Change Owner">Change Owner</option>
                <option value="Auditor / Inspector">Auditor / Inspector</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Quality Assurance" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setAddUserDialogOpen(false)}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input id="edit-first-name" defaultValue={selectedUser.name.split(' ')[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input id="edit-last-name" defaultValue={selectedUser.name.split(' ')[1]} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <select 
                  id="edit-role"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  defaultValue={selectedUser.role}
                >
                  <option value="Validation Lead">Validation Lead</option>
                  <option value="QA / Compliance">QA / Compliance</option>
                  <option value="Test Executor">Test Executor</option>
                  <option value="Change Owner">Change Owner</option>
                  <option value="Auditor / Inspector">Auditor / Inspector</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label>Account Status</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable user account</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setEditUserDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
