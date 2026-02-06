import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { toast } from '../hooks/use-toast';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [autoApproval, setAutoApproval] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [auditReminders, setAuditReminders] = useState(true);
  const [dataRetention, setDataRetention] = useState('365');

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your module settings have been updated successfully.",
    });
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure module-level settings for the Risk Management system
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Manage how you receive notifications about risks and assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for important updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="risk-alerts">Real-Time Risk Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get immediate notifications for high-priority risks
                </p>
              </div>
              <Switch
                id="risk-alerts"
                checked={riskAlerts}
                onCheckedChange={setRiskAlerts}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audit-reminders">Audit Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for scheduled audits
                </p>
              </div>
              <Switch
                id="audit-reminders"
                checked={auditReminders}
                onCheckedChange={setAuditReminders}
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Management Configuration</CardTitle>
            <CardDescription>
              Configure approval workflows and risk assessment rules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="require-approval">Require Multi-Level Approval</Label>
                <p className="text-sm text-muted-foreground">
                  High-risk items must be approved by management
                </p>
              </div>
              <Switch
                id="require-approval"
                checked={requireApproval}
                onCheckedChange={setRequireApproval}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approval">Auto-Approve Low Risks</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve risks below threshold
                </p>
              </div>
              <Switch
                id="auto-approval"
                checked={autoApproval}
                onCheckedChange={setAutoApproval}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Configure data retention and archival policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention Period (days)</Label>
              <Input
                id="data-retention"
                type="number"
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Historical risk data will be archived after this period
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
