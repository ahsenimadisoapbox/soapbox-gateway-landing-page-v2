import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const Settings = () => {
  const users = [
    { name: "Sarah Chen", role: "Compliance Manager", status: "Active" },
    { name: "Mike Rodriguez", role: "EHS Officer", status: "Active" },
    { name: "Jennifer Walsh", role: "Department Head", status: "Active" },
    { name: "David Kim", role: "Auditor", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings & Administration</h1>
          <p className="text-muted-foreground">Configure system settings and manage users</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <CardTitle>User Management</CardTitle>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                        {user.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="Soapbox Cloud - Compliance" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc-5">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                    <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                    <SelectItem value="utc">UTC+00:00 (GMT)</SelectItem>
                    <SelectItem value="utc+1">UTC+01:00 (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Track all system activities</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Configure organization information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme Corporation" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Main St, New York, NY 10001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="compliance@acme.com" />
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deadline Reminders</Label>
                  <p className="text-sm text-muted-foreground">Remind about upcoming deadlines</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Non-Compliance Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert on new non-compliance issues</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Settings;
