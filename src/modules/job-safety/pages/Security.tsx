import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Security = () => {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: "8",
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: "90",
  });

  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: "30",
    maxConcurrentSessions: "3",
    enableTwoFactor: false,
  });

  const handleSavePasswordPolicy = () => {
    toast.success("Password policy updated successfully");
  };

  const handleSaveSessionSettings = () => {
    toast.success("Session settings updated successfully");
  };

  const handlePasswordPolicyChange = (field: string, value: string | boolean) => {
    setPasswordPolicy({ ...passwordPolicy, [field]: value });
  };

  const handleSessionChange = (field: string, value: string | boolean) => {
    setSessionSettings({ ...sessionSettings, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Security</h1>
        </div>
        <p className="text-muted-foreground">Manage security settings and access controls</p>
      </div>

      <Tabs defaultValue="password" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="password">Password Policy</TabsTrigger>
          <TabsTrigger value="session">Session Management</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="audit">Security Audit</TabsTrigger>
        </TabsList>

        {/* Password Policy */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Password Policy Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">Minimum Password Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={passwordPolicy.minLength}
                      onChange={(e) => handlePasswordPolicyChange("minLength", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDays">Password Expiry (Days)</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      value={passwordPolicy.expiryDays}
                      onChange={(e) => handlePasswordPolicyChange("expiryDays", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                      <p className="text-sm text-muted-foreground">Password must contain at least one uppercase letter</p>
                    </div>
                    <Switch
                      id="requireUppercase"
                      checked={passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handlePasswordPolicyChange("requireUppercase", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                      <p className="text-sm text-muted-foreground">Password must contain at least one lowercase letter</p>
                    </div>
                    <Switch
                      id="requireLowercase"
                      checked={passwordPolicy.requireLowercase}
                      onCheckedChange={(checked) => handlePasswordPolicyChange("requireLowercase", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                      <p className="text-sm text-muted-foreground">Password must contain at least one number</p>
                    </div>
                    <Switch
                      id="requireNumbers"
                      checked={passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handlePasswordPolicyChange("requireNumbers", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                      <p className="text-sm text-muted-foreground">Password must contain at least one special character</p>
                    </div>
                    <Switch
                      id="requireSpecialChars"
                      checked={passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => handlePasswordPolicyChange("requireSpecialChars", checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePasswordPolicy}>Save Password Policy</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Management */}
        <TabsContent value="session">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>Session Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={sessionSettings.sessionTimeout}
                      onChange={(e) => handleSessionChange("sessionTimeout", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxConcurrentSessions">Max Concurrent Sessions</Label>
                    <Input
                      id="maxConcurrentSessions"
                      type="number"
                      value={sessionSettings.maxConcurrentSessions}
                      onChange={(e) => handleSessionChange("maxConcurrentSessions", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={sessionSettings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSessionChange("enableTwoFactor", checked)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSessionSettings}>Save Session Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Control */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Configure IP whitelist and access restrictions</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ipWhitelist">Allowed IP Addresses</Label>
                  <Input
                    id="ipWhitelist"
                    placeholder="Enter IP addresses (comma-separated)"
                  />
                </div>
                <Button>Update Access Control</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Audit */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Security Audit Logs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">View recent security events and authentication logs</p>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Failed login attempt</p>
                  <p className="text-xs text-muted-foreground">User: admin@example.com - 2025-01-19 10:23 AM</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">Password policy updated</p>
                  <p className="text-xs text-muted-foreground">User: system - 2025-01-19 09:15 AM</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm font-medium">New user added</p>
                  <p className="text-xs text-muted-foreground">User: john.doe@example.com - 2025-01-18 04:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
