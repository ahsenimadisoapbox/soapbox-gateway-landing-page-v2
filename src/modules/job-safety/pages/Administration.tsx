import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const Administration = () => {
  const [showAddUser, setShowAddUser] = useState(false);

  const users = [
    { id: 1, name: "Sarah Chen", email: "sarah.chen@company.com", role: "Compliance Manager", status: "Active" },
    { id: 2, name: "Mike Rodriguez", email: "mike.rodriguez@company.com", role: "EHS Officer", status: "Active" },
    { id: 3, name: "Jennifer Walsh", email: "jennifer.walsh@company.com", role: "Department Head", status: "Active" },
    { id: 4, name: "David Kim", email: "david.kim@company.com", role: "Auditor", status: "Active" },
  ];

  const handleAddUser = () => {
    toast.success("User added successfully");
    setShowAddUser(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Settings & Administration</h1>
        </div>
        <p className="text-muted-foreground">Configure system settings and manage users</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input defaultValue="Acme Corporation" />
                </div>
                <div>
                  <Label>Time Zone</Label>
                  <Input defaultValue="UTC-5 (Eastern Time)" />
                </div>
                <div>
                  <Label>Date Format</Label>
                  <Input defaultValue="MM/DD/YYYY" />
                </div>
                <div>
                  <Label>Language</Label>
                  <Input defaultValue="English (US)" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input placeholder="Enter user name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="user@company.com" />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input placeholder="Select role" />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowAddUser(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser}>Add User</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-status-success/10 text-status-success">{user.status}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.success(`Editing user: ${user.name}`)}
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

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Sites</Label>
                  <div className="space-y-2 mt-2">
                    {["Plant A", "Plant B", "Warehouse", "Lab"].map((site) => (
                      <div key={site} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{site}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.success(`Editing site: ${site}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">JSA Review Notifications</p>
                  <p className="text-sm text-muted-foreground">Notify when JSA requires review</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overdue Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert when tasks are overdue</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Password Policy</Label>
                <Input defaultValue="Minimum 8 characters, require special characters" readOnly />
              </div>
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Administration;
