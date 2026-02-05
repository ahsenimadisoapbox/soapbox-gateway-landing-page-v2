import { useState } from 'react';
import { useNCR } from '../context/NCRContext';
import { Modal } from '../components/shared/Modal';
import { toast } from '../hooks/use-toast';
import { Settings as SettingsIcon, Users, Building, Bell, Eye, Pencil, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockUsers, departments, sites } from '../data/mockData';

type TabType = 'general' | 'users' | 'organization' | 'notifications';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [userModal, setUserModal] = useState<any>(null);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [settings, setSettings] = useState({
    companyName: 'Soapbox Industries',
    defaultSite: 'Plant A',
    autoEscalation: true,
    escalationHours: 24,
    emailNotifications: true,
    reminderDays: 3,
  });
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Reporter', department: '' });

  const handleSaveGeneral = () => { toast({ title: 'Settings Saved', description: 'General settings updated.' }); };
  const handleSaveNotifications = () => { toast({ title: 'Settings Saved', description: 'Notification settings updated.' }); };
  const handleAddUser = () => { toast({ title: 'User Added', description: `${newUser.name} has been added.` }); setCreateUserModal(false); setNewUser({ name: '', email: '', role: 'Reporter', department: '' }); };
  const handleUpdateUser = () => { toast({ title: 'User Updated', description: 'User details have been saved.' }); setUserModal(null); };

  const tabs = [
    { id: 'general' as TabType, label: 'General', icon: SettingsIcon },
    { id: 'users' as TabType, label: 'Users & Roles', icon: Users },
    { id: 'organization' as TabType, label: 'Organization', icon: Building },
    { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><SettingsIcon className="h-6 w-6" />Settings & Administration</h1>
          <p className="page-subtitle">Configure system settings and manage users</p>
        </div>
      </div>

      <div className="border-b border-border mb-6">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('tab-button flex items-center gap-2', activeTab === tab.id ? 'tab-button-active' : 'tab-button-inactive')}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="font-semibold">General Settings</h3>
            <div><label className="block text-sm font-medium mb-2">Company Name</label><input type="text" value={settings.companyName} onChange={(e) => setSettings({...settings, companyName: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
            <div><label className="block text-sm font-medium mb-2">Default Site</label><select value={settings.defaultSite} onChange={(e) => setSettings({...settings, defaultSite: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background">{sites.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={settings.autoEscalation} onChange={(e) => setSettings({...settings, autoEscalation: e.target.checked})} /><label className="text-sm">Enable auto-escalation</label></div>
            <div><label className="block text-sm font-medium mb-2">Escalation Threshold (hours)</label><input type="number" value={settings.escalationHours} onChange={(e) => setSettings({...settings, escalationHours: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
            <button onClick={handleSaveGeneral} className="action-button action-button-primary">Save Changes</button>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-semibold flex items-center gap-2"><Users className="h-5 w-5" />User Management</h3><button onClick={() => setCreateUserModal(true)} className="action-button action-button-primary"><Plus className="h-4 w-4" />Add User</button></div>
            <div className="space-y-2">
              {mockUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.role}</p></div>
                  <div className="flex items-center gap-2"><span className="status-badge bg-success/10 text-success">Active</span><button onClick={() => setUserModal(user)} className="action-button action-button-outline py-1 px-3 text-sm">Edit</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-6">
            <h3 className="font-semibold">Organization Structure</h3>
            <div><h4 className="text-sm font-medium mb-2">Sites</h4><div className="flex flex-wrap gap-2">{sites.map(s => <span key={s} className="px-3 py-1 bg-muted rounded-md text-sm">{s}</span>)}</div></div>
            <div><h4 className="text-sm font-medium mb-2">Departments</h4><div className="flex flex-wrap gap-2">{departments.map(d => <span key={d} className="px-3 py-1 bg-muted rounded-md text-sm">{d}</span>)}</div></div>
            <button onClick={() => toast({ title: 'Saved', description: 'Organization settings saved.' })} className="action-button action-button-primary">Save Changes</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="font-semibold">Notification Settings</h3>
            <div className="flex items-center gap-2"><input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})} /><label className="text-sm">Enable email notifications</label></div>
            <div><label className="block text-sm font-medium mb-2">Reminder Days Before Due Date</label><input type="number" value={settings.reminderDays} onChange={(e) => setSettings({...settings, reminderDays: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
            <button onClick={handleSaveNotifications} className="action-button action-button-primary">Save Changes</button>
          </div>
        )}
      </div>

      <Modal isOpen={createUserModal} onClose={() => setCreateUserModal(false)} title="Add User" footer={<><button onClick={() => setCreateUserModal(false)} className="action-button action-button-outline">Cancel</button><button onClick={handleAddUser} className="action-button action-button-primary">Add User</button></>}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Name</label><input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
          <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
          <div><label className="block text-sm font-medium mb-2">Role</label><select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background"><option>Reporter</option><option>Supervisor</option><option>EHS Officer</option><option>Investigator</option><option>Approver</option><option>Admin</option></select></div>
          <div><label className="block text-sm font-medium mb-2">Department</label><select value={newUser.department} onChange={(e) => setNewUser({...newUser, department: e.target.value})} className="w-full px-3 py-2 border border-input rounded-md bg-background"><option value="">Select</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
        </div>
      </Modal>

      <Modal isOpen={!!userModal} onClose={() => setUserModal(null)} title="Edit User" footer={<><button onClick={() => setUserModal(null)} className="action-button action-button-outline">Cancel</button><button onClick={handleUpdateUser} className="action-button action-button-primary">Save</button></>}>
        {userModal && <div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Name</label><input type="text" defaultValue={userModal.name} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div><div><label className="block text-sm font-medium mb-2">Email</label><input type="email" defaultValue={userModal.email} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div><div><label className="block text-sm font-medium mb-2">Role</label><select defaultValue={userModal.role} className="w-full px-3 py-2 border border-input rounded-md bg-background"><option>Reporter</option><option>Supervisor</option><option>EHS Officer</option><option>Investigator</option><option>Approver</option><option>Admin</option></select></div></div>}
      </Modal>
    </div>
  );
}
