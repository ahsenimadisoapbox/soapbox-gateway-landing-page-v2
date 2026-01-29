import { Shield } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

const SecurityPage = () => (
  <div>
    <PageHeader title="Security" description="Manage security settings and access controls" icon={Shield} />
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-lg">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <div className="flex items-center justify-between"><Label>Two-Factor Authentication</Label><Switch /></div>
      <div className="flex items-center justify-between"><Label>Session Timeout (30 min)</Label><Switch defaultChecked /></div>
      <div className="flex items-center justify-between"><Label>Audit Login Activity</Label><Switch defaultChecked /></div>
      <div className="flex items-center justify-between"><Label>Electronic Signature Required</Label><Switch defaultChecked /></div>
    </div>
  </div>
);

export default SecurityPage;
