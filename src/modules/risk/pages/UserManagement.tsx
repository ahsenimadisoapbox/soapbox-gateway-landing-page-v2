import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Plus, Users } from 'lucide-react';

// Mock user data
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@soapbox.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@soapbox.com', role: 'Manager', status: 'active' },
  { id: 3, name: 'Mike Wilson', email: 'mike.w@soapbox.com', role: 'User', status: 'active' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@soapbox.com', role: 'User', status: 'inactive' },
  { id: 5, name: 'David Brown', email: 'david.b@soapbox.com', role: 'Manager', status: 'active' },
];

export default function UserManagement() {
  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: 'bg-destructive text-destructive-foreground',
      Manager: 'bg-primary text-primary-foreground',
      User: 'bg-secondary text-secondary-foreground',
    };
    return colors[role as keyof typeof colors] || 'bg-muted';
  };

  const activeUsers = mockUsers.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts, roles, and permissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((activeUsers / mockUsers.length) * 100)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.filter(u => u.role === 'Admin').length}</div>
            <p className="text-xs text-muted-foreground mt-1">With full access</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={user.status === 'active'} />
                      <span className="text-sm text-muted-foreground capitalize">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
