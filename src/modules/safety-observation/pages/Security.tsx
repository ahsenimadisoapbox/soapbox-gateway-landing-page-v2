import React from 'react';
import { Lock, Shield, Key, Users } from 'lucide-react';
import { PageHeader } from '../components/shared/PageHeader';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export default function Security() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Security" description="Manage security settings and permissions" icon={Lock} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="h-5 w-5 text-primary" /><h2 className="font-semibold">Access Controls</h2></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label>Two-Factor Authentication</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Session Timeout (30 min)</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>IP Whitelisting</Label><Switch /></div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4"><Key className="h-5 w-5 text-primary" /><h2 className="font-semibold">Password Policy</h2></div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label>Minimum 12 characters</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Require special characters</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Password expiry (90 days)</Label><Switch defaultChecked /></div>
          </div>
        </div>
        <div className="card-elevated p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4"><Users className="h-5 w-5 text-primary" /><h2 className="font-semibold">Role Permissions</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Permission</th><th className="text-center py-2">Admin</th><th className="text-center py-2">Inspector</th><th className="text-center py-2">Viewer</th></tr></thead>
              <tbody>
                {['View Inspections', 'Create Inspections', 'Edit Inspections', 'Delete Inspections', 'Manage Users', 'System Settings'].map((perm, i) => (
                  <tr key={perm} className="border-b"><td className="py-3">{perm}</td><td className="text-center"><Switch defaultChecked /></td><td className="text-center"><Switch defaultChecked={i < 4} /></td><td className="text-center"><Switch defaultChecked={i === 0} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button className="mt-4">Save Permissions</Button>
        </div>
      </div>
    </div>
  );
}
