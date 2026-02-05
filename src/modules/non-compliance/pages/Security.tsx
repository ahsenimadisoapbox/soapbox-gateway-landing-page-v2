import { useState } from 'react';
import { toast } from '../hooks/use-toast';
import { Shield, Key, Lock, Eye, EyeOff } from 'lucide-react';

export default function Security() {
  const [settings, setSettings] = useState({
    mfaEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    minPasswordLength: 8,
    requireSpecialChar: true,
  });

  const handleSave = () => { toast({ title: 'Security Settings Saved', description: 'Your security configuration has been updated.' }); };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Shield className="h-6 w-6" />Security</h1>
          <p className="page-subtitle">Manage security settings and access controls</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2"><Key className="h-5 w-5" />Authentication</h3>
          <div className="flex items-center justify-between"><div><p className="font-medium">Multi-Factor Authentication</p><p className="text-sm text-muted-foreground">Require MFA for all users</p></div><input type="checkbox" checked={settings.mfaEnabled} onChange={(e) => setSettings({...settings, mfaEnabled: e.target.checked})} className="h-5 w-5" /></div>
          <div><label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label><input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h3 className="font-semibold flex items-center gap-2"><Lock className="h-5 w-5" />Password Policy</h3>
          <div><label className="block text-sm font-medium mb-2">Password Expiry (days)</label><input type="number" value={settings.passwordExpiry} onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
          <div><label className="block text-sm font-medium mb-2">Minimum Password Length</label><input type="number" value={settings.minPasswordLength} onChange={(e) => setSettings({...settings, minPasswordLength: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-input rounded-md bg-background" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" checked={settings.requireSpecialChar} onChange={(e) => setSettings({...settings, requireSpecialChar: e.target.checked})} /><label className="text-sm">Require special characters</label></div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Role Permissions</h3>
          <table className="data-table">
            <thead><tr><th>Role</th><th>Create NCR</th><th>Validate</th><th>Investigate</th><th>Approve</th><th>Admin</th></tr></thead>
            <tbody>
              <tr><td>Reporter</td><td>Yes</td><td>No</td><td>No</td><td>No</td><td>No</td></tr>
              <tr><td>Supervisor</td><td>Yes</td><td>No</td><td>No</td><td>No</td><td>No</td></tr>
              <tr><td>EHS Officer</td><td>Yes</td><td>Yes</td><td>Yes</td><td>No</td><td>No</td></tr>
              <tr><td>Investigator</td><td>Yes</td><td>No</td><td>Yes</td><td>No</td><td>No</td></tr>
              <tr><td>Approver</td><td>Yes</td><td>Yes</td><td>No</td><td>Yes</td><td>No</td></tr>
              <tr><td>Admin</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Yes</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6"><button onClick={handleSave} className="action-button action-button-primary">Save Changes</button></div>
    </div>
  );
}
