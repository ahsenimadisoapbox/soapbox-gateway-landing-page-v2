import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

export default function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                defaultValue="SOAPBOX.CLOUD"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Notification Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="notifications@company.com"
                defaultValue="admin@soapbox.cloud"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for new incidents
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SLA Breach Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when SLA is about to breach
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* SLA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SLA Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="critical-sla">Critical Incidents (hours)</Label>
              <Input
                id="critical-sla"
                type="number"
                placeholder="2"
                defaultValue="2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="high-sla">High Priority (hours)</Label>
              <Input
                id="high-sla"
                type="number"
                placeholder="8"
                defaultValue="8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium-sla">Medium Priority (hours)</Label>
              <Input
                id="medium-sla"
                type="number"
                placeholder="24"
                defaultValue="24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="low-sla">Low Priority (hours)</Label>
              <Input
                id="low-sla"
                type="number"
                placeholder="72"
                defaultValue="72"
              />
            </div>
          </CardContent>
        </Card>

        {/* Escalation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Escalation Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Escalation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically escalate overdue incidents
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="escalation-time">Escalation Time (hours)</Label>
              <Input
                id="escalation-time"
                type="number"
                placeholder="4"
                defaultValue="4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="escalation-recipient">Escalation Recipient</Label>
              <Input
                id="escalation-recipient"
                placeholder="manager@company.com"
                defaultValue="manager@soapbox.cloud"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark theme
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Save Drafts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save form drafts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Closed Incidents</Label>
                <p className="text-sm text-muted-foreground">
                  Display closed incidents in dashboard
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                placeholder="UTC"
                defaultValue="America/New_York"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
