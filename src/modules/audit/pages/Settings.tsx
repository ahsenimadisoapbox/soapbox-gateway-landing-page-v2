import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [escalationDays, setEscalationDays] = useState('7');
  const [iso9001, setIso9001] = useState(true);
  const [fdaCfr, setFdaCfr] = useState(false);
  const [iso14001, setIso14001] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure audit management system settings
        </p>
      </div>

      {/* Auto-Notification Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Notification Configuration</CardTitle>
          <CardDescription>
            Manage automatic notification settings for audit events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto-Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Automatically send notifications for audit events
              </p>
            </div>
            <Switch checked={autoNotifications} onCheckedChange={setAutoNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for critical events
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* SLA/Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>SLA & Escalation Rules</CardTitle>
          <CardDescription>
            Define service level agreements and escalation thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Escalation Threshold (Days)</Label>
            <Input
              type="number"
              value={escalationDays}
              onChange={(e) => setEscalationDays(e.target.value)}
              placeholder="7"
            />
            <p className="text-sm text-muted-foreground">
              Number of days before an overdue item is escalated
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Finding Response Time</Label>
              <Input type="number" defaultValue="3" />
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">CAPA Completion Time</Label>
              <Input type="number" defaultValue="30" />
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Audit Report Time</Label>
              <Input type="number" defaultValue="7" />
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Standard Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Standard Alignment</CardTitle>
          <CardDescription>
            Map audit processes to relevant compliance standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>ISO 9001:2015</Label>
              <p className="text-sm text-muted-foreground">
                Quality Management Systems
              </p>
            </div>
            <Switch checked={iso9001} onCheckedChange={setIso9001} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>FDA 21 CFR Part 11</Label>
              <p className="text-sm text-muted-foreground">
                Electronic Records and Signatures
              </p>
            </div>
            <Switch checked={fdaCfr} onCheckedChange={setFdaCfr} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>ISO 14001</Label>
              <p className="text-sm text-muted-foreground">
                Environmental Management Systems
              </p>
            </div>
            <Switch checked={iso14001} onCheckedChange={setIso14001} />
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Access Control</CardTitle>
          <CardDescription>
            Configure access permissions for different user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Role-based access is currently configured. Only administrators can modify system settings.
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => toast.info('Manage roles')}>
                Manage Roles
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('View permissions')}>
                View Permissions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
