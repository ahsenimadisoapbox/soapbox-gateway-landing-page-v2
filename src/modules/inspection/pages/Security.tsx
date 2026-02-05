import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Shield, Eye, Download, AlertTriangle } from "lucide-react";

const Security = () => {
  // Mock security data
  const auditLogs = [
    { id: "LOG-001", user: "John Doe", action: "Login", resource: "System", timestamp: "2025-11-13 09:15:23", status: "Success" },
    { id: "LOG-002", user: "Sarah Chen", action: "Update", resource: "INS-001", timestamp: "2025-11-13 09:10:45", status: "Success" },
    { id: "LOG-003", user: "Mike Rodriguez", action: "Delete", resource: "FND-012", timestamp: "2025-11-13 08:55:12", status: "Success" },
    { id: "LOG-004", user: "Unknown", action: "Login", resource: "System", timestamp: "2025-11-13 08:30:05", status: "Failed" },
    { id: "LOG-005", user: "Jennifer Walsh", action: "Approve", resource: "INS-002", timestamp: "2025-11-13 08:15:33", status: "Success" },
  ];

  const securityAlerts = [
    { id: "ALT-001", type: "Authentication", message: "Multiple failed login attempts detected", severity: "HIGH", timestamp: "2025-11-13 08:30:00" },
    { id: "ALT-002", type: "Data Access", message: "Unusual data export pattern", severity: "MEDIUM", timestamp: "2025-11-12 15:45:00" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security & Audit</h1>
        <p className="text-muted-foreground">Monitor security events and audit logs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-success">Secure</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">No threats detected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">Current users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">3</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Recent security notifications</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === 'HIGH' ? 'text-destructive' : 'text-warning'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{alert.type}</span>
                    <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'outline'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
                <Button size="sm" variant="outline">
                  Investigate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>System activity and user actions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Log ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.id}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>Role-based permissions and access logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Recent Access Patterns</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inspector Access</span>
                  <span className="font-medium">145 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manager Access</span>
                  <span className="font-medium">67 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admin Access</span>
                  <span className="font-medium">12 today</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Permission Changes</h3>
              <div className="space-y-2 text-sm">
                <div className="text-muted-foreground">Sarah Chen - Role updated to EHS Manager</div>
                <div className="text-muted-foreground">New user added: Mike Williams</div>
                <div className="text-muted-foreground">Access revoked for: Former Employee</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
